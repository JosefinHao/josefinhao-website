/**
 * Interactive Particle Network
 * Subtle particle system that reacts to hover interactions
 * Uses shared utilities from utils.js for safe math operations
 */

class InteractiveParticleNetwork {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouseX = null;
        this.mouseY = null;
        this.hoveredSection = null;
        this.activeRadius = GameConstants.ACTIVE_RADIUS;
        this.maxParticles = GameConstants.MAX_PARTICLES;

        this.init();
    }

    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-network-canvas';
        this.ctx = this.canvas.getContext('2d');

        // Insert canvas as first child of body
        document.body.insertBefore(this.canvas, document.body.firstChild);

        // Set canvas size
        this.resize();

        // Create particles
        this.createParticles();

        // Event listeners
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseleave', () => this.handleMouseLeave());

        // Detect hoverable sections
        this.setupSectionHover();

        // Start animation
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = document.documentElement.scrollHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: 0,
                targetOpacity: 0
            });
        }
    }

    setupSectionHover() {
        // Get all content sections
        const sections = document.querySelectorAll('.profile-section, .content-placeholder, .main-content');

        sections.forEach(section => {
            section.addEventListener('mouseenter', () => {
                this.hoveredSection = section;
                this.activateParticles();
            });

            section.addEventListener('mouseleave', () => {
                if (this.hoveredSection === section) {
                    this.hoveredSection = null;
                    this.deactivateParticles();
                }
            });
        });
    }

    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY + window.scrollY;
    }

    handleMouseLeave() {
        this.mouseX = null;
        this.mouseY = null;
        this.deactivateParticles();
    }

    activateParticles() {
        this.particles.forEach(particle => {
            particle.targetOpacity = 0.6;
        });
    }

    deactivateParticles() {
        this.particles.forEach(particle => {
            particle.targetOpacity = 0;
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }

            // Smooth opacity transition
            const opacityDiff = particle.targetOpacity - particle.opacity;
            particle.opacity += opacityDiff * 0.1;

            // Mouse interaction
            if (this.mouseX !== null && this.mouseY !== null) {
                const dx = this.mouseX - particle.x;
                const dy = this.mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.activeRadius && distance > 0.01) { // Prevent division by zero
                    // Attract particles slightly towards mouse
                    const force = (this.activeRadius - distance) / this.activeRadius * GameConstants.FORCE_MULTIPLIER;
                    // Use safe division to prevent errors when distance is very small
                    particle.vx += MathUtils.safeDivide(dx * force, distance);
                    particle.vy += MathUtils.safeDivide(dy * force, distance);

                    // Increase opacity near mouse
                    const proximityOpacity = (this.activeRadius - distance) / this.activeRadius;
                    particle.targetOpacity = Math.max(particle.targetOpacity, proximityOpacity * 0.8);
                }
            }

            // Damping to prevent excessive speed
            particle.vx *= 0.98;
            particle.vy *= 0.98;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            if (particle.opacity > 0.01) {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(74, 144, 226, ${particle.opacity})`;
                this.ctx.fill();
            }
        });
    }

    drawConnections() {
        // Only draw connections if particles are visible
        const visibleParticles = this.particles.filter(p => p.opacity > 0.1);

        for (let i = 0; i < visibleParticles.length; i++) {
            for (let j = i + 1; j < visibleParticles.length; j++) {
                const p1 = visibleParticles[i];
                const p2 = visibleParticles[j];

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Draw connection if particles are close enough
                if (distance < GameConstants.CONNECTION_DISTANCE) {
                    const opacity = (GameConstants.CONNECTION_DISTANCE - distance) / GameConstants.CONNECTION_DISTANCE * Math.min(p1.opacity, p2.opacity) * 0.5;

                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(74, 144, 226, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }

        // Draw connections to mouse if active
        if (this.mouseX !== null && this.mouseY !== null && this.hoveredSection) {
            visibleParticles.forEach(particle => {
                const dx = this.mouseX - particle.x;
                const dy = this.mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.activeRadius) {
                    const opacity = (this.activeRadius - distance) / this.activeRadius * particle.opacity * 0.3;

                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(this.mouseX, this.mouseY);
                    this.ctx.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
                    this.ctx.lineWidth = 1.5;
                    this.ctx.stroke();
                }
            });

            // Draw mouse glow
            const gradient = this.ctx.createRadialGradient(
                this.mouseX, this.mouseY, 0,
                this.mouseX, this.mouseY, 30
            );
            gradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
            gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(this.mouseX, this.mouseY, 30, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();

        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready using shared utility
onDOMReady(() => {
    if (document.querySelector('.home-layout')) {
        new InteractiveParticleNetwork();
    }
});
