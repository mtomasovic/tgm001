# Level Variety & Randomness Enhancements

## Overview
This document describes the enhancements made to increase randomness and variety in level generation while maintaining difficulty progression.

## Key Changes

### 1. Hybrid Pattern System
**What**: Levels can now combine two different path generation patterns in a single level.
- After level 3, there's an increasing chance (up to 40%) to mix two patterns
- Primary pattern generates ~50% of platforms, secondary pattern generates the rest
- Each pattern has its own shuffle and transform settings for unique combinations

**Why**: Creates more unpredictable and visually distinct levels by blending different structures (e.g., zigzag + tower, spiral + valley).

### 2. Randomization Parameters
**New per-level variables**:
- `shuffleFactor` (0-1): Controls how much platforms deviate from the base pattern
- `transformType` (0-3): Determines which transformation to apply to the entire level
- `levelSeed`: Unique seed for each level to ensure different generation
- Randomized starting positions for both platform spawn and player spawn

**Impact**: Same pattern type (e.g., "linear") can look completely different each time.

### 3. Sub-Pattern Variations
Each path generator now has internal variations:

**Linear Path**:
- Sub-pattern 0: Steady climb
- Sub-pattern 1: Accelerating climb (gets steeper)
- Sub-pattern 2: Variable climb (alternating big/small steps)
- Gap variation: 0-60 pixels based on shuffle factor
- Trap placement: After, on, or before platforms

**Zigzag Path**:
- Random starting direction (up or down)
- Amplitude variation: 50-90 pixels
- Frequency variation: Switches every 2-3 platforms
- Varied trap placement (left or right side)

**Tower Path**:
- Style 0: Straight tower
- Style 1: Leaning tower (with lean factor)
- Style 2: Spiraling tower (sine wave)
- Variable stepping stone placement

**Valley Path**:
- Depth variation: 80-180 pixels
- Asymmetry: Valley bottom can shift left or right
- Variable descent/ascent rates

**Scattered Path**:
- Cluster spread: 100-250 pixels
- Pattern: Horizontal or vertical emphasis
- Variable cluster distributions

**Spiral Path**:
- Random starting angle
- Radius: 70-150+ pixels
- Random clockwise/counterclockwise direction
- Variable center position
- Adjustable tightness (10-25 pixels per step)

**Branching Path**:
- 2-3 branches per level
- Early or late branching style
- Variable branch lengths based on shuffle factor

**Pyramid Path**:
- Width variation: 100-160 pixels
- Centered or offset style
- 3-5 levels in the pyramid
- Position jitter on each platform

### 4. Level Transformations
After pattern generation, a random transformation is applied:

**Type 0: Vertical Shuffle**
- Randomly shifts platforms up/down by ±30 pixels
- Preserves general structure while adding vertical variety

**Type 1: Horizontal Jitter**
- Adds ±20 pixel horizontal offsets
- Makes gaps and alignments less predictable

**Type 2: Size Variation**
- Randomizes platform widths by ±40 pixels
- Creates mix of larger and smaller landing areas

**Type 3: Wave Pattern**
- Applies sinusoidal wave to platform heights
- Creates flowing, undulating level structure

**Additional Micro-adjustments** (levels 6+):
- 20% chance for tiny random adjustments (±15 pixels X/Y)
- Adds final layer of uniqueness

### 5. Enhanced Randomness in Details
- **Starting platforms**: Varied width (80-140) and position
- **Gap sizes**: Larger random variation ranges
- **Platform widths**: More dynamic sizing within each pattern
- **Death trap placement**: Multiple placement strategies per pattern
- **Death trap sizes**: 12-25 pixels (was fixed 10-20)
- **Climb rates**: Pattern-specific variation formulas
- **Branch structures**: Variable length and direction

## Difficulty Progression Preservation

Despite increased randomness, difficulty still scales properly:

1. **Base parameters still increase with level**:
   - Gap size: 60 → 200 pixels
   - Platform height range: 150 → 600 pixels
   - Death trap chance: 0% → 40%
   - Platform size: 95 → 35 pixels (smaller = harder)

2. **Transformations respect difficulty**:
   - Don't modify spawn or goal platforms
   - Don't alter death traps
   - Stay within reasonable bounds

3. **Pattern complexity increases**:
   - Hybrid patterns only appear after level 3
   - More platforms per level as you progress
   - Moving platforms added after level 5

4. **Validation remains strict**:
   - All levels still verified as completable
   - Fallback level if generation fails after 10 attempts

## Result
Each level now feels unique and fresh while maintaining:
- Mathematical completability
- Appropriate difficulty for the level number
- Visual and structural distinctiveness
- Engaging gameplay variety

Players will encounter significantly more diverse challenges across repeated playthroughs, with the same level number never looking the same twice.
