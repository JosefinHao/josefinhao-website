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

    createFormulas() {
        // Create container for formulas
        const container = document.createElement('div');
        container.id = 'floating-formulas-container';
        container.className = 'floating-formulas-container';

        // Create formula elements
        this.formulas.forEach((formula, index) => {
            const formulaElement = document.createElement('div');
            formulaElement.className = 'floating-formula';
            formulaElement.textContent = formula.text;
            formulaElement.setAttribute('data-category', formula.category);

            // Random positioning
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            formulaElement.style.left = `${startX}%`;
            formulaElement.style.top = `${startY}%`;

            // Random initial rotation (-15 to 15 degrees)
            const rotation = (Math.random() - 0.5) * 30;
            formulaElement.style.transform = `rotate(${rotation}deg)`;

            // Random animation duration (60-120 seconds for very slow movement)
            const duration = 60 + Math.random() * 60;
            formulaElement.style.animationDuration = `${duration}s`;

            // Random animation delay for staggered start
            const delay = Math.random() * 20;
            formulaElement.style.animationDelay = `${delay}s`;

            container.appendChild(formulaElement);
        });

        // Insert at the beginning of body (furthest back)
        document.body.insertBefore(container, document.body.firstChild);
    }
}

// Initialize floating formulas
new FloatingFormulas();
