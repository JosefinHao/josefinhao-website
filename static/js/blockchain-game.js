/**
 * Blockchain Mining Simulator
 * Interactive game to understand proof-of-work mining and blockchain fundamentals
 */

class BlockchainGame {
    constructor() {
        this.blockchain = [];
        this.currentBlock = null;
        this.difficulty = 2;
        this.isMining = false;
        this.attempts = 0;
        this.totalReward = 0;
        this.blockReward = 6.25; // BTC per block
        this.hashRate = 0;
        this.startTime = null;
        this.mempool = []; // Pending transactions
        this.balances = {}; // Address balances
        this.transactionCount = 0;
        this.minerAddress = 'miner1';
        this.maxTransactionsPerBlock = 5;

        this.initializeControls();
        this.initializeBalances();
        this.resetBlockchain();
    }

    initializeControls() {
        // Difficulty slider
        const difficultySlider = document.getElementById('blockchain-difficulty');
        const difficultyValue = document.getElementById('blockchain-difficulty-value');
        if (difficultySlider && difficultyValue) {
            difficultySlider.addEventListener('input', (e) => {
                this.difficulty = parseInt(e.target.value);
                difficultyValue.textContent = this.difficulty;
            });
        }

        // Mine button
        const mineBtn = document.getElementById('blockchain-mine-btn');
        if (mineBtn) {
            mineBtn.addEventListener('click', () => this.startMining());
        }

        // Reset button
        const resetBtn = document.getElementById('blockchain-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetBlockchain());
        }

        // Add transaction button
        const addTxBtn = document.getElementById('blockchain-add-tx-btn');
        if (addTxBtn) {
            addTxBtn.addEventListener('click', () => this.addRandomTransaction());
        }

        // Validate chain button
        const validateBtn = document.getElementById('blockchain-validate-btn');
        if (validateBtn) {
            validateBtn.addEventListener('click', () => this.validateChain());
        }
    }

    initializeBalances() {
        // Initialize some addresses with balances
        this.balances = {
            'alice': 100,
            'bob': 75,
            'charlie': 50,
            'david': 25,
            'miner1': 0
        };
    }

    async sha256(message) {
        // Use Web Crypto API for SHA-256
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    createBlock(index, previousHash, data, nonce = 0, transactions = []) {
        return {
            index,
            timestamp: Date.now(),
            data,
            transactions,
            previousHash,
            nonce,
            hash: null,
            merkleRoot: this.calculateMerkleRoot(transactions)
        };
    }

    createTransaction(from, to, amount) {
        return {
            id: ++this.transactionCount,
            from,
            to,
            amount,
            timestamp: Date.now()
        };
    }

    addRandomTransaction() {
        const addresses = Object.keys(this.balances).filter(a => a !== this.minerAddress && this.balances[a] > 0);
        if (addresses.length < 2) {
            alert('Not enough addresses with balance to create transaction');
            return;
        }

        const from = addresses[Math.floor(Math.random() * addresses.length)];
        const toAddresses = addresses.filter(a => a !== from);
        const to = toAddresses[Math.floor(Math.random() * toAddresses.length)];
        const maxAmount = this.balances[from];
        const amount = Math.floor(Math.random() * Math.min(maxAmount, 10)) + 1;

        const tx = this.createTransaction(from, to, amount);
        this.mempool.push(tx);
        this.updateMempoolDisplay();
        this.showNotification(`Transaction added: ${from} → ${to}: ${amount} BTC`);
    }

    calculateMerkleRoot(transactions) {
        if (transactions.length === 0) return '0000000000000000000000000000000000000000000000000000000000000000';

        // Simple concatenation of transaction IDs for educational purposes
        const txString = transactions.map(tx => `${tx.from}${tx.to}${tx.amount}`).join('');
        return txString.substring(0, 32).padEnd(32, '0');
    }

    async calculateHash(block) {
        const txData = block.transactions.map(tx => `${tx.from}${tx.to}${tx.amount}`).join('');
        const blockData = block.index + block.timestamp + block.data + txData + block.previousHash + block.nonce;
        return await this.sha256(blockData);
    }

    isHashValid(hash) {
        const requiredPrefix = '0'.repeat(this.difficulty);
        return hash.startsWith(requiredPrefix);
    }

    async resetBlockchain() {
        this.blockchain = [];
        this.attempts = 0;
        this.totalReward = 0;
        this.hashRate = 0;
        this.isMining = false;
        this.mempool = [];
        this.transactionCount = 0;
        this.initializeBalances();

        // Create genesis block
        const genesisBlock = this.createBlock(0, '0000000000000000000000000000000000000000000000000000000000000000', 'Genesis Block', 0, []);
        genesisBlock.hash = await this.calculateHash(genesisBlock);
        this.blockchain.push(genesisBlock);

        // Prepare next block
        this.prepareNextBlock();
        this.updateDisplay();
        this.updateMempoolDisplay();
        this.updateBalanceDisplay();
        this.renderBlockchain();
    }

    prepareNextBlock() {
        const previousBlock = this.blockchain[this.blockchain.length - 1];

        // Take transactions from mempool (up to max per block)
        const blockTransactions = this.mempool.splice(0, this.maxTransactionsPerBlock);

        // Add coinbase transaction (mining reward)
        const coinbaseTx = this.createTransaction('coinbase', this.minerAddress, this.blockReward);
        blockTransactions.unshift(coinbaseTx);

        const blockData = blockTransactions.length > 1
            ? `Block ${this.blockchain.length}: ${blockTransactions.length - 1} transaction(s) + coinbase`
            : `Block ${this.blockchain.length}: Coinbase only`;

        this.currentBlock = this.createBlock(
            this.blockchain.length,
            previousBlock.hash,
            blockData,
            0,
            blockTransactions
        );
        this.attempts = 0;
        this.startTime = null;
        this.updateMempoolDisplay();
    }

    async startMining() {
        if (this.isMining) return;

        this.isMining = true;
        this.attempts = 0;
        this.startTime = Date.now();

        const mineBtn = document.getElementById('blockchain-mine-btn');
        if (mineBtn) {
            mineBtn.disabled = true;
            mineBtn.textContent = 'Mining...';
        }

        await this.mineBlock();
    }

    async mineBlock() {
        const batchSize = 1000; // Try 1000 nonces per batch
        const maxBatches = 100000; // Prevent infinite loop

        for (let batch = 0; batch < maxBatches && this.isMining; batch++) {
            for (let i = 0; i < batchSize; i++) {
                this.currentBlock.nonce++;
                this.attempts++;

                const hash = await this.calculateHash(this.currentBlock);
                this.currentBlock.hash = hash;

                // Update display every 100 attempts
                if (this.attempts % 100 === 0) {
                    this.updateMiningDisplay();
                }

                if (this.isHashValid(hash)) {
                    // Block mined successfully!
                    await this.onBlockMined();
                    return;
                }
            }

            // Allow UI to update between batches
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        // Mining stopped or max attempts reached
        this.stopMining();
    }

    async onBlockMined() {
        this.isMining = false;

        // Process transactions and update balances
        for (const tx of this.currentBlock.transactions) {
            if (tx.from === 'coinbase') {
                this.balances[tx.to] = (this.balances[tx.to] || 0) + tx.amount;
            } else {
                this.balances[tx.from] -= tx.amount;
                this.balances[tx.to] = (this.balances[tx.to] || 0) + tx.amount;
            }
        }

        // Add block to blockchain
        this.blockchain.push({ ...this.currentBlock });
        this.totalReward += this.blockReward;

        // Show success animation
        const hashDisplay = document.getElementById('blockchain-hash');
        if (hashDisplay) {
            hashDisplay.classList.remove('blockchain-hash-invalid');
            hashDisplay.classList.add('blockchain-hash-valid');
        }

        // Update displays
        this.updateDisplay();
        this.updateBalanceDisplay();
        this.renderBlockchain();
        this.showNotification(`Block #${this.currentBlock.index} mined! Reward: ${this.blockReward} BTC`);

        // Re-enable mining for next block
        const mineBtn = document.getElementById('blockchain-mine-btn');
        if (mineBtn) {
            mineBtn.disabled = false;
            mineBtn.textContent = 'Mine Next Block';
        }

        // Prepare next block
        setTimeout(() => {
            this.prepareNextBlock();
            this.updateMiningDisplay();
        }, 1000);
    }

    stopMining() {
        this.isMining = false;
        const mineBtn = document.getElementById('blockchain-mine-btn');
        if (mineBtn) {
            mineBtn.disabled = false;
            mineBtn.textContent = 'Start Mining';
        }
    }

    updateMiningDisplay() {
        // Update current block display
        const blockNumber = document.getElementById('blockchain-block-number');
        const prevHash = document.getElementById('blockchain-prev-hash');
        const data = document.getElementById('blockchain-data');
        const nonce = document.getElementById('blockchain-nonce');
        const hash = document.getElementById('blockchain-hash');

        if (blockNumber) blockNumber.textContent = this.currentBlock.index;
        if (prevHash) prevHash.textContent = this.shortenHash(this.currentBlock.previousHash);
        if (data) data.textContent = this.currentBlock.data;
        if (nonce) nonce.textContent = this.currentBlock.nonce.toLocaleString();

        if (hash && this.currentBlock.hash) {
            hash.textContent = this.currentBlock.hash;
            if (this.isHashValid(this.currentBlock.hash)) {
                hash.classList.remove('blockchain-hash-invalid');
                hash.classList.add('blockchain-hash-valid');
            } else {
                hash.classList.remove('blockchain-hash-valid');
                hash.classList.add('blockchain-hash-invalid');
            }
        }

        this.updateDisplay();
    }

    updateDisplay() {
        // Calculate hash rate
        if (this.startTime && this.attempts > 0) {
            const elapsedSeconds = (Date.now() - this.startTime) / 1000;
            this.hashRate = Math.round(this.attempts / elapsedSeconds);
        }

        // Update stats
        const lengthDisplay = document.getElementById('blockchain-length-display');
        const attemptsDisplay = document.getElementById('blockchain-attempts-display');
        const hashrateDisplay = document.getElementById('blockchain-hashrate-display');
        const rewardDisplay = document.getElementById('blockchain-reward-display');

        if (lengthDisplay) lengthDisplay.textContent = this.blockchain.length;
        if (attemptsDisplay) attemptsDisplay.textContent = this.attempts.toLocaleString();
        if (hashrateDisplay) hashrateDisplay.textContent = this.hashRate.toLocaleString() + ' H/s';
        if (rewardDisplay) rewardDisplay.textContent = this.totalReward.toFixed(2) + ' BTC';
    }

    updateMempoolDisplay() {
        const mempoolDisplay = document.getElementById('blockchain-mempool-display');
        if (mempoolDisplay) {
            mempoolDisplay.textContent = this.mempool.length;
        }
    }

    updateBalanceDisplay() {
        const balanceDisplay = document.getElementById('blockchain-balances');
        if (!balanceDisplay) return;

        const sortedBalances = Object.entries(this.balances)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        balanceDisplay.innerHTML = sortedBalances
            .map(([address, balance]) => `
                <div class="blockchain-balance-item">
                    <span class="blockchain-address">${address}</span>
                    <span class="blockchain-amount">${balance.toFixed(2)} BTC</span>
                </div>
            `).join('');
    }

    showNotification(message) {
        const notification = document.getElementById('blockchain-notification');
        if (notification) {
            notification.textContent = message;
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
    }

    async validateChain() {
        let isValid = true;
        const issues = [];

        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const previousBlock = this.blockchain[i - 1];

            // Check hash validity
            if (!this.isHashValid(currentBlock.hash)) {
                isValid = false;
                issues.push(`Block #${i}: Invalid hash (doesn't meet difficulty requirement)`);
            }

            // Check previous hash link
            if (currentBlock.previousHash !== previousBlock.hash) {
                isValid = false;
                issues.push(`Block #${i}: Previous hash doesn't match`);
            }

            // Verify hash is correct
            const calculatedHash = await this.calculateHash(currentBlock);
            if (calculatedHash !== currentBlock.hash) {
                isValid = false;
                issues.push(`Block #${i}: Hash calculation mismatch`);
            }
        }

        if (isValid) {
            this.showNotification('✓ Blockchain is valid!');
        } else {
            this.showNotification(`✗ Blockchain invalid: ${issues.length} issue(s) found`);
            console.log('Validation issues:', issues);
        }
    }

    renderBlockchain() {
        const chainContainer = document.getElementById('blockchain-chain');
        if (!chainContainer) return;

        chainContainer.innerHTML = '';

        // Render blocks in reverse order (newest first)
        for (let i = this.blockchain.length - 1; i >= 0; i--) {
            const block = this.blockchain[i];
            const blockElement = this.createBlockElement(block);
            chainContainer.appendChild(blockElement);
        }
    }

    createBlockElement(block) {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'blockchain-block';

        const isValid = this.isHashValid(block.hash);
        const transactions = block.transactions || [];

        const transactionsHtml = transactions.length > 0
            ? `
                <div class="blockchain-block-field">
                    <span class="blockchain-field-label">Transactions (${transactions.length}):</span>
                    <div class="blockchain-transactions">
                        ${transactions.map(tx => `
                            <div class="blockchain-transaction">
                                ${tx.from === 'coinbase'
                                    ? `⛏️ Mining reward: ${tx.amount} BTC → ${tx.to}`
                                    : `${tx.from} → ${tx.to}: ${tx.amount} BTC`
                                }
                            </div>
                        `).join('')}
                    </div>
                </div>
            `
            : '';

        blockDiv.innerHTML = `
            <div class="blockchain-block-header">
                <span class="blockchain-block-index">Block #${block.index}</span>
                <span class="blockchain-block-status ${isValid ? 'valid' : 'invalid'}">
                    ${isValid ? '✓ Valid' : '✗ Invalid'}
                </span>
            </div>
            <div class="blockchain-block-field">
                <span class="blockchain-field-label">Hash:</span>
                <code class="blockchain-block-hash">${this.shortenHash(block.hash)}</code>
            </div>
            <div class="blockchain-block-field">
                <span class="blockchain-field-label">Previous:</span>
                <code class="blockchain-block-hash">${this.shortenHash(block.previousHash)}</code>
            </div>
            <div class="blockchain-block-field">
                <span class="blockchain-field-label">Nonce:</span>
                <span>${block.nonce.toLocaleString()}</span>
            </div>
            ${transactionsHtml}
            <div class="blockchain-block-field">
                <span class="blockchain-field-label">Data:</span>
                <span class="blockchain-block-data">${block.data}</span>
            </div>
        `;

        return blockDiv;
    }

    shortenHash(hash) {
        if (!hash) return 'N/A';
        if (hash.length <= 16) return hash;
        return hash.substring(0, 10) + '...' + hash.substring(hash.length - 6);
    }
}

// Initialize the game when the page loads
let blockchainGameInstance = null;

function initBlockchainGame() {
    // Only initialize if we're on the games page and haven't initialized yet
    const gameElement = document.getElementById('blockchain-chain');
    if (gameElement && !blockchainGameInstance) {
        blockchainGameInstance = new BlockchainGame();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlockchainGame);
} else {
    initBlockchainGame();
}

// Re-initialize when navigating via SPA
document.addEventListener('spa-page-loaded', (event) => {
    if (event.detail.path === '/games') {
        blockchainGameInstance = null; // Reset instance
        initBlockchainGame();
    }
});
