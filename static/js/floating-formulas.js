/**
 * Floating Mathematical Formulas Background
 * Creates a futuristic AI/ML/Blockchain themed background with mathematical formulas
 */

class FloatingFormulas {
    constructor() {
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
                x = 0 + Math.random() * 26;   // Left 0-26% (from edge)
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
                x = 0 + Math.random() * 30;   // Left 0-30% (from edge)
                y = 75 + (verticalOffset * 0.20); // Distribute across bottom 75-95%
                break;
            case 'left':
                x = 0 + Math.random() * 26;   // Left 0-26% (from edge)
                y = 35 + (verticalOffset * 0.30); // Distribute across middle
                break;
            case 'left-top':
                x = 0 + Math.random() * 26;   // Left 0-26% (from edge)
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
     * Now considers actual text width for more accurate collision detection
     */
    checkOverlap(newPos, newText, existingPositions, minDistance = 25) {
        const newWidth = this.estimateFormulaWidth(newText);

        for (let pos of existingPositions) {
            const posWidth = this.estimateFormulaWidth(pos.text);

            // Calculate actual distance considering text width
            const dx = Math.abs(newPos.x - pos.x);
            const dy = Math.abs(newPos.y - pos.y);

            // Horizontal overlap check
            const horizontalOverlap = dx < ((newWidth + posWidth) / 2 + minDistance);
            // Vertical overlap check (formulas are single line, so smaller vertical threshold)
            const verticalOverlap = dy < 8;

            if (horizontalOverlap && verticalOverlap) {
                return true; // Overlaps
            }
        }
        return false; // No overlap
    }

    createFormulas() {
        // Create container for formulas
        const container = document.createElement('div');
        container.id = 'floating-formulas-container';
        container.className = 'floating-formulas-container';

        const existingPositions = [];

        // Group formulas by category for organized placement
        const formulasByCategory = {};
        this.formulas.forEach(formula => {
            if (!formulasByCategory[formula.category]) {
                formulasByCategory[formula.category] = [];
            }
            formulasByCategory[formula.category].push(formula);
        });

        // Process each category group
        Object.keys(formulasByCategory).forEach(category => {
            const categoryFormulas = formulasByCategory[category];
            const zone = this.getCategoryZone(category);
            const totalInZone = categoryFormulas.length;

            categoryFormulas.forEach((formula, indexInCategory) => {
                const formulaElement = document.createElement('div');
                formulaElement.className = 'floating-formula';
                formulaElement.textContent = formula.text;
                formulaElement.setAttribute('data-category', formula.category);

                // Get position in category zone with overlap detection
                let position;
                let attempts = 0;
                do {
                    position = this.getPositionInZone(zone, indexInCategory, totalInZone);
                    attempts++;
                } while (this.checkOverlap(position, formula.text, existingPositions) && attempts < 100);

                // Store position with text for overlap checking
                existingPositions.push({
                    x: position.x,
                    y: position.y,
                    text: formula.text
                });

                formulaElement.style.left = `${position.x}%`;
                formulaElement.style.top = `${position.y}%`;

                // Smaller random rotation (-10 to 10 degrees)
                const rotation = (Math.random() - 0.5) * 20;
                formulaElement.style.setProperty('--initial-rotation', `${rotation}deg`);
                formulaElement.style.transform = `rotate(${rotation}deg)`;

                // Random animation duration (100-180 seconds for very slow movement)
                const duration = 100 + Math.random() * 80;
                formulaElement.style.animationDuration = `${duration}s`;

                // Staggered animation delay based on category
                const delay = Math.random() * 30;
                formulaElement.style.animationDelay = `${delay}s`;

                container.appendChild(formulaElement);
            });
        });

        // Insert at the beginning of body (furthest back)
        document.body.insertBefore(container, document.body.firstChild);
    }
}

// Initialize floating formulas
new FloatingFormulas();
