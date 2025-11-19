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
        wallColor: '#f5e6d3',
        scratches: [],
        isScratching: false,
        lastScratchPoint: null,
        scratchTarget: null,
        isDragging: false,
        draggedObject: null,
        dragOffset: { x: 0, y: 0 },
        cat: {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            size: 80,
            speed: 2,
            isMoving: false,
            moveType: 'walk',
            direction: 1,
            animationFrame: 0,
            jumpHeight: 0,
            jumpProgress: 0,
            state: 'standing',
            scratchAnimFrame: 0
        },
        boxes: [],
        catTrees: [],
        couches: [],
        toys: [],
        images: {
            cat: null,
            catTree: null,
            box: null,
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

        // Load cat image - transparent PNG orange cat
        game.images.cat = new Image();
        game.images.cat.crossOrigin = 'anonymous';
        game.images.cat.onload = imageLoaded;
        game.images.cat.onerror = () => {
            console.log('Cat image failed to load, using fallback');
            imageLoaded();
        };
        // Using pngimg.com transparent PNG
        game.images.cat.src = 'https://pngimg.com/uploads/cat/cat_PNG50434.png';

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

        // Load cardboard box image - transparent PNG
        game.images.box = new Image();
        game.images.box.crossOrigin = 'anonymous';
        game.images.box.onload = imageLoaded;
        game.images.box.onerror = () => {
            console.log('Box image failed to load, using fallback');
            imageLoaded();
        };
        // Using pngimg.com transparent PNG box
        game.images.box.src = 'https://pngimg.com/uploads/box/box_PNG49.png';

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

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Load images first, then start the game
        loadImages(() => {
            setupEventListeners();
            createCafeElements();

            game.cat.x = game.width / 2;
            game.cat.y = game.height / 2;
            game.cat.targetX = game.cat.x;
            game.cat.targetY = game.cat.y;

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

        if (game.boxes.length === 0) {
            createCafeElements();
        }
    }

    function createCafeElements() {
        game.boxes = [];
        game.catTrees = [];
        game.couches = [];
        game.toys = [];

        // Create random boxes (3-5 boxes)
        const numBoxes = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numBoxes; i++) {
            const size = 60 + Math.random() * 40;
            game.boxes.push({
                x: 80 + Math.random() * (game.width - 180),
                y: 80 + Math.random() * (game.height - 180),
                width: size,
                height: size * 0.8,
                type: 'box'
            });
        }

        // Create 2-3 cat trees
        const numTrees = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numTrees; i++) {
            game.catTrees.push({
                x: 100 + (i * (game.width - 200) / numTrees),
                y: 100 + Math.random() * (game.height - 200),
                width: 80,
                height: 120,
                type: 'tree'
            });
        }

        // Create 1-2 couches
        const numCouches = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numCouches; i++) {
            game.couches.push({
                x: 120 + Math.random() * (game.width - 300),
                y: game.height - 180 - Math.random() * 100,
                width: 150,
                height: 100,
                type: 'couch'
            });
        }

        // Create 3-5 cat toys
        const numToys = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numToys; i++) {
            const size = 30 + Math.random() * 20;
            game.toys.push({
                x: 80 + Math.random() * (game.width - 160),
                y: 80 + Math.random() * (game.height - 160),
                width: size,
                height: size,
                type: 'toy'
            });
        }
    }

    function setupEventListeners() {
        game.canvas.addEventListener('mousedown', handlePointerDown);
        game.canvas.addEventListener('mousemove', handlePointerMove);
        game.canvas.addEventListener('mouseup', handlePointerUp);
        game.canvas.addEventListener('mouseleave', handlePointerUp);

        game.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        game.canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        game.canvas.addEventListener('touchend', handlePointerUp);

        // Color picker
        const colorPickerBtn = document.getElementById('colorPickerBtn');
        const colorInput = document.getElementById('wallColorPicker');

        if (colorPickerBtn && colorInput) {
            colorPickerBtn.addEventListener('click', () => {
                colorInput.click();
            });

            colorInput.addEventListener('input', (e) => {
                game.wallColor = e.target.value;
                game.scratches = [];
            });

            colorInput.addEventListener('change', (e) => {
                game.wallColor = e.target.value;
            });
        }
    }

    function getObjectAtPosition(x, y) {
        // Check boxes
        for (let box of game.boxes) {
            if (x >= box.x && x <= box.x + box.width &&
                y >= box.y && y <= box.y + box.height) {
                return box;
            }
        }

        // Check cat trees
        for (let tree of game.catTrees) {
            if (x >= tree.x && x <= tree.x + tree.width &&
                y >= tree.y && y <= tree.y + tree.height) {
                return tree;
            }
        }

        // Check couches
        for (let couch of game.couches) {
            if (x >= couch.x && x <= couch.x + couch.width &&
                y >= couch.y && y <= couch.y + couch.height) {
                return couch;
            }
        }

        // Check toys
        for (let toy of game.toys) {
            if (x >= toy.x && x <= toy.x + toy.width &&
                y >= toy.y && y <= toy.y + toy.height) {
                return toy;
            }
        }

        return null;
    }

    function handlePointerDown(e) {
        const rect = game.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if near walls for scratching
        const wallThreshold = 50;
        const isNearWall = x < wallThreshold || x > game.width - wallThreshold ||
                          y < wallThreshold || y > game.height - wallThreshold;

        if (isNearWall) {
            game.isScratching = true;
            game.lastScratchPoint = { x, y };
            game.scratchTarget = { x, y };
            moveCatToScratch(x, y);
        } else {
            const obj = getObjectAtPosition(x, y);

            if (obj && (obj.type === 'box' || obj.type === 'tree' || obj.type === 'couch' || obj.type === 'toy')) {
                game.isDragging = true;
                game.draggedObject = obj;
                game.dragOffset = {
                    x: x - obj.x,
                    y: y - obj.y
                };
            } else {
                const clickedBox = getObjectAtPosition(x, y);
                if (clickedBox && (clickedBox.type === 'box' || clickedBox.type === 'couch')) {
                    handleBoxClick(clickedBox, x, y);
                } else {
                    moveCatTo(x, y);
                }
            }
        }
    }

    function handlePointerMove(e) {
        const rect = game.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (game.isDragging && game.draggedObject) {
            game.draggedObject.x = Math.max(50, Math.min(game.width - 50, x - game.dragOffset.x));
            game.draggedObject.y = Math.max(50, Math.min(game.height - 50, y - game.dragOffset.y));
            game.canvas.style.cursor = 'grabbing';
        } else if (game.isScratching) {
            if (game.lastScratchPoint) {
                game.scratches.push({
                    x1: game.lastScratchPoint.x,
                    y1: game.lastScratchPoint.y,
                    x2: x,
                    y2: y
                });
                game.lastScratchPoint = { x, y };
                game.scratchTarget = { x, y };
            }
        } else {
            const obj = getObjectAtPosition(x, y);
            if (obj && (obj.type === 'box' || obj.type === 'tree' || obj.type === 'couch' || obj.type === 'toy')) {
                game.canvas.style.cursor = 'grab';
            } else {
                game.canvas.style.cursor = 'pointer';
            }
        }
    }

    function handlePointerUp() {
        if (game.isDragging) {
            game.isDragging = false;
            game.draggedObject = null;
            game.canvas.style.cursor = 'pointer';
        }

        if (game.isScratching) {
            game.isScratching = false;
            game.lastScratchPoint = null;
        }
    }

    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = game.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        const wallThreshold = 50;
        const isNearWall = x < wallThreshold || x > game.width - wallThreshold ||
                          y < wallThreshold || y > game.height - wallThreshold;

        if (isNearWall) {
            game.isScratching = true;
            game.lastScratchPoint = { x, y };
            game.scratchTarget = { x, y };
            moveCatToScratch(x, y);
        } else {
            const obj = getObjectAtPosition(x, y);

            if (obj && (obj.type === 'box' || obj.type === 'tree' || obj.type === 'couch' || obj.type === 'toy')) {
                game.isDragging = true;
                game.draggedObject = obj;
                game.dragOffset = {
                    x: x - obj.x,
                    y: y - obj.y
                };
            } else {
                const clickedBox = getObjectAtPosition(x, y);
                if (clickedBox && (clickedBox.type === 'box' || clickedBox.type === 'couch')) {
                    handleBoxClick(clickedBox, x, y);
                } else {
                    moveCatTo(x, y);
                }
            }
        }
    }

    function handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = game.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        if (game.isDragging && game.draggedObject) {
            game.draggedObject.x = Math.max(50, Math.min(game.width - 50, x - game.dragOffset.x));
            game.draggedObject.y = Math.max(50, Math.min(game.height - 50, y - game.dragOffset.y));
        } else if (game.isScratching) {
            if (game.lastScratchPoint) {
                game.scratches.push({
                    x1: game.lastScratchPoint.x,
                    y1: game.lastScratchPoint.y,
                    x2: x,
                    y2: y
                });
                game.lastScratchPoint = { x, y };
                game.scratchTarget = { x, y };
            }
        }
    }

    function handleBoxClick(box, clickX, clickY) {
        const boxCenterX = box.x + box.width / 2;
        const boxCenterY = box.y + box.height / 2;
        const relativeY = clickY - box.y;

        if (relativeY < box.height * 0.3) {
            moveCatToLie(boxCenterX, boxCenterY - box.height / 3, 'ontop');
        } else {
            moveCatToLie(boxCenterX, boxCenterY, 'inside');
        }
    }

    function moveCatTo(x, y) {
        game.cat.targetX = Math.max(30, Math.min(game.width - 30, x));
        game.cat.targetY = Math.max(30, Math.min(game.height - 30, y));
        game.cat.isMoving = true;
        game.cat.state = 'standing';

        if (x > game.cat.x) {
            game.cat.direction = 1;
        } else {
            game.cat.direction = -1;
        }

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

    function moveCatToLie(x, y, lieType) {
        game.cat.targetX = x;
        game.cat.targetY = y;
        game.cat.isMoving = true;
        game.cat.lieType = lieType;

        if (x > game.cat.x) {
            game.cat.direction = 1;
        } else {
            game.cat.direction = -1;
        }

        game.cat.moveType = 'walk';
        game.cat.speed = 2;
    }

    function moveCatToScratch(x, y) {
        game.cat.targetX = x;
        game.cat.targetY = y;
        game.cat.isMoving = true;
        game.cat.state = 'moving-to-scratch';

        if (x > game.cat.x) {
            game.cat.direction = 1;
        } else {
            game.cat.direction = -1;
        }

        game.cat.moveType = 'run';
        game.cat.speed = 4;
    }

    function update() {
        if (game.cat.isMoving) {
            const dx = game.cat.targetX - game.cat.x;
            const dy = game.cat.targetY - game.cat.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < game.cat.speed) {
                game.cat.x = game.cat.targetX;
                game.cat.y = game.cat.targetY;
                game.cat.isMoving = false;
                game.cat.jumpHeight = 0;

                if (game.cat.state === 'moving-to-scratch') {
                    game.cat.state = 'scratching';
                    game.cat.scratchAnimFrame = 0;
                } else if (game.cat.lieType) {
                    game.cat.state = 'lying';
                    game.cat.lieType = null;
                }
            } else {
                const angle = Math.atan2(dy, dx);
                game.cat.x += Math.cos(angle) * game.cat.speed;
                game.cat.y += Math.sin(angle) * game.cat.speed;

                if (game.cat.moveType === 'jump') {
                    game.cat.jumpProgress += 0.05;
                    game.cat.jumpHeight = Math.sin(game.cat.jumpProgress * Math.PI) * 20;
                }
            }

            game.cat.animationFrame += 0.2;
        } else if (game.cat.state === 'scratching') {
            game.cat.scratchAnimFrame += 0.3;

            if (!game.scratchTarget && game.cat.scratchAnimFrame > 20) {
                game.cat.state = 'standing';
                game.cat.scratchAnimFrame = 0;
            }

            if (game.scratchTarget && !game.isScratching) {
                setTimeout(() => {
                    game.scratchTarget = null;
                    game.cat.state = 'standing';
                }, 1000);
            }
        }
    }

    function render() {
        const ctx = game.ctx;

        // Clear canvas
        ctx.clearRect(0, 0, game.width, game.height);

        // Draw subtle, cozy cafe background
        drawCozyBackground(ctx);

        // Draw wooden floor
        drawWoodenFloor(ctx);

        // Draw scratches on walls
        ctx.strokeStyle = 'rgba(139, 115, 85, 0.3)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        game.scratches.forEach(scratch => {
            ctx.beginPath();
            ctx.moveTo(scratch.x1, scratch.y1);
            ctx.lineTo(scratch.x2, scratch.y2);
            ctx.stroke();
        });

        // Draw cafe elements (order matters for layering)
        drawCouches();
        drawBoxes();
        drawCatTrees();
        drawToys();

        // Draw cat (always on top)
        drawCat();
    }

    function drawCozyBackground(ctx) {
        // Warm gradient background
        const bgGradient = ctx.createLinearGradient(0, 0, 0, game.height);
        bgGradient.addColorStop(0, '#fdf6e3');  // Warm cream
        bgGradient.addColorStop(0.7, '#f5e6d3'); // Beige
        bgGradient.addColorStop(1, '#e8d5c4');   // Darker tan
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, game.width, game.height);

        // Add subtle texture with very light dots
        ctx.fillStyle = 'rgba(139, 115, 85, 0.02)';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * game.width;
            const y = Math.random() * game.height;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Soft vignette effect
        const vignette = ctx.createRadialGradient(
            game.width / 2, game.height / 2, game.height * 0.3,
            game.width / 2, game.height / 2, game.height * 0.8
        );
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, 'rgba(101, 67, 33, 0.1)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, game.width, game.height);
    }

    function drawWoodenFloor(ctx) {
        const floorHeight = 80;
        const floorY = game.height - floorHeight;

        // Base floor color
        const floorGradient = ctx.createLinearGradient(0, floorY, 0, game.height);
        floorGradient.addColorStop(0, '#a88860');
        floorGradient.addColorStop(0.5, '#8b7355');
        floorGradient.addColorStop(1, '#6d5d4b');
        ctx.fillStyle = floorGradient;
        ctx.fillRect(0, floorY, game.width, floorHeight);

        // Wood grain effect with planks
        ctx.strokeStyle = 'rgba(101, 67, 33, 0.2)';
        ctx.lineWidth = 2;
        for (let x = 0; x < game.width; x += 120) {
            ctx.beginPath();
            ctx.moveTo(x, floorY);
            ctx.lineTo(x, game.height);
            ctx.stroke();
        }

        // Horizontal grain lines
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(101, 67, 33, 0.1)';
        for (let y = floorY; y < game.height; y += 8) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(game.width, y);
            ctx.stroke();
        }

        // Floor edge highlight
        ctx.strokeStyle = 'rgba(168, 136, 96, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, floorY);
        ctx.lineTo(game.width, floorY);
        ctx.stroke();
    }

    function drawBoxes() {
        const ctx = game.ctx;
        game.boxes.forEach(box => {
            // Realistic shadow
            ctx.save();
            ctx.fillStyle = 'rgba(101, 67, 33, 0.25)';
            ctx.beginPath();
            ctx.ellipse(
                box.x + box.width / 2,
                box.y + box.height + 3,
                box.width / 2.2,
                box.width / 10,
                0, 0, Math.PI * 2
            );
            ctx.fill();
            ctx.restore();

            // Draw box image
            if (game.images.box && game.images.box.complete && game.images.box.naturalWidth > 0) {
                ctx.save();
                // Adjust rendering for transparent PNG
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(game.images.box, box.x, box.y, box.width, box.height);
                ctx.restore();
            } else {
                // Improved fallback: draw realistic box
                drawRealisticBox(ctx, box.x, box.y, box.width, box.height);
            }
        });
    }

    function drawRealisticBox(ctx, x, y, width, height) {
        // Box body
        ctx.fillStyle = '#c4a57b';
        ctx.fillRect(x, y, width, height);

        // Box shading for depth
        ctx.fillStyle = 'rgba(139, 115, 85, 0.3)';
        ctx.fillRect(x, y, width * 0.15, height);
        ctx.fillRect(x + width * 0.85, y, width * 0.15, height);

        // Box top flaps
        ctx.strokeStyle = '#8b7355';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 5, y + 5);
        ctx.lineTo(x + width / 2, y + height * 0.15);
        ctx.lineTo(x + width - 5, y + 5);
        ctx.stroke();

        // Box outline
        ctx.strokeStyle = '#8b7355';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Cardboard texture lines
        ctx.strokeStyle = 'rgba(139, 115, 85, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(x, y + (height * i / 4));
            ctx.lineTo(x + width, y + (height * i / 4));
            ctx.stroke();
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
        } else if (game.cat.state === 'scratching') {
            drawCatScratching();
        } else {
            drawCatStanding();
        }
    }

    function drawCatStanding() {
        const ctx = game.ctx;
        const x = game.cat.x;
        const y = game.cat.y - game.cat.jumpHeight;
        const size = game.cat.size;

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

            // Position and scale cat properly for transparent PNG
            const catWidth = size * 1.2;  // Slightly larger for visibility
            const catHeight = size * 1.2;

            // Add subtle bounce animation when moving
            const bounce = game.cat.isMoving ? Math.sin(game.cat.animationFrame * 2) * 2 : 0;

            // Flip cat based on direction
            if (game.cat.direction === -1) {
                ctx.translate(x, y - catHeight / 2 + bounce);
                ctx.scale(-1, 1);
                ctx.drawImage(game.images.cat, -catWidth / 2, 0, catWidth, catHeight);
            } else {
                ctx.translate(x - catWidth / 2, y - catHeight / 2 + bounce);
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
        const size = game.cat.size;

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

            // Position for lying cat (wider, flatter)
            const catWidth = size * 1.5;
            const catHeight = size * 0.8;

            ctx.translate(x, y);
            ctx.rotate(Math.PI / 16); // Slight tilt
            ctx.scale(1, 0.7); // Squash for lying effect
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

    function drawCatScratching() {
        const ctx = game.ctx;
        const x = game.cat.x;
        const y = game.cat.y;
        const size = game.cat.size;

        // Realistic shadow
        ctx.save();
        ctx.fillStyle = 'rgba(101, 67, 33, 0.25)';
        ctx.beginPath();
        ctx.ellipse(x, y + 8, size / 2.2, size / 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw cat image scratching
        if (game.images.cat && game.images.cat.complete && game.images.cat.naturalWidth > 0) {
            ctx.save();

            const catWidth = size * 1.2;
            const catHeight = size * 1.2;

            // Add scratching animation - subtle movement
            const scratchOffset = Math.sin(game.cat.scratchAnimFrame) * 2;

            ctx.translate(x - catWidth / 2 + scratchOffset, y - catHeight / 2);
            ctx.drawImage(game.images.cat, 0, 0, catWidth, catHeight);

            ctx.restore();
        } else {
            // Fallback: draw scratching cat
            drawFallbackCat(ctx, x, y, size, game.cat.direction);
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
        gameInterval: null,
        currentPosition: -1,
        positions: [
            { left: '10%', top: '60px' },      // left position
            { left: '50%', top: '60px', transform: 'translateX(-50%)' },  // middle
            { right: '10%', top: '60px' }      // right position
        ]
    };

    function initWandGame() {
        const wandGameBtn = document.getElementById('wandGameBtn');
        const wandGameOverlay = document.getElementById('wandGameOverlay');
        const wandGameClose = document.getElementById('wandGameClose');
        const wandGameStart = document.getElementById('wandGameStart');
        const wand = document.getElementById('wand');

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
    }

    function startWandGame() {
        // Reset game state
        wandGame.isPlaying = true;
        wandGame.score = 0;
        wandGame.timeLeft = 30;
        wandGame.wandVisible = false;

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
        if (!wand) return;

        // Hide previous wand
        wand.style.display = 'none';
        wandGame.wandVisible = false;

        // Random delay before showing next wand (300ms to 800ms)
        const delay = 300 + Math.random() * 500;

        wandGame.wandTimeout = setTimeout(() => {
            if (!wandGame.isPlaying) return;

            // Choose random position (different from previous)
            let newPosition;
            do {
                newPosition = Math.floor(Math.random() * 3);
            } while (newPosition === wandGame.currentPosition && Math.random() > 0.3);

            wandGame.currentPosition = newPosition;
            const pos = wandGame.positions[newPosition];

            // Position the wand
            wand.style.left = pos.left || '';
            wand.style.right = pos.right || '';
            wand.style.top = pos.top;
            wand.style.transform = pos.transform || '';
            wand.style.display = 'block';
            wandGame.wandVisible = true;

            // Hide wand after a short time (400ms to 700ms)
            const visibleTime = 400 + Math.random() * 300;
            wandGame.wandTimeout = setTimeout(() => {
                if (wandGame.wandVisible) {
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

        // Score!
        wandGame.score++;
        document.getElementById('wandScore').textContent = wandGame.score;

        // Hide wand
        const wand = document.getElementById('wand');
        wand.style.display = 'none';
        wandGame.wandVisible = false;

        // Add hit effect
        wand.style.animation = 'none';
        setTimeout(() => {
            wand.style.animation = 'wandAppear 0.2s ease';
        }, 10);

        // Clear timeout and spawn next wand
        if (wandGame.wandTimeout) {
            clearTimeout(wandGame.wandTimeout);
        }
        spawnWand();
    }

    function endWandGame() {
        wandGame.isPlaying = false;

        // Clear intervals and timeouts
        if (wandGame.gameInterval) {
            clearInterval(wandGame.gameInterval);
        }
        if (wandGame.wandTimeout) {
            clearTimeout(wandGame.wandTimeout);
        }

        // Hide wand
        const wand = document.getElementById('wand');
        if (wand) {
            wand.style.display = 'none';
        }

        // Update UI
        document.getElementById('wandGameStart').disabled = false;
        document.getElementById('wandGameStart').textContent = 'Play Again';

        // Save score to leaderboard
        saveScore(wandGame.score);
        loadLeaderboard();
        updateBestScore();

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
        difficulty: 1
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

        // Start game
        yarnGameStart.addEventListener('click', startYarnGame);

        // Click on canvas
        yarnCanvas.addEventListener('click', handleYarnClick);
    }

    function startYarnGame() {
        yarnGame.isPlaying = true;
        yarnGame.score = 0;
        yarnGame.lives = 3;
        yarnGame.balls = [];
        yarnGame.difficulty = 1;

        document.getElementById('yarnScore').textContent = '0';
        document.getElementById('yarnLives').textContent = '3';
        document.getElementById('yarnGameStart').disabled = true;
        document.getElementById('yarnGameStart').textContent = 'Playing...';

        // Spawn balls periodically
        yarnGame.spawnInterval = setInterval(() => {
            if (yarnGame.isPlaying) {
                spawnYarnBall();
            }
        }, Math.max(800, 2000 - yarnGame.score * 20));

        // Start game loop
        yarnGameLoop();
    }

    function spawnYarnBall() {
        const colors = ['#e91e63', '#9c27b0', '#3f51b5', '#ff9800', '#4caf50'];
        const ball = {
            x: Math.random() * (yarnGame.canvas.width - 60) + 30,
            y: 0,
            radius: 20 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: 2 + Math.random() * 2 + yarnGame.difficulty * 0.5,
            vx: (Math.random() - 0.5) * 3,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        };
        yarnGame.balls.push(ball);
    }

    function handleYarnClick(e) {
        if (!yarnGame.isPlaying) return;

        const rect = yarnGame.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicked on any ball
        for (let i = yarnGame.balls.length - 1; i >= 0; i--) {
            const ball = yarnGame.balls[i];
            const dist = Math.sqrt(Math.pow(x - ball.x, 2) + Math.pow(y - ball.y, 2));

            if (dist < ball.radius) {
                // Hit! Bat it away
                ball.vy = -8 - Math.random() * 4;
                ball.vx = (x - ball.x) * 0.3;
                yarnGame.score++;
                document.getElementById('yarnScore').textContent = yarnGame.score;

                // Increase difficulty every 5 points
                if (yarnGame.score % 5 === 0) {
                    yarnGame.difficulty++;
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

            // Update position
            ball.x += ball.vx;
            ball.y += ball.vy;
            ball.vy += 0.3; // Gravity
            ball.rotation += ball.rotationSpeed;

            // Bounce off walls
            if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
                ball.vx *= -0.8;
                ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x));
            }

            // Remove if off-screen top
            if (ball.y < -ball.radius * 2) {
                yarnGame.balls.splice(i, 1);
                continue;
            }

            // Check if reached bottom
            if (ball.y > canvas.height - ball.radius && ball.vy > 0) {
                yarnGame.balls.splice(i, 1);
                yarnGame.lives--;
                document.getElementById('yarnLives').textContent = yarnGame.lives;

                if (yarnGame.lives <= 0) {
                    endYarnGame();
                    return;
                }
                continue;
            }

            // Draw yarn ball
            ctx.save();
            ctx.translate(ball.x, ball.y);
            ctx.rotate(ball.rotation);

            // Draw ball
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

        saveYarnScore(yarnGame.score);
        loadYarnLeaderboard();
        updateYarnBestScore();

        setTimeout(() => {
            alert(`Game Over! Your score: ${yarnGame.score}`);
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
        melodyGame.pattern = [];
        melodyGame.playerPattern = [];

        document.getElementById('melodyRound').textContent = '1';
        document.getElementById('melodyScore').textContent = '0';
        document.getElementById('melodyGameStart').disabled = true;
        document.getElementById('melodyGameStart').textContent = 'Watch...';

        // Disable toys during pattern display
        setToysEnabled(false);

        // Start first round
        setTimeout(() => {
            nextRound();
        }, 1000);
    }

    function nextRound() {
        melodyGame.playerPattern = [];
        melodyGame.currentStep = 0;

        // Add new random toy to pattern
        melodyGame.pattern.push(Math.floor(Math.random() * 4));

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
            delay += 600;
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
