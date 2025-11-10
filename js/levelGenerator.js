// Level Generation System
// This file contains all the procedural level generation logic

// Track last used patterns to ensure variety
let lastUsedPatterns = [];
let lastGenerationTime = 0;

// Debug display function
function updateDebugDisplay(info) {
    try {
        const debugContent = document.getElementById('debug-content');
        if (!debugContent) {
            console.log('Debug window not found, skipping display update');
            return;
        }
        
        let html = '';
        html += `<div class="debug-line"><span class="debug-label">Level:</span> <span class="debug-info">${info.level}</span></div>`;
        html += `<div class="debug-line"><span class="debug-label">Pattern:</span> <span class="debug-success">${info.pattern}</span></div>`;
    
    if (info.secondaryPattern) {
        html += `<div class="debug-line"><span class="debug-label">Hybrid:</span> <span class="debug-success">${info.secondaryPattern}</span></div>`;
    }
    
    html += `<div class="debug-line"><span class="debug-label">Transform:</span> ${info.transformType}</div>`;
    html += `<div class="debug-line"><span class="debug-label">Shuffle:</span> ${info.shuffleFactor}</div>`;
    
    if (info.isFallback) {
        html += `<div class="debug-line"><span class="debug-error">⚠️ FALLBACK LEVEL</span></div>`;
        html += `<div class="debug-line"><span class="debug-label">Reason:</span> <span class="debug-warning">Failed ${info.attempts} validation attempts</span></div>`;
    } else {
        html += `<div class="debug-line"><span class="debug-success">✓ Completable</span> (attempt ${info.attempts})</div>`;
    }
    
    html += `<div class="debug-line"><span class="debug-label">Platforms:</span> ${info.platformCount}</div>`;
    html += `<div class="debug-line"><span class="debug-label">Goal:</span> (${info.goalX}, ${info.goalY})</div>`;
    html += `<div class="debug-line"><span class="debug-label">Start X:</span> ${info.startX}</div>`;
    
    if (info.patternReset) {
        html += `<div class="debug-line"><span class="debug-info">🔄 Pattern tracking reset</span></div>`;
    }
    
    html += `<div class="debug-line"><span class="debug-label">Timestamp:</span> ${info.timestamp}</div>`;
    
        debugContent.innerHTML = html;
    } catch (error) {
        console.error('Error updating debug display:', error);
    }
}

// Reset level generation state (call when starting a new game)
function resetLevelGeneration() {
    lastUsedPatterns = [];
    lastGenerationTime = 0;
    console.log('Level generation state reset');
}

// Random Level Generator
function generateLevel(levelNumber) {
    // Reset pattern tracking for Level 1 to ensure variety on page refresh or new game
    // Also reset if it's been more than 2 seconds since last generation (indicates new game)
    const currentTime = Date.now();
    const patternReset = (levelNumber === 1 || (currentTime - lastGenerationTime) > 2000);
    if (patternReset) {
        lastUsedPatterns = [];
        console.log('Pattern tracking reset for new game session');
    }
    lastGenerationTime = currentTime;
    
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
        attempts++;
        const level = generateLevelAttempt(levelNumber);
        
        // Validate if the level is completable
        if (isLevelCompletable(level)) {
            // Display debug info for successful generation
            updateDebugDisplay({
                level: levelNumber,
                pattern: level.debugInfo.pattern,
                secondaryPattern: level.debugInfo.secondaryPattern,
                transformType: level.debugInfo.transformType,
                shuffleFactor: level.debugInfo.shuffleFactor,
                isFallback: false,
                attempts: attempts,
                platformCount: level.platforms.length,
                goalX: Math.round(level.goal.x),
                goalY: Math.round(level.goal.y),
                startX: Math.round(level.debugInfo.startX),
                patternReset: patternReset,
                timestamp: level.debugInfo.timestamp
            });
            return level;
        }
    }
    
    // If we can't generate a valid level after maxAttempts, return a simple fallback level
    const fallbackLevel = generateFallbackLevel(levelNumber);
    
    // Display debug info for fallback generation
    updateDebugDisplay({
        level: levelNumber,
        pattern: 'FALLBACK',
        secondaryPattern: null,
        transformType: 'None',
        shuffleFactor: '0.00',
        isFallback: true,
        attempts: maxAttempts,
        platformCount: fallbackLevel.platforms.length,
        goalX: Math.round(fallbackLevel.goal.x),
        goalY: Math.round(fallbackLevel.goal.y),
        startX: 50,
        patternReset: patternReset,
        timestamp: Date.now() % 100000
    });
    
    return fallbackLevel;
}

// Helper function to check if a level is mathematically completable
function isLevelCompletable(level) {
    // More generous physics for validation - player can actually achieve these
    const jumpHeight = 150; // Realistic max height player can reach with double jump
    const jumpDistance = 200; // Realistic max horizontal distance with running + double jump
    
    // Start from spawn point - check from starting platform
    const visited = new Set();
    const queue = [];
    
    // Find the starting platform and add it to queue
    for (let platform of level.platforms) {
        if (platform.color === '#8B4513') { // Brown = starting platform
            // Add multiple points on the starting platform for better coverage
            queue.push({x: platform.x + platform.width/4, y: platform.y});
            queue.push({x: platform.x + platform.width/2, y: platform.y});
            queue.push({x: platform.x + 3*platform.width/4, y: platform.y});
            break;
        }
    }
    
    // Also add spawn point itself
    queue.push({x: level.spawn.x, y: level.spawn.y});
    
    while (queue.length > 0) {
        const current = queue.shift();
        const key = `${Math.floor(current.x/20)},${Math.floor(current.y/20)}`; // Larger grid for efficiency
        
        if (visited.has(key)) continue;
        visited.add(key);
        
        // Check if we can reach the goal platform from current position
        const goalPlatform = level.platforms.find(p => p.color === '#FFD700');
        if (goalPlatform) {
            // Check multiple points on goal platform
            const goalPoints = [
                {x: goalPlatform.x, y: goalPlatform.y},
                {x: goalPlatform.x + goalPlatform.width/2, y: goalPlatform.y},
                {x: goalPlatform.x + goalPlatform.width, y: goalPlatform.y}
            ];
            
            for (let goalPoint of goalPoints) {
                const distanceToGoal = Math.abs(current.x - goalPoint.x);
                const heightToGoal = current.y - goalPoint.y; // Positive means goal is higher
                
                // Can reach goal if within jump range
                if (distanceToGoal <= jumpDistance && heightToGoal <= jumpHeight && heightToGoal >= -500) {
                    return true; // Goal is reachable!
                }
            }
        }
        
        // Find all platforms reachable from current position
        for (let platform of level.platforms) {
            // Skip death traps for pathfinding
            if (platform.color === '#FF0000') continue;
            
            // Check multiple points on each platform (left, center, right)
            const platformPoints = [
                {x: platform.x + 10, y: platform.y},
                {x: platform.x + platform.width/2, y: platform.y},
                {x: platform.x + platform.width - 10, y: platform.y}
            ];
            
            for (let point of platformPoints) {
                const distanceTo = Math.abs(current.x - point.x);
                const heightDiff = current.y - point.y; // Positive means platform is higher
                
                // Check if platform is reachable with double jump
                if (distanceTo <= jumpDistance && heightDiff <= jumpHeight && heightDiff >= -500) {
                    const pointKey = `${Math.floor(point.x/20)},${Math.floor(point.y/20)}`;
                    if (!visited.has(pointKey)) {
                        queue.push(point);
                    }
                }
            }
        }
    }
    
    return false; // Goal not reachable
}

function generateLevelAttempt(levelNumber) {
    // Base difficulty parameters that increase with level - MORE AGGRESSIVE SCALING
    const baseGap = 60 + Math.min(levelNumber * 12, 140); // Wider gaps faster (60-200)
    const maxPlatformHeight = 150 + Math.min(levelNumber * 30, 450); // Higher platforms faster (150-600)
    const deathTrapChance = Math.min(levelNumber * 0.08, 0.4); // More death traps
    const platformSizeVariation = Math.max(80 - levelNumber * 3, 25); // Platform size gets smaller (80-25)
    const minPlatformSize = Math.max(95 - levelNumber * 4, 35); // Minimum platform size (95-35)
    
    // NEW: Add randomization seed and variation factors for each level
    // Using timestamp + random for true randomness on each generation
    const levelSeed = levelNumber * 13.37 + Math.random() * 1000 + Date.now() % 10000;
    const shuffleFactor = 0.3 + Math.random() * 0.7; // 0.3-1.0 ensures minimum variation
    const hybridChance = Math.min(0.2 + levelNumber * 0.05, 0.5); // Start at 20%, increase to 50%
    const transformType = Math.floor(Math.random() * 4); // Different transformation per level
    
    const platforms = [];
    const spawn = {x: 50, y: 500};
    
    // Randomize starting platform position and size - MORE VARIATION
    const startPlatformWidth = 70 + Math.random() * 80; // 70-150 instead of 80-140
    const startPlatformX = Math.random() * 60; // 0-60 instead of sometimes 0-50
    const startPlatformY = 570 + Math.random() * 20; // 570-590 for variety
    platforms.push({x: startPlatformX, y: startPlatformY, width: startPlatformWidth, height: 20, color: '#8B4513'});
    
    // Choose a random level pattern with weighted probabilities
    // Avoid repeating the last pattern to ensure visible variety
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
    
    // Shuffle patterns array for more randomness (Fisher-Yates shuffle)
    const shuffledPatterns = [...patterns];
    for (let i = shuffledPatterns.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPatterns[i], shuffledPatterns[j]] = [shuffledPatterns[j], shuffledPatterns[i]];
    }
    
    // Filter out recently used patterns for more variety
    let availablePatterns = shuffledPatterns;
    if (lastUsedPatterns.length > 0) {
        const lastPattern = lastUsedPatterns[lastUsedPatterns.length - 1];
        availablePatterns = shuffledPatterns.filter(p => p.name !== lastPattern);
        // Ensure we always have patterns available
        if (availablePatterns.length === 0) {
            availablePatterns = shuffledPatterns;
        }
    }
    
    const totalWeight = availablePatterns.reduce((sum, p) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedPattern = availablePatterns[0].name; // Fallback to first available
    
    for (let pattern of availablePatterns) {
        random -= pattern.weight;
        if (random <= 0) {
            selectedPattern = pattern.name;
            break;
        }
    }
    
    // Track this pattern
    lastUsedPatterns.push(selectedPattern);
    if (lastUsedPatterns.length > 3) {
        lastUsedPatterns.shift(); // Keep only last 3 patterns
    }
    
    // NEW: Maybe select a second pattern to hybrid mix
    let secondaryPattern = null;
    // Start hybrid mixing from level 2 instead of level 4
    if (levelNumber > 1 && Math.random() < hybridChance) {
        let secondRandom = Math.random() * totalWeight;
        let attempts = 0;
        for (let pattern of patterns) {
            if (pattern.name !== selectedPattern) {
                secondRandom -= pattern.weight;
                if (secondRandom <= 0 || attempts++ > 5) {
                    secondaryPattern = pattern.name;
                    break;
                }
            }
        }
    }
    
    // Vary starting position more dramatically - MUCH MORE VARIATION
    const startXVariation = 50 + Math.random() * 100; // 50-150 instead of 100-180
    const startYVariation = Math.random() * 100; // 0-100 instead of 0-80
    let currentX = 100 + startXVariation;
    let currentY = 480 + startYVariation; // 480-580 varied start height (more range)
    const maxPlatforms = 5 + Math.floor(levelNumber / 1.5); // More platforms per level
    const platformsPerPattern = secondaryPattern ? Math.floor(maxPlatforms / 2) : maxPlatforms;
    
    // Generate primary pattern
    const patternConfig = {
        platforms,
        currentX,
        currentY,
        maxPlatforms: platformsPerPattern,
        levelNumber,
        baseGap,
        minPlatformSize,
        platformSizeVariation,
        deathTrapChance,
        shuffleFactor, // NEW: pass shuffle factor
        transformType  // NEW: pass transform type
    };
    
    switch (selectedPattern) {
        case 'linear':
            generateLinearPath(patternConfig);
            break;
        case 'zigzag':
            generateZigzagPath(patternConfig);
            break;
        case 'tower':
            generateTowerPath(patternConfig);
            break;
        case 'valley':
            generateValleyPath(patternConfig);
            break;
        case 'scattered':
            generateScatteredPath(patternConfig);
            break;
        case 'spiral':
            generateSpiralPath(patternConfig);
            break;
        case 'branching':
            generateBranchingPath(patternConfig);
            break;
        case 'pyramid':
            generatePyramidPath(patternConfig);
            break;
    }
    
    // NEW: Generate secondary hybrid pattern if selected
    if (secondaryPattern) {
        // Find the furthest platform to continue from
        let furthestX = 0;
        let furthestY = 500;
        for (let p of platforms) {
            if (p.x > furthestX && p.color !== '#FF0000') {
                furthestX = p.x;
                furthestY = p.y;
            }
        }
        
        const secondConfig = {
            platforms,
            currentX: furthestX + 60,
            currentY: furthestY + (Math.random() - 0.5) * 100, // Random vertical offset
            maxPlatforms: maxPlatforms - platformsPerPattern,
            levelNumber,
            baseGap,
            minPlatformSize,
            platformSizeVariation,
            deathTrapChance,
            shuffleFactor: Math.random(), // Different shuffle for second pattern
            transformType: Math.floor(Math.random() * 4)
        };
        
        switch (secondaryPattern) {
            case 'linear':
                generateLinearPath(secondConfig);
                break;
            case 'zigzag':
                generateZigzagPath(secondConfig);
                break;
            case 'tower':
                generateTowerPath(secondConfig);
                break;
            case 'valley':
                generateValleyPath(secondConfig);
                break;
            case 'scattered':
                generateScatteredPath(secondConfig);
                break;
            case 'spiral':
                generateSpiralPath(secondConfig);
                break;
            case 'branching':
                generateBranchingPath(secondConfig);
                break;
            case 'pyramid':
                generatePyramidPath(secondConfig);
                break;
        }
    }
    
    // NEW: Apply random transformations to all platforms
    applyLevelTransformations(platforms, transformType, shuffleFactor, levelNumber);
    
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
    
    // Goal platform - MORE DRAMATIC HEIGHT AND POSITION DIFFERENCES
    // Add significant random variation to goal position for each level generation
    const baseGoalHeight = Math.max(80, 400 - levelNumber * 12);
    const goalHeightVariation = Math.random() * 120 - 60; // ±60 pixels variation
    const goalHeight = Math.max(80, Math.min(500, baseGoalHeight + goalHeightVariation));
    
    // Much more varied goal X position
    const baseGoalX = selectedPattern === 'valley' ? 400 + Math.random() * 200 : 600 + Math.random() * 150;
    const goalXVariation = Math.random() * 100 - 50; // ±50 pixels variation
    const goalX = Math.max(550, Math.min(750, baseGoalX + goalXVariation));
    
    const goal = {x: goalX, y: goalHeight};
    
    platforms.push({
        x: goal.x,
        y: goal.y,
        width: 80 + Math.random() * 40,
        height: 20,
        color: '#FFD700'
    });
    
    // Log level generation info for debugging - ENHANCED LOGGING
    const timestamp = Date.now() % 100000; // Last 5 digits for uniqueness
    console.log(`[${timestamp}] Level ${levelNumber}: Pattern=${selectedPattern}${secondaryPattern ? '+' + secondaryPattern : ''}, Transform=${transformType}, Shuffle=${shuffleFactor.toFixed(2)}, Platforms=${platforms.length}, GoalPos=(${Math.round(goal.x)},${Math.round(goal.y)}), StartX=${Math.round(currentX)}`);
    
    const transformNames = ['Vertical Shuffle', 'Horizontal Jitter', 'Size Variation', 'Wave Pattern'];
    
    return {
        platforms: platforms,
        spawn: spawn,
        goal: goal,
        debugInfo: {
            pattern: selectedPattern,
            secondaryPattern: secondaryPattern,
            transformType: transformNames[transformType],
            shuffleFactor: shuffleFactor.toFixed(2),
            startX: currentX,
            timestamp: timestamp
        }
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

// Apply random transformations to create unique level variations
function applyLevelTransformations(platforms, transformType, shuffleFactor, levelNumber) {
    // Don't transform spawn platform or goal platform
    const nonSpecialPlatforms = platforms.filter(p => 
        p.color !== '#8B4513' && p.color !== '#FFD700'
    );
    
    // Ensure minimum shuffle strength for visible differences
    const effectiveShuffleFactor = Math.max(shuffleFactor, 0.4);
    
    switch (transformType) {
        case 0: // Vertical shuffle - shift platforms up/down randomly
            for (let platform of nonSpecialPlatforms) {
                if (Math.random() < effectiveShuffleFactor * 0.8 && platform.color !== '#FF0000') {
                    const shift = (Math.random() - 0.5) * 80; // Increased from 60 to 80
                    platform.y = Math.max(100, Math.min(560, platform.y + shift));
                }
            }
            break;
            
        case 1: // Horizontal jitter - slight x position changes
            for (let platform of nonSpecialPlatforms) {
                if (Math.random() < effectiveShuffleFactor) {
                    const jitter = (Math.random() - 0.5) * 60; // Increased from 40 to 60
                    platform.x = Math.max(50, Math.min(700, platform.x + jitter));
                }
            }
            break;
            
        case 2: // Size variation - randomize platform widths
            for (let platform of nonSpecialPlatforms) {
                if (Math.random() < effectiveShuffleFactor && platform.color !== '#FF0000') {
                    const sizeChange = (Math.random() - 0.5) * 50; // Increased from 40 to 50
                    platform.width = Math.max(35, Math.min(130, platform.width + sizeChange));
                }
            }
            break;
            
        case 3: // Rotation simulation - create slanted patterns
            // Group platforms and shift them in waves
            const waveFrequency = 0.15 + Math.random() * 0.15; // More visible waves
            const waveAmplitude = 50 * effectiveShuffleFactor; // Increased amplitude
            for (let i = 0; i < nonSpecialPlatforms.length; i++) {
                const platform = nonSpecialPlatforms[i];
                if (platform.color !== '#FF0000') {
                    const wave = Math.sin(i * waveFrequency) * waveAmplitude;
                    platform.y = Math.max(100, Math.min(560, platform.y + wave));
                }
            }
            break;
    }
    
    // Additional random micro-adjustments for all levels (not just 5+)
    if (levelNumber > 1) {
        for (let platform of nonSpecialPlatforms) {
            if (Math.random() < 0.3 && platform.color !== '#FF0000') {
                // Increased micro-adjustments
                platform.x += (Math.random() - 0.5) * 20;
                platform.y += (Math.random() - 0.5) * 20;
                platform.x = Math.max(50, Math.min(700, platform.x));
                platform.y = Math.max(100, Math.min(560, platform.y));
            }
        }
    }
}
