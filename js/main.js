// Main Application Entry Point
// This file orchestrates the game creation and initialization

// Try p5.js first, fallback to canvas
function createGame() {
    // Check if p5 is available
    if (typeof p5 !== 'undefined') {
        console.log('Using p5.js');
        return createP5Game();
    } else {
        console.log('p5.js not available, using Canvas fallback');
        return createCanvasGame();
    }
}

// Application initialization
function App() {
    // Game instance
    let gameInstance = null;
    
    // Show game container
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.style.display = 'block';
    }
    
    // Create and start the game immediately
    gameInstance = createGame();
    
    // Handle page visibility change to pause/resume game
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Game automatically pauses when tab is not visible
            console.log('Game paused (tab hidden)');
        } else {
            // Game automatically resumes when tab becomes visible
            console.log('Game resumed (tab visible)');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // The game will handle responsive resizing automatically
        console.log('Window resized');
    });
    
    // Cleanup function
    return () => {
        if (gameInstance && gameInstance.remove) {
            gameInstance.remove();
        }
    };
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const cleanup = App();
    
    // Store cleanup function globally for potential use
    window.gameCleanup = cleanup;
});
