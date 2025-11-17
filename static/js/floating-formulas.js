/**
 * Floating Mathematical Formulas Background
 * Creates a futuristic AI/ML/Blockchain themed background with mathematical formulas
 */

class FloatingFormulas {
    constructor() {
        this.formulaPositions = []; // Track all formula positions for overlap detection
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

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createFormulas());
        } else {
            this.createFormulas();
        }
    }

    /**
     * Get category zone mapping - groups related formulas together
     * Each category gets assigned to a specific edge zone
     */
    getCategoryZone(category) {
        const zoneMap = {
            'regression': 'top-left',
            'optimization': 'top-right',
            'finance': 'right',
            'pde': 'bottom-right',
            'simulation': 'bottom',
            'bayesian': 'bottom-left',
            'boosting': 'left',
            'neural': 'top',
            'clustering': 'right-bottom',
            'survival': 'left-top'
        };
        return zoneMap[category] || 'top';
    }

    /**
     * Get a position in a specific zone towards the edges
     * Groups formulas by category for better readability
     */
    getPositionInZone(zone, formulaIndex, totalInZone) {
        let x, y;

        // Distribute formulas evenly within their zone vertically
        const spacing = 100 / (totalInZone + 1);
        const verticalOffset = spacing * (formulaIndex + 1);

        switch(zone) {
            case 'top':
                x = 20 + Math.random() * 60; // Center top area
                y = 5 + (verticalOffset * 0.12); // Distribute across top 5-17%
                break;
            case 'top-left':
                x = 0 + Math.random() * 10;   // Left 0-10% (from edge)
                y = 5 + (verticalOffset * 0.20); // Distribute across top 5-25%
                break;
            case 'top-right':
                x = 74 + Math.random() * 18;  // Right 74-92%
                y = 5 + (verticalOffset * 0.20); // Distribute across top 5-25%
                break;
            case 'right':
                x = 76 + Math.random() * 18;  // Right 76-94%
                y = 25 + (verticalOffset * 0.30); // Distribute across middle-upper
                break;
            case 'right-bottom':
                x = 76 + Math.random() * 18;  // Right 76-94%
                y = 60 + (verticalOffset * 0.30); // Distribute across lower portion
                break;
            case 'bottom':
                x = 30 + Math.random() * 40;  // Center bottom
                y = 80 + (verticalOffset * 0.15); // Distribute across bottom 80-95%
                break;
            case 'bottom-right':
                x = 68 + Math.random() * 26;  // Right side 68-94%
                y = 75 + (verticalOffset * 0.20); // Distribute across bottom 75-95%
                break;
            case 'bottom-left':
                x = 0 + Math.random() * 10;   // Left 0-10% (from edge)
                y = 75 + (verticalOffset * 0.20); // Distribute across bottom 75-95%
                break;
            case 'left':
                x = 0 + Math.random() * 10;   // Left 0-10% (from edge)
                y = 35 + (verticalOffset * 0.30); // Distribute across middle
                break;
            case 'left-top':
                x = 0 + Math.random() * 10;   // Left 0-10% (from edge)
                y = 10 + (verticalOffset * 0.25); // Distribute across upper
                break;
        }

        return { x, y, zone };
    }

    /**
     * Estimate formula width in viewport percentage
     */
    estimateFormulaWidth(text, fontSize = 0.9) {
        // Rough estimate: average character width in rem * number of characters
        const avgCharWidth = 0.5; // rem
        const textWidth = text.length * avgCharWidth * fontSize;
        // Convert to approximate viewport percentage (assuming 1rem ≈ 16px, viewport ≈ 1200px)
        return (textWidth * 16 / 1200) * 100;
    }

    /**
     * Check if a new position overlaps with existing formulas
     * Accounts for drift movement and growth to prevent collisions during animation
     */
    checkOverlap(newPos, newText, existingPositions, minDistance = 25) {
        const newWidth = this.estimateFormulaWidth(newText);

        // Account for maximum drift distance (50px) and growth (125%)
        // Convert 50px to viewport percentage
        const maxDriftPercent = (50 / window.innerWidth) * 100;
        const growthFactor = 1.25; // 125% max size

        // Safety buffer includes drift space and growth
        const safetyBuffer = maxDriftPercent * 2 + minDistance;

        for (let pos of existingPositions) {
            const posWidth = this.estimateFormulaWidth(pos.text);

            // Calculate distance between centers
            const dx = Math.abs(newPos.x - pos.x);
            const dy = Math.abs(newPos.y - pos.y);

            // Combined width accounting for growth
            const combinedWidth = ((newWidth + posWidth) / 2) * growthFactor;

            // Check for overlap with safety buffer
            // Use larger buffer for both horizontal and vertical to account for drift
            const horizontalOverlap = dx < (combinedWidth + safetyBuffer);
            const verticalOverlap = dy < safetyBuffer;

            if (horizontalOverlap && verticalOverlap) {
                return true; // Would overlap during animation
            }
        }
        return false; // Safe distance
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

            // Set initial random position with overlap detection
            this.repositionFormula(formulaElement, true);

            // Stagger the initial appearance
            setTimeout(() => {
                this.startFormulaAnimation(formulaElement);
            }, index * 200); // Stagger by 200ms each

            container.appendChild(formulaElement);
        });

        // Insert at the beginning of body (furthest back)
        document.body.insertBefore(container, document.body.firstChild);
    }

    getRandomPosition() {
        // Randomly choose an edge: top, right, bottom, or left
        // All formula types appear randomly at all edges
        const edge = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
        let x, y;

        switch(edge) {
            case 0: // Top edge
                x = Math.random() * 100; // 0-100% across
                y = Math.random() * 20;  // 0-20% from top
                break;
            case 1: // Right edge
                x = 80 + Math.random() * 20; // 80-100% from left
                y = Math.random() * 100;     // 0-100% vertical
                break;
            case 2: // Bottom edge
                x = Math.random() * 100;     // 0-100% across
                y = 80 + Math.random() * 20; // 80-100% from top
                break;
            case 3: // Left edge
                x = Math.random() * 20;  // 0-20% from left
                y = Math.random() * 100; // 0-100% vertical
                break;
        }

        return { x, y };
    }

    repositionFormula(element, isInitial = false) {
        const formulaText = element.dataset.formulaText;
        const formulaIndex = parseInt(element.dataset.formulaIndex);
        let pos;
        let attempts = 0;
        const maxAttempts = 100;

        // Try to find a non-overlapping position
        do {
            pos = this.getRandomPosition();
            attempts++;
        } while (
            attempts < maxAttempts &&
            this.checkOverlap(pos, formulaText, this.formulaPositions, 50)
        );

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

        // Random rotation
        const rotation = (Math.random() - 0.5) * 20; // -10 to 10 degrees
        element.style.setProperty('--initial-rotation', `${rotation}deg`);

        // Random drift direction (single direction movement)
        const angle = Math.random() * 2 * Math.PI; // Random angle in radians
        const distance = 20 + Math.random() * 30; // 20-50px drift distance (reduced to minimize collisions)
        const driftX = Math.cos(angle) * distance;
        const driftY = Math.sin(angle) * distance;
        element.style.setProperty('--drift-x', `${driftX}px`);
        element.style.setProperty('--drift-y', `${driftY}px`);
    }

    startFormulaAnimation(element) {
        // Start the animation cycle: appear → grow → dissolve
        element.style.animation = 'formulaGrowDissolve 10s ease-in-out forwards';

        // After animation completes, reposition and restart
        const repositionAndRestart = () => {
            setTimeout(() => {
                // Reposition to new random edge location
                this.repositionFormula(element);

                // Restart animation
                element.style.animation = 'none';
                // Force reflow to restart animation
                void element.offsetWidth;
                element.style.animation = 'formulaGrowDissolve 10s ease-in-out forwards';

                // Schedule next cycle
                repositionAndRestart();
            }, 10000); // 10 second cycle
        };

        // Start the continuous cycle
        repositionAndRestart();
    }
}

// Initialize floating formulas only on the home page
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    new FloatingFormulas();
}
