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

        this.initializeControls();
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
    }

    async sha256(message) {
        // Use Web Crypto API for SHA-256
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    createBlock(index, previousHash, data, nonce = 0) {
        return {
            index,
            timestamp: Date.now(),
            data,
            previousHash,
            nonce,
            hash: null
        };
    }

    async calculateHash(block) {
        const blockData = block.index + block.timestamp + block.data + block.previousHash + block.nonce;
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

        // Create genesis block
        const genesisBlock = this.createBlock(0, '0000000000000000000000000000000000000000000000000000000000000000', 'Genesis Block');
        genesisBlock.hash = await this.calculateHash(genesisBlock);
        this.blockchain.push(genesisBlock);

        // Prepare next block
        this.prepareNextBlock();
        this.updateDisplay();
        this.renderBlockchain();
    }

    prepareNextBlock() {
        const previousBlock = this.blockchain[this.blockchain.length - 1];
        const blockData = `Block ${this.blockchain.length}: Transaction data here`;
        this.currentBlock = this.createBlock(
            this.blockchain.length,
            previousBlock.hash,
            blockData
        );
        this.attempts = 0;
        this.startTime = null;
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
        this.renderBlockchain();

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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BlockchainGame();
    });
} else {
    new BlockchainGame();
}
