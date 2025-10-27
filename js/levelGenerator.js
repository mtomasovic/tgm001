// Level Generation System
// This file contains all the procedural level generation logic

// Random Level Generator
function generateLevel(levelNumber) {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
        const level = generateLevelAttempt(levelNumber);
        
        // Validate if the level is completable
        if (isLevelCompletable(level)) {
            return level;
        }
        
        attempts++;
    }
    
    // If we can't generate a valid level after maxAttempts, return a simple fallback level
    return generateFallbackLevel(levelNumber);
}

// Helper function to check if a level is mathematically completable
function isLevelCompletable(level) {
    const jumpHeight = 12 * 2; // Single jump height * 2 for double jump
    const jumpDistance = 5 * 20; // Speed * frames (approximate horizontal distance in a jump)
    
    // Start from spawn point
    const visited = new Set();
    const queue = [{x: level.spawn.x, y: level.spawn.y}];
    
    while (queue.length > 0) {
        const current = queue.shift();
        const key = `${Math.floor(current.x/10)},${Math.floor(current.y/10)}`;
        
        if (visited.has(key)) continue;
        visited.add(key);
        
        // Check if we can reach the goal from current position
        const distanceToGoal = Math.abs(current.x - level.goal.x);
        const heightToGoal = current.y - level.goal.y; // Positive means goal is higher
        
        if (distanceToGoal <= jumpDistance && heightToGoal <= jumpHeight && heightToGoal >= -200) {
            return true; // Goal is reachable
        }
        
        // Find all platforms reachable from current position
        for (let platform of level.platforms) {
            // Skip death traps for pathfinding
            if (platform.color === '#FF0000') continue;
            
            const distanceTo = Math.abs(current.x - platform.x);
            const heightDiff = current.y - platform.y; // Positive means platform is higher
            
            // Check if platform is reachable with double jump
            if (distanceTo <= jumpDistance && heightDiff <= jumpHeight && heightDiff >= -300) {
                // Add platform position to queue
                queue.push({x: platform.x + platform.width/2, y: platform.y});
            }
        }
    }
    
    return false; // Goal not reachable
}

function generateLevelAttempt(levelNumber) {
    // Base difficulty parameters that increase with level
    const baseGap = 70 + Math.min(levelNumber * 8, 100); // Reduced max gap for better connectivity
    const maxPlatformHeight = 120 + Math.min(levelNumber * 20, 450); // How high platforms can be (120-570)
    const deathTrapChance = Math.min(levelNumber * 0.06, 0.35); // Reduced death trap chance for validation
    const platformSizeVariation = Math.max(70 - levelNumber * 2, 30); // Platform size gets smaller (70-30)
    const minPlatformSize = Math.max(90 - levelNumber * 3, 40); // Minimum platform size (90-40)
    
    const platforms = [];
    const spawn = {x: 50, y: 500};
    
    // Always start with ground platform
    platforms.push({x: 0, y: 580, width: 120, height: 20, color: '#8B4513'});
    
    // Choose a random level pattern with weighted probabilities
    const patterns = [
        {name: 'linear', weight: 1},
        {name: 'zigzag', weight: 1.5},
        {name: 'tower', weight: 1.2},
        {name: 'valley', weight: 1},
        {name: 'scattered', weight: 0.8},
        {name: 'spiral', weight: 1.3},
        {name: 'branching', weight: 1.1},
        {name: 'pyramid', weight: 1}
    ];
    
    const totalWeight = patterns.reduce((sum, p) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedPattern = 'linear';
    
    for (let pattern of patterns) {
        random -= pattern.weight;
        if (random <= 0) {
            selectedPattern = pattern.name;
            break;
        }
    }
    
    let currentX = 140;
    let currentY = 550;
    const maxPlatforms = 6 + Math.floor(levelNumber / 2);
    
    switch (selectedPattern) {
        case 'linear':
            generateLinearPath(platforms, currentX, currentY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance);
            break;
        case 'zigzag':
            generateZigzagPath(platforms, currentX, currentY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance);
            break;
        case 'tower':
            generateTowerPath(platforms, currentX, currentY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance);
            break;
        case 'valley':
            generateValleyPath(platforms, currentX, currentY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance);
            break;
        case 'scattered':
            generateScatteredPath(platforms, currentX, currentY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance);
            break;
        case 'spiral':
            generateSpiralPath(platforms, currentX, currentY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance);
            break;
        case 'branching':
            generateBranchingPath(platforms, currentX, currentY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance);
            break;
        case 'pyramid':
            generatePyramidPath(platforms, currentX, currentY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance);
            break;
    }
    
    // Add some random extra platforms for alternative routes
    if (levelNumber > 2 && Math.random() < 0.5) {
        addAlternativeRoute(platforms, levelNumber, minPlatformSize, platformSizeVariation, deathTrapChance);
    }
    
    // Add moving platforms for higher levels
    if (levelNumber > 5 && Math.random() < 0.3) {
        addMovingPlatforms(platforms, levelNumber, minPlatformSize);
    }
    
    // Add ground segments for variety but ensure they don't block paths
    if (levelNumber > 2) {
        const groundSegments = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < groundSegments; i++) {
            const segmentX = 200 + Math.random() * 300;
            const segmentWidth = 40 + Math.random() * 40;
            
            // Don't overlap with existing platforms
            let overlap = false;
            for (let platform of platforms) {
                if (segmentX < platform.x + platform.width && segmentX + segmentWidth > platform.x && 
                    Math.abs(580 - platform.y) < 30) {
                    overlap = true;
                    break;
                }
            }
            
            if (!overlap) {
                platforms.push({x: segmentX, y: 580, width: segmentWidth, height: 20, color: '#8B4513'});
                
                // Reduced death trap chance on ground segments
                if (levelNumber > 4 && Math.random() < deathTrapChance * 0.3) {
                    platforms.push({
                        x: segmentX + segmentWidth/2 - 8,
                        y: 560,
                        width: 16,
                        height: 20,
                        color: '#FF0000'
                    });
                }
            }
        }
    }
    
    // Goal platform - vary placement based on pattern
    const goalHeight = Math.max(100, 350 - levelNumber * 6);
    const goalX = selectedPattern === 'valley' ? 400 + Math.random() * 200 : 650 + Math.random() * 100;
    const goal = {x: goalX, y: goalHeight};
    
    platforms.push({
        x: goal.x,
        y: goal.y,
        width: 80 + Math.random() * 40,
        height: 20,
        color: '#FFD700'
    });
    
    return {
        platforms: platforms,
        spawn: spawn,
        goal: goal
    };
}

// Fallback level generator for when validation fails
function generateFallbackLevel(levelNumber) {
    const platforms = [];
    const spawn = {x: 50, y: 500};
    
    // Simple guaranteed completable level
    platforms.push({x: 0, y: 580, width: 120, height: 20, color: '#8B4513'}); // Ground
    platforms.push({x: 200, y: 520, width: 100, height: 20, color: '#009600'}); // Platform 1
    platforms.push({x: 400, y: 460, width: 100, height: 20, color: '#009600'}); // Platform 2
    platforms.push({x: 600, y: 400, width: 100, height: 20, color: '#009600'}); // Platform 3
    
    // Add some difficulty based on level
    if (levelNumber > 2) {
        platforms.push({x: 350, y: 480, width: 30, height: 20, color: '#FF0000'}); // Death trap
    }
    if (levelNumber > 4) {
        platforms.push({x: 550, y: 420, width: 30, height: 20, color: '#FF0000'}); // Death trap
    }
    
    const goal = {x: 650, y: 300 - Math.min(levelNumber * 10, 100)};
    platforms.push({
        x: goal.x,
        y: goal.y,
        width: 100,
        height: 20,
        color: '#FFD700'
    });
    
    return {
        platforms: platforms,
        spawn: spawn,
        goal: goal
    };
}
