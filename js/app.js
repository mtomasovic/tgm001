// Level definitions
const LEVELS = [
    // Level 1 - Very easy, just a few platforms
    {
        platforms: [
            {x: 0, y: 580, width: 800, height: 20, color: '#8B4513'}, // ground
            {x: 200, y: 520, width: 120, height: 20, color: '#009600'}, // platform
            {x: 400, y: 460, width: 120, height: 20, color: '#009600'}, // platform
            {x: 600, y: 420, width: 120, height: 20, color: '#FFD700'}, // goal
        ],
        spawn: {x: 50, y: 500},
        goal: {x: 600, y: 420}
    },
    // Level 2 - Small gaps
    {
        platforms: [
            {x: 0, y: 580, width: 150, height: 20, color: '#8B4513'}, // ground start
            {x: 200, y: 580, width: 100, height: 20, color: '#8B4513'}, // ground gap
            {x: 350, y: 580, width: 150, height: 20, color: '#8B4513'}, // ground gap
            {x: 550, y: 580, width: 250, height: 20, color: '#8B4513'}, // ground end
            {x: 250, y: 520, width: 80, height: 20, color: '#009600'}, // platform
            {x: 450, y: 460, width: 80, height: 20, color: '#009600'}, // platform
            {x: 650, y: 420, width: 100, height: 20, color: '#FFD700'}, // goal
        ],
        spawn: {x: 50, y: 500},
        goal: {x: 650, y: 420}
    },
    // Level 3 - Higher jumps
    {
        platforms: [
            {x: 0, y: 580, width: 800, height: 20, color: '#8B4513'}, // ground
            {x: 150, y: 480, width: 80, height: 20, color: '#009600'}, // platform
            {x: 300, y: 380, width: 80, height: 20, color: '#009600'}, // higher platform
            {x: 500, y: 280, width: 80, height: 20, color: '#009600'}, // even higher
            {x: 650, y: 350, width: 100, height: 20, color: '#FFD700'}, // goal
        ],
        spawn: {x: 50, y: 500},
        goal: {x: 650, y: 350}
    },
    // Level 4 - Obstacles introduced
    {
        platforms: [
            {x: 0, y: 580, width: 800, height: 20, color: '#8B4513'}, // ground
            {x: 150, y: 520, width: 100, height: 20, color: '#009600'}, // platform
            {x: 200, y: 480, width: 40, height: 20, color: '#960000'}, // obstacle
            {x: 350, y: 460, width: 100, height: 20, color: '#009600'}, // platform
            {x: 400, y: 420, width: 40, height: 20, color: '#960000'}, // obstacle
            {x: 550, y: 400, width: 100, height: 20, color: '#009600'}, // platform
            {x: 700, y: 360, width: 80, height: 20, color: '#FFD700'}, // goal
        ],
        spawn: {x: 50, y: 500},
        goal: {x: 700, y: 360}
    },
    // Level 5 - Precision jumping
    {
        platforms: [
            {x: 0, y: 580, width: 100, height: 20, color: '#8B4513'}, // ground start
            {x: 150, y: 500, width: 60, height: 20, color: '#009600'}, // small platform
            {x: 250, y: 420, width: 60, height: 20, color: '#009600'}, // small platform
            {x: 350, y: 340, width: 60, height: 20, color: '#009600'}, // small platform
            {x: 450, y: 260, width: 60, height: 20, color: '#009600'}, // small platform
            {x: 550, y: 340, width: 60, height: 20, color: '#009600'}, // small platform
            {x: 650, y: 420, width: 60, height: 20, color: '#009600'}, // small platform
            {x: 720, y: 580, width: 80, height: 20, color: '#8B4513'}, // ground end
            {x: 720, y: 380, width: 80, height: 20, color: '#FFD700'}, // goal
        ],
        spawn: {x: 50, y: 500},
        goal: {x: 720, y: 380}
    },
    // Level 6 - Moving platforms concept (static for now)
    {
        platforms: [
            {x: 0, y: 580, width: 800, height: 20, color: '#8B4513'}, // ground
            {x: 120, y: 480, width: 80, height: 20, color: '#009600'}, // platform
            {x: 250, y: 400, width: 60, height: 20, color: '#009600'}, // platform
            {x: 350, y: 480, width: 60, height: 20, color: '#009600'}, // platform
            {x: 450, y: 360, width: 60, height: 20, color: '#009600'}, // platform
            {x: 550, y: 440, width: 60, height: 20, color: '#009600'}, // platform
            {x: 200, y: 520, width: 40, height: 20, color: '#960000'}, // obstacle
            {x: 400, y: 520, width: 40, height: 20, color: '#960000'}, // obstacle
            {x: 600, y: 520, width: 40, height: 20, color: '#960000'}, // obstacle
            {x: 680, y: 380, width: 100, height: 20, color: '#FFD700'}, // goal
        ],
        spawn: {x: 50, y: 500},
        goal: {x: 680, y: 380}
    },
    // Level 7 - Narrow passages
    {
        platforms: [
            {x: 0, y: 580, width: 150, height: 20, color: '#8B4513'}, // ground start
            {x: 200, y: 580, width: 40, height: 20, color: '#8B4513'}, // narrow ground
            {x: 280, y: 580, width: 40, height: 20, color: '#8B4513'}, // narrow ground
            {x: 360, y: 580, width: 40, height: 20, color: '#8B4513'}, // narrow ground
            {x: 440, y: 580, width: 40, height: 20, color: '#8B4513'}, // narrow ground
            {x: 520, y: 580, width: 280, height: 20, color: '#8B4513'}, // ground end
            {x: 150, y: 460, width: 60, height: 20, color: '#009600'}, // platform
            {x: 300, y: 400, width: 60, height: 20, color: '#009600'}, // platform
            {x: 450, y: 340, width: 60, height: 20, color: '#009600'}, // platform
            {x: 600, y: 380, width: 60, height: 20, color: '#009600'}, // platform
            {x: 220, y: 500, width: 40, height: 20, color: '#960000'}, // obstacle
            {x: 380, y: 440, width: 40, height: 20, color: '#960000'}, // obstacle
            {x: 700, y: 320, width: 80, height: 20, color: '#FFD700'}, // goal
        ],
        spawn: {x: 50, y: 500},
        goal: {x: 700, y: 320}
    },
    // Level 8 - Vertical maze
    {
        platforms: [
            {x: 0, y: 580, width: 800, height: 20, color: '#8B4513'}, // ground
            {x: 100, y: 480, width: 80, height: 20, color: '#009600'}, // platform
            {x: 250, y: 380, width: 80, height: 20, color: '#009600'}, // platform
            {x: 100, y: 280, width: 80, height: 20, color: '#009600'}, // platform
            {x: 400, y: 180, width: 80, height: 20, color: '#009600'}, // platform
            {x: 600, y: 280, width: 80, height: 20, color: '#009600'}, // platform
            {x: 450, y: 380, width: 80, height: 20, color: '#009600'}, // platform
            {x: 550, y: 480, width: 80, height: 20, color: '#009600'}, // platform
            {x: 150, y: 420, width: 40, height: 20, color: '#960000'}, // obstacle
            {x: 350, y: 320, width: 40, height: 20, color: '#960000'}, // obstacle
            {x: 500, y: 220, width: 40, height: 20, color: '#960000'}, // obstacle
            {x: 650, y: 220, width: 40, height: 20, color: '#960000'}, // obstacle
            {x: 700, y: 160, width: 80, height: 20, color: '#FFD700'}, // goal
        ],
        spawn: {x: 50, y: 500},
        goal: {x: 700, y: 160}
    },
    // Level 9 - Complex obstacle course
    {
        platforms: [
            {x: 0, y: 580, width: 100, height: 20, color: '#8B4513'}, // ground start
            {x: 150, y: 580, width: 50, height: 20, color: '#8B4513'}, // ground segment
            {x: 250, y: 580, width: 50, height: 20, color: '#8B4513'}, // ground segment
            {x: 350, y: 580, width: 50, height: 20, color: '#8B4513'}, // ground segment
            {x: 450, y: 580, width: 50, height: 20, color: '#8B4513'}, // ground segment
            {x: 550, y: 580, width: 250, height: 20, color: '#8B4513'}, // ground end
            {x: 120, y: 480, width: 60, height: 20, color: '#009600'}, // platform
            {x: 220, y: 400, width: 60, height: 20, color: '#009600'}, // platform
            {x: 320, y: 320, width: 60, height: 20, color: '#009600'}, // platform
            {x: 420, y: 240, width: 60, height: 20, color: '#009600'}, // platform
            {x: 520, y: 160, width: 60, height: 20, color: '#009600'}, // platform
            {x: 620, y: 240, width: 60, height: 20, color: '#009600'}, // platform
            {x: 720, y: 320, width: 60, height: 20, color: '#009600'}, // platform
            {x: 170, y: 520, width: 30, height: 20, color: '#960000'}, // obstacle
            {x: 270, y: 440, width: 30, height: 20, color: '#960000'}, // obstacle
            {x: 370, y: 360, width: 30, height: 20, color: '#960000'}, // obstacle
            {x: 470, y: 280, width: 30, height: 20, color: '#960000'}, // obstacle
            {x: 570, y: 200, width: 30, height: 20, color: '#960000'}, // obstacle
            {x: 670, y: 280, width: 30, height: 20, color: '#960000'}, // obstacle
            {x: 720, y: 120, width: 80, height: 20, color: '#FFD700'}, // goal
        ],
        spawn: {x: 50, y: 500},
        goal: {x: 720, y: 120}
    },
    // Level 10 - Final challenge
    {
        platforms: [
            {x: 0, y: 580, width: 80, height: 20, color: '#8B4513'}, // ground start
            {x: 120, y: 520, width: 40, height: 20, color: '#009600'}, // platform
            {x: 200, y: 460, width: 40, height: 20, color: '#009600'}, // platform
            {x: 280, y: 400, width: 40, height: 20, color: '#009600'}, // platform
            {x: 360, y: 340, width: 40, height: 20, color: '#009600'}, // platform
            {x: 440, y: 280, width: 40, height: 20, color: '#009600'}, // platform
            {x: 520, y: 220, width: 40, height: 20, color: '#009600'}, // platform
            {x: 600, y: 160, width: 40, height: 20, color: '#009600'}, // platform
            {x: 680, y: 100, width: 40, height: 20, color: '#009600'}, // platform
            {x: 600, y: 40, width: 40, height: 20, color: '#009600'}, // platform
            {x: 520, y: 100, width: 40, height: 20, color: '#009600'}, // platform
            {x: 440, y: 160, width: 40, height: 20, color: '#009600'}, // platform
            {x: 360, y: 220, width: 40, height: 20, color: '#009600'}, // platform
            {x: 280, y: 280, width: 40, height: 20, color: '#009600'}, // platform
            {x: 720, y: 580, width: 80, height: 20, color: '#8B4513'}, // ground end
            {x: 140, y: 560, width: 20, height: 20, color: '#960000'}, // obstacle
            {x: 220, y: 500, width: 20, height: 20, color: '#960000'}, // obstacle
            {x: 300, y: 440, width: 20, height: 20, color: '#960000'}, // obstacle
            {x: 380, y: 380, width: 20, height: 20, color: '#960000'}, // obstacle
            {x: 460, y: 320, width: 20, height: 20, color: '#960000'}, // obstacle
            {x: 540, y: 260, width: 20, height: 20, color: '#960000'}, // obstacle
            {x: 620, y: 200, width: 20, height: 20, color: '#960000'}, // obstacle
            {x: 700, y: 140, width: 20, height: 20, color: '#960000'}, // obstacle
            {x: 720, y: 20, width: 80, height: 20, color: '#FFD700'}, // goal at top
        ],
        spawn: {x: 40, y: 500},
        goal: {x: 720, y: 20}
    }
];

// Simple Canvas Game (fallback if p5.js doesn't work)
function createCanvasGame() {
    const canvas = document.createElement('canvas');
    
    // Calculate responsive canvas size
    function calculateCanvasSize() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const gamepadHeight = isMobile ? 160 : 0; // Reserve more space for gamepad on mobile
        
        const maxWidth = Math.min(800, window.innerWidth - 40); // 20px padding on each side
        const maxHeight = Math.min(600, window.innerHeight - 150 - gamepadHeight); // Leave space for controls and UI
        
        // Maintain aspect ratio (4:3)
        const aspectRatio = 4 / 3;
        let canvasWidth = maxWidth;
        let canvasHeight = canvasWidth / aspectRatio;
        
        if (canvasHeight > maxHeight) {
            canvasHeight = maxHeight;
            canvasWidth = canvasHeight * aspectRatio;
        }
        
        return { width: canvasWidth, height: canvasHeight };
    }
    
    const canvasSize = calculateCanvasSize();
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    canvas.style.border = '2px solid #333';
    canvas.style.borderRadius = '8px';
    canvas.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
    
    const container = document.getElementById('game-container');
    if (container) {
        container.appendChild(canvas);
    }
    
    const ctx = canvas.getContext('2d');
    
    // Scale factor for responsive design
    const scaleX = canvas.width / 800;
    const scaleY = canvas.height / 600;
    
    // Create virtual gamepad
    const gamepad = new VirtualGamepad();
    
    // Game state
    const game = {
        currentLevel: 0,
        levelComplete: false,
        showLevelComplete: false,
        player: {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            width: 20 * scaleX,
            height: 40 * scaleY,
            speed: 5 * scaleX,
            jumpPower: 12 * scaleY,
            onGround: false,
            facing: 1,
            jumpsRemaining: 2, // Allow double jump
            lastJumpKey: false // Track if jump key was pressed last frame
        },
        platforms: [],
        keys: {},
        frameCount: 0,
        scaleX: scaleX,
        scaleY: scaleY
    };
    
    // Load level function
    function loadLevel(levelIndex) {
        if (levelIndex >= LEVELS.length) {
            // Game completed
            return;
        }
        
        const level = LEVELS[levelIndex];
        game.platforms = level.platforms.map(p => ({
            x: p.x * scaleX,
            y: p.y * scaleY,
            width: p.width * scaleX,
            height: p.height * scaleY,
            color: p.color
        }));
        
        // Set player spawn position
        game.player.x = level.spawn.x * scaleX;
        game.player.y = level.spawn.y * scaleY;
        game.player.vx = 0;
        game.player.vy = 0;
        game.player.jumpsRemaining = 2; // Reset double jump
        game.player.lastJumpKey = false;
        game.levelComplete = false;
        game.showLevelComplete = false;
    }
    
    // Initialize first level
    loadLevel(0);
    
    // Input handling
    function handleKeyDown(e) {
        game.keys[e.key] = true;
        game.keys[e.code] = true;
        
        // Handle next level confirmation
        if ((e.key === 'Enter' || e.key === ' ') && game.showLevelComplete) {
            if (game.currentLevel < LEVELS.length - 1) {
                game.currentLevel++;
                loadLevel(game.currentLevel);
            } else {
                // Game completed - could restart or show final message
                game.currentLevel = 0;
                loadLevel(game.currentLevel);
            }
        }
        
        e.preventDefault();
    }
    
    function handleKeyUp(e) {
        game.keys[e.key] = false;
        game.keys[e.code] = false;
        e.preventDefault();
    }
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Add click handler for next level button
    canvas.addEventListener('click', (e) => {
        if (game.showLevelComplete) {
            const rect = canvas.getBoundingClientRect();
            const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
            const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);
            
            // Check if click is on button
            const buttonWidth = 200 * game.scaleX;
            const buttonHeight = 50 * game.scaleY;
            const buttonX = canvas.width/2 - buttonWidth/2;
            const buttonY = canvas.height/2 + 20 * game.scaleY;
            
            if (clickX >= buttonX && clickX <= buttonX + buttonWidth &&
                clickY >= buttonY && clickY <= buttonY + buttonHeight) {
                if (game.currentLevel < LEVELS.length - 1) {
                    game.currentLevel++;
                    loadLevel(game.currentLevel);
                } else {
                    game.currentLevel = 0;
                    loadLevel(game.currentLevel);
                }
            }
        }
    });
    
    // Game logic
    function updatePlayer() {
        const p = game.player;
        
        // Merge keyboard and gamepad inputs
        const gamepadKeys = gamepad.getKeys();
        const allKeys = { ...game.keys, ...gamepadKeys };
        
        // Handle input
        if (allKeys['ArrowLeft'] || allKeys['a'] || allKeys['A'] || allKeys['KeyA']) {
            p.vx = -p.speed;
            p.facing = -1;
        } else if (allKeys['ArrowRight'] || allKeys['d'] || allKeys['D'] || allKeys['KeyD']) {
            p.vx = p.speed;
            p.facing = 1;
        } else {
            p.vx *= 0.8; // friction
        }
        
        if ((allKeys['ArrowUp'] || allKeys['w'] || allKeys['W'] || allKeys['KeyW'] || allKeys[' ']) && p.onGround) {
            p.vy = -p.jumpPower;
            p.onGround = false;
        }
        
        // Double jump logic - check for new jump key press while in air
        const jumpKeyPressed = allKeys['ArrowUp'] || allKeys['w'] || allKeys['W'] || allKeys['KeyW'] || allKeys[' '];
        if (jumpKeyPressed && !p.lastJumpKey && !p.onGround && p.jumpsRemaining > 0) {
            p.vy = -p.jumpPower * 0.85; // Slightly weaker second jump
            p.jumpsRemaining--;
        }
        p.lastJumpKey = jumpKeyPressed;
        
        // Apply gravity
        p.vy += 0.5;
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Check collisions with platforms
        p.onGround = false;
        for (let platform of game.platforms) {
            if (p.x < platform.x + platform.width &&
                p.x + p.width > platform.x &&
                p.y < platform.y + platform.height &&
                p.y + p.height > platform.y) {
                
                // Simple and reliable collision detection
                const playerBottom = p.y + p.height;
                const playerTop = p.y;
                const playerLeft = p.x;
                const playerRight = p.x + p.width;
                
                const platformTop = platform.y;
                const platformBottom = platform.y + platform.height;
                const platformLeft = platform.x;
                const platformRight = platform.x + platform.width;                    // Vertical collisions (prioritize these)
                    if (p.vy > 0 && playerBottom > platformTop && playerTop < platformTop) {
                        // Landing on top
                        p.y = platformTop - p.height;
                        p.vy = 0;
                        p.onGround = true;
                        p.jumpsRemaining = 2; // Reset double jump when landing
                        
                        // Check if it's the goal platform (yellow)
                        if (platform.color === '#FFD700' && !game.levelComplete) {
                            game.levelComplete = true;
                            game.showLevelComplete = true;
                        }
                    } else if (p.vy < 0 && playerTop < platformBottom && playerBottom > platformBottom) {
                    // Hitting from below
                    p.y = platformBottom;
                    p.vy = 0;
                } else {
                    // Horizontal collisions
                    if (p.vx > 0 && playerRight > platformLeft && playerLeft < platformLeft) {
                        // Moving right, hit left side of platform
                        p.x = platformLeft - p.width;
                        p.vx = 0;
                    } else if (p.vx < 0 && playerLeft < platformRight && playerRight > platformRight) {
                        // Moving left, hit right side of platform
                        p.x = platformRight;
                        p.vx = 0;
                    }
                }
            }
        }
        
        // Keep player in bounds
        if (p.x < 0) p.x = 0;
        if (p.x > canvas.width - p.width) p.x = canvas.width - p.width;
        if (p.y > canvas.height) {
            // Respawn at level spawn point
            const level = LEVELS[game.currentLevel];
            p.x = level.spawn.x * game.scaleX;
            p.y = level.spawn.y * game.scaleY;
            p.vx = 0;
            p.vy = 0;
            p.jumpsRemaining = 2; // Reset double jump on respawn
            p.lastJumpKey = false;
        }
    }
    
    function drawStickman() {
        const p = game.player;
        ctx.save();
        ctx.translate(p.x + p.width/2, p.y);
        ctx.scale(p.facing, 1);
        
        // Draw stickman (scaled)
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3 * game.scaleX;
        ctx.lineCap = 'round';
        
        // Head
        ctx.fillStyle = '#FFDC80';
        ctx.beginPath();
        ctx.arc(0, 10 * game.scaleY, 8 * game.scaleX, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Body
        ctx.beginPath();
        ctx.moveTo(0, 18 * game.scaleY);
        ctx.lineTo(0, 30 * game.scaleY);
        ctx.stroke();
        
        // Arms (animated based on movement)
        let armSwing = Math.sin(game.frameCount * 0.3) * 0.3;
        ctx.beginPath();
        if (Math.abs(p.vx) > 0.1) {
            ctx.moveTo(0, 22 * game.scaleY);
            ctx.lineTo((-8 + armSwing * 8) * game.scaleX, 28 * game.scaleY);
            ctx.moveTo(0, 22 * game.scaleY);
            ctx.lineTo((8 - armSwing * 8) * game.scaleX, 28 * game.scaleY);
        } else {
            ctx.moveTo(0, 22 * game.scaleY);
            ctx.lineTo(-6 * game.scaleX, 28 * game.scaleY);
            ctx.moveTo(0, 22 * game.scaleY);
            ctx.lineTo(6 * game.scaleX, 28 * game.scaleY);
        }
        ctx.stroke();
        
        // Legs (animated based on movement)
        let legSwing = Math.sin(game.frameCount * 0.4) * 0.4;
        ctx.beginPath();
        if (Math.abs(p.vx) > 0.1 && p.onGround) {
            ctx.moveTo(0, 30 * game.scaleY);
            ctx.lineTo((-6 + legSwing * 6) * game.scaleX, 40 * game.scaleY);
            ctx.moveTo(0, 30 * game.scaleY);
            ctx.lineTo((6 - legSwing * 6) * game.scaleX, 40 * game.scaleY);
        } else {
            ctx.moveTo(0, 30 * game.scaleY);
            ctx.lineTo(-4 * game.scaleX, 40 * game.scaleY);
            ctx.moveTo(0, 30 * game.scaleY);
            ctx.lineTo(4 * game.scaleX, 40 * game.scaleY);
        }
        ctx.stroke();
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-3 * game.scaleX, 8 * game.scaleY, 1 * game.scaleX, 0, Math.PI * 2);
        ctx.arc(3 * game.scaleX, 8 * game.scaleY, 1 * game.scaleX, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    function drawPlatforms() {
        for (let platform of game.platforms) {
            ctx.fillStyle = platform.color;
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2 * game.scaleX;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        }
    }
    
    function draw() {
        // Clear canvas with sky blue background
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw level indicator
        ctx.fillStyle = '#000';
        ctx.font = `${Math.max(16, 20 * Math.min(game.scaleX, game.scaleY))}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillText(`Level ${game.currentLevel + 1}`, 10, 30);
        
        // Draw platforms
        drawPlatforms();
        
        // Update and draw player (only if level not complete)
        if (!game.levelComplete) {
            updatePlayer();
        }
        drawStickman();
        
        // Draw level completion message and button
        if (game.showLevelComplete) {
            // Semi-transparent overlay
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Level complete message
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3 * game.scaleX;
            const titleFontSize = Math.max(24, 36 * Math.min(game.scaleX, game.scaleY));
            ctx.font = `bold ${titleFontSize}px Arial`;
            ctx.textAlign = 'center';
            
            if (game.currentLevel < LEVELS.length - 1) {
                ctx.fillText('LEVEL COMPLETE!', canvas.width/2, canvas.height/2 - 40 * game.scaleY);
                ctx.strokeText('LEVEL COMPLETE!', canvas.width/2, canvas.height/2 - 40 * game.scaleY);
            } else {
                ctx.fillText('GAME COMPLETE!', canvas.width/2, canvas.height/2 - 40 * game.scaleY);
                ctx.strokeText('GAME COMPLETE!', canvas.width/2, canvas.height/2 - 40 * game.scaleY);
            }
            
            // Next level button
            const buttonWidth = 200 * game.scaleX;
            const buttonHeight = 50 * game.scaleY;
            const buttonX = canvas.width/2 - buttonWidth/2;
            const buttonY = canvas.height/2 + 20 * game.scaleY;
            
            ctx.fillStyle = '#4CAF50';
            ctx.strokeStyle = '#2E7D32';
            ctx.lineWidth = 3 * game.scaleX;
            ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
            ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
            
            // Button text
            ctx.fillStyle = 'white';
            const buttonFontSize = Math.max(16, 20 * Math.min(game.scaleX, game.scaleY));
            ctx.font = `bold ${buttonFontSize}px Arial`;
            const buttonText = game.currentLevel < LEVELS.length - 1 ? 'NEXT LEVEL' : 'RESTART GAME';
            ctx.fillText(buttonText, canvas.width/2, buttonY + buttonHeight/2 + 6 * game.scaleY);
            
            // Instructions
            ctx.fillStyle = '#FFF';
            const instructFontSize = Math.max(12, 16 * Math.min(game.scaleX, game.scaleY));
            ctx.font = `${instructFontSize}px Arial`;
            ctx.fillText('Press SPACE or ENTER to continue', canvas.width/2, buttonY + buttonHeight + 30 * game.scaleY);
            
            ctx.textAlign = 'left';
        }
        
        game.frameCount++;
        requestAnimationFrame(draw);
    }
    
    // Start the game loop
    draw();
    
    // Return cleanup function
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        gamepad.destroy(); // Clean up virtual gamepad
        if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
    };
}

// Try p5.js first, fallback to canvas
function createGame() {
    // Check if p5 is available
    if (typeof p5 !== 'undefined') {
        console.log('Using p5.js');
        
        // Create virtual gamepad for p5.js version too
        const gamepad = new VirtualGamepad();
        
        // Previous p5.js code here...
        const sketch = (p) => {
            let player;
            let platforms = [];
            let keys = {};
            let currentLevel = 0;
            let levelComplete = false;
            let showLevelComplete = false;
            
            // Load level function for p5.js
            function loadLevel(levelIndex) {
                if (levelIndex >= LEVELS.length) {
                    return;
                }
                
                const level = LEVELS[levelIndex];
                const scaleX = p.width / 800;
                const scaleY = p.height / 600;
                
                platforms = level.platforms.map(platform => 
                    new Platform(
                        platform.x * scaleX, 
                        platform.y * scaleY, 
                        platform.width * scaleX, 
                        platform.height * scaleY, 
                        platform.color === '#8B4513' ? [139, 69, 19] :
                        platform.color === '#009600' ? [0, 150, 0] :
                        platform.color === '#960000' ? [150, 0, 0] :
                        platform.color === '#FFD700' ? [255, 215, 0] : [100, 100, 100]
                    )
                );
                
                // Set player spawn position
                player.x = level.spawn.x * scaleX;
                player.y = level.spawn.y * scaleY;
                player.vx = 0;
                player.vy = 0;
                player.jumpsRemaining = 2; // Reset double jump
                player.lastJumpKey = false;
                levelComplete = false;
                showLevelComplete = false;
            }
            
            class Player {
                constructor(x, y, scaleX, scaleY) {
                    this.x = x;
                    this.y = y;
                    this.vx = 0;
                    this.vy = 0;
                    this.width = 20 * scaleX;
                    this.height = 40 * scaleY;
                    this.speed = 5 * scaleX;
                    this.jumpPower = 12 * scaleY;
                    this.onGround = false;
                    this.facing = 1;
                    this.scaleX = scaleX;
                    this.scaleY = scaleY;
                    this.jumpsRemaining = 2; // Allow double jump
                    this.lastJumpKey = false; // Track if jump key was pressed last frame
                }
                
                update() {
                    // Merge keyboard and gamepad inputs
                    const gamepadKeys = gamepad.getKeys();
                    const allKeys = { ...keys, ...gamepadKeys };
                    
                    if (allKeys['ArrowLeft'] || allKeys['a'] || allKeys['A']) {
                        this.vx = -this.speed;
                        this.facing = -1;
                    } else if (allKeys['ArrowRight'] || allKeys['d'] || allKeys['D']) {
                        this.vx = this.speed;
                        this.facing = 1;
                    } else {
                        this.vx *= 0.8;
                    }
                    
                    if ((allKeys['ArrowUp'] || allKeys['w'] || allKeys['W'] || allKeys[' ']) && this.onGround) {
                        this.vy = -this.jumpPower;
                        this.onGround = false;
                    }
                    
                    // Double jump logic - check for new jump key press while in air
                    const jumpKeyPressed = allKeys['ArrowUp'] || allKeys['w'] || allKeys['W'] || allKeys[' '];
                    if (jumpKeyPressed && !this.lastJumpKey && !this.onGround && this.jumpsRemaining > 0) {
                        this.vy = -this.jumpPower * 0.85; // Slightly weaker second jump
                        this.jumpsRemaining--;
                    }
                    this.lastJumpKey = jumpKeyPressed;
                    
                    // Apply gravity
                    this.vy += 0.5;
                    this.x += this.vx;
                    this.y += this.vy;
                    
                    this.onGround = false;
                    for (let platform of platforms) {
                        if (this.x < platform.x + platform.width &&
                            this.x + this.width > platform.x &&
                            this.y < platform.y + platform.height &&
                            this.y + this.height > platform.y) {
                            
                            // Simple and reliable collision detection
                            const playerBottom = this.y + this.height;
                            const playerTop = this.y;
                            const playerLeft = this.x;
                            const playerRight = this.x + this.width;
                            
                            const platformTop = platform.y;
                            const platformBottom = platform.y + platform.height;
                            const platformLeft = platform.x;
                            const platformRight = platform.x + platform.width;
                            
                            // Vertical collisions (prioritize these)
                            if (this.vy > 0 && playerBottom > platformTop && playerTop < platformTop) {
                                // Landing on top
                                this.y = platformTop - this.height;
                                this.vy = 0;
                                this.onGround = true;
                                this.jumpsRemaining = 2; // Reset double jump when landing
                                
                                // Check if it's the goal platform (yellow)
                                if (platform.color[0] === 255 && platform.color[1] === 215 && platform.color[2] === 0 && !levelComplete) {
                                    levelComplete = true;
                                    showLevelComplete = true;
                                }
                            } else if (this.vy < 0 && playerTop < platformBottom && playerBottom > platformBottom) {
                                // Hitting from below
                                this.y = platformBottom;
                                this.vy = 0;
                            } else {
                                // Horizontal collisions
                                if (this.vx > 0 && playerRight > platformLeft && playerLeft < platformLeft) {
                                    // Moving right, hit left side of platform
                                    this.x = platformLeft - this.width;
                                    this.vx = 0;
                                } else if (this.vx < 0 && playerLeft < platformRight && playerRight > platformRight) {
                                    // Moving left, hit right side of platform
                                    this.x = platformRight;
                                    this.vx = 0;
                                }
                            }
                        }
                    }
                    
                    if (this.x < 0) this.x = 0;
                    if (this.x > p.width - this.width) this.x = p.width - this.width;
                    if (this.y > p.height) {
                        // Respawn at level spawn point
                        const level = LEVELS[currentLevel];
                        const scaleX = p.width / 800;
                        const scaleY = p.height / 600;
                        this.x = level.spawn.x * scaleX;
                        this.y = level.spawn.y * scaleY;
                        this.vx = 0;
                        this.vy = 0;
                        this.jumpsRemaining = 2; // Reset double jump on respawn
                        this.lastJumpKey = false;
                    }
                }
                
                draw() {
                    p.push();
                    p.translate(this.x + this.width/2, this.y);
                    p.scale(this.facing, 1);
                    
                    p.stroke(0);
                    p.strokeWeight(3 * this.scaleX);
                    
                    p.fill(255, 220, 177);
                    p.circle(0, 10 * this.scaleY, 16 * this.scaleX);
                    
                    p.line(0, 18 * this.scaleY, 0, 30 * this.scaleY);
                    
                    let armSwing = p.sin(p.frameCount * 0.3) * 0.3;
                    if (p.abs(this.vx) > 0.1) {
                        p.line(0, 22 * this.scaleY, (-8 + armSwing * 8) * this.scaleX, 28 * this.scaleY);
                        p.line(0, 22 * this.scaleY, (8 - armSwing * 8) * this.scaleX, 28 * this.scaleY);
                    } else {
                        p.line(0, 22 * this.scaleY, -6 * this.scaleX, 28 * this.scaleY);
                        p.line(0, 22 * this.scaleY, 6 * this.scaleX, 28 * this.scaleY);
                    }
                    
                    let legSwing = p.sin(p.frameCount * 0.4) * 0.4;
                    if (p.abs(this.vx) > 0.1 && this.onGround) {
                        p.line(0, 30 * this.scaleY, (-6 + legSwing * 6) * this.scaleX, 40 * this.scaleY);
                        p.line(0, 30 * this.scaleY, (6 - legSwing * 6) * this.scaleX, 40 * this.scaleY);
                    } else {
                        p.line(0, 30 * this.scaleY, -4 * this.scaleX, 40 * this.scaleY);
                        p.line(0, 30 * this.scaleY, 4 * this.scaleX, 40 * this.scaleY);
                    }
                    
                    p.fill(0);
                    p.noStroke();
                    p.circle(-3 * this.scaleX, 8 * this.scaleY, 2 * this.scaleX);
                    p.circle(3 * this.scaleX, 8 * this.scaleY, 2 * this.scaleX);
                    
                    p.pop();
                }
            }
            
            class Platform {
                constructor(x, y, width, height, color = [100, 100, 100]) {
                    this.x = x;
                    this.y = y;
                    this.width = width;
                    this.height = height;
                    this.color = color;
                }
                
                draw() {
                    p.fill(this.color);
                    p.stroke(0);
                    p.strokeWeight(2);
                    p.rect(this.x, this.y, this.width, this.height);
                }
            }
            
            p.setup = () => {
                // Calculate responsive canvas size
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const gamepadHeight = isMobile ? 160 : 0; // Reserve more space for gamepad on mobile
                
                const maxWidth = Math.min(800, window.innerWidth - 40);
                const maxHeight = Math.min(600, window.innerHeight - 150 - gamepadHeight);
                
                const aspectRatio = 4 / 3;
                let canvasWidth = maxWidth;
                let canvasHeight = canvasWidth / aspectRatio;
                
                if (canvasHeight > maxHeight) {
                    canvasHeight = maxHeight;
                    canvasWidth = canvasHeight * aspectRatio;
                }
                
                p.createCanvas(canvasWidth, canvasHeight);
                
                // Scale factors
                const scaleX = canvasWidth / 800;
                const scaleY = canvasHeight / 600;
                
                player = new Player(0, 0, scaleX, scaleY);
                
                // Load first level
                loadLevel(0);
                
                // Store scale factors globally for p5.js version
                window.p5ScaleX = scaleX;
                window.p5ScaleY = scaleY;
            };
            
            p.draw = () => {
                p.background(135, 206, 235);
                
                // Draw level indicator
                p.fill(0);
                p.textAlign(p.LEFT);
                p.textSize(Math.max(16, 20 * Math.min(p.width/800, p.height/600)));
                p.text(`Level ${currentLevel + 1}`, 10, 30);
                
                for (let platform of platforms) {
                    platform.draw();
                }
                
                // Update and draw player (only if level not complete)
                if (!levelComplete) {
                    player.update();
                }
                player.draw();
                
                // Draw level completion message and button
                if (showLevelComplete) {
                    // Semi-transparent overlay
                    p.fill(0, 0, 0, 180);
                    p.rect(0, 0, p.width, p.height);
                    
                    // Level complete message
                    p.fill(255, 215, 0);
                    p.stroke(0);
                    p.strokeWeight(3);
                    p.textAlign(p.CENTER);
                    const titleFontSize = Math.max(24, 36 * Math.min(p.width/800, p.height/600));
                    p.textSize(titleFontSize);
                    
                    if (currentLevel < LEVELS.length - 1) {
                        p.text('LEVEL COMPLETE!', p.width/2, p.height/2 - 40);
                    } else {
                        p.text('GAME COMPLETE!', p.width/2, p.height/2 - 40);
                    }
                    
                    // Next level button
                    const buttonWidth = 200 * (p.width/800);
                    const buttonHeight = 50 * (p.height/600);
                    const buttonX = p.width/2 - buttonWidth/2;
                    const buttonY = p.height/2 + 20;
                    
                    p.fill(76, 175, 80);
                    p.stroke(46, 125, 50);
                    p.strokeWeight(3);
                    p.rect(buttonX, buttonY, buttonWidth, buttonHeight);
                    
                    // Button text
                    p.fill(255);
                    p.noStroke();
                    const buttonFontSize = Math.max(16, 20 * Math.min(p.width/800, p.height/600));
                    p.textSize(buttonFontSize);
                    const buttonText = currentLevel < LEVELS.length - 1 ? 'NEXT LEVEL' : 'RESTART GAME';
                    p.text(buttonText, p.width/2, buttonY + buttonHeight/2 + 6);
                    
                    // Instructions
                    const instructFontSize = Math.max(12, 16 * Math.min(p.width/800, p.height/600));
                    p.textSize(instructFontSize);
                    p.text('Press SPACE or ENTER to continue', p.width/2, buttonY + buttonHeight + 30);
                    p.text('or tap the button on mobile', p.width/2, buttonY + buttonHeight + 50);
                }
            };
            
            p.keyPressed = () => {
                keys[p.key] = true;
                keys[p.keyCode] = true;
                
                // Handle next level confirmation
                if ((p.key === 'Enter' || p.key === ' ') && showLevelComplete) {
                    if (currentLevel < LEVELS.length - 1) {
                        currentLevel++;
                        loadLevel(currentLevel);
                    } else {
                        currentLevel = 0;
                        loadLevel(currentLevel);
                    }
                }
            };
            
            p.keyReleased = () => {
                keys[p.key] = false;
                keys[p.keyCode] = false;
            };
            
            p.mousePressed = () => {
                if (showLevelComplete) {
                    // Check if click is on button
                    const buttonWidth = 200 * (p.width/800);
                    const buttonHeight = 50 * (p.height/600);
                    const buttonX = p.width/2 - buttonWidth/2;
                    const buttonY = p.height/2 + 20;
                    
                    if (p.mouseX >= buttonX && p.mouseX <= buttonX + buttonWidth &&
                        p.mouseY >= buttonY && p.mouseY <= buttonY + buttonHeight) {
                        if (currentLevel < LEVELS.length - 1) {
                            currentLevel++;
                            loadLevel(currentLevel);
                        } else {
                            currentLevel = 0;
                            loadLevel(currentLevel);
                        }
                    }
                }
            };
        };
        
        const p5Instance = new p5(sketch, 'game-container');
        
        // Return object with cleanup function that includes gamepad
        return {
            remove: () => {
                gamepad.destroy();
                p5Instance.remove();
            }
        };
    } else {
        console.log('p5.js not available, using Canvas fallback');
        return createCanvasGame();
    }
}

class VirtualGamepad {
    constructor() {
        this.keys = {};
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.touchStartTime = 0;
        this.createGamepad();
    }
    
    createGamepad() {
        if (!this.isMobile) return;
        
        // Create gamepad container
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 0;
            right: 0;
            height: 130px;
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 20px;
            pointer-events: none;
        `;
        
        // Left side - D-pad
        this.createDPad();
        
        // Right side - Action buttons
        this.createActionButtons();
        
        document.body.appendChild(this.container);
    }
    
    createDPad() {
        const dpadContainer = document.createElement('div');
        dpadContainer.style.cssText = `
            position: relative;
            width: 100px;
            height: 100px;
            pointer-events: auto;
        `;
        
        // D-pad center
        const center = document.createElement('div');
        center.style.cssText = `
            position: absolute;
            top: 33px;
            left: 33px;
            width: 34px;
            height: 34px;
            background: rgba(0,0,0,0.3);
            border-radius: 50%;
        `;
        
        // Left arrow
        const leftBtn = this.createDPadButton('◀', '0px', '33px', 'ArrowLeft');
        // Right arrow  
        const rightBtn = this.createDPadButton('▶', '66px', '33px', 'ArrowRight');
        // Up arrow
        const upBtn = this.createDPadButton('▲', '33px', '0px', 'ArrowUp');
        
        dpadContainer.appendChild(center);
        dpadContainer.appendChild(leftBtn);
        dpadContainer.appendChild(rightBtn);
        dpadContainer.appendChild(upBtn);
        
        this.container.appendChild(dpadContainer);
    }
    
    createDPadButton(symbol, left, top, key) {
        const btn = document.createElement('div');
        btn.style.cssText = `
            position: absolute;
            left: ${left};
            top: ${top};
            width: 34px;
            height: 34px;
            background: rgba(255,255,255,0.8);
            border: 2px solid rgba(0,0,0,0.3);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
            user-select: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.1s;
        `;
        btn.textContent = symbol;
        
        // Touch events
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            btn.style.background = 'rgba(100,150,255,0.8)';
            btn.style.transform = 'scale(0.95)';
            this.keys[key] = true;
        });
        
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            btn.style.background = 'rgba(255,255,255,0.8)';
            btn.style.transform = 'scale(1)';
            this.keys[key] = false;
        });
        
        return btn;
    }
    
    createActionButtons() {
        const actionContainer = document.createElement('div');
        actionContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: auto;
        `;
        
        // Jump button (primary)
        const jumpBtn = document.createElement('div');
        jumpBtn.style.cssText = `
            width: 60px;
            height: 60px;
            background: rgba(0,200,0,0.8);
            border: 3px solid rgba(0,0,0,0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: bold;
            color: white;
            user-select: none;
            box-shadow: 0 3px 6px rgba(0,0,0,0.3);
            transition: all 0.1s;
        `;
        jumpBtn.textContent = '🦘';
        
        // Jump button events
        jumpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            jumpBtn.style.background = 'rgba(0,255,0,0.9)';
            jumpBtn.style.transform = 'scale(0.9)';
            this.keys['ArrowUp'] = true;
            this.keys[' '] = true;
            this.keys['Enter'] = true; // Also trigger Enter for level completion
        });
        
        jumpBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            jumpBtn.style.background = 'rgba(0,200,0,0.8)';
            jumpBtn.style.transform = 'scale(1)';
            this.keys['ArrowUp'] = false;
            this.keys[' '] = false;
            this.keys['Enter'] = false;
        });
        
        actionContainer.appendChild(jumpBtn);
        this.container.appendChild(actionContainer);
    }
    
    getKeys() {
        return this.keys;
    }
    
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

function App() {
    const gameRef = React.useRef(null);
    const cleanupRef = React.useRef(null);
    
    React.useEffect(() => {
        document.title = "test game 001";
        
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
            // Create the game when component mounts
            if (!gameRef.current) {
                console.log('Creating game...');
                cleanupRef.current = createGame();
                gameRef.current = true;
            }
        }, 100);
        
        // Cleanup function to remove the game when component unmounts
        return () => {
            if (cleanupRef.current) {
                if (typeof cleanupRef.current === 'function') {
                    cleanupRef.current(); // Canvas cleanup
                } else if (cleanupRef.current.remove) {
                    cleanupRef.current.remove(); // p5.js cleanup
                }
                cleanupRef.current = null;
                gameRef.current = null;
            }
        };
    }, []);

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: isMobile ? 'flex-start' : 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif',
            padding: isMobile ? '10px 10px 160px 10px' : '10px', // Extra bottom padding on mobile for gamepad
            boxSizing: 'border-box'
        }}>
            <div id="game-container" style={{
                border: '2px solid #333',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                maxWidth: '100%',
                maxHeight: isMobile ? 'calc(100vh - 200px)' : '90vh', // Account for gamepad space on mobile
                overflow: 'hidden',
                marginTop: isMobile ? '20px' : '0'
            }}></div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
