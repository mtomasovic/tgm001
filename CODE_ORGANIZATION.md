# Code Organization

## Project Structure

The game code has been reorganized into modular files for better maintainability:

### Core Game Files

- **`js/main.js`** - Main application entry point, handles initialization and game creation
- **`js/levelGenerator.js`** - Level generation system with validation logic
- **`js/pathGenerators.js`** - Different path pattern algorithms (linear, zigzag, tower, valley, etc.)
- **`js/alternativeRoutes.js`** - Alternative route creation (upper, lower, secret paths) and moving platforms
- **`js/gameEntities.js`** - Player and Platform classes for Canvas renderer
- **`js/virtualGamepad.js`** - Virtual gamepad implementation for mobile support
- **`js/canvasGame.js`** - Canvas-based game implementation (fallback)
- **`js/p5Game.js`** - p5.js-based game implementation (primary renderer)

### Legacy Files

- **`js/app.js`** - Original monolithic file (can be removed after testing)

## Module Dependencies

```
main.js
  ├─> levelGenerator.js
  │     ├─> pathGenerators.js
  │     └─> alternativeRoutes.js
  ├─> canvasGame.js
  │     ├─> gameEntities.js
  │     └─> virtualGamepad.js
  └─> p5Game.js
        └─> virtualGamepad.js
```

## File Responsibilities

### `levelGenerator.js`
- `generateLevel()` - Main level generation with retry logic
- `isLevelCompletable()` - Pathfinding validation to ensure levels are winnable
- `generateLevelAttempt()` - Creates a level attempt with selected pattern
- `generateFallbackLevel()` - Simple guaranteed completable level

### `pathGenerators.js`
- `generateLinearPath()` - Gradual ascending path
- `generateZigzagPath()` - Up and down zigzag pattern
- `generateTowerPath()` - Vertical tower climbing
- `generateValleyPath()` - Valley and hill pattern
- `generateScatteredPath()` - Clustered scattered platforms
- `generateSpiralPath()` - Spiral ascending pattern
- `generateBranchingPath()` - Multiple branching routes
- `generatePyramidPath()` - Pyramid climbing pattern
- `createBranch()` - Helper for branching paths

### `alternativeRoutes.js`
- `addMovingPlatforms()` - Adds moving platforms for advanced levels
- `addAlternativeRoute()` - Adds alternative routes to levels
- `createUpperRoute()` - Creates upper alternative path
- `createLowerRoute()` - Creates lower alternative path
- `createSecretRoute()` - Creates hidden shortcut path

### `gameEntities.js`
- `CanvasPlayer` - Player class for Canvas renderer
- `CanvasPlatform` - Platform class for Canvas renderer

### `virtualGamepad.js`
- `VirtualGamepad` - Virtual gamepad for mobile devices
  - D-pad for movement
  - Jump button
  - Touch event handling

### `canvasGame.js`
- `createCanvasGame()` - Complete Canvas-based game implementation
- Handles input, rendering, collision detection
- Uses CanvasPlayer and CanvasPlatform classes

### `p5Game.js`
- `createP5Game()` - Complete p5.js-based game implementation
- P5Player and P5Platform classes
- Handles input, rendering, collision detection

### `main.js`
- `createGame()` - Selects p5.js or Canvas renderer
- `App()` - Application initialization and UI setup
- Event handlers for game lifecycle

## Loading Order

The HTML file loads scripts in this order:

1. External libraries (p5.js, React)
2. Level generation modules
3. Path generation modules
4. Alternative routes module
5. Game entities module
6. Virtual gamepad module
7. Game renderer modules (Canvas and p5.js)
8. Main application entry point

## Benefits of This Organization

1. **Modularity** - Each file has a single, clear responsibility
2. **Maintainability** - Easy to find and modify specific features
3. **Testability** - Individual modules can be tested independently
4. **Readability** - Smaller files are easier to understand
5. **Reusability** - Modules can be reused in other projects
6. **Collaboration** - Multiple developers can work on different modules
7. **Debugging** - Issues are easier to isolate and fix

## Future Improvements

- Add ES6 module syntax (import/export) for better dependency management
- Add TypeScript for type safety
- Add unit tests for level generation and validation
- Split game entities into separate Player and Platform files
- Add a configuration file for game constants
- Add a sound manager module
- Add a particle effects module
