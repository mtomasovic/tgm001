// Game Entities - Player and Platform Classes
// This file contains the player and platform classes for both Canvas and p5.js

// Canvas Player Class
class CanvasPlayer {
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
        this.jumpsRemaining = 2; // Allow double jump
        this.lastJumpKey = false; // Track if jump key was pressed last frame
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }
    
    update(keys, gamepadKeys, platforms, spawn, canvas, movementMultiplier = 1) {
        // Merge keyboard and gamepad inputs
        const allKeys = { ...keys, ...gamepadKeys };
        
        // Handle input
        if (allKeys['ArrowLeft'] || allKeys['a'] || allKeys['A'] || allKeys['KeyA']) {
            // Use movement multiplier for progressive joystick control
            // Keyboard always uses full speed (multiplier = 1)
            const speedMultiplier = (allKeys['ArrowLeft'] && !keys['a'] && !keys['A'] && !keys['KeyA']) 
                ? Math.max(0.3, movementMultiplier) // Joystick: min 30% speed, max 100%
                : 1; // Keyboard: always 100%
            this.vx = -this.speed * speedMultiplier;
            this.facing = -1;
        } else if (allKeys['ArrowRight'] || allKeys['d'] || allKeys['D'] || allKeys['KeyD']) {
            // Use movement multiplier for progressive joystick control
            const speedMultiplier = (allKeys['ArrowRight'] && !keys['d'] && !keys['D'] && !keys['KeyD']) 
                ? Math.max(0.3, movementMultiplier) // Joystick: min 30% speed, max 100%
                : 1; // Keyboard: always 100%
            this.vx = this.speed * speedMultiplier;
            this.facing = 1;
        } else {
            this.vx *= 0.8; // friction
        }
        
        if ((allKeys['ArrowUp'] || allKeys['w'] || allKeys['W'] || allKeys['KeyW'] || allKeys[' ']) && this.onGround) {
            this.vy = -this.jumpPower;
            this.onGround = false;
        }
        
        // Double jump logic - check for new jump key press while in air
        const jumpKeyPressed = allKeys['ArrowUp'] || allKeys['w'] || allKeys['W'] || allKeys['KeyW'] || allKeys[' '];
        if (jumpKeyPressed && !this.lastJumpKey && !this.onGround && this.jumpsRemaining > 0) {
            this.vy = -this.jumpPower * 0.85; // Slightly weaker second jump
            this.jumpsRemaining--;
        }
        this.lastJumpKey = jumpKeyPressed;
        
        // Apply gravity (scaled for consistency)
        this.vy += 0.5 * this.scaleY;
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Check collisions with platforms
        this.onGround = false;
        return this.checkCollisions(platforms, spawn, canvas);
    }
    
    checkCollisions(platforms, spawn, canvas) {
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
                    if (platform.color === '#FFD700') {
                        return 'goal';
                    }
                    
                    // Check if it's a death trap platform (red)
                    if (platform.color === '#FF0000') {
                        this.respawn(spawn);
                        return 'death';
                    }
                    
                    // Bonus platforms give double jump boost
                    if (platform.color === '#00FF00') {
                        this.jumpsRemaining = 3; // Extra jump
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
        
        // Keep player in bounds
        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width - this.width) this.x = canvas.width - this.width;
        if (this.y > canvas.height) {
            this.respawn(spawn);
            return 'fall';
        }
        
        return null;
    }
    
    respawn(spawn) {
        this.x = spawn.x;
        this.y = spawn.y;
        this.vx = 0;
        this.vy = 0;
        this.jumpsRemaining = 2;
        this.lastJumpKey = false;
    }
    
    draw(ctx, frameCount) {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y);
        ctx.scale(this.facing, 1);
        
        // Draw stickman
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3 * this.scaleX;
        ctx.lineCap = 'round';
        
        // Head
        ctx.fillStyle = '#FFDC80';
        ctx.beginPath();
        ctx.arc(0, 10 * this.scaleY, 8 * this.scaleX, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Body
        ctx.beginPath();
        ctx.moveTo(0, 18 * this.scaleY);
        ctx.lineTo(0, 30 * this.scaleY);
        ctx.stroke();
        
        // Arms (animated based on movement)
        let armSwing = Math.sin(frameCount * 0.3) * 0.3;
        ctx.beginPath();
        if (Math.abs(this.vx) > 0.1) {
            ctx.moveTo(0, 22 * this.scaleY);
            ctx.lineTo((-8 + armSwing * 8) * this.scaleX, 28 * this.scaleY);
            ctx.moveTo(0, 22 * this.scaleY);
            ctx.lineTo((8 - armSwing * 8) * this.scaleX, 28 * this.scaleY);
        } else {
            ctx.moveTo(0, 22 * this.scaleY);
            ctx.lineTo(-6 * this.scaleX, 28 * this.scaleY);
            ctx.moveTo(0, 22 * this.scaleY);
            ctx.lineTo(6 * this.scaleX, 28 * this.scaleY);
        }
        ctx.stroke();
        
        // Legs (animated based on movement)
        let legSwing = Math.sin(frameCount * 0.4) * 0.4;
        ctx.beginPath();
        if (Math.abs(this.vx) > 0.1 && this.onGround) {
            ctx.moveTo(0, 30 * this.scaleY);
            ctx.lineTo((-6 + legSwing * 6) * this.scaleX, 40 * this.scaleY);
            ctx.moveTo(0, 30 * this.scaleY);
            ctx.lineTo((6 - legSwing * 6) * this.scaleX, 40 * this.scaleY);
        } else {
            ctx.moveTo(0, 30 * this.scaleY);
            ctx.lineTo(-4 * this.scaleX, 40 * this.scaleY);
            ctx.moveTo(0, 30 * this.scaleY);
            ctx.lineTo(4 * this.scaleX, 40 * this.scaleY);
        }
        ctx.stroke();
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-3 * this.scaleX, 8 * this.scaleY, 1 * this.scaleX, 0, Math.PI * 2);
        ctx.arc(3 * this.scaleX, 8 * this.scaleY, 1 * this.scaleX, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Canvas Platform Class
class CanvasPlatform {
    constructor(x, y, width, height, color, isMoving = false, moveSpeed = 0, moveDirection = 1, moveRange = 0, originalX = x) {
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
    
    draw(ctx, scaleX, scaleY) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2 * scaleX;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Add spiky visual effect for death traps
        if (this.color === '#FF0000') {
            ctx.fillStyle = '#AA0000';
            // Draw spikes on top
            const spikeCount = Math.max(1, Math.floor(this.width / (10 * scaleX)));
            const spikeWidth = this.width / spikeCount;
            for (let i = 0; i < spikeCount; i++) {
                const x = this.x + i * spikeWidth;
                ctx.beginPath();
                ctx.moveTo(x, this.y);
                ctx.lineTo(x + spikeWidth/2, this.y - 8 * scaleY);
                ctx.lineTo(x + spikeWidth, this.y);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }
        
        // Add visual effects for moving platforms
        if (this.isMoving) {
            // Draw motion lines
            ctx.strokeStyle = '#0088CC';
            ctx.lineWidth = 1 * scaleX;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
            ctx.setLineDash([]); // Reset dash
            
            // Draw directional arrow
            ctx.fillStyle = '#0088CC';
            const arrowX = this.x + this.width / 2;
            const arrowY = this.y - 15;
            const arrowSize = 6 * scaleX;
            
            ctx.beginPath();
            if (this.moveDirection > 0) {
                // Right arrow
                ctx.moveTo(arrowX - arrowSize, arrowY - arrowSize/2);
                ctx.lineTo(arrowX + arrowSize, arrowY);
                ctx.lineTo(arrowX - arrowSize, arrowY + arrowSize/2);
            } else {
                // Left arrow
                ctx.moveTo(arrowX + arrowSize, arrowY - arrowSize/2);
                ctx.lineTo(arrowX - arrowSize, arrowY);
                ctx.lineTo(arrowX + arrowSize, arrowY + arrowSize/2);
            }
            ctx.closePath();
            ctx.fill();
        }
        
        // Add visual effects for secret/hidden platforms (dark green)
        if (this.color === '#006600') {
            // Draw subtle pattern to indicate it's special
            ctx.fillStyle = '#004400';
            const patternSize = 4 * scaleX;
            for (let x = this.x; x < this.x + this.width; x += patternSize * 2) {
                for (let y = this.y; y < this.y + this.height; y += patternSize * 2) {
                    ctx.fillRect(x, y, patternSize, patternSize);
                }
            }
        }
        
        // Add visual effects for bonus platforms (bright green)
        if (this.color === '#00FF00') {
            // Draw glowing effect
            ctx.shadowColor = '#00FF00';
            ctx.shadowBlur = 10 * scaleX;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.shadowBlur = 0; // Reset shadow
        }
        
        // Add checkered flag pattern for goal platforms
        if (this.color === '#FFD700') {
            // Draw checkered pattern on the platform
            const checkerSize = 8 * scaleX;
            for (let x = 0; x < this.width; x += checkerSize) {
                for (let y = 0; y < this.height; y += checkerSize) {
                    const isBlack = ((Math.floor(x / checkerSize) + Math.floor(y / checkerSize)) % 2 === 0);
                    ctx.fillStyle = isBlack ? '#000000' : '#FFFFFF';
                    ctx.fillRect(this.x + x, this.y + y, checkerSize, checkerSize);
                }
            }
            
            // Draw checkered flag pole on the right side
            const flagPoleX = this.x + this.width - 15 * scaleX;
            const flagPoleY = this.y - 35 * scaleY;
            const flagWidth = 12 * scaleX;
            const flagHeight = 20 * scaleY;
            const poleWidth = 2 * scaleX;
            
            // Flag pole
            ctx.fillStyle = '#333333';
            ctx.fillRect(flagPoleX, flagPoleY, poleWidth, 35 * scaleY);
            
            // Checkered flag
            const flagCheckerSize = 4 * scaleX;
            for (let x = 0; x < flagWidth; x += flagCheckerSize) {
                for (let y = 0; y < flagHeight; y += flagCheckerSize) {
                    const isBlack = ((Math.floor(x / flagCheckerSize) + Math.floor(y / flagCheckerSize)) % 2 === 0);
                    ctx.fillStyle = isBlack ? '#000000' : '#FFFFFF';
                    ctx.fillRect(flagPoleX + poleWidth, flagPoleY + y, flagCheckerSize, flagCheckerSize);
                }
            }
            
            // Add waving effect to flag
            const waveOffset = Math.sin(Date.now() * 0.005) * 2 * scaleX;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(flagPoleX + poleWidth + flagWidth + waveOffset, flagPoleY, 2 * scaleX, flagHeight);
        }
    }
}

// Evil Stick Devil Class for Canvas
class CanvasEvilDevil {
    constructor(x, y, scaleX, scaleY) {
        this.spawnX = x;
        this.spawnY = y - 300 * scaleY; // Start high in the sky
        this.targetX = x;
        this.targetY = y - 50 * scaleY; // Float above the platform
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.vx = 0;
        this.vy = 0;
        this.width = 20 * scaleX;
        this.height = 40 * scaleY;
        this.speed = 0; // Will be set to 90% of player speed
        this.jumpPower = 12 * scaleY;
        this.onGround = false;
        this.facing = 1;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.state = 'flying-in'; // 'flying-in', 'waiting', 'chasing'
        this.playerHasMoved = false;
        this.hasLanded = false;
        this.animationFrame = 0;
        this.jumpsRemaining = 2;
        this.lastJumpTime = 0;
    }
    
    update(player, platforms, spawn, canvas) {
        this.animationFrame++;
        
        if (this.state === 'flying-in') {
            // Fly down to the target platform
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 5) {
                // Reached target position
                this.state = 'waiting';
                this.hasLanded = true;
                this.x = this.targetX;
                this.y = this.targetY;
            } else {
                // Move towards target with smooth easing
                const speed = 3 * this.scaleX;
                this.x += (dx / distance) * speed;
                this.y += (dy / distance) * speed;
                
                // Face the direction of movement
                if (dx > 0) this.facing = 1;
                else if (dx < 0) this.facing = -1;
            }
            return null;
        }
        
        if (this.state === 'waiting') {
            // Check if player has moved
            const playerMoved = Math.abs(player.vx) > 0.1 || Math.abs(player.vy) > 0.1;
            if (playerMoved && !this.playerHasMoved) {
                this.playerHasMoved = true;
                this.state = 'chasing';
                this.speed = player.speed * 0.6; // 60% of player speed
            }
            
            // Bob up and down while waiting
            this.y = this.targetY + Math.sin(this.animationFrame * 0.05) * 3 * this.scaleY;
            return null;
        }
        
        if (this.state === 'chasing') {
            // Chase the player
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Move horizontally towards player
            if (Math.abs(dx) > 5) {
                this.vx = (dx > 0 ? 1 : -1) * this.speed;
                this.facing = dx > 0 ? 1 : -1;
            } else {
                this.vx *= 0.8; // Friction
            }
            
            // Jump if player is above and devil is on ground
            if (dy < -50 && this.onGround && Date.now() - this.lastJumpTime > 500) {
                this.vy = -this.jumpPower;
                this.onGround = false;
                this.lastJumpTime = Date.now();
            }
            
            // Apply gravity
            this.vy += 0.5 * this.scaleY;
            
            // Update position
            this.x += this.vx;
            this.y += this.vy;
            
            // Check collisions with platforms
            this.onGround = false;
            for (let platform of platforms) {
                if (this.x < platform.x + platform.width &&
                    this.x + this.width > platform.x &&
                    this.y < platform.y + platform.height &&
                    this.y + this.height > platform.y) {
                    
                    const devilBottom = this.y + this.height;
                    const devilTop = this.y;
                    const platformTop = platform.y;
                    const platformBottom = platform.y + platform.height;
                    
                    // Landing on top
                    if (this.vy > 0 && devilBottom > platformTop && devilTop < platformTop) {
                        this.y = platformTop - this.height;
                        this.vy = 0;
                        this.onGround = true;
                        this.jumpsRemaining = 2;
                    }
                    // Hitting from below
                    else if (this.vy < 0 && devilTop < platformBottom && devilBottom > platformBottom) {
                        this.y = platformBottom;
                        this.vy = 0;
                    }
                }
            }
            
            // Keep devil in bounds
            if (this.x < 0) this.x = 0;
            if (this.x > canvas.width - this.width) this.x = canvas.width - this.width;
            
            // Respawn if fell off screen
            if (this.y > canvas.height) {
                this.respawn();
            }
            
            // Check collision with player (but not when player is on goal platform)
            if (this.checkCollisionWithPlayer(player, platforms)) {
                return 'caught';
            }
        }
        
        return null;
    }
    
    checkCollisionWithPlayer(player, platforms) {
        // Check if player is on the goal platform (safe zone)
        const goalPlatform = platforms.find(p => p.color === '#FFD700');
        
        if (goalPlatform) {
            // Check if player is standing on goal platform
            const playerOnGoal = player.x < goalPlatform.x + goalPlatform.width &&
                                player.x + player.width > goalPlatform.x &&
                                player.y + player.height >= goalPlatform.y &&
                                player.y + player.height <= goalPlatform.y + 10;
            
            // If player is on goal platform, they're safe
            if (playerOnGoal) {
                return false;
            }
        }
        
        // Simple bounding box collision
        return this.x < player.x + player.width &&
               this.x + this.width > player.x &&
               this.y < player.y + player.height &&
               this.y + this.height > player.y;
    }
    
    respawn() {
        this.x = this.targetX;
        this.y = this.targetY;
        this.vx = 0;
        this.vy = 0;
        this.state = 'waiting';
    }
    
    reset() {
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.vx = 0;
        this.vy = 0;
        this.state = 'flying-in';
        this.playerHasMoved = false;
        this.hasLanded = false;
        this.animationFrame = 0;
    }
    
    draw(ctx, frameCount) {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y);
        ctx.scale(this.facing, 1);
        
        // Draw evil stick devil
        ctx.strokeStyle = '#8B0000'; // Dark red
        ctx.lineWidth = 3 * this.scaleX;
        ctx.lineCap = 'round';
        
        // Head (red)
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(0, 10 * this.scaleY, 8 * this.scaleX, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw horns
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 2 * this.scaleX;
        ctx.beginPath();
        ctx.moveTo(-6 * this.scaleX, 4 * this.scaleY);
        ctx.lineTo(-9 * this.scaleX, 0);
        ctx.moveTo(6 * this.scaleX, 4 * this.scaleY);
        ctx.lineTo(9 * this.scaleX, 0);
        ctx.stroke();
        
        // Body
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 3 * this.scaleX;
        ctx.beginPath();
        ctx.moveTo(0, 18 * this.scaleY);
        ctx.lineTo(0, 30 * this.scaleY);
        ctx.stroke();
        
        // Arms (animated)
        let armSwing = Math.sin(frameCount * 0.3) * 0.3;
        ctx.beginPath();
        if (this.state === 'chasing' && Math.abs(this.vx) > 0.1) {
            ctx.moveTo(0, 22 * this.scaleY);
            ctx.lineTo((-8 + armSwing * 8) * this.scaleX, 28 * this.scaleY);
            ctx.moveTo(0, 22 * this.scaleY);
            ctx.lineTo((8 - armSwing * 8) * this.scaleX, 28 * this.scaleY);
        } else {
            // Reaching arms while waiting/flying
            ctx.moveTo(0, 22 * this.scaleY);
            ctx.lineTo(-8 * this.scaleX, 24 * this.scaleY);
            ctx.moveTo(0, 22 * this.scaleY);
            ctx.lineTo(8 * this.scaleX, 24 * this.scaleY);
        }
        ctx.stroke();
        
        // Legs (animated)
        let legSwing = Math.sin(frameCount * 0.4) * 0.4;
        ctx.beginPath();
        if (this.state === 'chasing' && Math.abs(this.vx) > 0.1 && this.onGround) {
            ctx.moveTo(0, 30 * this.scaleY);
            ctx.lineTo((-6 + legSwing * 6) * this.scaleX, 40 * this.scaleY);
            ctx.moveTo(0, 30 * this.scaleY);
            ctx.lineTo((6 - legSwing * 6) * this.scaleX, 40 * this.scaleY);
        } else {
            ctx.moveTo(0, 30 * this.scaleY);
            ctx.lineTo(-4 * this.scaleX, 40 * this.scaleY);
            ctx.moveTo(0, 30 * this.scaleY);
            ctx.lineTo(4 * this.scaleX, 40 * this.scaleY);
        }
        ctx.stroke();
        
        // Evil eyes
        ctx.fillStyle = '#FFFF00'; // Yellow eyes
        ctx.beginPath();
        ctx.arc(-3 * this.scaleX, 8 * this.scaleY, 2 * this.scaleX, 0, Math.PI * 2);
        ctx.arc(3 * this.scaleX, 8 * this.scaleY, 2 * this.scaleX, 0, Math.PI * 2);
        ctx.fill();
        
        // Evil pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-3 * this.scaleX, 8 * this.scaleY, 1 * this.scaleX, 0, Math.PI * 2);
        ctx.arc(3 * this.scaleX, 8 * this.scaleY, 1 * this.scaleX, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pitchfork tail
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 2 * this.scaleX;
        ctx.beginPath();
        ctx.moveTo(0, 30 * this.scaleY);
        const tailWiggle = Math.sin(frameCount * 0.2) * 3 * this.scaleX;
        ctx.lineTo(tailWiggle - 5 * this.scaleX, 35 * this.scaleY);
        ctx.lineTo(tailWiggle - 8 * this.scaleX, 38 * this.scaleY);
        ctx.stroke();
        
        // Draw arrow tip on tail
        ctx.beginPath();
        ctx.moveTo(tailWiggle - 10 * this.scaleX, 36 * this.scaleY);
        ctx.lineTo(tailWiggle - 8 * this.scaleX, 38 * this.scaleY);
        ctx.lineTo(tailWiggle - 6 * this.scaleX, 36 * this.scaleY);
        ctx.stroke();
        
        ctx.restore();
    }
}
