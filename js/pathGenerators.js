// Path Generation Patterns
// This file contains all the different path generation algorithms

// Linear ascending path
function generateLinearPath(config) {
    const {platforms, currentX: startX, currentY: startY, maxPlatforms, levelNumber, 
           baseGap, minPlatformSize, platformSizeVariation, deathTrapChance, 
           shuffleFactor = 0.5, transformType = 0} = config;
    
    let currentX = startX;
    let currentY = startY;
    
    // NEW: Add sub-pattern variation
    const subPattern = Math.floor(Math.random() * 3);
    const stepVariation = Math.random(); // 0-1 for step size variation
    
    for (let i = 0; i < maxPlatforms && currentX < 600; i++) {
        // More gap variation based on shuffle factor
        const gapVariation = shuffleFactor * 60; // 0-60 extra variation
        const gap = Math.max(40, baseGap + (Math.random() - 0.5) * gapVariation);
        currentX += gap;
        
        // Different climbing patterns based on sub-pattern
        let heightDrop;
        switch (subPattern) {
            case 0: // Steady climb
                heightDrop = 40 + Math.random() * 40 + (levelNumber * 5);
                break;
            case 1: // Accelerating climb (gets steeper)
                heightDrop = 30 + (i * 10) + Math.random() * 30 + (levelNumber * 4);
                break;
            case 2: // Variable climb (big steps and small steps)
                heightDrop = (i % 2 === 0 ? 60 : 25) + Math.random() * 35 + (levelNumber * 5);
                break;
        }
        
        // Apply step variation
        heightDrop *= (0.7 + stepVariation * 0.6); // 70%-130% of calculated height
        
        currentY -= heightDrop;
        currentY = Math.max(100, currentY);
        
        // Platform width variation increases with shuffle factor
        const widthVar = platformSizeVariation * (0.5 + shuffleFactor * 0.5);
        const platformWidth = minPlatformSize + Math.random() * widthVar;
        
        const newPlatform = {
            x: currentX,
            y: currentY,
            width: platformWidth,
            height: 20,
            color: '#009600'
        };
        
        // Use safe platform addition with collision checking
        if (!addPlatformSafely(platforms, newPlatform, true)) {
            // If we couldn't add this platform, try to continue with adjusted position
            currentX += 40; // Skip ahead a bit more
            continue;
        }
        
        // Add death traps with varied placement
        if (levelNumber > 1 && Math.random() < deathTrapChance * 0.4) {
            const trapPlacement = Math.random();
            let trapX, trapY;
            
            if (trapPlacement < 0.4) { // After platform
                trapX = currentX + platformWidth + 10;
                trapY = currentY + 25;
            } else if (trapPlacement < 0.7) { // On platform
                trapX = currentX + platformWidth * 0.3;
                trapY = currentY + 25;
            } else { // Before platform
                trapX = currentX - 25;
                trapY = currentY + 25;
            }
            
            const deathTrap = {
                x: trapX,
                y: trapY,
                width: 15 + Math.random() * 10,
                height: 20,
                color: '#FF0000'
            };
            
            // Only add death trap if it doesn't overlap (no adjustment for traps)
            addPlatformSafely(platforms, deathTrap, false);
        }
    }
}

// Zigzag up and down path
function generateZigzagPath(config) {
    const {platforms, currentX: startX, currentY: startY, maxPlatforms, levelNumber, 
           baseGap, minPlatformSize, platformSizeVariation, deathTrapChance, 
           shuffleFactor = 0.5, transformType = 0} = config;
    
    let currentX = startX;
    let currentY = startY;
    let goingUp = Math.random() < 0.5; // Randomize starting direction
    
    // NEW: Vary zigzag amplitude and frequency
    const amplitude = 50 + shuffleFactor * 40; // 50-90
    const frequency = Math.random() < 0.5 ? 2 : 3; // Switches every 2 or 3 platforms
    
    for (let i = 0; i < maxPlatforms && currentX < 600; i++) {
        const gap = Math.max(50, baseGap + (Math.random() - 0.5) * 30);
        currentX += gap;
        
        // Switch direction based on frequency
        if (i > 0 && i % frequency === 0) {
            goingUp = !goingUp;
        }
        
        // Zigzag pattern with varied amplitude
        if (goingUp) {
            currentY -= amplitude + Math.random() * 40;
            if (currentY < 150) goingUp = false;
        } else {
            currentY += (amplitude * 0.7) + Math.random() * 30;
            if (currentY > 520) goingUp = true;
        }
        currentY = Math.max(150, Math.min(550, currentY));
        
        const platformWidth = minPlatformSize + Math.random() * platformSizeVariation;
        
        const newPlatform = {
            x: currentX,
            y: currentY,
            width: platformWidth,
            height: 20,
            color: '#009600'
        };
        
        // Use safe platform addition with collision checking
        if (!addPlatformSafely(platforms, newPlatform, true)) {
            currentX += 40;
            continue;
        }
        
        // More varied death trap placement in zigzag
        if (levelNumber > 2 && Math.random() < deathTrapChance * 0.6) {
            const placement = Math.random();
            platforms.push({
                x: placement < 0.5 ? currentX - 15 : currentX + platformWidth - 10,
                y: currentY + 25,
                width: 12 + Math.random() * 8,
                height: 20,
                color: '#FF0000'
            });
        }
    }
}

// Vertical tower climbing
function generateTowerPath(config) {
    const {platforms, currentX: startX, currentY: startY, maxPlatforms, levelNumber, 
           baseGap, minPlatformSize, platformSizeVariation, deathTrapChance, 
           shuffleFactor = 0.5, transformType = 0} = config;
    
    let currentX = startX;
    let currentY = startY;
    
    // NEW: Vary tower structure - straight up, leaning, or spiraling
    const towerStyle = Math.floor(Math.random() * 3);
    const lean = (Math.random() - 0.5) * shuffleFactor * 40; // -20 to +20 lean per platform
    
    for (let i = 0; i < maxPlatforms && currentX < 500; i++) {
        const gap = Math.max(30, baseGap * 0.7 + (Math.random() - 0.5) * 30);
        
        // Apply tower style
        switch (towerStyle) {
            case 0: // Straight tower
                currentX += gap * 0.3;
                break;
            case 1: // Leaning tower
                currentX += gap * 0.4 + lean;
                break;
            case 2: // Spiraling tower
                currentX += gap * 0.5 + Math.sin(i * 0.8) * 30;
                break;
        }
        
        // Steep climb with variation
        const climbHeight = 70 + Math.random() * 40 + (shuffleFactor * 20);
        currentY -= climbHeight;
        currentY = Math.max(100, currentY);
        
        const platformWidth = Math.max(40, minPlatformSize * 0.8 + Math.random() * (platformSizeVariation * 0.6));
        
        platforms.push({
            x: currentX,
            y: currentY,
            width: platformWidth,
            height: 20,
            color: '#009600'
        });
        
        // Add stepping stones with varied placement
        if (i > 0 && Math.random() < 0.4 + shuffleFactor * 0.3) {
            const stepX = currentX + (Math.random() - 0.5) * 60;
            const stepY = currentY + 35 + Math.random() * 15;
            platforms.push({
                x: stepX,
                y: stepY,
                width: 25 + Math.random() * 15,
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
function generateValleyPath(config) {
    const {platforms, currentX: startX, currentY: startY, maxPlatforms, levelNumber, 
           baseGap, minPlatformSize, platformSizeVariation, deathTrapChance, 
           shuffleFactor = 0.5, transformType = 0} = config;
    
    let currentX = startX;
    let currentY = startY;
    
    // NEW: Randomize valley shape - shallow, deep, or asymmetric
    const valleyDepth = 80 + shuffleFactor * 100; // 80-180
    const valleyAsymmetry = (Math.random() - 0.5) * 0.3; // -0.15 to +0.15
    
    for (let i = 0; i < maxPlatforms && currentX < 600; i++) {
        const gap = Math.max(45, baseGap + (Math.random() - 0.5) * 35);
        currentX += gap;
        
        // Create valley shape with asymmetry
        const valleyProgress = i / maxPlatforms + valleyAsymmetry;
        if (valleyProgress < 0.5) {
            // Going down into valley
            const descentRate = 1 - Math.abs(valleyProgress - 0.25) * 2; // Peaks at 0.25
            currentY += (30 + Math.random() * 30) * (1 + descentRate);
        } else {
            // Coming up from valley  
            const ascentRate = (valleyProgress - 0.5) * 2; // Increases after midpoint
            currentY -= (40 + Math.random() * 40) * (1 + ascentRate * 0.5);
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
        
        // More traps in the valley bottom with varied sizes
        if (levelNumber > 2 && valleyProgress > 0.3 && valleyProgress < 0.7 && Math.random() < deathTrapChance * 0.7) {
            platforms.push({
                x: currentX + Math.random() * platformWidth * 0.7,
                y: currentY + 25,
                width: 12 + Math.random() * 8,
                height: 20,
                color: '#FF0000'
            });
        }
    }
}

// Scattered platform layout with better connectivity
function generateScatteredPath(config) {
    const {platforms, currentX: startX, currentY: startY, maxPlatforms, levelNumber, 
           baseGap, minPlatformSize, platformSizeVariation, deathTrapChance, 
           shuffleFactor = 0.5, transformType = 0} = config;
    
    const platformPositions = [];
    const clusters = Math.min(3, Math.floor(levelNumber / 3) + 1); // Create platform clusters
    
    // NEW: Vary cluster distribution
    const clusterSpread = 100 + shuffleFactor * 150; // 100-250
    const clusterPattern = Math.floor(Math.random() * 2); // Horizontal or vertical emphasis
    
    // Generate clustered positions for better flow
    for (let cluster = 0; cluster < clusters; cluster++) {
        const clusterCenterX = 200 + (cluster / Math.max(1, clusters - 1)) * 350;
        const clusterCenterY = 250 + Math.random() * 200;
        const platformsPerCluster = Math.floor(maxPlatforms / clusters);
        
        for (let i = 0; i < platformsPerCluster; i++) {
            const angle = (i / platformsPerCluster) * Math.PI * 2;
            const radius = 40 + Math.random() * clusterSpread * 0.5;
            
            let x, y;
            if (clusterPattern === 0) { // Horizontal spread
                x = clusterCenterX + Math.cos(angle) * radius * 1.5 + Math.random() * 40 - 20;
                y = clusterCenterY + Math.sin(angle) * radius * 0.7 + Math.random() * 40 - 20;
            } else { // Vertical spread
                x = clusterCenterX + Math.cos(angle) * radius * 0.7 + Math.random() * 40 - 20;
                y = clusterCenterY + Math.sin(angle) * radius * 1.5 + Math.random() * 40 - 20;
            }
            
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
        
        const newPlatform = {
            x: pos.x,
            y: pos.y,
            width: finalWidth,
            height: 20,
            color: '#009600'
        };
        
        // Use safe platform addition with collision checking
        addPlatformSafely(platforms, newPlatform, true);
        
        // Add connecting platforms if gap is too large
        if (i > 0) {
            const prevPos = platformPositions[i - 1];
            const distance = Math.abs(pos.x - prevPos.x);
            const heightDiff = Math.abs(pos.y - prevPos.y);
            
            if (distance > 140 || heightDiff > 120) {
                // Add intermediate platform with variation
                const midX = (pos.x + prevPos.x) / 2 + (Math.random() - 0.5) * 40;
                const midY = (pos.y + prevPos.y) / 2 + (Math.random() - 0.5) * 40;
                
                const bridgePlatform = {
                    x: midX,
                    y: midY,
                    width: 40 + Math.random() * 30,
                    height: 20,
                    color: '#009600'
                };
                
                // Only add if it doesn't overlap
                addPlatformSafely(platforms, bridgePlatform, true);
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
function generateSpiralPath(config) {
    const {platforms, currentX: startX, currentY: startY, maxPlatforms, levelNumber, 
           baseGap, minPlatformSize, platformSizeVariation, deathTrapChance, 
           shuffleFactor = 0.5, transformType = 0} = config;
    
    let currentX = startX;
    let currentY = startY;
    let angle = Math.random() * Math.PI; // Random starting angle
    
    // NEW: Vary spiral characteristics
    const spiralRadius = 70 + levelNumber * 5 + shuffleFactor * 40; // 70-150+
    const spiralTightness = 10 + shuffleFactor * 15; // How much radius shrinks per step
    const centerX = 320 + Math.random() * 80; // Randomize center
    const centerY = 380 + Math.random() * 80;
    const clockwise = Math.random() < 0.5 ? 1 : -1; // Random direction
    
    for (let i = 0; i < maxPlatforms && currentX < 600; i++) {
        const angleStep = (Math.PI / 3 + Math.random() * Math.PI / 6) * clockwise; // 60-90 degrees
        angle += angleStep;
        
        const currentRadius = spiralRadius - i * spiralTightness;
        currentX = centerX + Math.cos(angle) * currentRadius;
        currentY = centerY - Math.sin(angle) * currentRadius - i * (15 + shuffleFactor * 10); // Ascending
        
        // Keep within bounds
        currentX = Math.max(150, Math.min(650, currentX));
        currentY = Math.max(150, Math.min(550, currentY));
        
        // Platform gets smaller as we spiral up
        const platformWidth = Math.max(35, minPlatformSize - i * 5); 
        
        platforms.push({
            x: currentX,
            y: currentY,
            width: platformWidth,
            height: 20,
            color: '#009600'
        });
        
        // Strategic death traps - more in outer spiral
        if (levelNumber > 3 && Math.random() < deathTrapChance * 0.4) {
            const trapOffset = Math.random() < 0.5 ? platformWidth + 10 : -15;
            platforms.push({
                x: currentX + trapOffset,
                y: currentY + 25,
                width: 12 + Math.random() * 8,
                height: 20,
                color: '#FF0000'
            });
        }
    }
}

// Branching path with multiple routes
function generateBranchingPath(config) {
    const {platforms, currentX: startX, currentY: startY, maxPlatforms, levelNumber, 
           baseGap, minPlatformSize, platformSizeVariation, deathTrapChance, 
           shuffleFactor = 0.5, transformType = 0} = config;
    
    let currentX = startX;
    let currentY = startY;
    
    // NEW: Vary branching structure
    const branchCount = 2 + Math.floor(shuffleFactor * 2); // 2-3 branches
    const branchingStyle = Math.floor(Math.random() * 2); // Early or late branching
    
    // Main path
    const mainPlatforms = Math.floor(maxPlatforms * 0.7);
    for (let i = 0; i < mainPlatforms && currentX < 500; i++) {
        const gap = Math.max(50, baseGap + (Math.random() - 0.5) * 35);
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
        
        // Create branches at varied points
        const branchPoints = branchingStyle === 0 ? 
            [Math.floor(mainPlatforms / 4), Math.floor(mainPlatforms / 2)] : // Early branching
            [Math.floor(mainPlatforms / 2), Math.floor(mainPlatforms * 3/4)]; // Late branching
        
        if (branchPoints.includes(i)) {
            createBranch(platforms, currentX, currentY, levelNumber, minPlatformSize, deathTrapChance, shuffleFactor);
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
function createBranch(platforms, branchX, branchY, levelNumber, minPlatformSize, deathTrapChance, shuffleFactor = 0.5) {
    // Create upper and lower branches with variation
    const directions = [1, -1]; // up and down
    const branchLength = 2 + Math.floor(shuffleFactor); // 2-3 platforms per branch
    
    for (let dir of directions) {
        let branchCurrentX = branchX + 30 + Math.random() * 20;
        let branchCurrentY = branchY + dir * (50 + shuffleFactor * 30);
        
        for (let i = 0; i < branchLength && branchCurrentX < 650; i++) {
            branchCurrentX += 60 + Math.random() * 40;
            branchCurrentY += dir * (20 + Math.random() * 25);
            branchCurrentY = Math.max(150, Math.min(550, branchCurrentY));
            
            const platformWidth = Math.max(35, minPlatformSize * (0.7 + Math.random() * 0.2));
            
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
function generatePyramidPath(config) {
    const {platforms, currentX: startX, currentY: startY, maxPlatforms, levelNumber, 
           baseGap, minPlatformSize, platformSizeVariation, deathTrapChance, 
           shuffleFactor = 0.5, transformType = 0} = config;
    
    let currentX = startX;
    let currentY = startY;
    let pyramidLevel = 0;
    
    // NEW: Vary pyramid characteristics
    const pyramidWidth = 100 + shuffleFactor * 60; // 100-160
    const pyramidStyle = Math.floor(Math.random() * 2); // Centered or offset
    const maxLevels = 3 + Math.floor(shuffleFactor * 2); // 3-5 levels
    
    for (let i = 0; i < maxPlatforms && currentX < 600 && pyramidLevel < maxLevels; i++) {
        // Create pyramid structure - fewer platforms as we go up
        const platformsInLevel = Math.max(1, 3 - pyramidLevel);
        
        for (let j = 0; j < platformsInLevel && currentX < 600; j++) {
            const gap = pyramidWidth / (platformsInLevel + 1);
            currentX += gap + (Math.random() - 0.5) * 20; // Add jitter
            
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
        currentY -= 60 + Math.random() * 40;
        currentY = Math.max(150, currentY);
        
        // Pyramid style affects horizontal offset
        if (pyramidStyle === 0) {
            currentX = startX + pyramidLevel * 40; // Centered offset
        } else {
            currentX = startX + pyramidLevel * (30 + Math.random() * 20); // Random offset
        }
    }
}
