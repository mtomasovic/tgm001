// Simple Canvas Game (fallback if p5.js doesn't work)
function createCanvasGame() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    canvas.style.border = '2px solid #333';
    canvas.style.borderRadius = '8px';
    canvas.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    
    const container = document.getElementById('game-container');
    if (container) {
        container.appendChild(canvas);
    }
    
    const ctx = canvas.getContext('2d');
    
    // Game state
    const game = {
        player: {
            x: 50,
            y: 100,
            vx: 0,
            vy: 0,
            width: 20,
            height: 40,
            speed: 5,
            jumpPower: 12,
            onGround: false,
            facing: 1
        },
        platforms: [
            {x: 0, y: 580, width: 800, height: 20, color: '#8B4513'}, // ground
            {x: 150, y: 520, width: 100, height: 20, color: '#009600'}, // first platform
            {x: 300, y: 460, width: 80, height: 20, color: '#009600'}, // second platform
            {x: 450, y: 400, width: 100, height: 20, color: '#009600'}, // third platform
            {x: 600, y: 480, width: 80, height: 20, color: '#009600'}, // fourth platform
            {x: 200, y: 420, width: 60, height: 20, color: '#960000'}, // red obstacle
            {x: 380, y: 340, width: 60, height: 20, color: '#960000'}, // red obstacle
            {x: 700, y: 420, width: 80, height: 20, color: '#FFD700'}, // goal platform
        ],
        keys: {},
        frameCount: 0
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
        
        // Handle input
        if (game.keys['ArrowLeft'] || game.keys['a'] || game.keys['A'] || game.keys['KeyA']) {
            p.vx = -p.speed;
            p.facing = -1;
        } else if (game.keys['ArrowRight'] || game.keys['d'] || game.keys['D'] || game.keys['KeyD']) {
            p.vx = p.speed;
            p.facing = 1;
        } else {
            p.vx *= 0.8; // friction
        }
        
        if ((game.keys['ArrowUp'] || game.keys['w'] || game.keys['W'] || game.keys['KeyW'] || game.keys[' ']) && p.onGround) {
            p.vy = -p.jumpPower;
            p.onGround = false;
        }
        
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
            p.x = 50;
            p.y = 100;
            p.vx = 0;
            p.vy = 0;
        }
    }
    
    function drawStickman() {
        const p = game.player;
        ctx.save();
        ctx.translate(p.x + p.width/2, p.y);
        ctx.scale(p.facing, 1);
        
        // Draw stickman
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // Head
        ctx.fillStyle = '#FFDC80';
        ctx.beginPath();
        ctx.arc(0, 10, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Body
        ctx.beginPath();
        ctx.moveTo(0, 18);
        ctx.lineTo(0, 30);
        ctx.stroke();
        
        // Arms (animated based on movement)
        let armSwing = Math.sin(game.frameCount * 0.3) * 0.3;
        ctx.beginPath();
        if (Math.abs(p.vx) > 0.1) {
            ctx.moveTo(0, 22);
            ctx.lineTo(-8 + armSwing * 8, 28);
            ctx.moveTo(0, 22);
            ctx.lineTo(8 - armSwing * 8, 28);
        } else {
            ctx.moveTo(0, 22);
            ctx.lineTo(-6, 28);
            ctx.moveTo(0, 22);
            ctx.lineTo(6, 28);
        }
        ctx.stroke();
        
        // Legs (animated based on movement)
        let legSwing = Math.sin(game.frameCount * 0.4) * 0.4;
        ctx.beginPath();
        if (Math.abs(p.vx) > 0.1 && p.onGround) {
            ctx.moveTo(0, 30);
            ctx.lineTo(-6 + legSwing * 6, 40);
            ctx.moveTo(0, 30);
            ctx.lineTo(6 - legSwing * 6, 40);
        } else {
            ctx.moveTo(0, 30);
            ctx.lineTo(-4, 40);
            ctx.moveTo(0, 30);
            ctx.lineTo(4, 40);
        }
        ctx.stroke();
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-3, 8, 1, 0, Math.PI * 2);
        ctx.arc(3, 8, 1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    function drawPlatforms() {
        for (let platform of game.platforms) {
            ctx.fillStyle = platform.color;
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
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
        
        // Draw instructions
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.fillText('Use ARROW KEYS or WASD to move and jump!', 10, 30);
        ctx.fillText('Navigate the obstacle course to reach the golden platform!', 10, 50);
        
        // Draw goal message if player reaches the end
        if (game.player.x > 700 && game.player.y < canvas.height - 200) {
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.font = '32px Arial';
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
                    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
                        this.vx = -this.speed;
                        this.facing = -1;
                    } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
                        this.vx = this.speed;
                        this.facing = 1;
                    } else {
                        this.vx *= 0.8;
                    }
                    
                    if ((keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' ']) && this.onGround) {
                        this.vy = -this.jumpPower;
                        this.onGround = false;
                    }
                    
                    this.vy += 0.5;
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
                        this.x = 50;
                        this.y = 100;
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
                p.createCanvas(800, 600);
                player = new Player(50, 100);
                platforms = [
                    new Platform(0, p.height - 20, p.width, 20, [139, 69, 19]),
                    new Platform(150, p.height - 80, 100, 20, [0, 150, 0]),
                    new Platform(300, p.height - 140, 80, 20, [0, 150, 0]),
                    new Platform(450, p.height - 200, 100, 20, [0, 150, 0]),
                    new Platform(600, p.height - 120, 80, 20, [0, 150, 0]),
                    new Platform(700, p.height - 180, 80, 20, [255, 215, 0]),
                ];
            };
            
            p.draw = () => {
                p.background(135, 206, 235);
                
                for (let platform of platforms) {
                    platform.draw();
                }
                
                player.update();
                player.draw();
                
                p.fill(0);
                p.textSize(16);
                p.text('Use ARROW KEYS or WASD to move and jump!', 10, 30);
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
        
        return new p5(sketch, 'game-container');
    } else {
        console.log('p5.js not available, using Canvas fallback');
        return createCanvasGame();
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
            padding: '20px'
        }}>
            <h1 style={{ 
                fontSize: '36px', 
                color: '#333',
                textAlign: 'center',
                marginBottom: '20px'
            }}>
                Stickman Platformer
            </h1>
            <div id="game-container" style={{
                border: '2px solid #333',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}></div>
            <div style={{
                marginTop: '20px',
                textAlign: 'center',
                maxWidth: '600px'
            }}>
                <h3>Controls:</h3>
                <p>🏃‍♂️ Move: Arrow Keys or A/D</p>
                <p>🦘 Jump: Up Arrow, W, or Spacebar</p>
                <p>🎯 Goal: Reach the golden platform!</p>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
