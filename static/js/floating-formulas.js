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
                latex: '\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2',
                category: 'regression'
            },
            // 2. Logistic Regression (Cross-Entropy Loss)
            {
                latex: 'L(\\theta) = -\\sum[y_i\\log(h_\\theta(x)) + (1-y_i)\\log(1-h_\\theta(x))]',
                category: 'regression'
            },
            // 3. Gradient Descent
            {
                latex: '\\theta := \\theta - \\alpha\\nabla J(\\theta)',
                category: 'optimization'
            },
            {
                latex: '\\frac{\\partial J}{\\partial \\theta_j} = \\frac{1}{m} \\sum_{i=1}^{m}(h_\\theta(x^{(i)}) - y^{(i)})x_j^{(i)}',
                category: 'optimization'
            },
            // 4. Black-Scholes Formula
            {
                latex: 'C = S_0N(d_1) - Ke^{-rt}N(d_2)',
                category: 'finance'
            },
            {
                latex: 'd_1 = \\frac{\\ln(S_0/K) + (r + \\sigma^2/2)t}{\\sigma\\sqrt{t}}',
                category: 'finance'
            },
            // 5. PDE (Heat Equation / Diffusion)
            {
                latex: '\\frac{\\partial u}{\\partial t} = \\alpha\\nabla^2u',
                category: 'pde'
            },
            {
                latex: '\\frac{\\partial^2 u}{\\partial x^2} + \\frac{\\partial^2 u}{\\partial y^2} = 0',
                category: 'pde'
            },
            // 6. Monte Carlo
            {
                latex: '\\mathbb{E}[f(X)] \\approx \\frac{1}{N} \\sum_{i=1}^{N}f(X_i)',
                category: 'simulation'
            },
            {
                latex: '\\int_a^b f(x)dx \\approx \\frac{b-a}{N} \\sum_{i=1}^{N}f(x_i)',
                category: 'simulation'
            },
            // 7. Bayesian with Beta and Binomial
            {
                latex: 'P(\\theta|D) = \\frac{P(D|\\theta)P(\\theta)}{P(D)}',
                category: 'bayesian'
            },
            {
                latex: '\\text{Beta}(\\alpha,\\beta) = \\frac{\\Gamma(\\alpha+\\beta)}{\\Gamma(\\alpha)\\Gamma(\\beta)} \\theta^{\\alpha-1}(1-\\theta)^{\\beta-1}',
                category: 'bayesian'
            },
            {
                latex: 'P(k|n,\\theta) = \\binom{n}{k}\\theta^k(1-\\theta)^{n-k}',
                category: 'bayesian'
            },
            // 8. XGBoost
            {
                latex: '\\text{Obj} = \\sum_{i=1}^{n}L(y_i,\\hat{y}_i) + \\sum_{k=1}^{K}\\Omega(f_k)',
                category: 'boosting'
            },
            {
                latex: '\\Omega(f) = \\gamma T + \\frac{1}{2}\\lambda\\|w\\|^2',
                category: 'boosting'
            },
            // 9. Neural Networks
            {
                latex: 'a_j = \\sigma\\left(\\sum_{i}w_{ij}x_i + b_j\\right)',
                category: 'neural'
            },
            {
                latex: '\\delta_j = \\frac{\\partial E}{\\partial \\text{net}_j} = (t_j - y_j)\\sigma\'(\\text{net}_j)',
                category: 'neural'
            },
            {
                latex: '\\sigma(x) = \\frac{1}{1 + e^{-x}}',
                category: 'neural'
            },
            {
                latex: '\\text{ReLU}(x) = \\max(0, x)',
                category: 'neural'
            },
            // 10. Clustering (K-means)
            {
                latex: '\\arg\\min_{C} \\sum_{k=1}^{K} \\sum_{x \\in C_k} \\|x - \\mu_k\\|^2',
                category: 'clustering'
            },
            {
                latex: '\\mu_k = \\frac{1}{|C_k|} \\sum_{x \\in C_k} x',
                category: 'clustering'
            },
            // 11. Survival Analysis
            {
                latex: 'S(t) = \\exp(-\\Lambda(t)) = \\exp\\left(-\\int_0^t\\lambda(u)du\\right)',
                category: 'survival'
            },
            {
                latex: 'h(t) = \\lim_{\\Delta t \\to 0}\\frac{P(t\\leq T<t+\\Delta t|T\\geq t)}{\\Delta t}',
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
            formulaElement.setAttribute('data-category', formula.category);

            // Render LaTeX using KaTeX (wait for KaTeX to be loaded)
            let retryCount = 0;
            const renderFormula = () => {
                if (typeof katex !== 'undefined') {
                    try {
                        katex.render(formula.latex, formulaElement, {
                            throwOnError: false,
                            displayMode: true, // Display mode for proper math layout (fractions, etc.)
                            strict: false, // Allow some non-standard LaTeX
                            trust: false // Don't allow raw HTML
                        });
                        // Debug: Check if KaTeX rendered properly
                        if (index === 0) {
                            console.log('KaTeX rendered formula 0:', formulaElement.innerHTML.substring(0, 100));
                            console.log('Formula element classes:', formulaElement.firstChild?.className);
                        }
                    } catch (e) {
                        console.error('KaTeX rendering error for formula', index, ':', e);
                        console.error('LaTeX:', formula.latex);
                        formulaElement.textContent = formula.latex; // Fallback to plain text
                    }
                } else {
                    // KaTeX not loaded yet, try again in 100ms (max 50 retries = 5 seconds)
                    retryCount++;
                    if (retryCount < 50) {
                        setTimeout(renderFormula, 100);
                    } else {
                        console.error('KaTeX failed to load after 5 seconds');
                        formulaElement.textContent = formula.latex; // Fallback to plain text
                    }
                }
            };
            renderFormula();

            // Store reference to formula for overlap detection
            formulaElement.dataset.formulaLatex = formula.latex;
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
        const formulaLatex = element.dataset.formulaLatex;
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
                latex: formulaLatex,
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

// Initialize floating formulas globally (shows on all pages)
// The formulas are positioned around edges, so they don't interfere with content
const formulasInstance = new FloatingFormulas();

// Make globally accessible for SPA router
window.formulasInstance = formulasInstance;
