// Canvas Game Implementation
// This file contains the Canvas-based game implementation (fallback when p5.js is not available)

function createCanvasGame() {
    // Reset level generation state when creating a new game
    if (typeof resetLevelGeneration === 'function') {
        resetLevelGeneration();
    }
    
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
        currentLevel: 1, // Start at level 1
        levelComplete: false,
        showLevelComplete: false,
        platforms: [],
        goal: {x: 0, y: 0, width: 0, height: 0}, // Current level goal
        spawn: {x: 0, y: 0}, // Current level spawn point
        keys: {},
        frameCount: 0,
        scaleX: scaleX,
        scaleY: scaleY,
        evilDevil: null // Evil devil enemy
    };
    
    // Create player
    game.player = new CanvasPlayer(0, 0, scaleX, scaleY);
    
    // Load level function
    function loadLevel(levelNumber) {
        // Generate level using the procedural generator
        const level = generateLevel(levelNumber);
        
        game.platforms = level.platforms.map(platform => new CanvasPlatform(
            platform.x * scaleX,
            platform.y * scaleY,
            platform.width * scaleX,
            platform.height * scaleY,
            platform.color,
            platform.isMoving || false,
            platform.moveSpeed ? platform.moveSpeed * scaleX : 0,
            platform.moveDirection || 1,
            platform.moveRange ? platform.moveRange * scaleX : 0,
            platform.originalX ? platform.originalX * scaleX : platform.x * scaleX
        ));
        
        // Set goal position
        game.goal = {
            x: level.goal.x * scaleX,
            y: level.goal.y * scaleY,
            width: 40 * scaleX,
            height: 40 * scaleY
        };
        
        // Set spawn position
        game.spawn = {
            x: level.spawn.x * scaleX,
            y: level.spawn.y * scaleY
        };
        
        // Set player spawn position
        game.player.respawn(game.spawn);
        game.levelComplete = false;
        game.showLevelComplete = false;
        
        // Spawn evil devil on level 2 and above
        game.evilDevil = null;
        if (levelNumber >= 2) {
            // Calculate spawn probability: 50% at level 2, increasing by 10% per level, capped at 100%
            const spawnProbability = Math.min(1.0, 0.5 + (levelNumber - 2) * 0.1);
            
            if (Math.random() < spawnProbability) {
                // Find the goal platform (finish line with checkered flag)
                const goalPlatform = game.platforms.find(p => p.color === '#FFD700');
                
                if (goalPlatform) {
                    game.evilDevil = new CanvasEvilDevil(
                        goalPlatform.x + goalPlatform.width / 2,
                        goalPlatform.y,
                        scaleX,
                        scaleY
                    );
                    console.log(`Evil devil spawned on goal platform at level ${levelNumber} (probability: ${(spawnProbability * 100).toFixed(0)}%)`);
                }
            }
        }
    }
    
    // Initialize first level
    loadLevel(1);
    
    // Input handling
    function handleKeyDown(e) {
        game.keys[e.key] = true;
        game.keys[e.code] = true;
        
        // Handle next level confirmation
        if ((e.key === 'Enter' || e.key === ' ') && game.showLevelComplete) {
            // Always advance to next level (infinite progression)
            game.currentLevel++;
            loadLevel(game.currentLevel);
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
                // Always advance to next level (infinite progression)
                game.currentLevel++;
                loadLevel(game.currentLevel);
            }
        }
    });
    
    // Update moving platforms
    function updateMovingPlatforms() {
        for (let platform of game.platforms) {
            platform.update();
            
            // Handle player riding on moving platforms
            if (platform.isMoving && game.player.onGround &&
                game.player.x < platform.x + platform.width &&
                game.player.x + game.player.width > platform.x &&
                game.player.y + game.player.height >= platform.y &&
                game.player.y + game.player.height <= platform.y + 5) {
                game.player.x += platform.moveSpeed * platform.moveDirection;
                // Keep player in bounds when riding platforms
                if (game.player.x < 0) game.player.x = 0;
                if (game.player.x > canvas.width - game.player.width) game.player.x = canvas.width - game.player.width;
            }
        }
    }
    
    function drawPlatforms() {
        for (let platform of game.platforms) {
            platform.draw(ctx, game.scaleX, game.scaleY);
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
        ctx.fillText(`Level ${game.currentLevel}`, 10, 30);
        
        // Draw platforms
        drawPlatforms();
        
        // Update and draw player (only if level not complete)
        if (!game.levelComplete) {
            const gamepadKeys = gamepad.getKeys();
            const movementMultiplier = gamepad.getMovementMultiplier();
            const result = game.player.update(game.keys, gamepadKeys, game.platforms, game.spawn, canvas, movementMultiplier);
            
            if (result === 'goal') {
                game.levelComplete = true;
                game.showLevelComplete = true;
            }
            
            updateMovingPlatforms();
            
            // Update and draw evil devil if it exists
            if (game.evilDevil) {
                const devilResult = game.evilDevil.update(game.player, game.platforms, game.spawn, canvas);
                if (devilResult === 'caught') {
                    // Player caught by devil - respawn both
                    game.player.respawn(game.spawn);
                    game.evilDevil.reset();
                    console.log('Player caught by evil devil! Both respawning...');
                }
            }
        }
        game.player.draw(ctx, game.frameCount);
        
        // Draw evil devil after player
        if (game.evilDevil) {
            game.evilDevil.draw(ctx, game.frameCount);
        }
        
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
            
            // Always show level complete (infinite progression)
            ctx.fillText(`LEVEL ${game.currentLevel} COMPLETE!`, canvas.width/2, canvas.height/2 - 40 * game.scaleY);
            ctx.strokeText(`LEVEL ${game.currentLevel} COMPLETE!`, canvas.width/2, canvas.height/2 - 40 * game.scaleY);
            
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
            const buttonText = 'NEXT LEVEL'; // Always next level for infinite progression
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
