/**
 * Cat Cafe Interactive Game - 2D Edition
 * A cozy interactive experience where you play as a cat in a cafe
 */

(function() {
    'use strict';

    // Game state
    const game = {
        canvas: null,
        ctx: null,
        width: 0,
        height: 0,
        points: 0,
        catSize: 1, // Logical cat size (starts at 1, increases with feeding, decreases with exercise)
        catHunger: 100,
        catEnergy: 100,
        cat: {
            x: 0,
            y: 0,
            size: 80,
            direction: 1,
            state: 'standing'
        },
        catTrees: [],
        couches: [],
        toys: [],
        images: {
            cat: null,
            catTree: null,
            couch: null,
            toy: null,
            background: null,
            loaded: false
        },
        initialized: false,
        animationFrameId: null
    };

    function cleanup() {
        if (game.animationFrameId) {
            cancelAnimationFrame(game.animationFrameId);
            game.animationFrameId = null;
        }
        window.removeEventListener('resize', resizeCanvas);
        game.initialized = false;
        console.log('Cat Cafe cleaned up');
    }

    function saveCatSize() {
        try {
            localStorage.setItem('catCafeSize', game.catSize.toString());
        } catch (e) {
            console.error('Failed to save cat size:', e);
        }
    }

    function loadCatSize() {
        try {
            const savedSize = localStorage.getItem('catCafeSize');
            if (savedSize) {
                game.catSize = parseFloat(savedSize);
                // Ensure cat size is at least 1
                if (game.catSize < 1) {
                    game.catSize = 1;
                }
            }
        } catch (e) {
            console.error('Failed to load cat size:', e);
            game.catSize = 1;
        }
    }

    function loadImages(callback) {
        let loadedCount = 0;
        const totalImages = 5;

        function imageLoaded() {
            loadedCount++;
            console.log(`Loaded ${loadedCount}/${totalImages} images`);
            if (loadedCount === totalImages) {
                game.images.loaded = true;
                callback();
            }
        }

        // Load background image
        game.images.background = new Image();
        game.images.background.onload = () => {
            console.log('Cat cafe background image loaded successfully:', game.images.background.naturalWidth, 'x', game.images.background.naturalHeight);
            imageLoaded();
        };
        game.images.background.onerror = (e) => {
            console.error('Background image failed to load:', e);
            imageLoaded();
        };
        game.images.background.src = '/static/images/cat_cafe.png';
        console.log('Loading cat cafe background from:', game.images.background.src);

        // Load cat image - local custom cat PNG
        game.images.cat = new Image();
        game.images.cat.onload = imageLoaded;
        game.images.cat.onerror = () => {
            console.log('Cat image failed to load, using fallback');
            imageLoaded();
        };
        game.images.cat.src = '/static/images/cat.png';

        // Load cat tree image - transparent PNG
        game.images.catTree = new Image();
        game.images.catTree.crossOrigin = 'anonymous';
        game.images.catTree.onload = imageLoaded;
        game.images.catTree.onerror = () => {
            console.log('Cat tree image failed to load, using fallback');
            imageLoaded();
        };
        // Placeholder - will use illustrated fallback
        game.images.catTree.src = 'data:image/png;base64,invalid';

        // Load couch image - transparent PNG
        game.images.couch = new Image();
        game.images.couch.crossOrigin = 'anonymous';
        game.images.couch.onload = imageLoaded;
        game.images.couch.onerror = () => {
            console.log('Couch image failed to load, using fallback');
            imageLoaded();
        };
        // Placeholder - will use illustrated fallback
        game.images.couch.src = 'data:image/png;base64,invalid';

        // Load cat toy image - transparent PNG
        game.images.toy = new Image();
        game.images.toy.crossOrigin = 'anonymous';
        game.images.toy.onload = imageLoaded;
        game.images.toy.onerror = () => {
            console.log('Toy image failed to load, using fallback');
            imageLoaded();
        };
        // Placeholder - will use illustrated fallback
        game.images.toy.src = 'data:image/png;base64,invalid';
    }

    function init() {
        console.log('Cat Cafe 2D game initializing...');

        if (game.initialized) {
            console.log('Cat Cafe already initialized, cleaning up first...');
            cleanup();
        }

        const canvas = document.getElementById('cat-cafe-canvas');
        if (!canvas) {
            console.error('Canvas not found');
            return;
        }

        game.canvas = canvas;
        game.ctx = canvas.getContext('2d');

        // Load saved cat size
        loadCatSize();

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Load images first, then start the game
        loadImages(() => {
            setupEventListeners();
            createCafeElements();

            game.cat.x = game.width / 2;
            game.cat.y = game.height / 2;

            game.initialized = true;
            gameLoop();

            console.log('Cat Cafe 2D game initialized successfully');
        });
    }

    function resizeCanvas() {
        if (!game.canvas || !game.canvas.parentElement) {
            return;
        }

        const container = game.canvas.parentElement;
        game.canvas.width = container.clientWidth;
        game.canvas.height = Math.max(500, Math.min(700, window.innerHeight - 250));
        game.width = game.canvas.width;
        game.height = game.canvas.height;

        if (game.catTrees.length === 0) {
            createCafeElements();
        }
    }

    function createCafeElements() {
        // Clear all furniture and toys - keeping cafe simple
        game.catTrees = [];
        game.couches = [];
        game.toys = [];
    }

    function setupEventListeners() {
        game.canvas.addEventListener('mousedown', handlePointerDown);
        game.canvas.addEventListener('mousemove', handlePointerMove);
        game.canvas.addEventListener('mouseup', handlePointerUp);
        game.canvas.addEventListener('mouseleave', handlePointerUp);

        game.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        game.canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        game.canvas.addEventListener('touchend', handlePointerUp);

        // Food bowl click handler
        const foodBowlBtn = document.getElementById('foodBowlBtn');
        if (foodBowlBtn) {
            foodBowlBtn.addEventListener('click', feedCat);
        }

        // Update points and cat size display
        updatePointsDisplay();
        updateCatSizeDisplay();
    }

    function updatePointsDisplay() {
        const pointsDisplay = document.getElementById('pointsDisplay');
        if (pointsDisplay) {
            pointsDisplay.textContent = game.points;
        }
    }

    function updateCatSizeDisplay() {
        const catSizeDisplay = document.getElementById('catSizeDisplay');
        if (catSizeDisplay) {
            catSizeDisplay.textContent = game.catSize.toFixed(1);
        }
    }

    function feedCat() {
        const FOOD_COST = 10;
        if (game.points >= FOOD_COST) {
            game.points -= FOOD_COST;
            game.catHunger = Math.min(100, game.catHunger + 30);

            // Increase cat size by 1 (10 points × 0.1 per point)
            game.catSize += 1;
            saveCatSize();

            updatePointsDisplay();
            updateCatSizeDisplay();

            // Show feeding animation or message
            showMessage(`Fed the cat! Size: ${game.catSize.toFixed(1)} | Hunger: ${Math.floor(game.catHunger)}%`);
        } else {
            showMessage(`Need ${FOOD_COST} points to feed the cat!`);
        }
    }

    function showMessage(text) {
        const messageEl = document.getElementById('cafeMessage');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.style.opacity = '1';
            setTimeout(() => {
                messageEl.style.opacity = '0';
            }, 2000);
        }
    }

    function exerciseCat(points) {
        // Each point of exercise reduces cat size by 0.1
        const sizeReduction = points * 0.1;
        game.catSize = Math.max(1, game.catSize - sizeReduction);
        saveCatSize();
        updateCatSizeDisplay();
    }

    function playMeowSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Create a meow-like sound with frequency modulation
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
            oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.15);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.25);

            // Envelope for more natural sound
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.type = 'triangle';
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio not supported:', e);
        }
    }

    function handlePointerDown(e) {
        // Play meow sound when canvas is clicked
        playMeowSound();
    }

    function handlePointerMove(e) {
        // No longer needed for movement or dragging
        game.canvas.style.cursor = 'pointer';
    }

    function handlePointerUp() {
        // No longer needed for movement or dragging
    }

    function handleTouchStart(e) {
        e.preventDefault();
        // Play meow sound when canvas is touched
        playMeowSound();
    }

    function handleTouchMove(e) {
        e.preventDefault();
        // No longer needed for movement or dragging
    }

    function update() {
        // Cat no longer moves - stays in standing state
        game.cat.state = 'standing';
    }

    function render() {
        const ctx = game.ctx;

        // Clear canvas
        ctx.clearRect(0, 0, game.width, game.height);

        // Draw cafe background image
        drawCafeBackground(ctx);

        // Draw cafe elements (order matters for layering)
        drawCouches();
        drawCatTrees();
        drawToys();

        // Draw cat (always on top)
        drawCat();
    }

    function drawCafeBackground(ctx) {
        // Use custom cat cafe background image if loaded
        if (game.images.background && game.images.background.complete && game.images.background.naturalWidth > 0) {
            // Draw background image scaled to fit canvas
            ctx.drawImage(game.images.background, 0, 0, game.width, game.height);
        } else {
            // Fallback: Draw gradient background
            if (!game.images.background) {
                console.warn('Background image not loaded yet');
            } else if (!game.images.background.complete) {
                console.warn('Background image not complete');
            } else if (game.images.background.naturalWidth === 0) {
                console.warn('Background image has zero width');
            }
            const bgGradient = ctx.createLinearGradient(0, 0, 0, game.height);
            bgGradient.addColorStop(0, '#fdf6e3');  // Warm cream
            bgGradient.addColorStop(0.7, '#f5e6d3'); // Beige
            bgGradient.addColorStop(1, '#e8d5c4');   // Darker tan
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, game.width, game.height);
        }
    }

    function drawCatTrees() {
        const ctx = game.ctx;
        game.catTrees.forEach(tree => {
            // Realistic shadow
            ctx.save();
            ctx.fillStyle = 'rgba(101, 67, 33, 0.3)';
            ctx.beginPath();
            ctx.ellipse(
                tree.x + tree.width / 2,
                tree.y + tree.height + 3,
                tree.width / 2.5,
                tree.width / 12,
                0, 0, Math.PI * 2
            );
            ctx.fill();
            ctx.restore();

            // Draw improved cat tree (always use fallback for now)
            drawRealisticCatTree(ctx, tree.x, tree.y, tree.width, tree.height);
        });
    }

    function drawRealisticCatTree(ctx, x, y, width, height) {
        const centerX = x + width / 2;
        const baseY = y + height;
        const poleWidth = width * 0.25;

        // Base platform
        ctx.fillStyle = '#6d5d4b';
        ctx.fillRect(x, baseY - 10, width, 10);
        ctx.strokeStyle = '#5a4a3a';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, baseY - 10, width, 10);

        // Pole with texture
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(centerX - poleWidth / 2, y + height * 0.2, poleWidth, height * 0.8);

        // Sisal rope texture on pole
        ctx.strokeStyle = '#a0826d';
        ctx.lineWidth = 2;
        for (let ty = y + height * 0.2; ty < baseY; ty += 4) {
            ctx.beginPath();
            ctx.moveTo(centerX - poleWidth / 2, ty);
            ctx.lineTo(centerX + poleWidth / 2, ty);
            ctx.stroke();
        }

        // Platforms at different heights
        const platforms = [
            { yOffset: 0.2, size: width * 0.7 },
            { yOffset: 0.5, size: width * 0.55 },
            { yOffset: 0.75, size: width * 0.45 }
        ];

        platforms.forEach(platform => {
            const py = y + height * platform.yOffset;
            const psize = platform.size;

            // Platform shadow
            ctx.fillStyle = 'rgba(109, 93, 75, 0.4)';
            ctx.beginPath();
            ctx.ellipse(centerX, py + 3, psize / 2, psize / 8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Platform
            ctx.fillStyle = '#a0826d';
            ctx.beginPath();
            ctx.ellipse(centerX, py, psize / 2, psize / 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Platform edge
            ctx.strokeStyle = '#8b7355';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Carpet texture on platform
            ctx.fillStyle = '#8b6f47';
            ctx.beginPath();
            ctx.ellipse(centerX, py, psize / 2.5, psize / 8, 0, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawCouches() {
        const ctx = game.ctx;
        game.couches.forEach(couch => {
            // Realistic shadow
            ctx.save();
            ctx.fillStyle = 'rgba(101, 67, 33, 0.25)';
            ctx.beginPath();
            ctx.ellipse(
                couch.x + couch.width / 2,
                couch.y + couch.height + 5,
                couch.width / 2.2,
                couch.width / 10,
                0, 0, Math.PI * 2
            );
            ctx.fill();
            ctx.restore();

            // Draw improved couch
            drawRealisticCouch(ctx, couch.x, couch.y, couch.width, couch.height);
        });
    }

    function drawRealisticCouch(ctx, x, y, width, height) {
        // Couch seat
        const seatY = y + height * 0.4;
        const seatHeight = height * 0.6;

        // Seat base
        ctx.fillStyle = '#8b6f47';
        ctx.fillRect(x, seatY, width, seatHeight);

        // Seat cushion detail
        ctx.fillStyle = '#a0826d';
        ctx.fillRect(x + 5, seatY + 5, width - 10, seatHeight * 0.7);

        // Cushion segments
        const cushionCount = 3;
        ctx.strokeStyle = '#8b6f47';
        ctx.lineWidth = 3;
        for (let i = 1; i < cushionCount; i++) {
            const cx = x + (width * i / cushionCount);
            ctx.beginPath();
            ctx.moveTo(cx, seatY + 5);
            ctx.lineTo(cx, seatY + seatHeight * 0.7);
            ctx.stroke();
        }

        // Left armrest
        ctx.fillStyle = '#8b6f47';
        ctx.fillRect(x, y, width * 0.15, height * 0.8);
        ctx.fillStyle = '#a0826d';
        ctx.fillRect(x, y, width * 0.15, width * 0.1);

        // Right armrest
        ctx.fillStyle = '#8b6f47';
        ctx.fillRect(x + width * 0.85, y, width * 0.15, height * 0.8);
        ctx.fillStyle = '#a0826d';
        ctx.fillRect(x + width * 0.85, y, width * 0.15, width * 0.1);

        // Backrest
        ctx.fillStyle = '#8b6f47';
        ctx.fillRect(x + width * 0.15, y, width * 0.7, height * 0.5);
        ctx.fillStyle = '#a0826d';
        ctx.fillRect(x + width * 0.2, y + 5, width * 0.6, height * 0.35);

        // Couch legs
        ctx.fillStyle = '#6d5d4b';
        const legWidth = 8;
        ctx.fillRect(x + 15, y + height - 15, legWidth, 15);
        ctx.fillRect(x + width - 15 - legWidth, y + height - 15, legWidth, 15);
    }

    function drawToys() {
        const ctx = game.ctx;
        game.toys.forEach(toy => {
            // Realistic shadow
            ctx.save();
            ctx.fillStyle = 'rgba(101, 67, 33, 0.2)';
            ctx.beginPath();
            ctx.ellipse(
                toy.x + toy.width / 2,
                toy.y + toy.height + 2,
                toy.width / 2.5,
                toy.width / 10,
                0, 0, Math.PI * 2
            );
            ctx.fill();
            ctx.restore();

            // Draw toy (various types)
            const toyType = Math.floor((toy.x + toy.y) % 3);
            switch (toyType) {
                case 0:
                    drawToyBall(ctx, toy.x, toy.y, toy.width);
                    break;
                case 1:
                    drawToyMouse(ctx, toy.x, toy.y, toy.width);
                    break;
                case 2:
                    drawToyFeather(ctx, toy.x, toy.y, toy.width);
                    break;
            }
        });
    }

    function drawToyBall(ctx, x, y, size) {
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 2;

        // Ball gradient
        const ballGradient = ctx.createRadialGradient(
            centerX - radius * 0.3, centerY - radius * 0.3, 0,
            centerX, centerY, radius
        );
        ballGradient.addColorStop(0, '#ff8a65');
        ballGradient.addColorStop(1, '#e64a19');

        ctx.fillStyle = ballGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Ball detail stripes
        ctx.strokeStyle = '#d84315';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
    }

    function drawToyMouse(ctx, x, y, size) {
        // Mouse body
        ctx.fillStyle = '#9e9e9e';
        ctx.beginPath();
        ctx.ellipse(x + size * 0.6, y + size * 0.6, size * 0.35, size * 0.25, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Mouse head
        ctx.beginPath();
        ctx.arc(x + size * 0.3, y + size * 0.4, size * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // Ear
        ctx.fillStyle = '#757575';
        ctx.beginPath();
        ctx.arc(x + size * 0.2, y + size * 0.25, size * 0.12, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.strokeStyle = '#9e9e9e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + size * 0.85, y + size * 0.65);
        ctx.quadraticCurveTo(x + size, y + size * 0.5, x + size * 0.95, y + size * 0.3);
        ctx.stroke();
    }

    function drawToyFeather(ctx, x, y, size) {
        // Feather stick
        ctx.strokeStyle = '#8b7355';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + size * 0.5, y + size * 0.8);
        ctx.lineTo(x + size * 0.5, y + size * 0.3);
        ctx.stroke();

        // Feathers
        const featherColors = ['#9c27b0', '#e91e63', '#ff5722'];
        featherColors.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.save();
            ctx.translate(x + size * 0.5, y + size * 0.3);
            ctx.rotate((i - 1) * 0.4);
            ctx.beginPath();
            ctx.ellipse(0, -size * 0.15, size * 0.12, size * 0.25, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    function drawCat() {
        if (game.cat.state === 'lying') {
            drawCatLying();
        } else {
            drawCatStanding();
        }
    }

    function drawCatStanding() {
        const ctx = game.ctx;
        const x = game.cat.x;
        const y = game.cat.y;
        const size = game.cat.size * game.catSize; // Scale cat by catSize

        // Realistic shadow
        ctx.save();
        ctx.fillStyle = 'rgba(101, 67, 33, 0.25)';
        ctx.beginPath();
        ctx.ellipse(game.cat.x, game.cat.y + 8, size / 2.2, size / 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw cat image
        if (game.images.cat && game.images.cat.complete && game.images.cat.naturalWidth > 0) {
            ctx.save();

            // Maintain original aspect ratio - do not resize or distort
            const imgWidth = game.images.cat.naturalWidth;
            const imgHeight = game.images.cat.naturalHeight;
            const aspectRatio = imgWidth / imgHeight;

            // Scale based on size while maintaining aspect ratio
            const scaleFactor = size / Math.max(imgWidth, imgHeight);
            const catWidth = imgWidth * scaleFactor;
            const catHeight = imgHeight * scaleFactor;

            // Flip cat based on direction
            if (game.cat.direction === -1) {
                ctx.translate(x, y - catHeight / 2);
                ctx.scale(-1, 1);
                ctx.drawImage(game.images.cat, -catWidth / 2, 0, catWidth, catHeight);
            } else {
                ctx.translate(x - catWidth / 2, y - catHeight / 2);
                ctx.drawImage(game.images.cat, 0, 0, catWidth, catHeight);
            }

            ctx.restore();
        } else {
            // Improved fallback: draw cute orange cat
            drawFallbackCat(ctx, x, y, size, game.cat.direction);
        }
    }

    function drawFallbackCat(ctx, x, y, size, direction) {
        // Body
        ctx.fillStyle = '#ff9e80';
        ctx.beginPath();
        ctx.ellipse(x, y, size / 2, size / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        const headY = y - size / 3;
        ctx.beginPath();
        ctx.arc(x, headY, size / 3, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        const earSize = size / 8;
        const earOffset = size / 5;
        ctx.beginPath();
        ctx.moveTo(x - earOffset, headY - size / 6);
        ctx.lineTo(x - earOffset - earSize, headY - size / 3 - earSize);
        ctx.lineTo(x - earOffset + earSize, headY - size / 3);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + earOffset, headY - size / 6);
        ctx.lineTo(x + earOffset - earSize, headY - size / 3);
        ctx.lineTo(x + earOffset + earSize, headY - size / 3 - earSize);
        ctx.closePath();
        ctx.fill();

        // Face details
        ctx.fillStyle = '#2c3e50';
        const eyeY = headY - size / 12;
        const eyeOffset = size / 10;
        ctx.beginPath();
        ctx.arc(x - eyeOffset, eyeY, size / 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + eyeOffset, eyeY, size / 25, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#ffb3ba';
        ctx.beginPath();
        ctx.moveTo(x, headY + size / 15);
        ctx.lineTo(x - size / 40, headY + size / 20);
        ctx.lineTo(x + size / 40, headY + size / 20);
        ctx.closePath();
        ctx.fill();

        // Tail
        ctx.strokeStyle = '#ff9e80';
        ctx.lineWidth = size / 12;
        ctx.lineCap = 'round';
        const tailX = x - (size / 2) * direction;
        ctx.beginPath();
        ctx.moveTo(tailX, y);
        ctx.quadraticCurveTo(
            tailX - 15 * direction,
            y - 20,
            tailX - 20 * direction,
            y - 30
        );
        ctx.stroke();
    }

    function drawCatLying() {
        const ctx = game.ctx;
        const x = game.cat.x;
        const y = game.cat.y;
        const size = game.cat.size * game.catSize; // Scale cat by catSize

        // Realistic shadow (wider for lying position)
        ctx.save();
        ctx.fillStyle = 'rgba(101, 67, 33, 0.25)';
        ctx.beginPath();
        ctx.ellipse(x, y + 12, size / 1.3, size / 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw cat image lying down
        if (game.images.cat && game.images.cat.complete && game.images.cat.naturalWidth > 0) {
            ctx.save();

            // Maintain original aspect ratio - do not resize or distort
            const imgWidth = game.images.cat.naturalWidth;
            const imgHeight = game.images.cat.naturalHeight;

            // Scale based on size while maintaining aspect ratio
            const scaleFactor = size / Math.max(imgWidth, imgHeight);
            const catWidth = imgWidth * scaleFactor;
            const catHeight = imgHeight * scaleFactor;

            ctx.translate(x, y);
            ctx.rotate(Math.PI / 16); // Slight tilt for lying effect
            ctx.drawImage(game.images.cat, -catWidth / 2, -catHeight / 2, catWidth, catHeight);

            ctx.restore();
        } else {
            // Fallback: draw lying cat
            ctx.fillStyle = '#ff9e80';
            ctx.beginPath();
            ctx.ellipse(x, y, size / 1.3, size / 4, 0, 0, Math.PI * 2);
            ctx.fill();

            const headY = y - size / 8;
            ctx.beginPath();
            ctx.arc(x - size / 4, headY, size / 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawCatFace(ctx, x, y, size) {
        const earSize = size / 6;
        const earOffset = size / 4;

        // Ears
        ctx.fillStyle = '#ff9e80';
        ctx.beginPath();
        ctx.moveTo(x - earOffset, y - size / 4);
        ctx.lineTo(x - earOffset - earSize / 2, y - size / 3 - earSize);
        ctx.lineTo(x - earOffset + earSize / 2, y - size / 3);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + earOffset, y - size / 4);
        ctx.lineTo(x + earOffset - earSize / 2, y - size / 3);
        ctx.lineTo(x + earOffset + earSize / 2, y - size / 3 - earSize);
        ctx.closePath();
        ctx.fill();

        // Inner ears
        ctx.fillStyle = '#ffb3ba';
        ctx.beginPath();
        ctx.arc(x - earOffset, y - size / 3.5, earSize / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + earOffset, y - size / 3.5, earSize / 3, 0, Math.PI * 2);
        ctx.fill();

        // Muzzle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(x, y + size / 12, size / 6, size / 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#2c3e50';
        const eyeY = y - size / 12;
        const eyeOffset = size / 8;
        ctx.beginPath();
        ctx.arc(x - eyeOffset, eyeY, size / 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + eyeOffset, eyeY, size / 20, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#ffb3ba';
        ctx.beginPath();
        ctx.moveTo(x, y + size / 10);
        ctx.lineTo(x - size / 30, y + size / 15);
        ctx.lineTo(x + size / 30, y + size / 15);
        ctx.closePath();
        ctx.fill();

        // Whiskers
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        const whiskerLength = size / 2.5;
        const whiskerY = y + size / 15;

        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(x - size / 8, whiskerY + i * size / 20);
            ctx.lineTo(x - size / 8 - whiskerLength, whiskerY + i * size / 15);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x + size / 8, whiskerY + i * size / 20);
            ctx.lineTo(x + size / 8 + whiskerLength, whiskerY + i * size / 15);
            ctx.stroke();
        }
    }

    function gameLoop() {
        if (!game.initialized) {
            return;
        }

        update();
        render();
        game.animationFrameId = requestAnimationFrame(gameLoop);
    }

    // ============================================
    // WAND MINI-GAME
    // ============================================

    const wandGame = {
        isPlaying: false,
        score: 0,
        timeLeft: 30,
        wandVisible: false,
        wandTimeout: null,
        hideTimeout: null,
        gameInterval: null,
        mouseX: 0,
        mouseY: 0
    };

    function initWandGame() {
        const wandGameBtn = document.getElementById('wandGameBtn');
        const wandGameOverlay = document.getElementById('wandGameOverlay');
        const wandGameClose = document.getElementById('wandGameClose');
        const wandGameStart = document.getElementById('wandGameStart');
        const wand = document.getElementById('wand');
        const wandGameArea = document.getElementById('wandGameArea');

        if (!wandGameBtn || !wandGameOverlay) {
            return; // Elements not ready yet
        }

        // Open game modal
        wandGameBtn.addEventListener('click', () => {
            wandGameOverlay.style.display = 'flex';
            loadLeaderboard();
            updateBestScore();
        });

        // Close game modal
        wandGameClose.addEventListener('click', () => {
            stopWandGame();
            wandGameOverlay.style.display = 'none';
        });

        // Close on overlay click
        wandGameOverlay.addEventListener('click', (e) => {
            if (e.target === wandGameOverlay) {
                stopWandGame();
                wandGameOverlay.style.display = 'none';
            }
        });

        // Start game
        wandGameStart.addEventListener('click', startWandGame);

        // Click on wand
        if (wand) {
            wand.addEventListener('click', hitWand);
        }

        // Mouse tracking for cat paw
        if (wandGameArea) {
            wandGameArea.addEventListener('mousemove', (e) => {
                if (!wandGame.isPlaying) return;

                const rect = wandGameArea.getBoundingClientRect();
                wandGame.mouseX = e.clientX - rect.left;
                wandGame.mouseY = e.clientY - rect.top;
                updateCatPawRotation();
            });
        }
    }

    function updateCatPawRotation() {
        const catPaw = document.getElementById('catPaw');
        if (!catPaw || !wandGame.isPlaying) return;

        const gameArea = document.getElementById('wandGameArea');
        const gameRect = gameArea.getBoundingClientRect();

        // Paw anchor point at bottom center
        const pawX = gameRect.width / 2;
        const pawY = gameRect.height;

        // Calculate angle to mouse
        const dx = wandGame.mouseX - pawX;
        const dy = wandGame.mouseY - pawY;
        const angle = Math.atan2(dx, -dy) * (180 / Math.PI);

        // Limit the angle to prevent unrealistic bending
        const limitedAngle = Math.max(-60, Math.min(60, angle));

        // Apply rotation
        catPaw.style.transform = `translate(-50%, 0) rotate(${limitedAngle}deg)`;
    }

    function startWandGame() {
        // Reset game state
        wandGame.isPlaying = true;
        wandGame.score = 0;
        wandGame.timeLeft = 30;
        wandGame.wandVisible = false;

        // Show cat paw
        const catPaw = document.getElementById('catPaw');
        if (catPaw) {
            catPaw.style.display = 'block';
            catPaw.style.opacity = '1';
            catPaw.style.transform = 'translate(-50%, 0) rotate(0deg)';
        }

        // Update UI
        document.getElementById('wandScore').textContent = '0';
        document.getElementById('wandTime').textContent = '30';
        document.getElementById('wandGameStart').disabled = true;
        document.getElementById('wandGameStart').textContent = 'Playing...';

        // Start timer
        wandGame.gameInterval = setInterval(() => {
            wandGame.timeLeft--;
            document.getElementById('wandTime').textContent = wandGame.timeLeft;

            if (wandGame.timeLeft <= 0) {
                endWandGame();
            }
        }, 1000);

        // Start spawning wands
        spawnWand();
    }

    function spawnWand() {
        if (!wandGame.isPlaying) return;

        const wand = document.getElementById('wand');
        const gameArea = document.getElementById('wandGameArea');
        if (!wand || !gameArea) return;

        // Clear any existing timeouts to prevent overlapping cycles
        if (wandGame.wandTimeout) {
            clearTimeout(wandGame.wandTimeout);
            wandGame.wandTimeout = null;
        }
        if (wandGame.hideTimeout) {
            clearTimeout(wandGame.hideTimeout);
            wandGame.hideTimeout = null;
        }

        // Hide previous wand
        wand.style.display = 'none';
        wandGame.wandVisible = false;

        // Difficulty progression: game gets faster as time goes on
        const timeElapsed = 30 - wandGame.timeLeft;
        // Start at 0.65, decrease to 0.35 as game progresses (smaller = faster)
        const speedMultiplier = Math.max(0.35, 0.65 - (timeElapsed / 40));

        // Random delay before showing next wand (starts at 300-700ms, gets faster)
        const baseDelay = 300 + Math.random() * 400;
        const delay = baseDelay * speedMultiplier;

        wandGame.wandTimeout = setTimeout(() => {
            if (!wandGame.isPlaying) return;

            // Wand base is fixed at top center (via CSS)
            // We only rotate the wand to make feathers appear at different positions

            // Generate random rotation angle (degrees)
            // Negative = swing left, Positive = swing right
            // Range: -70 to +70 degrees for good coverage of game area
            const randomAngle = -70 + Math.random() * 140;

            // IMPORTANT: Set transform FIRST, then display
            // This prevents the wand from briefly appearing at center before rotating
            wand.style.transform = `translate(-50%, 0) rotate(${randomAngle}deg)`;

            // Use requestAnimationFrame to ensure transform is applied before showing
            requestAnimationFrame(() => {
                wand.style.display = 'block';
                wandGame.wandVisible = true;
            });

            // Hide wand after a reasonable time (starts at 900-1400ms, gets shorter)
            // Wands stay visible longer at the beginning for easier gameplay
            const baseVisibleTime = 900 + Math.random() * 500;
            const visibleTime = baseVisibleTime * Math.max(0.45, speedMultiplier);
            wandGame.hideTimeout = setTimeout(() => {
                if (wandGame.wandVisible && wandGame.isPlaying) {
                    wand.style.display = 'none';
                    wandGame.wandVisible = false;
                    spawnWand(); // Spawn next wand
                }
            }, visibleTime);

        }, delay);
    }

    function hitWand(e) {
        if (!wandGame.isPlaying || !wandGame.wandVisible) return;

        e.stopPropagation();

        const wand = document.getElementById('wand');

        // Score!
        wandGame.score++;
        document.getElementById('wandScore').textContent = wandGame.score;

        // Add hit effect to paw
        const catPaw = document.getElementById('catPaw');
        if (catPaw) {
            catPaw.classList.add('hitting');
            setTimeout(() => {
                catPaw.classList.remove('hitting');
            }, 200);
        }

        // Hide wand immediately
        wand.style.display = 'none';
        wandGame.wandVisible = false;

        // Clear all timeouts and spawn next wand
        if (wandGame.wandTimeout) {
            clearTimeout(wandGame.wandTimeout);
            wandGame.wandTimeout = null;
        }
        if (wandGame.hideTimeout) {
            clearTimeout(wandGame.hideTimeout);
            wandGame.hideTimeout = null;
        }

        // Spawn next wand quickly
        setTimeout(() => {
            spawnWand();
        }, 100);
    }

    function endWandGame() {
        wandGame.isPlaying = false;

        // Clear intervals and timeouts
        if (wandGame.gameInterval) {
            clearInterval(wandGame.gameInterval);
            wandGame.gameInterval = null;
        }
        if (wandGame.wandTimeout) {
            clearTimeout(wandGame.wandTimeout);
            wandGame.wandTimeout = null;
        }
        if (wandGame.hideTimeout) {
            clearTimeout(wandGame.hideTimeout);
            wandGame.hideTimeout = null;
        }

        // Hide wand
        const wand = document.getElementById('wand');
        if (wand) {
            wand.style.display = 'none';
        }

        // Hide cat paw
        const catPaw = document.getElementById('catPaw');
        if (catPaw) {
            catPaw.style.opacity = '0';
            setTimeout(() => {
                catPaw.style.display = 'none';
            }, 300);
        }

        // Update UI
        document.getElementById('wandGameStart').disabled = false;
        document.getElementById('wandGameStart').textContent = 'Play Again';

        // Save score to leaderboard
        saveScore(wandGame.score);
        loadLeaderboard();
        updateBestScore();

        // Award points to main game
        game.points += wandGame.score;

        // Exercise cat - reduce size based on score
        exerciseCat(wandGame.score);

        updatePointsDisplay();
        showMessage(`Earned ${wandGame.score} points! Cat size: ${game.catSize.toFixed(1)}`);

        // Show game over message
        setTimeout(() => {
            alert(`Game Over! Your score: ${wandGame.score}`);
        }, 100);
    }

    function stopWandGame() {
        if (wandGame.isPlaying) {
            endWandGame();
        }
    }

    function saveScore(score) {
        try {
            let scores = JSON.parse(localStorage.getItem('catWandScores') || '[]');

            // Add new score with timestamp
            scores.push({
                score: score,
                date: new Date().toISOString()
            });

            // Sort by score (highest first)
            scores.sort((a, b) => b.score - a.score);

            // Keep only top 10
            scores = scores.slice(0, 10);

            localStorage.setItem('catWandScores', JSON.stringify(scores));
        } catch (e) {
            console.error('Failed to save score:', e);
        }
    }

    function loadLeaderboard() {
        try {
            const scores = JSON.parse(localStorage.getItem('catWandScores') || '[]');
            const leaderboardList = document.getElementById('wandLeaderboardList');

            if (!leaderboardList) return;

            if (scores.length === 0) {
                leaderboardList.innerHTML = '<li>No scores yet</li>';
                return;
            }

            leaderboardList.innerHTML = scores.map((entry, index) => {
                const date = new Date(entry.date);
                const dateStr = date.toLocaleDateString();
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                return `<li>
                    <span>${medal} ${entry.score} points</span>
                    <span style="font-size: 0.85rem; opacity: 0.7;">${dateStr}</span>
                </li>`;
            }).join('');
        } catch (e) {
            console.error('Failed to load leaderboard:', e);
        }
    }

    function updateBestScore() {
        try {
            const scores = JSON.parse(localStorage.getItem('catWandScores') || '[]');
            const bestScore = scores.length > 0 ? scores[0].score : 0;
            const bestElement = document.getElementById('wandBest');
            if (bestElement) {
                bestElement.textContent = bestScore;
            }
        } catch (e) {
            console.error('Failed to update best score:', e);
        }
    }

    // ============================================
    // YARN BALL BOUNCE GAME
    // ============================================

    const yarnGame = {
        canvas: null,
        ctx: null,
        isPlaying: false,
        score: 0,
        lives: 3,
        balls: [],
        animationId: null,
        spawnInterval: null,
        difficulty: 1,
        yarnImages: [],
        imagesLoaded: false
    };

    function initYarnGame() {
        const yarnGameBtn = document.getElementById('yarnGameBtn');
        const yarnGameOverlay = document.getElementById('yarnGameOverlay');
        const yarnGameClose = document.getElementById('yarnGameClose');
        const yarnGameStart = document.getElementById('yarnGameStart');
        const yarnCanvas = document.getElementById('yarnCanvas');

        if (!yarnGameBtn || !yarnGameOverlay || !yarnCanvas) {
            return;
        }

        yarnGame.canvas = yarnCanvas;
        yarnGame.ctx = yarnCanvas.getContext('2d');

        // Load yarn ball images immediately when initializing
        console.log('Initializing Yarn Ball game and preloading images...');
        loadYarnBallImages();

        // Open game modal
        yarnGameBtn.addEventListener('click', () => {
            yarnGameOverlay.style.display = 'flex';
            loadYarnLeaderboard();
            updateYarnBestScore();
        });

        // Close game modal
        yarnGameClose.addEventListener('click', () => {
            stopYarnGame();
            yarnGameOverlay.style.display = 'none';
        });

        // Close on overlay click
        yarnGameOverlay.addEventListener('click', (e) => {
            if (e.target === yarnGameOverlay) {
                stopYarnGame();
                yarnGameOverlay.style.display = 'none';
            }
        });

        // Start game - only allow if images are loaded
        yarnGameStart.addEventListener('click', () => {
            if (!yarnGame.imagesLoaded) {
                console.warn('Yarn ball images still loading, please wait...');
                alert('Loading yarn ball images, please wait a moment and try again!');
                return;
            }
            startYarnGame();
        });

        // Click on canvas
        yarnCanvas.addEventListener('click', handleYarnClick);
    }

    function loadYarnBallImages() {
        // Use local yarn ball images with different colors
        const yarnImageURLs = [
            '/static/images/yarn_ball_pink.png',
            '/static/images/yarn_ball_blue.png',
            '/static/images/yarn_ball_purple.png',
            '/static/images/yarn_ball_orange.png',
            '/static/images/yarn_ball_green.png',
            '/static/images/yarn_ball_yellow.png'
        ];

        console.log('Loading yarn ball images...');
        let loadedCount = 0;
        yarnImageURLs.forEach((url, index) => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                console.log(`Yarn ball image ${index} loaded successfully:`, url, img.naturalWidth, 'x', img.naturalHeight);
                if (loadedCount === yarnImageURLs.length) {
                    yarnGame.imagesLoaded = true;
                    console.log('✓ All', yarnImageURLs.length, 'yarn ball images loaded successfully!');
                    console.log('✓ Yarn ball images ready to use!');
                }
            };
            img.onerror = (e) => {
                console.error(`Yarn image ${index} failed to load:`, url, e);
                loadedCount++;
                if (loadedCount === yarnImageURLs.length) {
                    yarnGame.imagesLoaded = true;
                }
            };
            console.log('Starting to load yarn image:', url);
            img.src = url;
            yarnGame.yarnImages.push(img);
        });
    }

    function startYarnGame() {
        yarnGame.isPlaying = true;
        yarnGame.score = 0;
        yarnGame.lives = 5;
        yarnGame.balls = [];
        yarnGame.difficulty = 1;
        yarnGame._fallbackLogged = false; // Reset debug flag

        console.log('Starting Yarn Ball game. Images loaded:', yarnGame.imagesLoaded, 'Image count:', yarnGame.yarnImages.length);

        document.getElementById('yarnScore').textContent = '0.0';
        document.getElementById('yarnLives').textContent = '5';
        document.getElementById('yarnGameStart').disabled = true;
        document.getElementById('yarnGameStart').textContent = 'Playing...';

        // Spawn 5 balls immediately for instant action at faster intervals
        spawnYarnBall();
        setTimeout(() => spawnYarnBall(), 200);
        setTimeout(() => spawnYarnBall(), 400);
        setTimeout(() => spawnYarnBall(), 600);
        setTimeout(() => spawnYarnBall(), 800);

        // Spawn balls periodically - very fast spawn rate to keep many balls on screen
        yarnGame.spawnInterval = setInterval(() => {
            if (yarnGame.isPlaying) {
                spawnYarnBall();
            }
        }, 500); // Very fast spawn rate (0.5 seconds) to maintain lots of balls

        // Start game loop
        yarnGameLoop();
    }

    function spawnYarnBall() {
        const colors = ['#e91e63', '#9c27b0', '#3f51b5', '#ff9800', '#4caf50'];
        const canvas = yarnGame.canvas;

        // Choose random spawn direction
        const spawnType = Math.random();
        const imageIndex = Math.floor(Math.random() * yarnGame.yarnImages.length);
        let ball = {
            radius: 25 + Math.random() * 10, // Slightly larger for visibility
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2, // Start at random rotation
            rotationSpeed: 0, // Will be calculated based on movement speed
            imageIndex: imageIndex
        };

        // Moderate speed with gradual difficulty increase
        const baseSpeed = 1.5 + Math.random() * 0.5; // Start at moderate speed: 1.5-2.0
        const difficultyMultiplier = 1 + (yarnGame.difficulty - 1) * 0.15; // Gradual 15% increase per level
        const speed = baseSpeed * difficultyMultiplier;

        // Spawn from any edge with random angle across the screen
        if (spawnType < 0.25) {
            // Spawn from top - roll diagonally down
            ball.x = Math.random() * canvas.width;
            ball.y = -ball.radius;
            const angle = (Math.random() * 120 + 30) * Math.PI / 180; // 30-150 degrees
            ball.vx = Math.cos(angle) * speed;
            ball.vy = Math.sin(angle) * speed;
        } else if (spawnType < 0.5) {
            // Spawn from bottom - roll diagonally up
            ball.x = Math.random() * canvas.width;
            ball.y = canvas.height + ball.radius;
            const angle = (Math.random() * 120 + 210) * Math.PI / 180; // 210-330 degrees
            ball.vx = Math.cos(angle) * speed;
            ball.vy = Math.sin(angle) * speed;
        } else if (spawnType < 0.75) {
            // Spawn from left - roll right
            ball.x = -ball.radius;
            ball.y = Math.random() * canvas.height;
            const angle = (Math.random() * 120 - 60) * Math.PI / 180; // -60 to 60 degrees
            ball.vx = Math.cos(angle) * speed;
            ball.vy = Math.sin(angle) * speed;
        } else {
            // Spawn from right - roll left
            ball.x = canvas.width + ball.radius;
            ball.y = Math.random() * canvas.height;
            const angle = (Math.random() * 120 + 120) * Math.PI / 180; // 120-240 degrees
            ball.vx = Math.cos(angle) * speed;
            ball.vy = Math.sin(angle) * speed;
        }

        // Calculate rotation speed based on linear velocity
        // The yarn ball should rotate realistically as it rolls
        const velocity = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        ball.rotationSpeed = velocity / ball.radius * 0.8; // Realistic rolling physics

        yarnGame.balls.push(ball);
    }

    function handleYarnClick(e) {
        if (!yarnGame.isPlaying) return;

        const rect = yarnGame.canvas.getBoundingClientRect();
        // Account for canvas scaling
        const scaleX = yarnGame.canvas.width / rect.width;
        const scaleY = yarnGame.canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        console.log('Click at:', x, y, 'Balls:', yarnGame.balls.length);

        // Check if clicked on any ball
        for (let i = yarnGame.balls.length - 1; i >= 0; i--) {
            const ball = yarnGame.balls[i];
            const dist = Math.sqrt(Math.pow(x - ball.x, 2) + Math.pow(y - ball.y, 2));

            // Use radius * 1.5 for more forgiving click detection since visual size is radius * 2
            const clickRadius = ball.radius * 1.5;
            console.log('Ball', i, 'at', ball.x, ball.y, 'dist:', dist, 'clickRadius:', clickRadius);

            if (dist < clickRadius) {
                // Hit! Make ball fly away with animation
                console.log('Ball clicked!');
                ball.flyingAway = true;
                ball.flyVelocityX = (x - ball.x) * 0.3;
                ball.flyVelocityY = -15 - Math.random() * 5; // Strong upward velocity
                ball.opacity = 1;

                // Add score and round immediately to avoid floating-point precision issues
                yarnGame.score = Math.round((yarnGame.score + 0.2) * 10) / 10;
                document.getElementById('yarnScore').textContent = yarnGame.score.toFixed(1);

                // Increase difficulty gradually every 3 points
                if (yarnGame.score % 3 === 0) {
                    yarnGame.difficulty++;
                    // Update spawn interval for faster spawning as difficulty increases
                    if (yarnGame.spawnInterval) {
                        clearInterval(yarnGame.spawnInterval);
                        const newInterval = Math.max(300, 500 - yarnGame.difficulty * 30);
                        yarnGame.spawnInterval = setInterval(() => {
                            if (yarnGame.isPlaying) {
                                spawnYarnBall();
                            }
                        }, newInterval);
                    }
                }
                break;
            }
        }
    }

    function yarnGameLoop() {
        if (!yarnGame.isPlaying) return;

        const ctx = yarnGame.ctx;
        const canvas = yarnGame.canvas;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw balls
        for (let i = yarnGame.balls.length - 1; i >= 0; i--) {
            const ball = yarnGame.balls[i];

            // Update position based on state
            if (ball.flyingAway) {
                // Flying away animation
                ball.x += ball.flyVelocityX;
                ball.y += ball.flyVelocityY;
                ball.flyVelocityY += 0.5; // Gravity pulls it down eventually
                ball.rotation += ball.rotationSpeed * 3; // Spin faster when flying
                ball.opacity -= 0.02; // Fade out

                // Remove when fully faded or far off screen
                if (ball.opacity <= 0 || ball.y < -200 || ball.y > canvas.height + 200) {
                    yarnGame.balls.splice(i, 1);
                    continue;
                }
            } else {
                // Normal rolling
                ball.x += ball.vx;
                ball.y += ball.vy;
                // No gravity - balls maintain constant speed
                ball.rotation += ball.rotationSpeed;

                // Remove if off-screen in any direction (with margin for complete disappearance)
                const margin = ball.radius * 3;
                if (ball.x < -margin || ball.x > canvas.width + margin ||
                    ball.y < -margin || ball.y > canvas.height + margin) {
                    yarnGame.balls.splice(i, 1);
                    yarnGame.lives--;
                    document.getElementById('yarnLives').textContent = yarnGame.lives;

                    if (yarnGame.lives <= 0) {
                        endYarnGame();
                        return;
                    }
                    continue;
                }
            }

            // Draw yarn ball
            ctx.save();
            ctx.translate(ball.x, ball.y);
            ctx.rotate(ball.rotation);

            // Apply opacity for flying away animation
            if (ball.flyingAway && ball.opacity !== undefined) {
                ctx.globalAlpha = ball.opacity;
            }

            // Use realistic yarn ball image if loaded, otherwise use fallback
            const yarnImg = yarnGame.yarnImages[ball.imageIndex];
            if (yarnGame.imagesLoaded && yarnImg && yarnImg.complete && yarnImg.naturalWidth > 0) {
                // Draw realistic yarn ball image
                const size = ball.radius * 2;
                ctx.drawImage(yarnImg, -size / 2, -size / 2, size, size);
            } else {
                // Fallback: Draw simple ball with yarn texture
                // Debug: log why we're using fallback (only log once per condition)
                if (!yarnGame._fallbackLogged) {
                    if (!yarnGame.imagesLoaded) {
                        console.warn('Using fallback: yarn images not loaded yet. imagesLoaded =', yarnGame.imagesLoaded);
                    } else if (!yarnImg) {
                        console.warn('Using fallback: yarnImg is null/undefined for index', ball.imageIndex);
                    } else if (!yarnImg.complete) {
                        console.warn('Using fallback: yarnImg not complete');
                    } else if (yarnImg.naturalWidth === 0) {
                        console.warn('Using fallback: yarnImg has zero width');
                    }
                    yarnGame._fallbackLogged = true;
                }

                ctx.fillStyle = ball.color;
                ctx.beginPath();
                ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
                ctx.fill();

                // Draw yarn texture
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                for (let j = 0; j < 3; j++) {
                    const angle = j * Math.PI / 3;
                    ctx.beginPath();
                    ctx.arc(0, 0, ball.radius * 0.7, angle, angle + Math.PI);
                    ctx.stroke();
                }
            }

            ctx.restore();
        }

        yarnGame.animationId = requestAnimationFrame(yarnGameLoop);
    }

    function endYarnGame() {
        yarnGame.isPlaying = false;

        if (yarnGame.animationId) {
            cancelAnimationFrame(yarnGame.animationId);
        }
        if (yarnGame.spawnInterval) {
            clearInterval(yarnGame.spawnInterval);
        }

        document.getElementById('yarnGameStart').disabled = false;
        document.getElementById('yarnGameStart').textContent = 'Play Again';

        // Ensure score is rounded before saving and displaying
        const finalScore = Math.round(yarnGame.score * 10) / 10;

        saveYarnScore(finalScore);
        loadYarnLeaderboard();
        updateYarnBestScore();

        // Award points to main game
        game.points += yarnGame.score;

        // Exercise cat - reduce size based on score
        exerciseCat(yarnGame.score);

        updatePointsDisplay();
        showMessage(`Earned ${yarnGame.score} points! Cat size: ${game.catSize.toFixed(1)}`);

        setTimeout(() => {
            alert(`Game Over! Your score: ${finalScore.toFixed(1)}`);
        }, 100);
    }

    function stopYarnGame() {
        if (yarnGame.isPlaying) {
            endYarnGame();
        }
    }

    function saveYarnScore(score) {
        try {
            let scores = JSON.parse(localStorage.getItem('catYarnScores') || '[]');
            scores.push({ score: score, date: new Date().toISOString() });
            scores.sort((a, b) => b.score - a.score);
            scores = scores.slice(0, 10);
            localStorage.setItem('catYarnScores', JSON.stringify(scores));
        } catch (e) {
            console.error('Failed to save yarn score:', e);
        }
    }

    function loadYarnLeaderboard() {
        try {
            const scores = JSON.parse(localStorage.getItem('catYarnScores') || '[]');
            const list = document.getElementById('yarnLeaderboardList');
            if (!list) return;

            if (scores.length === 0) {
                list.innerHTML = '<li>No scores yet</li>';
                return;
            }

            list.innerHTML = scores.map((entry, index) => {
                const date = new Date(entry.date);
                const dateStr = date.toLocaleDateString();
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                return `<li>
                    <span>${medal} ${entry.score} points</span>
                    <span style="font-size: 0.85rem; opacity: 0.7;">${dateStr}</span>
                </li>`;
            }).join('');
        } catch (e) {
            console.error('Failed to load yarn leaderboard:', e);
        }
    }

    function updateYarnBestScore() {
        try {
            const scores = JSON.parse(localStorage.getItem('catYarnScores') || '[]');
            const bestScore = scores.length > 0 ? scores[0].score : 0;
            const bestElement = document.getElementById('yarnBest');
            if (bestElement) {
                bestElement.textContent = bestScore;
            }
        } catch (e) {
            console.error('Failed to update yarn best score:', e);
        }
    }

    // ============================================
    // MEOW MELODY GAME
    // ============================================

    const melodyGame = {
        isPlaying: false,
        round: 1,
        score: 0,
        pattern: [],
        playerPattern: [],
        isShowingPattern: false,
        currentStep: 0
    };

    // Simple meow sounds with different pitches (using oscillator)
    function playMeow(pitch) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Different pitches for different toys
            const frequencies = [392, 440, 494, 523]; // G, A, B, C
            oscillator.frequency.value = frequencies[pitch];
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.error('Audio playback failed:', e);
        }
    }

    function initMelodyGame() {
        const melodyGameBtn = document.getElementById('melodyGameBtn');
        const melodyGameOverlay = document.getElementById('melodyGameOverlay');
        const melodyGameClose = document.getElementById('melodyGameClose');
        const melodyGameStart = document.getElementById('melodyGameStart');

        if (!melodyGameBtn || !melodyGameOverlay) {
            return;
        }

        // Open game modal
        melodyGameBtn.addEventListener('click', () => {
            melodyGameOverlay.style.display = 'flex';
            loadMelodyLeaderboard();
            updateMelodyBestScore();
        });

        // Close game modal
        melodyGameClose.addEventListener('click', () => {
            stopMelodyGame();
            melodyGameOverlay.style.display = 'none';
        });

        // Close on overlay click
        melodyGameOverlay.addEventListener('click', (e) => {
            if (e.target === melodyGameOverlay) {
                stopMelodyGame();
                melodyGameOverlay.style.display = 'none';
            }
        });

        // Start game
        melodyGameStart.addEventListener('click', startMelodyGame);

        // Toy click handlers
        const toys = document.querySelectorAll('.melody-toy');
        toys.forEach((toy, index) => {
            toy.addEventListener('click', () => handleToyClick(index));
        });
    }

    function startMelodyGame() {
        melodyGame.isPlaying = true;
        melodyGame.round = 1;
        melodyGame.score = 0;
        // Start with 4 random sounds
        melodyGame.pattern = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
        melodyGame.playerPattern = [];
        melodyGame.currentStep = 0;

        document.getElementById('melodyRound').textContent = '1';
        document.getElementById('melodyScore').textContent = '0';
        document.getElementById('melodyGameStart').disabled = true;
        document.getElementById('melodyGameStart').textContent = 'Watch...';

        // Disable toys during pattern display
        setToysEnabled(false);

        // Start first round (show initial pattern)
        setTimeout(() => {
            showPattern();
        }, 1000);
    }

    function nextRound() {
        melodyGame.playerPattern = [];
        melodyGame.currentStep = 0;

        // Generate completely new random pattern (length increases with round)
        melodyGame.pattern = Array.from({ length: 3 + melodyGame.round }, () => Math.floor(Math.random() * 4));

        // Show pattern
        showPattern();
    }

    function showPattern() {
        melodyGame.isShowingPattern = true;
        setToysEnabled(false);

        let delay = 0;
        melodyGame.pattern.forEach((toyIndex, i) => {
            setTimeout(() => {
                highlightToy(toyIndex);
                playMeow(toyIndex);
            }, delay);
            delay += 350; // Faster transition (was 600ms)
        });

        // Enable player input after pattern is shown
        setTimeout(() => {
            melodyGame.isShowingPattern = false;
            setToysEnabled(true);
            document.getElementById('melodyGameStart').textContent = 'Your turn!';
        }, delay + 200);
    }

    function highlightToy(index) {
        const toys = document.querySelectorAll('.melody-toy');
        const toy = toys[index];

        toy.classList.add('active');
        setTimeout(() => {
            toy.classList.remove('active');
        }, 400);
    }

    function handleToyClick(index) {
        if (!melodyGame.isPlaying || melodyGame.isShowingPattern) return;

        // Play sound and highlight
        playMeow(index);
        highlightToy(index);

        // Add to player pattern
        melodyGame.playerPattern.push(index);

        // Check if correct
        if (melodyGame.playerPattern[melodyGame.currentStep] !== melodyGame.pattern[melodyGame.currentStep]) {
            // Wrong!
            endMelodyGame(false);
            return;
        }

        melodyGame.currentStep++;

        // Check if pattern complete
        if (melodyGame.currentStep === melodyGame.pattern.length) {
            // Correct! Next round
            melodyGame.score++;
            melodyGame.round++;

            document.getElementById('melodyScore').textContent = melodyGame.score;
            document.getElementById('melodyRound').textContent = melodyGame.round;
            document.getElementById('melodyGameStart').textContent = 'Correct!';

            setToysEnabled(false);

            setTimeout(() => {
                document.getElementById('melodyGameStart').textContent = 'Watch...';
                nextRound();
            }, 1500);
        }
    }

    function setToysEnabled(enabled) {
        const toys = document.querySelectorAll('.melody-toy');
        toys.forEach(toy => {
            if (enabled) {
                toy.classList.remove('disabled');
            } else {
                toy.classList.add('disabled');
            }
        });
    }

    function endMelodyGame(completed = true) {
        melodyGame.isPlaying = false;
        setToysEnabled(false);

        document.getElementById('melodyGameStart').disabled = false;
        document.getElementById('melodyGameStart').textContent = 'Play Again';

        saveMelodyScore(melodyGame.score);
        loadMelodyLeaderboard();
        updateMelodyBestScore();

        // Award points to main game
        game.points += melodyGame.score;

        // Exercise cat - reduce size based on score
        exerciseCat(melodyGame.score);

        updatePointsDisplay();
        showMessage(`Earned ${melodyGame.score} points! Cat size: ${game.catSize.toFixed(1)}`);

        setTimeout(() => {
            const message = completed ?
                `Amazing! You completed ${melodyGame.score} rounds!` :
                `Game Over! You reached round ${melodyGame.round} with ${melodyGame.score} points!`;
            alert(message);
        }, 100);
    }

    function stopMelodyGame() {
        if (melodyGame.isPlaying) {
            endMelodyGame(false);
        }
    }

    function saveMelodyScore(score) {
        try {
            let scores = JSON.parse(localStorage.getItem('catMelodyScores') || '[]');
            scores.push({ score: score, date: new Date().toISOString() });
            scores.sort((a, b) => b.score - a.score);
            scores = scores.slice(0, 10);
            localStorage.setItem('catMelodyScores', JSON.stringify(scores));
        } catch (e) {
            console.error('Failed to save melody score:', e);
        }
    }

    function loadMelodyLeaderboard() {
        try {
            const scores = JSON.parse(localStorage.getItem('catMelodyScores') || '[]');
            const list = document.getElementById('melodyLeaderboardList');
            if (!list) return;

            if (scores.length === 0) {
                list.innerHTML = '<li>No scores yet</li>';
                return;
            }

            list.innerHTML = scores.map((entry, index) => {
                const date = new Date(entry.date);
                const dateStr = date.toLocaleDateString();
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                return `<li>
                    <span>${medal} ${entry.score} rounds</span>
                    <span style="font-size: 0.85rem; opacity: 0.7;">${dateStr}</span>
                </li>`;
            }).join('');
        } catch (e) {
            console.error('Failed to load melody leaderboard:', e);
        }
    }

    function updateMelodyBestScore() {
        try {
            const scores = JSON.parse(localStorage.getItem('catMelodyScores') || '[]');
            const bestScore = scores.length > 0 ? scores[0].score : 0;
            const bestElement = document.getElementById('melodyBest');
            if (bestElement) {
                bestElement.textContent = bestScore;
            }
        } catch (e) {
            console.error('Failed to update melody best score:', e);
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    // Initialize on direct page load
    if (window.location.pathname === '/cat-cafe') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                init();
                initWandGame();
                initYarnGame();
                initMelodyGame();
            });
        } else {
            setTimeout(() => {
                init();
                initWandGame();
                initYarnGame();
                initMelodyGame();
            }, 50);
        }
    }

    // Initialize on SPA navigation
    document.addEventListener('spa-page-loaded', function(e) {
        if (e.detail.path === '/cat-cafe') {
            setTimeout(() => {
                init();
                initWandGame();
                initYarnGame();
                initMelodyGame();
            }, 150);
        }
    });

})();
