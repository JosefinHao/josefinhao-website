/**
 * Cat Cafe Interactive Game - 3D Isometric Edition
 * A cozy interactive experience where you play as a cat in a cafe with 3D perspective
 */

(function() {
    'use strict';

    // Isometric projection settings
    const ISO = {
        angle: Math.PI / 6, // 30 degrees
        scale: 0.866 // cos(30)
    };

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
        scratchTarget: null, // Where cat should go to scratch
        isDragging: false,
        draggedObject: null,
        dragOffset: { x: 0, y: 0 },
        cat: {
            x: 0,
            y: 0,
            z: 0,
            targetX: 0,
            targetY: 0,
            targetZ: 0,
            size: 50,
            speed: 2,
            isMoving: false,
            moveType: 'walk',
            direction: 1,
            animationFrame: 0,
            jumpHeight: 0,
            jumpProgress: 0,
            state: 'standing', // 'standing', 'lying', 'scratching'
            scratchAnimFrame: 0
        },
        boxes: [],
        catTrees: [],
        walkways: [],
        room: {
            width: 800,
            depth: 600,
            height: 400
        }
    };

    // Convert 3D world coordinates to 2D isometric screen coordinates
    function toIso(x, y, z = 0) {
        const isoX = (x - y) * Math.cos(ISO.angle);
        const isoY = (x + y) * Math.sin(ISO.angle) - z;
        return {
            x: game.width / 2 + isoX,
            y: game.height * 0.7 + isoY
        };
    }

    // Convert 2D screen coordinates to 3D world coordinates
    function fromIso(screenX, screenY, z = 0) {
        const x = screenX - game.width / 2;
        const y = screenY - game.height * 0.7 + z;

        const worldY = (y / Math.sin(ISO.angle) - x / Math.cos(ISO.angle)) / 2;
        const worldX = y / Math.sin(ISO.angle) - worldY;

        return { x: worldX, y: worldY, z };
    }

    function init() {
        console.log('Cat Cafe 3D game initializing...');

        const canvas = document.getElementById('cat-cafe-canvas');
        if (!canvas) {
            console.error('Canvas not found');
            return;
        }

        game.canvas = canvas;
        game.ctx = canvas.getContext('2d');

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        setupEventListeners();
        createCafeElements();

        game.cat.x = game.room.width / 2;
        game.cat.y = game.room.depth / 2;
        game.cat.z = 0;
        game.cat.targetX = game.cat.x;
        game.cat.targetY = game.cat.y;
        game.cat.targetZ = 0;

        gameLoop();

        console.log('Cat Cafe 3D game initialized successfully');
    }

    function resizeCanvas() {
        const container = game.canvas.parentElement;
        game.canvas.width = container.clientWidth;
        game.canvas.height = Math.max(600, window.innerHeight - 300);
        game.width = game.canvas.width;
        game.height = game.canvas.height;

        if (game.boxes.length === 0) {
            createCafeElements();
        }
    }

    function createCafeElements() {
        game.boxes = [];
        game.catTrees = [];
        game.walkways = [];

        const numBoxes = 5 + Math.floor(Math.random() * 4);
        for (let i = 0; i < numBoxes; i++) {
            const size = 40 + Math.random() * 50;
            game.boxes.push({
                x: 100 + Math.random() * (game.room.width - 200),
                y: 100 + Math.random() * (game.room.depth - 200),
                z: 0,
                width: size,
                depth: size,
                height: size,
                color: '#c4a57b',
                type: 'box'
            });
        }

        const treePositions = [
            { x: game.room.width * 0.2, y: game.room.depth * 0.3 },
            { x: game.room.width * 0.5, y: game.room.depth * 0.6 },
            { x: game.room.width * 0.8, y: game.room.depth * 0.4 }
        ];

        treePositions.forEach(pos => {
            const height = 140 + Math.random() * 60;
            game.catTrees.push({
                x: pos.x,
                y: pos.y,
                z: 0,
                height: height,
                radius: 12,
                platforms: [
                    { z: height * 0.3, radius: 35 },
                    { z: height * 0.6, radius: 28 },
                    { z: height * 0.85, radius: 22 }
                ],
                type: 'tree'
            });
        });

        game.walkways = [
            {
                x1: 50,
                y1: 80,
                x2: game.room.width - 50,
                y2: 80,
                z: 150,
                width: 20,
                thickness: 8
            }
        ];
    }

    function setupEventListeners() {
        game.canvas.addEventListener('mousedown', handlePointerDown);
        game.canvas.addEventListener('mousemove', handlePointerMove);
        game.canvas.addEventListener('mouseup', handlePointerUp);
        game.canvas.addEventListener('mouseleave', handlePointerUp);

        game.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        game.canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        game.canvas.addEventListener('touchend', handlePointerUp);

        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                game.wallColor = e.target.dataset.color;
                game.scratches = [];
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        const firstColorBtn = document.querySelector('.color-btn');
        if (firstColorBtn) firstColorBtn.classList.add('active');
    }

    function getObjectAtPosition(screenX, screenY) {
        const world = fromIso(screenX, screenY, 0);

        // Check boxes
        for (let box of game.boxes) {
            if (world.x >= box.x && world.x <= box.x + box.width &&
                world.y >= box.y && world.y <= box.y + box.depth) {
                return box;
            }
        }

        // Check cat trees (wider hitbox for easier dragging)
        for (let tree of game.catTrees) {
            const dist = Math.sqrt(
                Math.pow(world.x - tree.x, 2) +
                Math.pow(world.y - tree.y, 2)
            );
            if (dist < 50) {
                return tree;
            }
        }

        return null;
    }

    function handlePointerDown(e) {
        const rect = game.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        // Check if near walls for scratching
        const wallThreshold = 100;
        const isNearWall = screenX < wallThreshold || screenX > game.width - wallThreshold ||
                          screenY < wallThreshold || screenY > game.height - wallThreshold;

        if (isNearWall) {
            game.isScratching = true;
            game.lastScratchPoint = { x: screenX, y: screenY };

            // Convert wall position to 3D world coordinate for cat to move to
            const wallWorld = fromIso(screenX, screenY, 50); // Height where cat will scratch
            game.scratchTarget = {
                x: Math.max(50, Math.min(game.room.width - 50, wallWorld.x)),
                y: Math.max(50, Math.min(game.room.depth - 50, wallWorld.y)),
                screenX: screenX,
                screenY: screenY
            };

            // Move cat to scratch location
            moveCatToScratch(game.scratchTarget.x, game.scratchTarget.y);
        } else {
            // Check for object dragging
            const obj = getObjectAtPosition(screenX, screenY);

            if (obj && (obj.type === 'box' || obj.type === 'tree')) {
                game.isDragging = true;
                game.draggedObject = obj;
                const world = fromIso(screenX, screenY, 0);
                game.dragOffset = {
                    x: world.x - obj.x,
                    y: world.y - obj.y
                };
            } else {
                // Check for box interaction
                const clickedBox = getObjectAtPosition(screenX, screenY);
                if (clickedBox && clickedBox.type === 'box') {
                    handleBoxClick(clickedBox, screenX, screenY);
                } else {
                    const world = fromIso(screenX, screenY, 0);
                    moveCatTo(world.x, world.y, 0);
                }
            }
        }
    }

    function handlePointerMove(e) {
        const rect = game.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        if (game.isDragging && game.draggedObject) {
            // Drag object
            const world = fromIso(screenX, screenY, 0);
            game.draggedObject.x = Math.max(50, Math.min(game.room.width - 50, world.x - game.dragOffset.x));
            game.draggedObject.y = Math.max(50, Math.min(game.room.depth - 50, world.y - game.dragOffset.y));

            // Update cursor
            game.canvas.style.cursor = 'grabbing';
        } else if (game.isScratching) {
            // Add scratch marks
            if (game.lastScratchPoint) {
                game.scratches.push({
                    x1: game.lastScratchPoint.x,
                    y1: game.lastScratchPoint.y,
                    x2: screenX,
                    y2: screenY
                });
                game.lastScratchPoint = { x: screenX, y: screenY };

                // Update scratch target for cat
                const wallWorld = fromIso(screenX, screenY, 50);
                game.scratchTarget = {
                    x: Math.max(50, Math.min(game.room.width - 50, wallWorld.x)),
                    y: Math.max(50, Math.min(game.room.depth - 50, wallWorld.y)),
                    screenX: screenX,
                    screenY: screenY
                };
            }
        } else {
            // Update cursor based on hover
            const obj = getObjectAtPosition(screenX, screenY);
            if (obj && (obj.type === 'box' || obj.type === 'tree')) {
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
            // Keep scratchTarget so cat can finish scratching
        }
    }

    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = game.canvas.getBoundingClientRect();
        const screenX = touch.clientX - rect.left;
        const screenY = touch.clientY - rect.top;

        const wallThreshold = 100;
        const isNearWall = screenX < wallThreshold || screenX > game.width - wallThreshold ||
                          screenY < wallThreshold || screenY > game.height - wallThreshold;

        if (isNearWall) {
            game.isScratching = true;
            game.lastScratchPoint = { x: screenX, y: screenY };

            const wallWorld = fromIso(screenX, screenY, 50);
            game.scratchTarget = {
                x: Math.max(50, Math.min(game.room.width - 50, wallWorld.x)),
                y: Math.max(50, Math.min(game.room.depth - 50, wallWorld.y)),
                screenX: screenX,
                screenY: screenY
            };
            moveCatToScratch(game.scratchTarget.x, game.scratchTarget.y);
        } else {
            const obj = getObjectAtPosition(screenX, screenY);

            if (obj && (obj.type === 'box' || obj.type === 'tree')) {
                game.isDragging = true;
                game.draggedObject = obj;
                const world = fromIso(screenX, screenY, 0);
                game.dragOffset = {
                    x: world.x - obj.x,
                    y: world.y - obj.y
                };
            } else {
                const clickedBox = getObjectAtPosition(screenX, screenY);
                if (clickedBox && clickedBox.type === 'box') {
                    handleBoxClick(clickedBox, screenX, screenY);
                } else {
                    const world = fromIso(screenX, screenY, 0);
                    moveCatTo(world.x, world.y, 0);
                }
            }
        }
    }

    function handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = game.canvas.getBoundingClientRect();
        const screenX = touch.clientX - rect.left;
        const screenY = touch.clientY - rect.top;

        if (game.isDragging && game.draggedObject) {
            const world = fromIso(screenX, screenY, 0);
            game.draggedObject.x = Math.max(50, Math.min(game.room.width - 50, world.x - game.dragOffset.x));
            game.draggedObject.y = Math.max(50, Math.min(game.room.depth - 50, world.y - game.dragOffset.y));
        } else if (game.isScratching) {
            if (game.lastScratchPoint) {
                game.scratches.push({
                    x1: game.lastScratchPoint.x,
                    y1: game.lastScratchPoint.y,
                    x2: screenX,
                    y2: screenY
                });
                game.lastScratchPoint = { x: screenX, y: screenY };

                const wallWorld = fromIso(screenX, screenY, 50);
                game.scratchTarget = {
                    x: Math.max(50, Math.min(game.room.width - 50, wallWorld.x)),
                    y: Math.max(50, Math.min(game.room.depth - 50, wallWorld.y)),
                    screenX: screenX,
                    screenY: screenY
                };
            }
        }
    }

    function getBoxAtPosition(x, y) {
        for (let box of game.boxes) {
            if (x >= box.x && x <= box.x + box.width &&
                y >= box.y && y <= box.y + box.depth) {
                return box;
            }
        }
        return null;
    }

    function handleBoxClick(box, screenX, screenY) {
        const relativeY = screenY - game.height * 0.7;

        if (relativeY < -box.height * 0.7) {
            // Clicked on top - lie on box
            moveCatToLie(box.x + box.width / 2, box.y + box.depth / 2, box.height, 'ontop');
        } else {
            // Clicked inside - lie inside box
            moveCatToLie(box.x + box.width / 2, box.y + box.depth / 2, 0, 'inside');
        }
    }

    function moveCatTo(x, y, z) {
        game.cat.targetX = Math.max(50, Math.min(game.room.width - 50, x));
        game.cat.targetY = Math.max(50, Math.min(game.room.depth - 50, y));
        game.cat.targetZ = z;
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
            game.cat.speed = 2.5;
        } else if (rand < 0.66) {
            game.cat.moveType = 'run';
            game.cat.speed = 5;
        } else {
            game.cat.moveType = 'jump';
            game.cat.speed = 3.5;
            game.cat.jumpProgress = 0;
        }
    }

    function moveCatToLie(x, y, z, lieType) {
        game.cat.targetX = Math.max(50, Math.min(game.room.width - 50, x));
        game.cat.targetY = Math.max(50, Math.min(game.room.depth - 50, y));
        game.cat.targetZ = z;
        game.cat.isMoving = true;
        game.cat.lieType = lieType;

        if (x > game.cat.x) {
            game.cat.direction = 1;
        } else {
            game.cat.direction = -1;
        }

        game.cat.moveType = 'walk';
        game.cat.speed = 2.5;
    }

    function moveCatToScratch(x, y) {
        game.cat.targetX = x;
        game.cat.targetY = y;
        game.cat.targetZ = 0;
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
            const dz = game.cat.targetZ - game.cat.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < game.cat.speed) {
                game.cat.x = game.cat.targetX;
                game.cat.y = game.cat.targetY;
                game.cat.z = game.cat.targetZ;
                game.cat.isMoving = false;
                game.cat.jumpHeight = 0;

                // Set state after reaching destination
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

                game.cat.z += dz * 0.05;

                if (game.cat.moveType === 'jump') {
                    game.cat.jumpProgress += 0.05;
                    game.cat.jumpHeight = Math.sin(game.cat.jumpProgress * Math.PI) * 40;
                }
            }

            game.cat.animationFrame += 0.2;
        } else if (game.cat.state === 'scratching') {
            game.cat.scratchAnimFrame += 0.3;

            // Stop scratching after a while if not actively scratching
            if (!game.scratchTarget && game.cat.scratchAnimFrame > 20) {
                game.cat.state = 'standing';
                game.cat.scratchAnimFrame = 0;
            }

            // Clear scratch target after reaching it
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
        ctx.clearRect(0, 0, game.width, game.height);

        drawRoom();
        drawScratches();

        const objects = [];

        game.boxes.forEach(box => {
            objects.push({ type: 'box', data: box, depth: box.y + box.depth });
        });

        game.catTrees.forEach(tree => {
            objects.push({ type: 'tree', data: tree, depth: tree.y });
        });

        objects.push({ type: 'cat', data: game.cat, depth: game.cat.y });

        objects.sort((a, b) => a.depth - b.depth);

        objects.forEach(obj => {
            if (obj.type === 'box') drawBox3D(obj.data);
            else if (obj.type === 'tree') drawCatTree3D(obj.data);
            else if (obj.type === 'cat') drawCat3D(obj.data);
        });

        game.walkways.forEach(walkway => drawWalkway3D(walkway));
    }

    function drawRoom() {
        const ctx = game.ctx;
        const room = game.room;

        const gradient = ctx.createLinearGradient(0, 0, 0, game.height);
        gradient.addColorStop(0, game.wallColor);
        gradient.addColorStop(1, shadeColor(game.wallColor, -10));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, game.width, game.height);

        drawFloor3D();
        drawWalls3D();
    }

    function drawFloor3D() {
        const ctx = game.ctx;
        const tileSize = 60;

        for (let x = 0; x < game.room.width; x += tileSize) {
            for (let y = 0; y < game.room.depth; y += tileSize) {
                const p1 = toIso(x, y, 0);
                const p2 = toIso(x + tileSize, y, 0);
                const p3 = toIso(x + tileSize, y + tileSize, 0);
                const p4 = toIso(x, y + tileSize, 0);

                const isLight = ((x / tileSize) + (y / tileSize)) % 2 === 0;
                ctx.fillStyle = isLight ? '#8b7355' : '#7a6349';

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.lineTo(p4.x, p4.y);
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    function drawWalls3D() {
        const ctx = game.ctx;
        const room = game.room;

        const backWall = [
            toIso(0, 0, 0),
            toIso(room.width, 0, 0),
            toIso(room.width, 0, room.height),
            toIso(0, 0, room.height)
        ];

        ctx.fillStyle = shadeColor(game.wallColor, -15);
        ctx.beginPath();
        ctx.moveTo(backWall[0].x, backWall[0].y);
        backWall.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();

        const leftWall = [
            toIso(0, 0, 0),
            toIso(0, room.depth, 0),
            toIso(0, room.depth, room.height),
            toIso(0, 0, room.height)
        ];

        ctx.fillStyle = shadeColor(game.wallColor, -8);
        ctx.beginPath();
        ctx.moveTo(leftWall[0].x, leftWall[0].y);
        leftWall.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();

        const rightWall = [
            toIso(room.width, 0, 0),
            toIso(room.width, room.depth, 0),
            toIso(room.width, room.depth, room.height),
            toIso(room.width, 0, room.height)
        ];

        ctx.fillStyle = shadeColor(game.wallColor, -5);
        ctx.beginPath();
        ctx.moveTo(rightWall[0].x, rightWall[0].y);
        rightWall.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
    }

    function drawScratches() {
        const ctx = game.ctx;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        game.scratches.forEach(scratch => {
            ctx.beginPath();
            ctx.moveTo(scratch.x1, scratch.y1);
            ctx.lineTo(scratch.x2, scratch.y2);
            ctx.stroke();
        });
    }

    function drawBox3D(box) {
        const ctx = game.ctx;

        const p1 = toIso(box.x, box.y, box.z);
        const p2 = toIso(box.x + box.width, box.y, box.z);
        const p3 = toIso(box.x + box.width, box.y + box.depth, box.z);
        const p4 = toIso(box.x, box.y + box.depth, box.z);
        const p5 = toIso(box.x, box.y, box.z + box.height);
        const p6 = toIso(box.x + box.width, box.y, box.z + box.height);
        const p7 = toIso(box.x + box.width, box.y + box.depth, box.z + box.height);
        const p8 = toIso(box.x, box.y + box.depth, box.z + box.height);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = shadeColor(box.color, 10);
        ctx.beginPath();
        ctx.moveTo(p5.x, p5.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.lineTo(p7.x, p7.y);
        ctx.lineTo(p8.x, p8.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#8b7355';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = shadeColor(box.color, -10);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p8.x, p8.y);
        ctx.lineTo(p5.x, p5.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = box.color;
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p7.x, p7.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#a0826d';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p5.x + (p6.x - p5.x) * 0.2, p5.y + (p6.y - p5.y) * 0.2);
        ctx.lineTo(p5.x + (p6.x - p5.x) * 0.8, p5.y + (p6.y - p5.y) * 0.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p8.x + (p7.x - p8.x) * 0.2, p8.y + (p7.y - p8.y) * 0.2);
        ctx.lineTo(p8.x + (p7.x - p8.x) * 0.8, p8.y + (p7.y - p8.y) * 0.8);
        ctx.stroke();
    }

    function drawCatTree3D(tree) {
        const ctx = game.ctx;

        const trunkBottom = toIso(tree.x, tree.y, tree.z);
        const trunkTop = toIso(tree.x, tree.y, tree.z + tree.height);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(trunkBottom.x, trunkBottom.y, tree.radius * 1.2, tree.radius * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        const leftGradient = ctx.createLinearGradient(
            trunkBottom.x - tree.radius, trunkBottom.y,
            trunkBottom.x, trunkBottom.y
        );
        leftGradient.addColorStop(0, '#6d5d4b');
        leftGradient.addColorStop(1, '#8b7355');

        ctx.fillStyle = leftGradient;
        ctx.beginPath();
        ctx.ellipse(trunkBottom.x - tree.radius / 2, trunkBottom.y, tree.radius * 0.7, tree.radius * 0.5, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#8b7355';
        ctx.fillRect(
            trunkBottom.x - tree.radius,
            trunkTop.y,
            tree.radius * 2,
            trunkBottom.y - trunkTop.y
        );

        ctx.fillStyle = '#a0826d';
        ctx.fillRect(
            trunkBottom.x,
            trunkTop.y,
            tree.radius,
            trunkBottom.y - trunkTop.y
        );

        ctx.fillStyle = '#a0826d';
        ctx.beginPath();
        ctx.ellipse(trunkTop.x, trunkTop.y, tree.radius, tree.radius * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        tree.platforms.forEach(platform => {
            const platformPos = toIso(tree.x, tree.y, tree.z + platform.z);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.ellipse(platformPos.x, platformPos.y + 2, platform.radius + 2, platform.radius * 0.5 + 1, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#a0826d';
            ctx.beginPath();
            ctx.ellipse(platformPos.x, platformPos.y, platform.radius, platform.radius * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#8b7355';
            ctx.beginPath();
            ctx.ellipse(platformPos.x, platformPos.y, platform.radius - 5, platform.radius * 0.5 - 3, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#6d5d4b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(platformPos.x, platformPos.y, platform.radius, platform.radius * 0.5, 0, 0, Math.PI * 2);
            ctx.stroke();
        });

        const basePos = toIso(tree.x, tree.y, tree.z);
        ctx.fillStyle = '#6d5d4b';
        ctx.beginPath();
        ctx.ellipse(basePos.x, basePos.y, tree.radius * 1.5, tree.radius * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawWalkway3D(walkway) {
        const ctx = game.ctx;

        const p1 = toIso(walkway.x1, walkway.y1 - walkway.width / 2, walkway.z);
        const p2 = toIso(walkway.x2, walkway.y2 - walkway.width / 2, walkway.z);
        const p3 = toIso(walkway.x2, walkway.y2 + walkway.width / 2, walkway.z);
        const p4 = toIso(walkway.x1, walkway.y1 + walkway.width / 2, walkway.z);

        const p5 = toIso(walkway.x1, walkway.y1 - walkway.width / 2, walkway.z + walkway.thickness);
        const p6 = toIso(walkway.x2, walkway.y2 - walkway.width / 2, walkway.z + walkway.thickness);
        const p7 = toIso(walkway.x2, walkway.y2 + walkway.width / 2, walkway.z + walkway.thickness);
        const p8 = toIso(walkway.x1, walkway.y1 + walkway.width / 2, walkway.z + walkway.thickness);

        ctx.fillStyle = '#7a6349';
        ctx.beginPath();
        ctx.moveTo(p5.x, p5.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.lineTo(p7.x, p7.y);
        ctx.lineTo(p8.x, p8.y);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6d5d4b';
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p7.x, p7.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.closePath();
        ctx.fill();

        for (let x = walkway.x1; x < walkway.x2; x += 100) {
            const bracketTop = toIso(x, walkway.y1, walkway.z);
            const bracketBottom = toIso(x, walkway.y1, 0);

            ctx.strokeStyle = '#8b7355';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(bracketTop.x, bracketTop.y);
            ctx.lineTo(bracketBottom.x, bracketBottom.y);
            ctx.stroke();
        }
    }

    function drawCat3D(cat) {
        const ctx = game.ctx;

        if (cat.state === 'lying') {
            drawCatLying(cat);
        } else if (cat.state === 'scratching') {
            drawCatScratching(cat);
        } else {
            drawCatStanding(cat);
        }
    }

    function drawCatStanding(cat) {
        const ctx = game.ctx;
        const pos = toIso(cat.x, cat.y, cat.z + cat.jumpHeight);
        const size = cat.size;

        const shadowPos = toIso(cat.x, cat.y, 0);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(shadowPos.x, shadowPos.y, size / 2.5, size / 5, 0, 0, Math.PI * 2);
        ctx.fill();

        const bodyGradient = ctx.createRadialGradient(pos.x - 5, pos.y - 5, 0, pos.x, pos.y, size / 2);
        bodyGradient.addColorStop(0, '#ffb399');
        bodyGradient.addColorStop(1, '#ff8c66');

        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y, size / 2, size / 3, 0, 0, Math.PI * 2);
        ctx.fill();

        const headY = pos.y - size / 3;
        ctx.beginPath();
        ctx.arc(pos.x, headY, size / 3, 0, Math.PI * 2);
        ctx.fill();

        drawCatFace(ctx, pos.x, headY, size, cat.direction, cat.animationFrame);

        ctx.strokeStyle = '#ff9e80';
        ctx.lineWidth = size / 10;
        ctx.lineCap = 'round';
        const tailX = pos.x - (size / 2) * cat.direction;
        const tailWave = Math.sin(cat.animationFrame) * 5;
        ctx.beginPath();
        ctx.moveTo(tailX, pos.y);
        ctx.quadraticCurveTo(
            tailX - 15 * cat.direction,
            pos.y - 15 + tailWave,
            tailX - 20 * cat.direction,
            pos.y - 25 + tailWave
        );
        ctx.stroke();

        if (cat.jumpHeight < 5) {
            ctx.fillStyle = '#ff9e80';
            const pawSize = size / 12;
            const pawY = pos.y + size / 3;
            const pawBounce = cat.isMoving ? Math.sin(cat.animationFrame * 2) * 2 : 0;

            ctx.beginPath();
            ctx.ellipse(pos.x - size / 6, pawY + pawBounce, pawSize, pawSize * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(pos.x + size / 6, pawY - pawBounce, pawSize, pawSize * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawCatLying(cat) {
        const ctx = game.ctx;
        const pos = toIso(cat.x, cat.y, cat.z);
        const size = cat.size;

        const shadowPos = toIso(cat.x, cat.y, 0);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(shadowPos.x, shadowPos.y, size / 1.8, size / 4, 0, 0, Math.PI * 2);
        ctx.fill();

        const bodyGradient = ctx.createRadialGradient(pos.x - 5, pos.y, 0, pos.x, pos.y, size / 1.5);
        bodyGradient.addColorStop(0, '#ffb399');
        bodyGradient.addColorStop(1, '#ff8c66');

        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y + 5, size / 1.5, size / 4, 0, 0, Math.PI * 2);
        ctx.fill();

        const headY = pos.y - size / 6;
        ctx.beginPath();
        ctx.arc(pos.x - size / 4, headY, size / 4, 0, Math.PI * 2);
        ctx.fill();

        drawCatFace(ctx, pos.x - size / 4, headY, size * 0.8, cat.direction, cat.animationFrame);

        ctx.strokeStyle = '#ff9e80';
        ctx.lineWidth = size / 12;
        ctx.lineCap = 'round';
        const tailX = pos.x + size / 2;
        const tailWave = Math.sin(cat.animationFrame * 0.5) * 3;
        ctx.beginPath();
        ctx.moveTo(tailX, pos.y);
        ctx.quadraticCurveTo(
            tailX + 15,
            pos.y + tailWave,
            tailX + 25,
            pos.y - 5 + tailWave
        );
        ctx.stroke();
    }

    function drawCatScratching(cat) {
        const ctx = game.ctx;
        const pos = toIso(cat.x, cat.y, cat.z);
        const size = cat.size;

        const shadowPos = toIso(cat.x, cat.y, 0);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(shadowPos.x, shadowPos.y, size / 2.5, size / 5, 0, 0, Math.PI * 2);
        ctx.fill();

        const bodyGradient = ctx.createRadialGradient(pos.x - 5, pos.y - 5, 0, pos.x, pos.y, size / 2);
        bodyGradient.addColorStop(0, '#ffb399');
        bodyGradient.addColorStop(1, '#ff8c66');

        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y, size / 2, size / 3, 0, 0, Math.PI * 2);
        ctx.fill();

        const headY = pos.y - size / 3;
        ctx.beginPath();
        ctx.arc(pos.x, headY, size / 3, 0, Math.PI * 2);
        ctx.fill();

        drawCatFace(ctx, pos.x, headY, size, cat.direction, cat.animationFrame);

        ctx.fillStyle = '#ff9e80';
        const pawSize = size / 10;
        const scratchOffset = Math.sin(cat.scratchAnimFrame) * 8;
        const pawY = pos.y - size / 4;

        ctx.save();
        ctx.translate(pos.x - size / 3, pawY);
        ctx.rotate(-Math.PI / 4 + Math.sin(cat.scratchAnimFrame) * 0.3);
        ctx.beginPath();
        ctx.ellipse(0, scratchOffset, pawSize, pawSize * 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(-pawSize / 2 + i * pawSize / 2, scratchOffset - pawSize);
            ctx.lineTo(-pawSize / 2 + i * pawSize / 2, scratchOffset - pawSize * 1.5);
            ctx.stroke();
        }
        ctx.restore();

        ctx.save();
        ctx.translate(pos.x + size / 3, pawY);
        ctx.rotate(Math.PI / 4 - Math.sin(cat.scratchAnimFrame) * 0.3);
        ctx.fillStyle = '#ff9e80';
        ctx.beginPath();
        ctx.ellipse(0, -scratchOffset, pawSize, pawSize * 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(-pawSize / 2 + i * pawSize / 2, -scratchOffset - pawSize);
            ctx.lineTo(-pawSize / 2 + i * pawSize / 2, -scratchOffset - pawSize * 1.5);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawCatFace(ctx, x, y, size, direction, animFrame) {
        const earSize = size / 6;
        const earOffset = size / 4;

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

        ctx.fillStyle = '#ffb3ba';
        ctx.beginPath();
        ctx.arc(x - earOffset, y - size / 3.5, earSize / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + earOffset, y - size / 3.5, earSize / 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(x, y + size / 12, size / 6, size / 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2c3e50';
        const eyeY = y - size / 12;
        const eyeOffset = size / 8;
        ctx.beginPath();
        ctx.arc(x - eyeOffset, eyeY, size / 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + eyeOffset, eyeY, size / 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffb3ba';
        ctx.beginPath();
        ctx.moveTo(x, y + size / 10);
        ctx.lineTo(x - size / 30, y + size / 15);
        ctx.lineTo(x + size / 30, y + size / 15);
        ctx.closePath();
        ctx.fill();

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

    function shadeColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }

    function gameLoop() {
        update();
        render();
        requestAnimationFrame(gameLoop);
    }

    if (window.location.pathname === '/cat-cafe') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    document.addEventListener('spa-page-loaded', function(e) {
        if (e.detail.path === '/cat-cafe') {
            setTimeout(init, 100);
        }
    });

})();
