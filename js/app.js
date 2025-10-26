// Simple Canvas Game (fallback if p5.js doesn't work)
function createCanvasGame() {
    const canvas = document.createElement('canvas');
    
    // Calculate responsive canvas size
    function calculateCanvasSize() {
        const maxWidth = Math.min(800, window.innerWidth - 40); // 20px padding on each side
        const maxHeight = Math.min(600, window.innerHeight - 200); // Leave space for controls and UI
        
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
        player: {
            x: 50 * scaleX,
            y: 100 * scaleY,
            vx: 0,
            vy: 0,
            width: 20 * scaleX,
            height: 40 * scaleY,
            speed: 5 * scaleX,
            jumpPower: 12 * scaleY,
            onGround: false,
            facing: 1
        },
        platforms: [
            {x: 0, y: canvas.height - 20 * scaleY, width: canvas.width, height: 20 * scaleY, color: '#8B4513'}, // ground
            {x: 150 * scaleX, y: canvas.height - 80 * scaleY, width: 100 * scaleX, height: 20 * scaleY, color: '#009600'}, // first platform
            {x: 300 * scaleX, y: canvas.height - 140 * scaleY, width: 80 * scaleX, height: 20 * scaleY, color: '#009600'}, // second platform
            {x: 450 * scaleX, y: canvas.height - 200 * scaleY, width: 100 * scaleX, height: 20 * scaleY, color: '#009600'}, // third platform
            {x: 600 * scaleX, y: canvas.height - 120 * scaleY, width: 80 * scaleX, height: 20 * scaleY, color: '#009600'}, // fourth platform
            {x: 200 * scaleX, y: canvas.height - 180 * scaleY, width: 60 * scaleX, height: 20 * scaleY, color: '#960000'}, // red obstacle
            {x: 380 * scaleX, y: canvas.height - 260 * scaleY, width: 60 * scaleX, height: 20 * scaleY, color: '#960000'}, // red obstacle
            {x: 700 * scaleX, y: canvas.height - 180 * scaleY, width: 80 * scaleX, height: 20 * scaleY, color: '#FFD700'}, // goal platform
        ],
        keys: {},
        frameCount: 0,
        scaleX: scaleX,
        scaleY: scaleY
    };
    
    // Input handling
    function handleKeyDown(e) {
        game.keys[e.key] = true;
        game.keys[e.code] = true;
        e.preventDefault();
    }
    
    function handleKeyUp(e) {
        game.keys[e.key] = false;
        game.keys[e.code] = false;
        e.preventDefault();
    }
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
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
        
        // Apply gravity
        p.vy += 0.5 * game.scaleY;
        
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
                
                // Landing on top
                if (p.vy > 0 && p.y < platform.y) {
                    p.y = platform.y - p.height;
                    p.vy = 0;
                    p.onGround = true;
                }
                // Hitting from below
                else if (p.vy < 0 && p.y > platform.y) {
                    p.y = platform.y + platform.height;
                    p.vy = 0;
                }
                // Hitting from sides
                else if (p.vx > 0) {
                    p.x = platform.x - p.width;
                    p.vx = 0;
                } else if (p.vx < 0) {
                    p.x = platform.x + platform.width;
                    p.vx = 0;
                }
            }
        }
        
        // Keep player in bounds
        if (p.x < 0) p.x = 0;
        if (p.x > canvas.width - p.width) p.x = canvas.width - p.width;
        if (p.y > canvas.height) {
            // Respawn
            p.x = 50 * game.scaleX;
            p.y = 100 * game.scaleY;
            p.vx = 0;
            p.vy = 0;
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
        
        // Draw platforms
        drawPlatforms();
        
        // Update and draw player
        updatePlayer();
        drawStickman();
        
        // Draw goal message if player reaches the end
        if (game.player.x > 700 * game.scaleX && game.player.y < canvas.height - 200 * game.scaleY) {
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2 * game.scaleX;
            const goalFontSize = Math.max(20, 32 * Math.min(game.scaleX, game.scaleY));
            ctx.font = `${goalFontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('GOAL REACHED!', canvas.width/2, canvas.height/2);
            ctx.strokeText('GOAL REACHED!', canvas.width/2, canvas.height/2);
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
            
            class Player {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.vx = 0;
                    this.vy = 0;
                    this.width = 20;
                    this.height = 40;
                    this.speed = 5;
                    this.jumpPower = 12;
                    this.onGround = false;
                    this.facing = 1;
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
                    
                    // Use scaled gravity
                    this.vy += 0.5 * (window.p5ScaleY || 1);
                    this.x += this.vx;
                    this.y += this.vy;
                    
                    this.onGround = false;
                    for (let platform of platforms) {
                        if (this.x < platform.x + platform.width &&
                            this.x + this.width > platform.x &&
                            this.y < platform.y + platform.height &&
                            this.y + this.height > platform.y) {
                            
                            if (this.vy > 0 && this.y < platform.y) {
                                this.y = platform.y - this.height;
                                this.vy = 0;
                                this.onGround = true;
                            }
                        }
                    }
                    
                    if (this.x < 0) this.x = 0;
                    if (this.x > p.width - this.width) this.x = p.width - this.width;
                    if (this.y > p.height) {
                        // Use scaled respawn position
                        this.x = 50 * (window.p5ScaleX || 1);
                        this.y = 100 * (window.p5ScaleY || 1);
                        this.vx = 0;
                        this.vy = 0;
                    }
                }
                
                draw() {
                    p.push();
                    p.translate(this.x + this.width/2, this.y);
                    p.scale(this.facing, 1);
                    
                    p.stroke(0);
                    p.strokeWeight(3);
                    
                    p.fill(255, 220, 177);
                    p.circle(0, 10, 16);
                    
                    p.line(0, 18, 0, 30);
                    
                    let armSwing = p.sin(p.frameCount * 0.3) * 0.3;
                    if (p.abs(this.vx) > 0.1) {
                        p.line(0, 22, -8 + armSwing * 8, 28);
                        p.line(0, 22, 8 - armSwing * 8, 28);
                    } else {
                        p.line(0, 22, -6, 28);
                        p.line(0, 22, 6, 28);
                    }
                    
                    let legSwing = p.sin(p.frameCount * 0.4) * 0.4;
                    if (p.abs(this.vx) > 0.1 && this.onGround) {
                        p.line(0, 30, -6 + legSwing * 6, 40);
                        p.line(0, 30, 6 - legSwing * 6, 40);
                    } else {
                        p.line(0, 30, -4, 40);
                        p.line(0, 30, 4, 40);
                    }
                    
                    p.fill(0);
                    p.noStroke();
                    p.circle(-3, 8, 2);
                    p.circle(3, 8, 2);
                    
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
                const maxWidth = Math.min(800, window.innerWidth - 40);
                const maxHeight = Math.min(600, window.innerHeight - 200);
                
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
                
                player = new Player(50 * scaleX, 100 * scaleY);
                player.width = 20 * scaleX;
                player.height = 40 * scaleY;
                player.speed = 5 * scaleX;
                player.jumpPower = 12 * scaleY;
                
                platforms = [
                    new Platform(0, p.height - 20 * scaleY, p.width, 20 * scaleY, [139, 69, 19]),
                    new Platform(150 * scaleX, p.height - 80 * scaleY, 100 * scaleX, 20 * scaleY, [0, 150, 0]),
                    new Platform(300 * scaleX, p.height - 140 * scaleY, 80 * scaleX, 20 * scaleY, [0, 150, 0]),
                    new Platform(450 * scaleX, p.height - 200 * scaleY, 100 * scaleX, 20 * scaleY, [0, 150, 0]),
                    new Platform(600 * scaleX, p.height - 120 * scaleY, 80 * scaleX, 20 * scaleY, [0, 150, 0]),
                    new Platform(700 * scaleX, p.height - 180 * scaleY, 80 * scaleX, 20 * scaleY, [255, 215, 0]),
                ];
                
                // Store scale factors globally for p5.js version
                window.p5ScaleX = scaleX;
                window.p5ScaleY = scaleY;
            };
            
            p.draw = () => {
                p.background(135, 206, 235);
                
                for (let platform of platforms) {
                    platform.draw();
                }
                
                player.update();
                player.draw();
            };
            
            p.keyPressed = () => {
                keys[p.key] = true;
                keys[p.keyCode] = true;
            };
            
            p.keyReleased = () => {
                keys[p.key] = false;
                keys[p.keyCode] = false;
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
            bottom: 20px;
            left: 0;
            right: 0;
            height: 120px;
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
        });
        
        jumpBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            jumpBtn.style.background = 'rgba(0,200,0,0.8)';
            jumpBtn.style.transform = 'scale(1)';
            this.keys['ArrowUp'] = false;
            this.keys[' '] = false;
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

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif',
            padding: '10px',
            boxSizing: 'border-box'
        }}>
            <div id="game-container" style={{
                border: '2px solid #333',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                maxWidth: '100%',
                maxHeight: '90vh',
                overflow: 'hidden'
            }}></div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
