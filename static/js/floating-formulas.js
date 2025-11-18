/**
 * Floating Mathematical Formulas Background
 * Creates a futuristic AI/ML/Blockchain themed background with mathematical formulas
 */

class FloatingFormulas {
    constructor() {
        this.formulaPositions = []; // Track all formula positions for overlap detection
        this.gridCells = this.initializeGrid(); // Grid-based positioning for even distribution
        this.formulas = [
            // 1. Linear Regression (MSE Loss)
            {
                text: 'MSE = 1/n Σ(yᵢ - ŷᵢ)²',
                category: 'regression'
            },
            // 2. Logistic Regression (Cross-Entropy Loss)
            {
                text: 'L(θ) = -Σ[yᵢlog(hθ(x)) + (1-yᵢ)log(1-hθ(x))]',
                category: 'regression'
            },
            // 3. Gradient Descent
            {
                text: 'θ := θ - α∇J(θ)',
                category: 'optimization'
            },
            {
                text: '∂J/∂θⱼ = 1/m Σ(hθ(x⁽ⁱ⁾) - y⁽ⁱ⁾)xⱼ⁽ⁱ⁾',
                category: 'optimization'
            },
            // 4. Black-Scholes Formula
            {
                text: 'C = S₀N(d₁) - Ke⁻ʳᵗN(d₂)',
                category: 'finance'
            },
            {
                text: 'd₁ = [ln(S₀/K) + (r + σ²/2)t] / σ√t',
                category: 'finance'
            },
            // 5. PDE (Heat Equation / Diffusion)
            {
                text: '∂u/∂t = α∇²u',
                category: 'pde'
            },
            {
                text: '∂²u/∂x² + ∂²u/∂y² = 0',
                category: 'pde'
            },
            // 6. Monte Carlo
            {
                text: 'E[f(X)] ≈ 1/N Σf(Xᵢ)',
                category: 'simulation'
            },
            {
                text: '∫f(x)dx ≈ (b-a)/N Σf(xᵢ)',
                category: 'simulation'
            },
            // 7. Bayesian with Beta and Binomial
            {
                text: 'P(θ|D) = P(D|θ)P(θ) / P(D)',
                category: 'bayesian'
            },
            {
                text: 'Beta(α,β) = Γ(α+β)/[Γ(α)Γ(β)] θᵅ⁻¹(1-θ)ᵝ⁻¹',
                category: 'bayesian'
            },
            {
                text: 'P(k|n,θ) = (n k)θᵏ(1-θ)ⁿ⁻ᵏ',
                category: 'bayesian'
            },
            // 8. XGBoost
            {
                text: 'Obj = ΣL(yᵢ,ŷᵢ) + ΣΩ(fₖ)',
                category: 'boosting'
            },
            {
                text: 'Ω(f) = γT + ½λ||w||²',
                category: 'boosting'
            },
            // 9. Neural Networks
            {
                text: 'aⱼ = σ(Σwᵢⱼxᵢ + bⱼ)',
                category: 'neural'
            },
            {
                text: 'δⱼ = ∂E/∂netⱼ = (tⱼ - yⱼ)σ\'(netⱼ)',
                category: 'neural'
            },
            {
                text: 'σ(x) = 1/(1 + e⁻ˣ)',
                category: 'neural'
            },
            {
                text: 'ReLU(x) = max(0, x)',
                category: 'neural'
            },
            // 10. Clustering (K-means)
            {
                text: 'argmin Σₖ Σₓ∈Cₖ ||x - μₖ||²',
                category: 'clustering'
            },
            {
                text: 'μₖ = 1/|Cₖ| Σₓ∈Cₖ x',
                category: 'clustering'
            },
            // 11. Survival Analysis
            {
                text: 'S(t) = exp(-Λ(t)) = exp(-∫₀ᵗλ(u)du)',
                category: 'survival'
            },
            {
                text: 'h(t) = lim[P(t≤T<t+Δt|T≥t)] / Δt',
                category: 'survival'
            }
        ];

        this.init();
    }

    /**
     * Initialize a grid system for even formula distribution
     * Divides the viewport edges into cells to prevent clustering
     */
    initializeGrid() {
        // Create a grid around the edges of the viewport
        // Using constants for grid dimensions
        const cols = GameConstants.FORMULA_GRID_COLUMNS;
        const rows = GameConstants.FORMULA_GRID_ROWS;
        const cells = [];

        // Define safe bounds to keep formulas within viewport
        // Account for formula width/height and transform: translate(-50%, -50%)
        const minPercent = 5;  // 5% from left/top edge
        const maxPercent = 95; // 95% from left/top edge (keeps formulas within viewport)

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Only use edge cells (not center)
                const isTopRow = row === 0;
                const isBottomRow = row === rows - 1;
                const isLeftCol = col === 0;
                const isRightCol = col === cols - 1;
                const isEdgeCell = isTopRow || isBottomRow || isLeftCol || isRightCol;

                if (isEdgeCell) {
                    // Map to safe range (5% - 95% instead of 0% - 100%)
                    const rawX = (col / (cols - 1)) * 100;
                    const rawY = (row / (rows - 1)) * 100;

                    // Scale to safe bounds
                    const x = minPercent + (rawX / 100) * (maxPercent - minPercent);
                    const y = minPercent + (rawY / 100) * (maxPercent - minPercent);

                    cells.push({
                        x,
                        y,
                        col,
                        row,
                        occupied: false,
                        // Add slight randomness within cell (±3% jitter, reduced to stay in bounds)
                        getRandomPosition: () => ({
                            x: MathUtils.clamp(x + (Math.random() - 0.5) * 6, minPercent, maxPercent),
                            y: MathUtils.clamp(y + (Math.random() - 0.5) * 6, minPercent, maxPercent)
                        })
                    });
                }
            }
        }

        return cells;
    }

    init() {
        // Use shared DOM ready utility for consistency
        onDOMReady(() => this.createFormulas());
    }

    createFormulas() {
        // Check if container already exists (prevents flash on navigation)
        let container = document.getElementById('floating-formulas-container');

        if (container) {
            // Container already exists, don't recreate
            return;
        }

        // Create container for formulas
        container = document.createElement('div');
        container.id = 'floating-formulas-container';
        container.className = 'floating-formulas-container';

        // Create all formulas with random initial positions
        this.formulas.forEach((formula, index) => {
            const formulaElement = document.createElement('div');
            formulaElement.className = 'floating-formula';
            formulaElement.textContent = formula.text;
            formulaElement.setAttribute('data-category', formula.category);

            // Store reference to formula text for overlap detection
            formulaElement.dataset.formulaText = formula.text;
            formulaElement.dataset.formulaIndex = index;

            // Set initial random position with grid-based system
            this.repositionFormula(formulaElement, true);

            // Staggered appearance: each formula appears one by one
            // This creates a sequential reveal effect when the page first loads
            const staggeredDelay = index * GameConstants.FORMULA_STAGGER_DELAY;
            setTimeout(() => {
                this.startFormulaAnimation(formulaElement);
            }, staggeredDelay);

            container.appendChild(formulaElement);
        });

        // Insert at the beginning of body (furthest back)
        document.body.insertBefore(container, document.body.firstChild);
    }

    /**
     * Get a random position from the grid system
     * Ensures even distribution by selecting from available grid cells
     */
    getRandomPosition() {
        // Get all unoccupied cells
        const availableCells = this.gridCells.filter(cell => !cell.occupied);

        if (availableCells.length === 0) {
            // All cells occupied, reset all cells and start over
            this.gridCells.forEach(cell => cell.occupied = false);
            return this.getRandomPosition();
        }

        // Randomly select an available cell
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const selectedCell = availableCells[randomIndex];

        // Mark cell as occupied
        selectedCell.occupied = true;

        // Return position with slight randomness within the cell
        return selectedCell.getRandomPosition();
    }

    repositionFormula(element, isInitial = false) {
        const formulaText = element.dataset.formulaText;
        const formulaIndex = parseInt(element.dataset.formulaIndex);

        // If repositioning (not initial), free up the old cell
        if (!isInitial) {
            const oldCellIndex = element.dataset.cellIndex;
            if (oldCellIndex !== undefined) {
                const oldCell = this.gridCells[parseInt(oldCellIndex)];
                if (oldCell) {
                    oldCell.occupied = false;
                }
            }
        }

        // Get a new grid-based position
        const pos = this.getRandomPosition();

        // Find and store the cell index for later cleanup
        const cellIndex = this.gridCells.findIndex(cell => cell.occupied &&
            Math.abs(cell.x - pos.x) < 5 && Math.abs(cell.y - pos.y) < 5);
        element.dataset.cellIndex = cellIndex;

        // Update position tracking
        if (isInitial) {
            // Add new position
            this.formulaPositions.push({
                x: pos.x,
                y: pos.y,
                text: formulaText,
                index: formulaIndex
            });
        } else {
            // Update existing position
            const existingPos = this.formulaPositions.find(p => p.index === formulaIndex);
            if (existingPos) {
                existingPos.x = pos.x;
                existingPos.y = pos.y;
            }
        }

        element.style.left = `${pos.x}%`;
        element.style.top = `${pos.y}%`;

        // Random rotation (using constant from GameConstants)
        const rotation = (Math.random() - 0.5) * GameConstants.FORMULA_ROTATION_RANGE;
        element.style.setProperty('--initial-rotation', `${rotation}deg`);

        // Random drift direction (single direction movement)
        // Reduced distance to keep formulas within viewport bounds
        const angle = Math.random() * 2 * Math.PI; // Random angle in radians
        const distance = GameConstants.FORMULA_DRIFT_MIN + Math.random() * (GameConstants.FORMULA_DRIFT_MAX - GameConstants.FORMULA_DRIFT_MIN);
        const driftX = Math.cos(angle) * distance;
        const driftY = Math.sin(angle) * distance;
        element.style.setProperty('--drift-x', `${driftX}px`);
        element.style.setProperty('--drift-y', `${driftY}px`);
    }

    startFormulaAnimation(element) {
        // Randomize animation duration between 12-18 seconds for variety
        const animationDuration = 12 + Math.random() * 6; // 12-18 seconds
        element.style.animation = `formulaGrowDissolve ${animationDuration}s ease-in-out forwards`;

        // After animation completes, reposition and restart
        const repositionAndRestart = () => {
            setTimeout(() => {
                // Reposition to new random grid cell location
                this.repositionFormula(element);

                // Randomize next animation duration for organic appearance
                const nextDuration = 12 + Math.random() * 6; // 12-18 seconds

                // Restart animation with new duration
                element.style.animation = 'none';
                // Force reflow to restart animation
                void element.offsetWidth;
                element.style.animation = `formulaGrowDissolve ${nextDuration}s ease-in-out forwards`;

                // Schedule next cycle
                repositionAndRestart();
            }, animationDuration * 1000); // Duration in milliseconds
        };

        // Start the continuous cycle
        repositionAndRestart();
    }
}

// Initialize floating formulas only on the home page
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    new FloatingFormulas();
}
