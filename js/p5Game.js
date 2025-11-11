// p5.js Game Implementation
// This file contains the p5.js-based game implementation

function createP5Game() {
    // Reset level generation state when creating a new game
    if (typeof resetLevelGeneration === 'function') {
        resetLevelGeneration();
    }
    
    // Create virtual gamepad for p5.js version too
    const gamepad = new VirtualGamepad();
    
    const sketch = (p) => {
        let player;
        let platforms = [];
        let keys = {};
        let currentLevel = 1; // Start at level 1
        let levelComplete = false;
        let showLevelComplete = false;
        let goal = {x: 0, y: 0, width: 0, height: 0}; // Current level goal
        let spawn = {x: 0, y: 0}; // Current level spawn point
        
        // Load level function for p5.js
        function loadLevel(levelNumber) {
            // Generate level using the procedural generator
            const level = generateLevel(levelNumber);
            const scaleX = p.width / 800;
            const scaleY = p.height / 600;
            
            platforms = level.platforms.map(platform => 
                new P5Platform(
                    platform.x * scaleX, 
                    platform.y * scaleY, 
                    platform.width * scaleX, 
                    platform.height * scaleY, 
                    platform.color === '#8B4513' ? [139, 69, 19] :     // Brown (ground)
                    platform.color === '#009600' ? [0, 150, 0] :       // Green (normal)
                    platform.color === '#960000' ? [150, 0, 0] :       // Dark red (obstacle)
                    platform.color === '#FFD700' ? [255, 215, 0] :     // Gold (goal)
                    platform.color === '#FF0000' ? [255, 0, 0] :       // Red (death trap)
                    platform.color === '#00FFFF' ? [0, 255, 255] :     // Cyan (moving)
                    platform.color === '#006600' ? [0, 102, 0] :       // Dark green (secret)
                    platform.color === '#00FF00' ? [0, 255, 0] :       // Bright green (bonus)
                    [100, 100, 100],                                   // Default gray
                    platform.isMoving || false,                        // Pass moving flag
                    platform.moveSpeed || 0,
                    platform.moveDirection || 1,
                    platform.moveRange || 0,
                    platform.originalX || platform.x * scaleX
                )
            );
            
            // Set goal position
            goal = {
                x: level.goal.x * scaleX,
                y: level.goal.y * scaleY,
                width: 40 * scaleX,
                height: 40 * scaleY
            };
            
            // Set spawn position
            spawn = {
                x: level.spawn.x * scaleX,
                y: level.spawn.y * scaleY
            };
            
            // Set player spawn position
            player.x = spawn.x;
            player.y = spawn.y;
            player.vx = 0;
            player.vy = 0;
            player.jumpsRemaining = 2; // Reset double jump
            player.lastJumpKey = false;
            levelComplete = false;
            showLevelComplete = false;
        }
        
        class P5Player {
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
                
                // Apply gravity (scaled for consistency)
                this.vy += 0.5 * this.scaleY;
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
                            
                            // Check if it's a death trap platform (red)
                            if (platform.color[0] === 255 && platform.color[1] === 0 && platform.color[2] === 0) {
                                // Respawn at level spawn point
                                this.x = spawn.x;
                                this.y = spawn.y;
                                this.vx = 0;
                                this.vy = 0;
                                this.jumpsRemaining = 2;
                                this.lastJumpKey = false;
                                return; // Exit collision detection early
                            }
                            
                            // Bonus platforms give double jump boost (bright green)
                            if (platform.color[0] === 0 && platform.color[1] === 255 && platform.color[2] === 0) {
                                this.jumpsRemaining = 3; // Extra jump
                            }
                        } else if (this.vy < 0 && playerTop < platformBottom && this.y + this.height > platformBottom) {
                            // Hitting from below
                            this.y = platformBottom;
                            this.vy = 0;
                        } else {
                            // Horizontal collisions
                            if (this.vx > 0 && this.x + this.width > platformLeft && this.x < platformLeft) {
                                // Moving right, hit left side of platform
                                this.x = platformLeft - this.width;
                                this.vx = 0;
                            } else if (this.vx < 0 && this.x < platformRight && this.x + this.width > platformRight) {
                                // Moving left, hit right side of platform
                                this.x = platformRight;
                                this.vx = 0;
                            }
                        }
                    }
                }
                
                // Handle player riding on moving platforms
                for (let platform of platforms) {
                    if (platform.isMoving && this.onGround &&
                        this.x < platform.x + platform.width &&
                        this.x + this.width > platform.x &&
                        this.y + this.height >= platform.y &&
                        this.y + this.height <= platform.y + 5) {
                        this.x += platform.moveSpeed * platform.moveDirection;
                        // Keep player in bounds when riding platforms
                        if (this.x < 0) this.x = 0;
                        if (this.x > p.width - this.width) this.x = p.width - this.width;
                    }
                }
                
                if (this.x < 0) this.x = 0;
                if (this.x > p.width - this.width) this.x = p.width - this.width;
                if (this.y > p.height) {
                    // Respawn at level spawn point
                    this.x = spawn.x;
                    this.y = spawn.y;
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
        
        class P5Platform {
            constructor(x, y, width, height, color = [100, 100, 100], isMoving = false, moveSpeed = 0, moveDirection = 1, moveRange = 0, originalX = x) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.color = color;
                this.isMoving = isMoving;
                this.moveSpeed = moveSpeed;
                this.moveDirection = moveDirection;
                this.moveRange = moveRange;
                this.originalX = originalX;
            }
            
            update() {
                if (this.isMoving) {
                    // Update platform position
                    this.x += this.moveSpeed * this.moveDirection;
                    
                    // Check if platform has reached its movement bounds
                    const distanceFromOriginal = Math.abs(this.x - this.originalX);
                    if (distanceFromOriginal >= this.moveRange) {
                        this.moveDirection *= -1; // Reverse direction
                        // Clamp to exact bounds to prevent drift
                        if (this.x > this.originalX) {
                            this.x = this.originalX + this.moveRange;
                        } else {
                            this.x = this.originalX - this.moveRange;
                        }
                    }
                }
            }
            
            draw() {
                p.fill(this.color);
                p.stroke(0);
                p.strokeWeight(2);
                p.rect(this.x, this.y, this.width, this.height);
                
                // Add spiky visual effect for death traps
                if (this.color[0] === 255 && this.color[1] === 0 && this.color[2] === 0) {
                    p.fill(170, 0, 0);
                    // Draw spikes on top
                    const scaleX = p.width / 800;
                    const scaleY = p.height / 600;
                    const spikeCount = Math.max(1, Math.floor(this.width / (10 * scaleX)));
                    const spikeWidth = this.width / spikeCount;
                    for (let i = 0; i < spikeCount; i++) {
                        const x = this.x + i * spikeWidth;
                        p.beginShape();
                        p.vertex(x, this.y);
                        p.vertex(x + spikeWidth/2, this.y - 8 * scaleY);
                        p.vertex(x + spikeWidth, this.y);
                        p.endShape(p.CLOSE);
                    }
                }
                
                // Add visual effects for moving platforms (cyan)
                if (this.isMoving) {
                    // Draw motion lines
                    p.stroke(0, 136, 204);
                    p.strokeWeight(1);
                    p.drawingContext.setLineDash([5, 5]);
                    p.noFill();
                    p.rect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
                    p.drawingContext.setLineDash([]); // Reset dash
                    
                    // Draw directional arrow
                    p.fill(0, 136, 204);
                    const arrowX = this.x + this.width / 2;
                    const arrowY = this.y - 15;
                    const arrowSize = 6;
                    
                    p.beginShape();
                    if (this.moveDirection > 0) {
                        // Right arrow
                        p.vertex(arrowX - arrowSize, arrowY - arrowSize/2);
                        p.vertex(arrowX + arrowSize, arrowY);
                        p.vertex(arrowX - arrowSize, arrowY + arrowSize/2);
                    } else {
                        // Left arrow
                        p.vertex(arrowX + arrowSize, arrowY - arrowSize/2);
                        p.vertex(arrowX - arrowSize, arrowY);
                        p.vertex(arrowX + arrowSize, arrowY + arrowSize/2);
                    }
                    p.endShape(p.CLOSE);
                }
                
                // Add visual effects for secret/hidden platforms (dark green)
                if (this.color[0] === 0 && this.color[1] === 102 && this.color[2] === 0) {
                    // Draw subtle pattern to indicate it's special
                    p.fill(0, 68, 0);
                    const patternSize = 4;
                    for (let x = this.x; x < this.x + this.width; x += patternSize * 2) {
                        for (let y = this.y; y < this.y + this.height; y += patternSize * 2) {
                            p.rect(x, y, patternSize, patternSize);
                        }
                    }
                }
                
                // Add visual effects for bonus platforms (bright green)
                if (this.color[0] === 0 && this.color[1] === 255 && this.color[2] === 0) {
                    // Draw glowing effect with multiple rectangles
                    for (let i = 1; i <= 3; i++) {
                        p.fill(0, 255, 0, 100 - i * 20);
                        p.rect(this.x - i, this.y - i, this.width + i*2, this.height + i*2);
                    }
                }
                
                // Add checkered flag pattern for goal platforms (gold)
                if (this.color[0] === 255 && this.color[1] === 215 && this.color[2] === 0) {
                    const scaleX = p.width / 800;
                    const scaleY = p.height / 600;
                    
                    // Draw checkered pattern on the platform
                    const checkerSize = 8 * scaleX;
                    p.noStroke();
                    for (let x = 0; x < this.width; x += checkerSize) {
                        for (let y = 0; y < this.height; y += checkerSize) {
                            const isBlack = ((Math.floor(x / checkerSize) + Math.floor(y / checkerSize)) % 2 === 0);
                            p.fill(isBlack ? 0 : 255);
                            p.rect(this.x + x, this.y + y, checkerSize, checkerSize);
                        }
                    }
                    
                    // Draw checkered flag pole on the right side
                    const flagPoleX = this.x + this.width - 15 * scaleX;
                    const flagPoleY = this.y - 35 * scaleY;
                    const flagWidth = 12 * scaleX;
                    const flagHeight = 20 * scaleY;
                    const poleWidth = 2 * scaleX;
                    
                    // Flag pole
                    p.fill(51);
                    p.rect(flagPoleX, flagPoleY, poleWidth, 35 * scaleY);
                    
                    // Checkered flag
                    const flagCheckerSize = 4 * scaleX;
                    for (let x = 0; x < flagWidth; x += flagCheckerSize) {
                        for (let y = 0; y < flagHeight; y += flagCheckerSize) {
                            const isBlack = ((Math.floor(x / flagCheckerSize) + Math.floor(y / flagCheckerSize)) % 2 === 0);
                            p.fill(isBlack ? 0 : 255);
                            p.rect(flagPoleX + poleWidth + x, flagPoleY + y, flagCheckerSize, flagCheckerSize);
                        }
                    }
                    
                    // Add waving effect to flag
                    const waveOffset = Math.sin(Date.now() * 0.005) * 2 * scaleX;
                    p.fill(255, 255, 255, 80);
                    p.rect(flagPoleX + poleWidth + flagWidth + waveOffset, flagPoleY, 2 * scaleX, flagHeight);
                    
                    // Reset stroke for other elements
                    p.stroke(0);
                }
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
            
            player = new P5Player(0, 0, scaleX, scaleY);
            
            // Load first level
            loadLevel(1);
            
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
            p.text(`Level ${currentLevel}`, 10, 30);
            
            for (let platform of platforms) {
                platform.update(); // Update moving platforms
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
                
                // Always show level complete (infinite progression)
                p.text(`LEVEL ${currentLevel} COMPLETE!`, p.width/2, p.height/2 - 40);
                
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
                const buttonText = 'NEXT LEVEL'; // Always next level for infinite progression
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
                // Always advance to next level (infinite progression)
                currentLevel++;
                loadLevel(currentLevel);
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
                    // Always advance to next level (infinite progression)
                    currentLevel++;
                    loadLevel(currentLevel);
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
}
