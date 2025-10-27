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

// Linear ascending path
function generateLinearPath(platforms, startX, startY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance) {
    let currentX = startX;
    let currentY = startY;
    
    for (let i = 0; i < maxPlatforms && currentX < 600; i++) {
        const gap = Math.max(40, baseGap + Math.random() * 30 - 15);
        currentX += gap;
        
        // Gradual ascent
        currentY -= 30 + Math.random() * 40;
        currentY = Math.max(150, currentY);
        
        const platformWidth = minPlatformSize + Math.random() * platformSizeVariation;
        
        platforms.push({
            x: currentX,
            y: currentY,
            width: platformWidth,
            height: 20,
            color: '#009600'
        });
        
        // Add death traps occasionally
        if (levelNumber > 1 && Math.random() < deathTrapChance * 0.4) {
            platforms.push({
                x: currentX + platformWidth + 10,
                y: currentY + 25,
                width: 20,
                height: 20,
                color: '#FF0000'
            });
        }
    }
}

// Zigzag up and down path
function generateZigzagPath(platforms, startX, startY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance) {
    let currentX = startX;
    let currentY = startY;
    let goingUp = true;
    
    for (let i = 0; i < maxPlatforms && currentX < 600; i++) {
        const gap = Math.max(50, baseGap + Math.random() * 20 - 10);
        currentX += gap;
        
        // Zigzag pattern
        if (goingUp) {
            currentY -= 60 + Math.random() * 40;
            if (currentY < 200) goingUp = false;
        } else {
            currentY += 40 + Math.random() * 30;
            if (currentY > 500) goingUp = true;
        }
        currentY = Math.max(150, Math.min(550, currentY));
        
        const platformWidth = minPlatformSize + Math.random() * platformSizeVariation;
        
        platforms.push({
            x: currentX,
            y: currentY,
            width: platformWidth,
            height: 20,
            color: '#009600'
        });
        
        // More death traps in zigzag for difficulty
        if (levelNumber > 2 && Math.random() < deathTrapChance * 0.6) {
            platforms.push({
                x: currentX - 15,
                y: currentY + 25,
                width: 15,
                height: 20,
                color: '#FF0000'
            });
        }
    }
}

// Vertical tower climbing
function generateTowerPath(platforms, startX, startY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance) {
    let currentX = startX;
    let currentY = startY;
    
    // Create a tower structure
    for (let i = 0; i < maxPlatforms && currentX < 500; i++) {
        const gap = Math.max(30, baseGap * 0.7 + Math.random() * 20 - 10);
        currentX += gap;
        
        // Steep climb with some variation
        currentY -= 80 + Math.random() * 30;
        currentY = Math.max(100, currentY);
        
        const platformWidth = Math.max(40, minPlatformSize * 0.8 + Math.random() * (platformSizeVariation * 0.6));
        
        platforms.push({
            x: currentX,
            y: currentY,
            width: platformWidth,
            height: 20,
            color: '#009600'
        });
        
        // Add stepping stones for tower climbing
        if (i > 0 && Math.random() < 0.5) {
            platforms.push({
                x: currentX - 40,
                y: currentY + 40,
                width: 30,
                height: 20,
                color: '#009600'
            });
        }
        
        // Strategic death traps
        if (levelNumber > 3 && Math.random() < deathTrapChance * 0.5) {
            platforms.push({
                x: currentX + platformWidth/2 - 5,
                y: currentY + 25,
                width: 10,
                height: 20,
                color: '#FF0000'
            });
        }
    }
}

// Valley and hill pattern
function generateValleyPath(platforms, startX, startY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance) {
    let currentX = startX;
    let currentY = startY;
    
    for (let i = 0; i < maxPlatforms && currentX < 600; i++) {
        const gap = Math.max(45, baseGap + Math.random() * 25 - 12);
        currentX += gap;
        
        // Create valley shape (down then up)
        const valleyProgress = i / maxPlatforms;
        if (valleyProgress < 0.5) {
            // Going down into valley
            currentY += 40 + Math.random() * 30;
        } else {
            // Coming up from valley
            currentY -= 50 + Math.random() * 40;
        }
        currentY = Math.max(150, Math.min(580, currentY));
        
        const platformWidth = minPlatformSize + Math.random() * platformSizeVariation;
        
        platforms.push({
            x: currentX,
            y: currentY,
            width: platformWidth,
            height: 20,
            color: '#009600'
        });
        
        // More traps in the valley bottom
        if (levelNumber > 2 && valleyProgress > 0.3 && valleyProgress < 0.7 && Math.random() < deathTrapChance * 0.7) {
            platforms.push({
                x: currentX + Math.random() * platformWidth,
                y: currentY + 25,
                width: 15,
                height: 20,
                color: '#FF0000'
            });
        }
    }
}

// Scattered platform layout with better connectivity
function generateScatteredPath(platforms, startX, startY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance) {
    const platformPositions = [];
    const clusters = Math.min(3, Math.floor(levelNumber / 3) + 1); // Create platform clusters
    
    // Generate clustered positions for better flow
    for (let cluster = 0; cluster < clusters; cluster++) {
        const clusterCenterX = 200 + (cluster / (clusters - 1)) * 350;
        const clusterCenterY = 250 + Math.random() * 200;
        const platformsPerCluster = Math.floor(maxPlatforms / clusters);
        
        for (let i = 0; i < platformsPerCluster; i++) {
            const angle = (i / platformsPerCluster) * Math.PI * 2;
            const radius = 40 + Math.random() * 60;
            
            const x = clusterCenterX + Math.cos(angle) * radius + Math.random() * 40 - 20;
            const y = clusterCenterY + Math.sin(angle) * radius + Math.random() * 40 - 20;
            
            platformPositions.push({
                x: Math.max(150, Math.min(650, x)),
                y: Math.max(150, Math.min(550, y))
            });
        }
    }
    
    // Sort by x position to ensure progression
    platformPositions.sort((a, b) => a.x - b.x);
    
    // Create platforms with varied sizes
    for (let i = 0; i < platformPositions.length; i++) {
        const pos = platformPositions[i];
        const platformWidth = minPlatformSize + Math.random() * platformSizeVariation;
        
        // Make some platforms smaller for difficulty
        const finalWidth = levelNumber > 5 && Math.random() < 0.3 ? 
            Math.max(30, platformWidth * 0.6) : platformWidth;
        
        platforms.push({
            x: pos.x,
            y: pos.y,
            width: finalWidth,
            height: 20,
            color: '#009600'
        });
        
        // Add connecting platforms if gap is too large
        if (i > 0) {
            const prevPos = platformPositions[i - 1];
            const distance = Math.abs(pos.x - prevPos.x);
            const heightDiff = Math.abs(pos.y - prevPos.y);
            
            if (distance > 140 || heightDiff > 120) {
                // Add intermediate platform
                const midX = (pos.x + prevPos.x) / 2 + Math.random() * 30 - 15;
                const midY = (pos.y + prevPos.y) / 2 + Math.random() * 30 - 15;
                
                platforms.push({
                    x: midX,
                    y: midY,
                    width: 50,
                    height: 20,
                    color: '#009600'
                });
            }
        }
        
        // Scattered death traps with strategic placement
        if (levelNumber > 1 && Math.random() < deathTrapChance * 0.4) {
            // Place death trap between platforms sometimes
            if (i > 0 && Math.random() < 0.5) {
                const prevPos = platformPositions[i - 1];
                const trapX = (pos.x + prevPos.x) / 2;
                const trapY = Math.max(pos.y, prevPos.y) + 25;
                
                platforms.push({
                    x: trapX,
                    y: trapY,
                    width: 12,
                    height: 20,
                    color: '#FF0000'
                });
            } else {
                platforms.push({
                    x: pos.x + Math.random() * finalWidth,
                    y: pos.y + 25,
                    width: 12,
                    height: 20,
                    color: '#FF0000'
                });
            }
        }
    }
}

// Spiral ascending pattern
function generateSpiralPath(platforms, startX, startY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance) {
    let currentX = startX;
    let currentY = startY;
    let angle = 0;
    const spiralRadius = 80 + levelNumber * 5;
    const centerX = 350;
    const centerY = 350;
    
    for (let i = 0; i < maxPlatforms && currentX < 600; i++) {
        angle += Math.PI / 3 + Math.random() * Math.PI / 6; // 60-90 degrees per step
        
        currentX = centerX + Math.cos(angle) * (spiralRadius - i * 15);
        currentY = centerY - Math.sin(angle) * (spiralRadius - i * 15) - i * 20; // Ascending spiral
        
        // Keep within bounds
        currentX = Math.max(150, Math.min(650, currentX));
        currentY = Math.max(150, Math.min(550, currentY));
        
        const platformWidth = Math.max(40, minPlatformSize - i * 5); // Getting smaller as we go up
        
        platforms.push({
            x: currentX,
            y: currentY,
            width: platformWidth,
            height: 20,
            color: '#009600'
        });
        
        // Strategic death traps
        if (levelNumber > 3 && Math.random() < deathTrapChance * 0.4) {
            platforms.push({
                x: currentX + platformWidth + 10,
                y: currentY + 25,
                width: 15,
                height: 20,
                color: '#FF0000'
            });
        }
    }
}

// Branching path with multiple routes
function generateBranchingPath(platforms, startX, startY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance) {
    let currentX = startX;
    let currentY = startY;
    
    // Main path
    const mainPlatforms = Math.floor(maxPlatforms * 0.7);
    for (let i = 0; i < mainPlatforms && currentX < 500; i++) {
        const gap = Math.max(50, baseGap + Math.random() * 25 - 12);
        currentX += gap;
        currentY -= 40 + Math.random() * 30;
        currentY = Math.max(200, currentY);
        
        const platformWidth = minPlatformSize + Math.random() * platformSizeVariation;
        
        platforms.push({
            x: currentX,
            y: currentY,
            width: platformWidth,
            height: 20,
            color: '#009600'
        });
        
        // Create branches at certain points
        if (i === Math.floor(mainPlatforms / 3) || i === Math.floor(mainPlatforms * 2/3)) {
            createBranch(platforms, currentX, currentY, levelNumber, minPlatformSize, deathTrapChance);
        }
        
        // Death traps on main path
        if (levelNumber > 2 && Math.random() < deathTrapChance * 0.3) {
            platforms.push({
                x: currentX + Math.random() * platformWidth,
                y: currentY + 25,
                width: 12,
                height: 20,
                color: '#FF0000'
            });
        }
    }
}

// Helper function for branching paths
function createBranch(platforms, branchX, branchY, levelNumber, minPlatformSize, deathTrapChance) {
    // Create upper and lower branches
    const directions = [1, -1]; // up and down
    
    for (let dir of directions) {
        let branchCurrentX = branchX + 30;
        let branchCurrentY = branchY + dir * 60;
        
        for (let i = 0; i < 2 && branchCurrentX < 650; i++) {
            branchCurrentX += 60 + Math.random() * 30;
            branchCurrentY += dir * (20 + Math.random() * 20);
            branchCurrentY = Math.max(150, Math.min(550, branchCurrentY));
            
            const platformWidth = Math.max(40, minPlatformSize * 0.8);
            
            platforms.push({
                x: branchCurrentX,
                y: branchCurrentY,
                width: platformWidth,
                height: 20,
                color: '#009600'
            });
            
            // Fewer death traps on branch paths (reward exploration)
            if (levelNumber > 4 && Math.random() < deathTrapChance * 0.1) {
                platforms.push({
                    x: branchCurrentX + platformWidth + 5,
                    y: branchCurrentY + 25,
                    width: 10,
                    height: 20,
                    color: '#FF0000'
                });
            }
        }
    }
}

// Pyramid climbing pattern
function generatePyramidPath(platforms, startX, startY, maxPlatforms, levelNumber, baseGap, minPlatformSize, platformSizeVariation, deathTrapChance) {
    let currentX = startX;
    let currentY = startY;
    let pyramidLevel = 0;
    const pyramidWidth = 120;
    
    for (let i = 0; i < maxPlatforms && currentX < 600; i++) {
        // Create pyramid structure
        const platformsInLevel = Math.max(1, 3 - pyramidLevel);
        
        for (let j = 0; j < platformsInLevel && currentX < 600; j++) {
            const gap = pyramidWidth / (platformsInLevel + 1);
            currentX += gap;
            
            const platformWidth = Math.max(30, minPlatformSize - pyramidLevel * 10);
            
            platforms.push({
                x: currentX,
                y: currentY,
                width: platformWidth,
                height: 20,
                color: '#009600'
            });
            
            // Death traps become more frequent higher up the pyramid
            if (levelNumber > 2 && Math.random() < deathTrapChance * (0.2 + pyramidLevel * 0.2)) {
                platforms.push({
                    x: currentX + platformWidth/2 - 5,
                    y: currentY + 25,
                    width: 10,
                    height: 20,
                    color: '#FF0000'
                });
            }
            
            i++; // Count each platform
        }
        
        // Move up to next pyramid level
        pyramidLevel++;
        currentY -= 70 + Math.random() * 30;
        currentY = Math.max(150, currentY);
        currentX = startX + pyramidLevel * 40; // Shift each level
    }
}

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
        currentLevel: 1, // Start at level 1
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
        goal: {x: 0, y: 0, width: 0, height: 0}, // Current level goal
        spawn: {x: 0, y: 0}, // Current level spawn point
        keys: {},
        frameCount: 0,
        scaleX: scaleX,
        scaleY: scaleY
    };
    
    // Load level function
    function loadLevel(levelNumber) {
        // Generate level using the procedural generator
        const level = generateLevel(levelNumber);
        
        game.platforms = level.platforms.map(platform => ({
            x: platform.x * scaleX,
            y: platform.y * scaleY,
            width: platform.width * scaleX,
            height: platform.height * scaleY,
            color: platform.color,
            isMoving: platform.isMoving || false,
            moveSpeed: platform.moveSpeed ? platform.moveSpeed * scaleX : 0,
            moveDirection: platform.moveDirection || 1,
            moveRange: platform.moveRange ? platform.moveRange * scaleX : 0,
            originalX: platform.originalX ? platform.originalX * scaleX : platform.x * scaleX
        }));
        
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
        game.player.x = game.spawn.x;
        game.player.y = game.spawn.y;
        game.player.vx = 0;
        game.player.vy = 0;
        game.player.jumpsRemaining = 2; // Reset double jump
        game.player.lastJumpKey = false;
        game.levelComplete = false;
        game.showLevelComplete = false;
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
            if (platform.isMoving) {
                // Update platform position
                platform.x += platform.moveSpeed * platform.moveDirection;
                
                // Check if platform has reached its movement bounds
                const distanceFromOriginal = Math.abs(platform.x - platform.originalX);
                if (distanceFromOriginal >= platform.moveRange) {
                    platform.moveDirection *= -1; // Reverse direction
                    // Clamp to exact bounds to prevent drift
                    if (platform.x > platform.originalX) {
                        platform.x = platform.originalX + platform.moveRange;
                    } else {
                        platform.x = platform.originalX - platform.moveRange;
                    }
                }
                
                // If player is standing on this platform, move player with it
                const p = game.player;
                if (p.onGround && 
                    p.x < platform.x + platform.width &&
                    p.x + p.width > platform.x &&
                    p.y + p.height >= platform.y &&
                    p.y + p.height <= platform.y + 5) {
                    p.x += platform.moveSpeed * platform.moveDirection;
                    // Keep player in bounds when riding platforms
                    if (p.x < 0) p.x = 0;
                    if (p.x > canvas.width - p.width) p.x = canvas.width - p.width;
                }
            }
        }
    }
    
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
                        
                        // Check if it's a death trap platform (red)
                        if (platform.color === '#FF0000') {
                            // Respawn at level spawn point
                            p.x = game.spawn.x;
                            p.y = game.spawn.y;
                            p.vx = 0;
                            p.vy = 0;
                            p.jumpsRemaining = 2;
                            p.lastJumpKey = false;
                            return; // Exit collision detection early
                        }
                        
                        // Bonus platforms give double jump boost
                        if (platform.color === '#00FF00') {
                            p.jumpsRemaining = 3; // Extra jump
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
            p.x = game.spawn.x;
            p.y = game.spawn.y;
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
            
            // Add spiky visual effect for death traps
            if (platform.color === '#FF0000') {
                ctx.fillStyle = '#AA0000';
                // Draw spikes on top
                const spikeCount = Math.max(1, Math.floor(platform.width / (10 * game.scaleX)));
                const spikeWidth = platform.width / spikeCount;
                for (let i = 0; i < spikeCount; i++) {
                    const x = platform.x + i * spikeWidth;
                    ctx.beginPath();
                    ctx.moveTo(x, platform.y);
                    ctx.lineTo(x + spikeWidth/2, platform.y - 8 * game.scaleY);
                    ctx.lineTo(x + spikeWidth, platform.y);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            }
            
            // Add visual effects for moving platforms
            if (platform.isMoving) {
                // Draw motion lines
                ctx.strokeStyle = '#0088CC';
                ctx.lineWidth = 1 * game.scaleX;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(platform.x - 2, platform.y - 2, platform.width + 4, platform.height + 4);
                ctx.setLineDash([]); // Reset dash
                
                // Draw directional arrow
                ctx.fillStyle = '#0088CC';
                const arrowX = platform.x + platform.width / 2;
                const arrowY = platform.y - 15;
                const arrowSize = 6 * game.scaleX;
                
                ctx.beginPath();
                if (platform.moveDirection > 0) {
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
            if (platform.color === '#006600') {
                // Draw subtle pattern to indicate it's special
                ctx.fillStyle = '#004400';
                const patternSize = 4 * game.scaleX;
                for (let x = platform.x; x < platform.x + platform.width; x += patternSize * 2) {
                    for (let y = platform.y; y < platform.y + platform.height; y += patternSize * 2) {
                        ctx.fillRect(x, y, patternSize, patternSize);
                    }
                }
            }
            
            // Add visual effects for bonus platforms (bright green)
            if (platform.color === '#00FF00') {
                // Draw glowing effect
                ctx.shadowColor = '#00FF00';
                ctx.shadowBlur = 10 * game.scaleX;
                ctx.fillStyle = platform.color;
                ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
                ctx.shadowBlur = 0; // Reset shadow
            }
            
            // Add visual effects for goal platforms
            if (platform.color === '#FFD700') {
                // Draw shimmering effect
                ctx.fillStyle = '#FFFF00';
                const shimmerOffset = Math.sin(Date.now() * 0.01) * 5;
                ctx.fillRect(platform.x + shimmerOffset, platform.y - 2, platform.width, 2);
                
                // Draw goal flag or marker
                ctx.fillStyle = '#FF6600';
                ctx.fillRect(platform.x + platform.width - 10, platform.y - 20, 8, 15);
                ctx.fillStyle = '#FFFF00';
                ctx.fillRect(platform.x + platform.width - 10, platform.y - 20, 6, 8);
            }
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
            updatePlayer();
            updateMovingPlatforms();
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
                    new Platform(
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
                    p.strokeWeight(3);
                    
                    p.fill(255, 220, 177);
                    p.circle(0, 10, 16);
                    
                    p.line(0, 18, 0, 30);
                    
                    let armSwing = p.sin(p.frameCount * 0.3) * 0.3;
                    if (p.abs(this.vx) > 0.1) {
                        p.line(0, 22, (-8 + armSwing * 8), 28);
                        p.line(0, 22, (8 - armSwing * 8), 28);
                    } else {
                        p.line(0, 22, -6, 28);
                        p.line(0, 22, 6, 28);
                    }
                    
                    let legSwing = p.sin(p.frameCount * 0.4) * 0.4;
                    if (p.abs(this.vx) > 0.1 && this.onGround) {
                        p.line(0, 30, (-6 + legSwing * 6), 40);
                        p.line(0, 30, (6 - legSwing * 6), 40);
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
                    
                    // Add visual effects for goal platforms (gold)
                    if (this.color[0] === 255 && this.color[1] === 215 && this.color[2] === 0) {
                        // Draw shimmering effect
                        p.fill(255, 255, 0);
                        const shimmerOffset = Math.sin(Date.now() * 0.01) * 5;
                        p.rect(this.x + shimmerOffset, this.y - 2, this.width, 2);
                        
                        // Draw goal flag or marker
                        p.fill(255, 102, 0);
                        p.rect(this.x + this.width - 10, this.y - 20, 8, 15);
                        p.fill(255, 255, 0);
                        p.rect(this.x + this.width - 10, this.y - 20, 6, 8);
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
                
                player = new Player(0, 0, scaleX, scaleY);
                
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
