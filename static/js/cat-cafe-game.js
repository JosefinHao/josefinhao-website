/**
 * Cat Cafe Interactive Game
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
        wallColor: '#f5e6d3',
        scratches: [],
        isScratching: false,
        lastScratchPoint: null,
        cat: {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            size: 50,
            speed: 2,
            isMoving: false,
            moveType: 'walk', // 'walk', 'run', 'jump'
            direction: 1, // 1 for right, -1 for left
            animationFrame: 0,
            jumpHeight: 0,
            jumpProgress: 0
        },
        boxes: [],
        catTrees: [],
        walkways: []
    };

    // Initialize the game
    function init() {
        console.log('Cat Cafe game initializing...');

        const canvas = document.getElementById('cat-cafe-canvas');
        if (!canvas) {
            console.error('Canvas not found');
            return;
        }

        game.canvas = canvas;
        game.ctx = canvas.getContext('2d');

        // Set up canvas size
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Set up event listeners
        setupEventListeners();

        // Create cafe elements
        createCafeElements();

        // Position cat in center
        game.cat.x = game.width / 2;
        game.cat.y = game.height / 2;
        game.cat.targetX = game.cat.x;
        game.cat.targetY = game.cat.y;

        // Start game loop
        gameLoop();

        console.log('Cat Cafe game initialized successfully');
    }

    // Resize canvas to fill container
    function resizeCanvas() {
        const container = game.canvas.parentElement;
        game.canvas.width = container.clientWidth;
        game.canvas.height = Math.max(600, window.innerHeight - 300);
        game.width = game.canvas.width;
        game.height = game.canvas.height;

        // Recreate cafe elements on resize
        if (game.boxes.length === 0) {
            createCafeElements();
        }
    }

    // Create cafe elements (boxes, cat trees, walkways)
    function createCafeElements() {
        game.boxes = [];
        game.catTrees = [];
        game.walkways = [];

        // Create random boxes (5-8 boxes)
        const numBoxes = 5 + Math.floor(Math.random() * 4);
        for (let i = 0; i < numBoxes; i++) {
            const size = 40 + Math.random() * 40;
            game.boxes.push({
                x: 50 + Math.random() * (game.width - 150),
                y: game.height - 50 - size,
                width: size,
                height: size,
                color: '#c4a57b'
            });
        }

        // Create 3 cat trees
        const treePositions = [
            { x: game.width * 0.15, baseY: game.height - 50 },
            { x: game.width * 0.5, baseY: game.height - 50 },
            { x: game.width * 0.85, baseY: game.height - 50 }
        ];

        treePositions.forEach(pos => {
            game.catTrees.push({
                x: pos.x,
                baseY: pos.baseY,
                height: 120 + Math.random() * 60,
                platforms: [
                    { offsetY: -40, size: 30 },
                    { offsetY: -80, size: 25 },
                    { offsetY: -120, size: 20 }
                ]
            });
        });

        // Create walkways along the walls
        const walkwayY = 80;
        game.walkways = [
            { x1: 0, y: walkwayY, x2: game.width, width: 15 }
        ];
    }

    // Setup event listeners
    function setupEventListeners() {
        // Canvas click/touch events
        game.canvas.addEventListener('mousedown', handlePointerDown);
        game.canvas.addEventListener('mousemove', handlePointerMove);
        game.canvas.addEventListener('mouseup', handlePointerUp);
        game.canvas.addEventListener('mouseleave', handlePointerUp);

        game.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        game.canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        game.canvas.addEventListener('touchend', handlePointerUp);

        // Color palette buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                game.wallColor = e.target.dataset.color;
                // Clear scratches when changing color
                game.scratches = [];

                // Update active state
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Set first color as active
        const firstColorBtn = document.querySelector('.color-btn');
        if (firstColorBtn) firstColorBtn.classList.add('active');
    }

    // Handle pointer down
    function handlePointerDown(e) {
        const rect = game.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicking on walls (edges of canvas)
        const wallThreshold = 50;
        if (x < wallThreshold || x > game.width - wallThreshold ||
            y < wallThreshold || y > game.height - wallThreshold) {
            game.isScratching = true;
            game.lastScratchPoint = { x, y };
        } else {
            // Check if clicking on a box
            const clickedBox = getBoxAtPosition(x, y);
            if (clickedBox) {
                handleBoxClick(clickedBox, x, y);
            } else {
                // Move cat to clicked position
                moveCatTo(x, y);
            }
        }
    }

    // Handle pointer move
    function handlePointerMove(e) {
        if (!game.isScratching) return;

        const rect = game.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (game.lastScratchPoint) {
            // Add scratch mark
            game.scratches.push({
                x1: game.lastScratchPoint.x,
                y1: game.lastScratchPoint.y,
                x2: x,
                y2: y
            });
            game.lastScratchPoint = { x, y };
        }
    }

    // Handle pointer up
    function handlePointerUp() {
        game.isScratching = false;
        game.lastScratchPoint = null;
    }

    // Handle touch start
    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = game.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        const wallThreshold = 50;
        if (x < wallThreshold || x > game.width - wallThreshold ||
            y < wallThreshold || y > game.height - wallThreshold) {
            game.isScratching = true;
            game.lastScratchPoint = { x, y };
        } else {
            const clickedBox = getBoxAtPosition(x, y);
            if (clickedBox) {
                handleBoxClick(clickedBox, x, y);
            } else {
                moveCatTo(x, y);
            }
        }
    }

    // Handle touch move
    function handleTouchMove(e) {
        e.preventDefault();
        if (!game.isScratching) return;

        const touch = e.touches[0];
        const rect = game.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        if (game.lastScratchPoint) {
            game.scratches.push({
                x1: game.lastScratchPoint.x,
                y1: game.lastScratchPoint.y,
                x2: x,
                y2: y
            });
            game.lastScratchPoint = { x, y };
        }
    }

    // Get box at position
    function getBoxAtPosition(x, y) {
        for (let box of game.boxes) {
            if (x >= box.x && x <= box.x + box.width &&
                y >= box.y && y <= box.y + box.height) {
                return box;
            }
        }
        return null;
    }

    // Handle box click
    function handleBoxClick(box, clickX, clickY) {
        const boxCenterX = box.x + box.width / 2;
        const boxCenterY = box.y + box.height / 2;
        const relativeY = clickY - box.y;

        if (relativeY < box.height * 0.3) {
            // Clicked on top of box - move cat to top
            moveCatTo(boxCenterX, box.y - game.cat.size / 2);
        } else {
            // Clicked inside box - move cat into box
            moveCatTo(boxCenterX, boxCenterY);
        }
    }

    // Move cat to position
    function moveCatTo(x, y) {
        game.cat.targetX = x;
        game.cat.targetY = y;
        game.cat.isMoving = true;

        // Update direction based on target
        if (x > game.cat.x) {
            game.cat.direction = 1;
        } else {
            game.cat.direction = -1;
        }

        // Randomly choose movement type
        const rand = Math.random();
        if (rand < 0.33) {
            game.cat.moveType = 'walk';
            game.cat.speed = 2;
        } else if (rand < 0.66) {
            game.cat.moveType = 'run';
            game.cat.speed = 4;
        } else {
            game.cat.moveType = 'jump';
            game.cat.speed = 3;
            game.cat.jumpProgress = 0;
        }
    }

    // Update game state
    function update() {
        // Update cat movement
        if (game.cat.isMoving) {
            const dx = game.cat.targetX - game.cat.x;
            const dy = game.cat.targetY - game.cat.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < game.cat.speed) {
                game.cat.x = game.cat.targetX;
                game.cat.y = game.cat.targetY;
                game.cat.isMoving = false;
                game.cat.jumpHeight = 0;
            } else {
                const angle = Math.atan2(dy, dx);
                game.cat.x += Math.cos(angle) * game.cat.speed;
                game.cat.y += Math.sin(angle) * game.cat.speed;

                // Handle jump animation
                if (game.cat.moveType === 'jump') {
                    game.cat.jumpProgress += 0.05;
                    game.cat.jumpHeight = Math.sin(game.cat.jumpProgress * Math.PI) * 30;
                }
            }

            // Animation frame
            game.cat.animationFrame += 0.2;
        }
    }

    // Render game
    function render() {
        const ctx = game.ctx;

        // Clear canvas
        ctx.clearRect(0, 0, game.width, game.height);

        // Draw background (walls)
        ctx.fillStyle = game.wallColor;
        ctx.fillRect(0, 0, game.width, game.height);

        // Draw floor
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(0, game.height - 50, game.width, 50);

        // Draw wall pattern
        drawWallPattern();

        // Draw scratches
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        game.scratches.forEach(scratch => {
            ctx.beginPath();
            ctx.moveTo(scratch.x1, scratch.y1);
            ctx.lineTo(scratch.x2, scratch.y2);
            ctx.stroke();
        });

        // Draw walkways
        drawWalkways();

        // Draw cat trees
        drawCatTrees();

        // Draw boxes
        drawBoxes();

        // Draw cat
        drawCat();
    }

    // Draw wall pattern
    function drawWallPattern() {
        const ctx = game.ctx;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x < game.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, game.height - 50);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y < game.height - 50; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(game.width, y);
            ctx.stroke();
        }
    }

    // Draw walkways
    function drawWalkways() {
        const ctx = game.ctx;
        game.walkways.forEach(walkway => {
            ctx.fillStyle = '#6d5d4b';
            ctx.fillRect(walkway.x1, walkway.y - walkway.width / 2,
                        walkway.x2 - walkway.x1, walkway.width);

            // Add support brackets
            for (let x = walkway.x1; x < walkway.x2; x += 100) {
                ctx.fillStyle = '#8b7355';
                ctx.fillRect(x - 2, walkway.y, 4, 20);
            }
        });
    }

    // Draw cat trees
    function drawCatTrees() {
        const ctx = game.ctx;
        game.catTrees.forEach(tree => {
            // Draw trunk
            ctx.fillStyle = '#8b7355';
            ctx.fillRect(tree.x - 10, tree.baseY - tree.height, 20, tree.height);

            // Draw platforms
            tree.platforms.forEach(platform => {
                const platformY = tree.baseY + platform.offsetY;
                ctx.fillStyle = '#a0826d';
                ctx.beginPath();
                ctx.arc(tree.x, platformY, platform.size, 0, Math.PI * 2);
                ctx.fill();

                // Add texture
                ctx.fillStyle = '#8b7355';
                ctx.beginPath();
                ctx.arc(tree.x, platformY, platform.size - 5, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw base
            ctx.fillStyle = '#6d5d4b';
            ctx.fillRect(tree.x - 15, tree.baseY, 30, 10);
        });
    }

    // Draw boxes
    function drawBoxes() {
        const ctx = game.ctx;
        game.boxes.forEach(box => {
            // Box shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(box.x + 3, box.y + 3, box.width, box.height);

            // Box body
            ctx.fillStyle = box.color;
            ctx.fillRect(box.x, box.y, box.width, box.height);

            // Box outline
            ctx.strokeStyle = '#8b7355';
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            // Box flaps
            ctx.strokeStyle = '#a0826d';
            ctx.lineWidth = 1;
            const flapY = box.y + 5;
            ctx.beginPath();
            ctx.moveTo(box.x + 5, flapY);
            ctx.lineTo(box.x + box.width - 5, flapY);
            ctx.stroke();
        });
    }

    // Draw cat
    function drawCat() {
        const ctx = game.ctx;
        const cat = game.cat;
        const x = cat.x;
        const y = cat.y - cat.jumpHeight;
        const size = cat.size;

        // Cat shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(cat.x, cat.y + size / 2 + 5, size / 2, size / 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cat body (oval)
        ctx.fillStyle = '#ff9e80'; // Cute orange color
        ctx.beginPath();
        ctx.ellipse(x, y, size / 2, size / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cat head (circle)
        const headY = y - size / 3;
        ctx.beginPath();
        ctx.arc(x, headY, size / 3, 0, Math.PI * 2);
        ctx.fill();

        // Cat ears
        const earSize = size / 6;
        const earOffset = size / 4;

        // Left ear
        ctx.beginPath();
        ctx.moveTo(x - earOffset, headY - size / 4);
        ctx.lineTo(x - earOffset - earSize / 2, headY - size / 3 - earSize);
        ctx.lineTo(x - earOffset + earSize / 2, headY - size / 3);
        ctx.closePath();
        ctx.fill();

        // Right ear
        ctx.beginPath();
        ctx.moveTo(x + earOffset, headY - size / 4);
        ctx.lineTo(x + earOffset - earSize / 2, headY - size / 3);
        ctx.lineTo(x + earOffset + earSize / 2, headY - size / 3 - earSize);
        ctx.closePath();
        ctx.fill();

        // Inner ears (pink)
        ctx.fillStyle = '#ffb3ba';
        ctx.beginPath();
        ctx.arc(x - earOffset, headY - size / 3.5, earSize / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + earOffset, headY - size / 3.5, earSize / 3, 0, Math.PI * 2);
        ctx.fill();

        // Cat face
        ctx.fillStyle = '#ffffff';
        // White muzzle
        ctx.beginPath();
        ctx.ellipse(x, headY + size / 12, size / 6, size / 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#2c3e50';
        const eyeY = headY - size / 12;
        const eyeOffset = size / 8;

        // Left eye
        ctx.beginPath();
        ctx.arc(x - eyeOffset, eyeY, size / 20, 0, Math.PI * 2);
        ctx.fill();

        // Right eye
        ctx.beginPath();
        ctx.arc(x + eyeOffset, eyeY, size / 20, 0, Math.PI * 2);
        ctx.fill();

        // Nose (pink)
        ctx.fillStyle = '#ffb3ba';
        ctx.beginPath();
        ctx.moveTo(x, headY + size / 10);
        ctx.lineTo(x - size / 30, headY + size / 15);
        ctx.lineTo(x + size / 30, headY + size / 15);
        ctx.closePath();
        ctx.fill();

        // Whiskers
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        const whiskerLength = size / 2.5;
        const whiskerY = headY + size / 15;

        // Left whiskers
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(x - size / 8, whiskerY + i * size / 20);
            ctx.lineTo(x - size / 8 - whiskerLength, whiskerY + i * size / 15);
            ctx.stroke();
        }

        // Right whiskers
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(x + size / 8, whiskerY + i * size / 20);
            ctx.lineTo(x + size / 8 + whiskerLength, whiskerY + i * size / 15);
            ctx.stroke();
        }

        // Cat tail
        ctx.strokeStyle = '#ff9e80';
        ctx.lineWidth = size / 10;
        ctx.lineCap = 'round';
        const tailX = x - (size / 2) * cat.direction;
        const tailWave = Math.sin(cat.animationFrame) * 5;
        ctx.beginPath();
        ctx.moveTo(tailX, y);
        ctx.quadraticCurveTo(
            tailX - 15 * cat.direction,
            y - 15 + tailWave,
            tailX - 20 * cat.direction,
            y - 25 + tailWave
        );
        ctx.stroke();

        // Cat paws (when not jumping)
        if (cat.jumpHeight === 0) {
            ctx.fillStyle = '#ff9e80';
            const pawSize = size / 12;
            const pawY = y + size / 2.5;
            const pawBounce = cat.isMoving ? Math.sin(cat.animationFrame * 2) * 2 : 0;

            // Front paws
            ctx.beginPath();
            ctx.ellipse(x - size / 6, pawY + pawBounce, pawSize, pawSize * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(x + size / 6, pawY - pawBounce, pawSize, pawSize * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Game loop
    function gameLoop() {
        update();
        render();
        requestAnimationFrame(gameLoop);
    }

    // Initialize on page load
    if (window.location.pathname === '/cat-cafe') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    // Initialize on SPA navigation
    document.addEventListener('spa-page-loaded', function(e) {
        if (e.detail.path === '/cat-cafe') {
            // Small delay to ensure DOM is ready
            setTimeout(init, 100);
        }
    });

})();
