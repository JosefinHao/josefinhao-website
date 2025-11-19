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
        cat: {
            x: 0,
            y: 0,
            z: 0, // Height above ground
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
            jumpProgress: 0
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

    // Convert 2D screen coordinates to 3D world coordinates (for click handling)
    function fromIso(screenX, screenY, z = 0) {
        const x = screenX - game.width / 2;
        const y = screenY - game.height * 0.7 + z;

        const worldY = (y / Math.sin(ISO.angle) - x / Math.cos(ISO.angle)) / 2;
        const worldX = y / Math.sin(ISO.angle) - worldY;

        return { x: worldX, y: worldY, z };
    }

    // Initialize the game
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

        // Position cat in center of room
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

        // Create random 3D boxes
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
                color: '#c4a57b'
            });
        }

        // Create 3 cat trees with 3D positions
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
                ]
            });
        });

        // Create elevated walkway
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

        // Color palette
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

    function handlePointerDown(e) {
        const rect = game.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        // Check if near walls for scratching
        const wallThreshold = 100;
        if (screenX < wallThreshold || screenX > game.width - wallThreshold ||
            screenY < wallThreshold || screenY > game.height - wallThreshold) {
            game.isScratching = true;
            game.lastScratchPoint = { x: screenX, y: screenY };
        } else {
            const world = fromIso(screenX, screenY, 0);
            const clickedBox = getBoxAtPosition(world.x, world.y);

            if (clickedBox) {
                handleBoxClick(clickedBox, screenX, screenY);
            } else {
                moveCatTo(world.x, world.y, 0);
            }
        }
    }

    function handlePointerMove(e) {
        if (!game.isScratching) return;

        const rect = game.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

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

    function handlePointerUp() {
        game.isScratching = false;
        game.lastScratchPoint = null;
    }

    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = game.canvas.getBoundingClientRect();
        const screenX = touch.clientX - rect.left;
        const screenY = touch.clientY - rect.top;

        const wallThreshold = 100;
        if (screenX < wallThreshold || screenX > game.width - wallThreshold ||
            screenY < wallThreshold || screenY > game.height - wallThreshold) {
            game.isScratching = true;
            game.lastScratchPoint = { x: screenX, y: screenY };
        } else {
            const world = fromIso(screenX, screenY, 0);
            const clickedBox = getBoxAtPosition(world.x, world.y);

            if (clickedBox) {
                handleBoxClick(clickedBox, screenX, screenY);
            } else {
                moveCatTo(world.x, world.y, 0);
            }
        }
    }

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
            // Clicked on top - sit on box
            moveCatTo(box.x + box.width / 2, box.y + box.depth / 2, box.height);
        } else {
            // Clicked inside - go into box
            moveCatTo(box.x + box.width / 2, box.y + box.depth / 2, 0);
        }
    }

    function moveCatTo(x, y, z) {
        game.cat.targetX = Math.max(50, Math.min(game.room.width - 50, x));
        game.cat.targetY = Math.max(50, Math.min(game.room.depth - 50, y));
        game.cat.targetZ = z;
        game.cat.isMoving = true;

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
            } else {
                const angle = Math.atan2(dy, dx);
                game.cat.x += Math.cos(angle) * game.cat.speed;
                game.cat.y += Math.sin(angle) * game.cat.speed;

                // Smooth Z transition
                game.cat.z += dz * 0.05;

                if (game.cat.moveType === 'jump') {
                    game.cat.jumpProgress += 0.05;
                    game.cat.jumpHeight = Math.sin(game.cat.jumpProgress * Math.PI) * 40;
                }
            }

            game.cat.animationFrame += 0.2;
        }
    }

    function render() {
        const ctx = game.ctx;
        ctx.clearRect(0, 0, game.width, game.height);

        // Draw room background
        drawRoom();

        // Draw scratches on walls
        drawScratches();

        // Collect all objects with depth for sorting
        const objects = [];

        // Add floor objects
        game.boxes.forEach(box => {
            objects.push({ type: 'box', data: box, depth: box.y + box.depth });
        });

        game.catTrees.forEach(tree => {
            objects.push({ type: 'tree', data: tree, depth: tree.y });
        });

        objects.push({ type: 'cat', data: game.cat, depth: game.cat.y });

        // Sort by depth (painter's algorithm)
        objects.sort((a, b) => a.depth - b.depth);

        // Draw sorted objects
        objects.forEach(obj => {
            if (obj.type === 'box') drawBox3D(obj.data);
            else if (obj.type === 'tree') drawCatTree3D(obj.data);
            else if (obj.type === 'cat') drawCat3D(obj.data);
        });

        // Draw walkways on top
        game.walkways.forEach(walkway => drawWalkway3D(walkway));
    }

    function drawRoom() {
        const ctx = game.ctx;
        const room = game.room;

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, game.height);
        gradient.addColorStop(0, game.wallColor);
        gradient.addColorStop(1, shadeColor(game.wallColor, -10));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, game.width, game.height);

        // Draw floor with perspective tiles
        drawFloor3D();

        // Draw back and side walls with perspective
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

                // Alternating floor tiles
                const isLight = ((x / tileSize) + (y / tileSize)) % 2 === 0;
                ctx.fillStyle = isLight ? '#8b7355' : '#7a6349';

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.lineTo(p4.x, p4.y);
                ctx.closePath();
                ctx.fill();

                // Tile outline
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    function drawWalls3D() {
        const ctx = game.ctx;
        const room = game.room;

        // Back wall
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

        // Left wall
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

        // Right wall
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

        // Box vertices
        const p1 = toIso(box.x, box.y, box.z);
        const p2 = toIso(box.x + box.width, box.y, box.z);
        const p3 = toIso(box.x + box.width, box.y + box.depth, box.z);
        const p4 = toIso(box.x, box.y + box.depth, box.z);
        const p5 = toIso(box.x, box.y, box.z + box.height);
        const p6 = toIso(box.x + box.width, box.y, box.z + box.height);
        const p7 = toIso(box.x + box.width, box.y + box.depth, box.z + box.height);
        const p8 = toIso(box.x, box.y + box.depth, box.z + box.height);

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fill();

        // Top face (lighter)
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

        // Left face (darker)
        ctx.fillStyle = shadeColor(box.color, -10);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p8.x, p8.y);
        ctx.lineTo(p5.x, p5.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right face (medium)
        ctx.fillStyle = box.color;
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p7.x, p7.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Top flaps for cardboard effect
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

        // Draw cylindrical trunk
        const trunkBottom = toIso(tree.x, tree.y, tree.z);
        const trunkTop = toIso(tree.x, tree.y, tree.z + tree.height);

        // Trunk shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(trunkBottom.x, trunkBottom.y, tree.radius * 1.2, tree.radius * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Left side of trunk (darker)
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

        // Center trunk
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(
            trunkBottom.x - tree.radius,
            trunkTop.y,
            tree.radius * 2,
            trunkBottom.y - trunkTop.y
        );

        // Right side highlight
        ctx.fillStyle = '#a0826d';
        ctx.fillRect(
            trunkBottom.x,
            trunkTop.y,
            tree.radius,
            trunkBottom.y - trunkTop.y
        );

        // Top of trunk
        ctx.fillStyle = '#a0826d';
        ctx.beginPath();
        ctx.ellipse(trunkTop.x, trunkTop.y, tree.radius, tree.radius * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw platforms
        tree.platforms.forEach(platform => {
            const platformPos = toIso(tree.x, tree.y, tree.z + platform.z);

            // Platform shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.ellipse(platformPos.x, platformPos.y + 2, platform.radius + 2, platform.radius * 0.5 + 1, 0, 0, Math.PI * 2);
            ctx.fill();

            // Platform top
            ctx.fillStyle = '#a0826d';
            ctx.beginPath();
            ctx.ellipse(platformPos.x, platformPos.y, platform.radius, platform.radius * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Platform texture
            ctx.fillStyle = '#8b7355';
            ctx.beginPath();
            ctx.ellipse(platformPos.x, platformPos.y, platform.radius - 5, platform.radius * 0.5 - 3, 0, 0, Math.PI * 2);
            ctx.fill();

            // Platform edge
            ctx.strokeStyle = '#6d5d4b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(platformPos.x, platformPos.y, platform.radius, platform.radius * 0.5, 0, 0, Math.PI * 2);
            ctx.stroke();
        });

        // Base
        const basePos = toIso(tree.x, tree.y, tree.z);
        ctx.fillStyle = '#6d5d4b';
        ctx.beginPath();
        ctx.ellipse(basePos.x, basePos.y, tree.radius * 1.5, tree.radius * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawWalkway3D(walkway) {
        const ctx = game.ctx;

        // Walkway platform vertices
        const p1 = toIso(walkway.x1, walkway.y1 - walkway.width / 2, walkway.z);
        const p2 = toIso(walkway.x2, walkway.y2 - walkway.width / 2, walkway.z);
        const p3 = toIso(walkway.x2, walkway.y2 + walkway.width / 2, walkway.z);
        const p4 = toIso(walkway.x1, walkway.y1 + walkway.width / 2, walkway.z);

        const p5 = toIso(walkway.x1, walkway.y1 - walkway.width / 2, walkway.z + walkway.thickness);
        const p6 = toIso(walkway.x2, walkway.y2 - walkway.width / 2, walkway.z + walkway.thickness);
        const p7 = toIso(walkway.x2, walkway.y2 + walkway.width / 2, walkway.z + walkway.thickness);
        const p8 = toIso(walkway.x1, walkway.y1 + walkway.width / 2, walkway.z + walkway.thickness);

        // Top face
        ctx.fillStyle = '#7a6349';
        ctx.beginPath();
        ctx.moveTo(p5.x, p5.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.lineTo(p7.x, p7.y);
        ctx.lineTo(p8.x, p8.y);
        ctx.closePath();
        ctx.fill();

        // Front face
        ctx.fillStyle = '#6d5d4b';
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p7.x, p7.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.closePath();
        ctx.fill();

        // Support brackets
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
        const pos = toIso(cat.x, cat.y, cat.z + cat.jumpHeight);
        const size = cat.size;

        // Shadow on ground
        const shadowPos = toIso(cat.x, cat.y, 0);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(shadowPos.x, shadowPos.y, size / 2.5, size / 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cat body (with 3D shading)
        const bodyGradient = ctx.createRadialGradient(pos.x - 5, pos.y - 5, 0, pos.x, pos.y, size / 2);
        bodyGradient.addColorStop(0, '#ffb399');
        bodyGradient.addColorStop(1, '#ff8c66');

        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y, size / 2, size / 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cat head
        const headY = pos.y - size / 3;
        ctx.beginPath();
        ctx.arc(pos.x, headY, size / 3, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        const earSize = size / 6;
        const earOffset = size / 4;

        ctx.fillStyle = '#ff9e80';
        // Left ear
        ctx.beginPath();
        ctx.moveTo(pos.x - earOffset, headY - size / 4);
        ctx.lineTo(pos.x - earOffset - earSize / 2, headY - size / 3 - earSize);
        ctx.lineTo(pos.x - earOffset + earSize / 2, headY - size / 3);
        ctx.closePath();
        ctx.fill();

        // Right ear
        ctx.beginPath();
        ctx.moveTo(pos.x + earOffset, headY - size / 4);
        ctx.lineTo(pos.x + earOffset - earSize / 2, headY - size / 3);
        ctx.lineTo(pos.x + earOffset + earSize / 2, headY - size / 3 - earSize);
        ctx.closePath();
        ctx.fill();

        // Inner ears
        ctx.fillStyle = '#ffb3ba';
        ctx.beginPath();
        ctx.arc(pos.x - earOffset, headY - size / 3.5, earSize / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pos.x + earOffset, headY - size / 3.5, earSize / 3, 0, Math.PI * 2);
        ctx.fill();

        // Face details
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(pos.x, headY + size / 12, size / 6, size / 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#2c3e50';
        const eyeY = headY - size / 12;
        const eyeOffset = size / 8;
        ctx.beginPath();
        ctx.arc(pos.x - eyeOffset, eyeY, size / 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pos.x + eyeOffset, eyeY, size / 20, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#ffb3ba';
        ctx.beginPath();
        ctx.moveTo(pos.x, headY + size / 10);
        ctx.lineTo(pos.x - size / 30, headY + size / 15);
        ctx.lineTo(pos.x + size / 30, headY + size / 15);
        ctx.closePath();
        ctx.fill();

        // Whiskers
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        const whiskerLength = size / 2.5;
        const whiskerY = headY + size / 15;

        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(pos.x - size / 8, whiskerY + i * size / 20);
            ctx.lineTo(pos.x - size / 8 - whiskerLength, whiskerY + i * size / 15);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(pos.x + size / 8, whiskerY + i * size / 20);
            ctx.lineTo(pos.x + size / 8 + whiskerLength, whiskerY + i * size / 15);
            ctx.stroke();
        }

        // Tail
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

        // Paws (when on ground)
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

    // Utility function to lighten/darken colors
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
            setTimeout(init, 100);
        }
    });

})();
