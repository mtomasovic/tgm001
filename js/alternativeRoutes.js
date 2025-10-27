// Alternative Routes and Special Features
// This file contains functions for creating alternative paths and special platform features

// Add moving platforms for advanced levels
function addMovingPlatforms(platforms, levelNumber, minPlatformSize) {
    const movingCount = Math.min(2, Math.floor(levelNumber / 8));
    
    for (let i = 0; i < movingCount; i++) {
        const x = 250 + Math.random() * 300;
        const y = 200 + Math.random() * 200;
        
        platforms.push({
            x: x,
            y: y,
            width: Math.max(60, minPlatformSize * 0.8),
            height: 20,
            color: '#00FFFF', // Cyan for moving platforms
            isMoving: true,
            moveSpeed: 1 + Math.random() * 2,
            moveDirection: Math.random() < 0.5 ? 1 : -1,
            moveRange: 80 + Math.random() * 40,
            originalX: x
        });
    }
}

// Add alternative routes for more complex levels
function addAlternativeRoute(platforms, levelNumber, minPlatformSize, platformSizeVariation, deathTrapChance) {
    // Find existing platforms to branch from
    const existingPlatforms = platforms.filter(p => p.color === '#009600');
    if (existingPlatforms.length < 3) return;
    
    // Create multiple types of alternative routes
    const routeTypes = ['upper', 'lower', 'secret'];
    const routeType = routeTypes[Math.floor(Math.random() * routeTypes.length)];
    
    if (routeType === 'upper') {
        createUpperRoute(platforms, existingPlatforms, levelNumber, minPlatformSize, deathTrapChance);
    } else if (routeType === 'lower') {
        createLowerRoute(platforms, existingPlatforms, levelNumber, minPlatformSize, deathTrapChance);
    } else {
        createSecretRoute(platforms, existingPlatforms, levelNumber, minPlatformSize, deathTrapChance);
    }
}

// Create an upper alternative route
function createUpperRoute(platforms, existingPlatforms, levelNumber, minPlatformSize, deathTrapChance) {
    const branchPoint = existingPlatforms[Math.floor(existingPlatforms.length * 0.3)];
    
    let altX = branchPoint.x + 40;
    let altY = branchPoint.y - 100 - Math.random() * 40;
    
    for (let i = 0; i < 4 && altX < 680; i++) {
        altX += 70 + Math.random() * 50;
        altY += (Math.random() - 0.3) * 40; // Slight downward tendency
        altY = Math.max(80, Math.min(400, altY));
        
        const platformWidth = Math.max(50, minPlatformSize * 0.8);
        
        platforms.push({
            x: altX,
            y: altY,
            width: platformWidth,
            height: 20,
            color: '#009600'
        });
        
        // Upper routes have strategic death traps but also rewards
        if (levelNumber > 3 && Math.random() < deathTrapChance * 0.3) {
            platforms.push({
                x: altX + platformWidth + 8,
                y: altY + 25,
                width: 12,
                height: 20,
                color: '#FF0000'
            });
        }
        
        // Add bonus platforms occasionally
        if (Math.random() < 0.4) {
            platforms.push({
                x: altX - 25,
                y: altY + 35,
                width: 20,
                height: 20,
                color: '#00FF00' // Bright green for bonus
            });
        }
    }
}

// Create a lower alternative route
function createLowerRoute(platforms, existingPlatforms, levelNumber, minPlatformSize, deathTrapChance) {
    const branchPoint = existingPlatforms[Math.floor(existingPlatforms.length * 0.4)];
    
    let altX = branchPoint.x + 30;
    let altY = branchPoint.y + 80 + Math.random() * 40;
    
    for (let i = 0; i < 3 && altX < 650; i++) {
        altX += 80 + Math.random() * 40;
        altY += (Math.random() - 0.7) * 30; // Upward tendency to rejoin
        altY = Math.max(200, Math.min(550, altY));
        
        const platformWidth = Math.max(60, minPlatformSize * 0.9);
        
        platforms.push({
            x: altX,
            y: altY,
            width: platformWidth,
            height: 20,
            color: '#009600'
        });
        
        // Lower routes are safer but longer
        if (levelNumber > 5 && Math.random() < deathTrapChance * 0.15) {
            platforms.push({
                x: altX + Math.random() * platformWidth,
                y: altY + 25,
                width: 10,
                height: 20,
                color: '#FF0000'
            });
        }
    }
}

// Create a secret/hidden route
function createSecretRoute(platforms, existingPlatforms, levelNumber, minPlatformSize, deathTrapChance) {
    if (levelNumber < 4) return; // Secret routes only in higher levels
    
    const branchPoint = existingPlatforms[Math.floor(existingPlatforms.length * 0.6)];
    
    // Create a hidden platform that leads to a shortcut
    let secretX = branchPoint.x - 60 + Math.random() * 40;
    let secretY = branchPoint.y - 60 - Math.random() * 40;
    
    // First hidden platform (smaller and harder to see)
    platforms.push({
        x: secretX,
        y: secretY,
        width: 30,
        height: 20,
        color: '#006600' // Darker green for "hidden"
    });
    
    // Second platform that connects to later in the level
    const connectionPlatform = existingPlatforms[Math.floor(existingPlatforms.length * 0.8)];
    if (connectionPlatform) {
        const shortcutX = connectionPlatform.x - 40;
        const shortcutY = connectionPlatform.y - 40;
        
        platforms.push({
            x: shortcutX,
            y: shortcutY,
            width: 40,
            height: 20,
            color: '#006600'
        });
        
        // Add a dangerous but rewarding intermediate platform
        const midX = (secretX + shortcutX) / 2;
        const midY = (secretY + shortcutY) / 2 - 30;
        
        platforms.push({
            x: midX,
            y: midY,
            width: 25,
            height: 20,
            color: '#006600'
        });
        
        // High risk, high reward - death trap near secret route
        if (Math.random() < 0.6) {
            platforms.push({
                x: midX + 30,
                y: midY + 25,
                width: 15,
                height: 20,
                color: '#FF0000'
            });
        }
    }
}
