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
        const totalImages = 6;

        function imageLoaded() {
            loadedCount++;
            if (loadedCount === totalImages) {
                game.images.loaded = true;
                callback();
            }
        }

        // Load cat image - cute orange fluffy cat
        game.images.cat = new Image();
        game.images.cat.crossOrigin = 'anonymous';
        game.images.cat.onload = imageLoaded;
        game.images.cat.onerror = imageLoaded;
        game.images.cat.src = 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop&q=80';

        // Load cat tree image
        game.images.catTree = new Image();
        game.images.catTree.crossOrigin = 'anonymous';
        game.images.catTree.onload = imageLoaded;
        game.images.catTree.onerror = imageLoaded;
        game.images.catTree.src = 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=200&h=300&fit=crop&q=80';

        // Load cardboard box image
        game.images.box = new Image();
        game.images.box.crossOrigin = 'anonymous';
        game.images.box.onload = imageLoaded;
        game.images.box.onerror = imageLoaded;
        game.images.box.src = 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=200&h=200&fit=crop&q=80';

        // Load couch image
        game.images.couch = new Image();
        game.images.couch.crossOrigin = 'anonymous';
        game.images.couch.onload = imageLoaded;
        game.images.couch.onerror = imageLoaded;
        game.images.couch.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop&q=80';

        // Load cat toy image
        game.images.toy = new Image();
        game.images.toy.crossOrigin = 'anonymous';
        game.images.toy.onload = imageLoaded;
        game.images.toy.onerror = imageLoaded;
        game.images.toy.src = 'https://images.unsplash.com/photo-1591856378301-5c3b77e9da6b?w=150&h=150&fit=crop&q=80';

        // Load cafe background
        game.images.background = new Image();
        game.images.background.crossOrigin = 'anonymous';
        game.images.background.onload = imageLoaded;
        game.images.background.onerror = imageLoaded;
        game.images.background.src = 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&h=800&fit=crop&q=80';
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

        // Draw cozy cafe background
        if (game.images.background && game.images.background.complete) {
            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.drawImage(game.images.background, 0, 0, game.width, game.height);
            ctx.restore();

            // Add a warm overlay for coziness
            ctx.fillStyle = 'rgba(255, 248, 240, 0.4)';
            ctx.fillRect(0, 0, game.width, game.height);
        } else {
            // Fallback warm background
            ctx.fillStyle = '#f5e6d3';
            ctx.fillRect(0, 0, game.width, game.height);
        }

        // Draw floor (wooden floor look)
        const gradient = ctx.createLinearGradient(0, game.height - 60, 0, game.height);
        gradient.addColorStop(0, '#8b7355');
        gradient.addColorStop(1, '#6d5d4b');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, game.height - 60, game.width, 60);

        // Draw scratches
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 3;
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

    function drawBoxes() {
        const ctx = game.ctx;
        game.boxes.forEach(box => {
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(box.x + box.width / 2, box.y + box.height + 5, box.width / 2, box.height / 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Draw box image
            if (game.images.box && game.images.box.complete) {
                ctx.save();
                ctx.drawImage(game.images.box, box.x, box.y, box.width, box.height);
                ctx.restore();
            } else {
                // Fallback: draw simple box
                ctx.fillStyle = '#c4a57b';
                ctx.fillRect(box.x, box.y, box.width, box.height);
                ctx.strokeStyle = '#8b7355';
                ctx.lineWidth = 2;
                ctx.strokeRect(box.x, box.y, box.width, box.height);
            }
        });
    }

    function drawCatTrees() {
        const ctx = game.ctx;
        game.catTrees.forEach(tree => {
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(tree.x + tree.width / 2, tree.y + tree.height + 5, tree.width / 2, tree.height / 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Draw cat tree image
            if (game.images.catTree && game.images.catTree.complete) {
                ctx.save();
                ctx.drawImage(game.images.catTree, tree.x, tree.y, tree.width, tree.height);
                ctx.restore();
            } else {
                // Fallback: draw simple cat tree
                const treeX = tree.x + tree.width / 2;
                const treeY = tree.y + tree.height;
                const radius = tree.width / 5;

                ctx.fillStyle = '#8b7355';
                ctx.fillRect(treeX - radius / 2, treeY - tree.height, radius, tree.height);

                const platforms = [
                    { offset: -tree.height * 0.7, size: 20 },
                    { offset: -tree.height * 0.45, size: 16 },
                    { offset: -tree.height * 0.2, size: 12 }
                ];

                platforms.forEach(platform => {
                    ctx.fillStyle = '#a0826d';
                    ctx.beginPath();
                    ctx.arc(treeX, treeY + platform.offset, platform.size, 0, Math.PI * 2);
                    ctx.fill();
                });

                ctx.fillStyle = '#6d5d4b';
                ctx.beginPath();
                ctx.arc(treeX, treeY, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    function drawCouches() {
        const ctx = game.ctx;
        game.couches.forEach(couch => {
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(couch.x + couch.width / 2, couch.y + couch.height + 5, couch.width / 2, couch.height / 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Draw couch image
            if (game.images.couch && game.images.couch.complete) {
                ctx.save();
                ctx.drawImage(game.images.couch, couch.x, couch.y, couch.width, couch.height);
                ctx.restore();
            } else {
                // Fallback: draw simple couch
                ctx.fillStyle = '#8b6f47';
                ctx.fillRect(couch.x, couch.y + couch.height * 0.3, couch.width, couch.height * 0.7);
                ctx.fillStyle = '#a0826d';
                ctx.fillRect(couch.x, couch.y, couch.width * 0.15, couch.height * 0.6);
                ctx.fillRect(couch.x + couch.width * 0.85, couch.y, couch.width * 0.15, couch.height * 0.6);
            }
        });
    }

    function drawToys() {
        const ctx = game.ctx;
        game.toys.forEach(toy => {
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.ellipse(toy.x + toy.width / 2, toy.y + toy.height + 3, toy.width / 2, toy.height / 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Draw toy image
            if (game.images.toy && game.images.toy.complete) {
                ctx.save();
                ctx.drawImage(game.images.toy, toy.x, toy.y, toy.width, toy.height);
                ctx.restore();
            } else {
                // Fallback: draw simple toy (ball)
                ctx.fillStyle = '#ff6b6b';
                ctx.beginPath();
                ctx.arc(toy.x + toy.width / 2, toy.y + toy.height / 2, toy.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#c92a2a';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
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

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(game.cat.x, game.cat.y + size / 2 + 5, size / 2, size / 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw cat image
        if (game.images.cat && game.images.cat.complete) {
            ctx.save();

            // Position and scale cat
            const catWidth = size;
            const catHeight = size;

            // Flip cat based on direction
            if (game.cat.direction === -1) {
                ctx.translate(x + catWidth / 2, y);
                ctx.scale(-1, 1);
                ctx.translate(-catWidth / 2, 0);
            } else {
                ctx.translate(x - catWidth / 2, y);
            }

            // Add subtle bounce animation when moving
            const bounce = game.cat.isMoving ? Math.sin(game.cat.animationFrame * 2) * 2 : 0;
            ctx.translate(0, -catHeight + bounce);

            // Draw the cat image
            ctx.drawImage(game.images.cat, 0, 0, catWidth, catHeight);

            ctx.restore();
        } else {
            // Fallback: draw simple orange cat
            ctx.fillStyle = '#ff9e80';
            ctx.beginPath();
            ctx.ellipse(x, y, size / 2, size / 2.5, 0, 0, Math.PI * 2);
            ctx.fill();

            const headY = y - size / 3;
            ctx.beginPath();
            ctx.arc(x, headY, size / 3, 0, Math.PI * 2);
            ctx.fill();

            drawCatFace(ctx, x, headY, size);
        }
    }

    function drawCatLying() {
        const ctx = game.ctx;
        const x = game.cat.x;
        const y = game.cat.y;
        const size = game.cat.size;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y + 10, size / 1.5, size / 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw cat image lying down
        if (game.images.cat && game.images.cat.complete) {
            ctx.save();

            // Position for lying cat (wider, flatter)
            const catWidth = size * 1.3;
            const catHeight = size * 0.7;

            ctx.translate(x - catWidth / 2, y - catHeight / 2);

            // Rotate slightly to show lying position
            ctx.translate(catWidth / 2, catHeight / 2);
            ctx.rotate(Math.PI / 12);
            ctx.translate(-catWidth / 2, -catHeight / 2);

            // Draw the cat image
            ctx.drawImage(game.images.cat, 0, 0, catWidth, catHeight);

            ctx.restore();
        } else {
            // Fallback: draw simple lying cat
            ctx.fillStyle = '#ff9e80';
            ctx.beginPath();
            ctx.ellipse(x, y + 3, size / 1.5, size / 4, 0, 0, Math.PI * 2);
            ctx.fill();

            const headY = y - size / 6;
            ctx.beginPath();
            ctx.arc(x - size / 4, headY, size / 4, 0, Math.PI * 2);
            ctx.fill();

            drawCatFace(ctx, x - size / 4, headY, size * 0.8);
        }
    }

    function drawCatScratching() {
        const ctx = game.ctx;
        const x = game.cat.x;
        const y = game.cat.y;
        const size = game.cat.size;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y + size / 2 + 5, size / 2.5, size / 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw cat image scratching
        if (game.images.cat && game.images.cat.complete) {
            ctx.save();

            // Position and scale cat
            const catWidth = size;
            const catHeight = size;

            // Add scratching animation - subtle movement
            const scratchOffset = Math.sin(game.cat.scratchAnimFrame) * 3;

            ctx.translate(x - catWidth / 2 + scratchOffset, y - catHeight + 10);

            // Draw the cat image
            ctx.drawImage(game.images.cat, 0, 0, catWidth, catHeight);

            ctx.restore();
        } else {
            // Fallback: draw simple scratching cat
            ctx.fillStyle = '#ff9e80';
            ctx.beginPath();
            ctx.ellipse(x, y, size / 2, size / 3, 0, 0, Math.PI * 2);
            ctx.fill();

            const headY = y - size / 3;
            ctx.beginPath();
            ctx.arc(x, headY, size / 3, 0, Math.PI * 2);
            ctx.fill();

            drawCatFace(ctx, x, headY, size);

            // Draw simple paws
            const pawSize = size / 10;
            const scratchOffset = Math.sin(game.cat.scratchAnimFrame) * 8;
            const pawY = y - size / 4;

            ctx.fillStyle = '#ff9e80';
            ctx.save();
            ctx.translate(x - size / 3, pawY);
            ctx.rotate(-Math.PI / 4 + Math.sin(game.cat.scratchAnimFrame) * 0.3);
            ctx.beginPath();
            ctx.ellipse(0, scratchOffset, pawSize, pawSize * 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.translate(x + size / 3, pawY);
            ctx.rotate(Math.PI / 4 - Math.sin(game.cat.scratchAnimFrame) * 0.3);
            ctx.fillStyle = '#ff9e80';
            ctx.beginPath();
            ctx.ellipse(0, -scratchOffset, pawSize, pawSize * 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
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
    // INITIALIZATION
    // ============================================

    // Initialize on direct page load
    if (window.location.pathname === '/cat-cafe') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                init();
                initWandGame();
            });
        } else {
            setTimeout(() => {
                init();
                initWandGame();
            }, 50);
        }
    }

    // Initialize on SPA navigation
    document.addEventListener('spa-page-loaded', function(e) {
        if (e.detail.path === '/cat-cafe') {
            setTimeout(() => {
                init();
                initWandGame();
            }, 150);
        }
    });

})();
