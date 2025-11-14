/**
 * Interactive Background Particles System
 * AI-themed particles that respond to user interaction
 */

class Particle {
    constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.baseSize = type === 'data-node' ? 8 : Math.random() * 3 + 2;
        this.size = this.baseSize;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.life = type === 'data-node' ? 100 : 200;
        this.maxLife = this.life;
        this.hue = type === 'data-node' ? 210 : Math.random() * 30 + 200; // Blue range
        this.opacity = type === 'ripple' ? 0.8 : 0.6;
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update(mouseX, mouseY, dancing = false) {
        // Mouse attraction for normal particles
        if (this.type === 'normal' && mouseX !== null && mouseY !== null) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 150;

            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                this.speedX += (dx / distance) * force * 0.3;
                this.speedY += (dy / distance) * force * 0.3;
            }
        }

        // Dancing effect
        if (dancing && this.type === 'normal') {
            this.speedX += (Math.random() - 0.5) * 1.5;
            this.speedY += (Math.random() - 0.5) * 1.5;
        }

        // Apply velocity with damping
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.95;
        this.speedY *= 0.95;

        // Pulse effect
        this.pulsePhase += this.pulseSpeed;
        this.size = this.baseSize + Math.sin(this.pulsePhase) * (this.baseSize * 0.3);

        // Ripple expansion
        if (this.type === 'ripple') {
            this.size += 0.8;
            this.opacity -= 0.015;
        }

        // Data node floating away
        if (this.type === 'data-node') {
            this.speedY -= 0.05; // Float upward
            this.opacity = this.life / this.maxLife;
        }

        // Decrease life
        this.life--;

        // Wrap around edges for normal particles
        if (this.type === 'normal') {
            if (this.x < 0) this.x = window.innerWidth;
            if (this.x > window.innerWidth) this.x = 0;
            if (this.y < 0) this.y = window.innerHeight;
            if (this.y > window.innerHeight) this.y = 0;
        }
    }

    draw(ctx) {
        ctx.save();

        if (this.type === 'ripple') {
            // Draw ripple as expanding circle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (this.type === 'data-node') {
            // Draw data node as glowing hexagon
            ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.opacity})`;
            ctx.shadowBlur = 15;
            ctx.shadowColor = `hsla(${this.hue}, 80%, 65%, ${this.opacity})`;

            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const x = this.x + Math.cos(angle) * this.size;
                const y = this.y + Math.sin(angle) * this.size;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        } else {
            // Draw normal particle as glowing circle
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            gradient.addColorStop(0, `hsla(${this.hue}, 70%, 60%, ${this.opacity})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 70%, 60%, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Add connection lines to nearby particles
            ctx.strokeStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity * 0.2})`;
            ctx.lineWidth = 0.5;
        }

        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = null;
        this.mouseY = null;
        this.dancing = false;
        this.lastShakeTime = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.shakeThreshold = 20;

        this.init();
    }

    init() {
        // Setup canvas
        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.resize();

        // Create initial particles
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            ));
        }

        // Event listeners
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('click', (e) => this.handleClick(e));
        window.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
        document.addEventListener('mouseleave', () => {
            this.mouseX = null;
            this.mouseY = null;
        });

        // Start animation
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleMouseMove(e) {
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Detect shake (rapid mouse movement)
        if (distance > this.shakeThreshold) {
            const now = Date.now();
            if (now - this.lastShakeTime < 100) {
                this.triggerDance();
            }
            this.lastShakeTime = now;
        }

        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;

        // Spawn particle trail occasionally
        if (Math.random() < 0.1) {
            this.particles.push(new Particle(e.clientX, e.clientY));
        }
    }

    handleClick(e) {
        // Create ripple effect
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.particles.push(new Particle(e.clientX, e.clientY, 'ripple'));
            }, i * 100);
        }
    }

    handleDoubleClick(e) {
        e.preventDefault();
        // Spawn data nodes
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const distance = 20;
            const x = e.clientX + Math.cos(angle) * distance;
            const y = e.clientY + Math.sin(angle) * distance;
            this.particles.push(new Particle(x, y, 'data-node'));
        }
    }

    triggerDance() {
        this.dancing = true;
        setTimeout(() => {
            this.dancing = false;
        }, 1000);
    }

    drawConnections() {
        // Draw connections between nearby normal particles
        const normalParticles = this.particles.filter(p => p.type === 'normal');

        for (let i = 0; i < normalParticles.length; i++) {
            for (let j = i + 1; j < normalParticles.length; j++) {
                const p1 = normalParticles[i];
                const p2 = normalParticles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    const opacity = (100 - distance) / 100 * 0.2;
                    this.ctx.strokeStyle = `hsla(210, 70%, 60%, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections first (behind particles)
        this.drawConnections();

        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(this.mouseX, this.mouseY, this.dancing);
            particle.draw(this.ctx);

            // Remove dead particles
            if (particle.life <= 0 && particle.type !== 'normal') {
                this.particles.splice(i, 1);
            } else if (particle.type === 'normal' && particle.life <= 0) {
                // Respawn normal particles
                particle.life = 200;
            }
        }

        // Maintain particle count
        while (this.particles.filter(p => p.type === 'normal').length < 50) {
            this.particles.push(new Particle(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            ));
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ParticleSystem();
    });
} else {
    new ParticleSystem();
}
