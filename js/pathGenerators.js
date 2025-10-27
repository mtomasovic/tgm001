// Path Generation Patterns
// This file contains all the different path generation algorithms

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
