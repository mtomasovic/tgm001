// Virtual Gamepad for Mobile Support
// This file contains the virtual gamepad implementation for mobile devices

class VirtualGamepad {
    constructor() {
        this.keys = {};
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.touchStartTime = 0;
        this.createGamepad();
    }
    
    createGamepad() {
        if (!this.isMobile) {
            this.gamepadDiv = document.createElement('div');
            this.gamepadDiv.style.display = 'none';
            document.body.appendChild(this.gamepadDiv);
            return;
        }
        
        // Create main gamepad container
        this.gamepadDiv = document.createElement('div');
        this.gamepadDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 350px;
            height: 130px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 20px;
            z-index: 1000;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
        `;
        
        this.createDPad();
        this.createJumpButton();
        
        document.body.appendChild(this.gamepadDiv);
    }
    
    createDPad() {
        const dpadContainer = document.createElement('div');
        dpadContainer.style.cssText = `
            position: relative;
            width: 120px;
            height: 120px;
        `;
        
        // Create directional buttons with adjusted spacing
        this.createDPadButton('↑', 42, 0, 'ArrowUp');
        this.createDPadButton('↓', 42, 84, 'ArrowDown');
        this.createDPadButton('←', 0, 42, 'ArrowLeft');
        this.createDPadButton('→', 84, 42, 'ArrowRight');
        
        dpadContainer.appendChild(this.upButton);
        dpadContainer.appendChild(this.downButton);
        dpadContainer.appendChild(this.leftButton);
        dpadContainer.appendChild(this.rightButton);
        
        this.gamepadDiv.appendChild(dpadContainer);
    }
    
    createDPadButton(symbol, left, top, key) {
        const button = document.createElement('div');
        button.textContent = symbol;
        button.style.cssText = `
            position: absolute;
            left: ${left}px;
            top: ${top}px;
            width: 36px;
            height: 36px;
            background: rgba(255, 255, 255, 0.8);
            border: 2px solid #333;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            color: #333;
            cursor: pointer;
            touch-action: manipulation;
            user-select: none;
            -webkit-user-select: none;
        `;
        
        // Add touch events
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys[key] = true;
            button.style.background = 'rgba(100, 150, 255, 0.8)';
        });
        
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys[key] = false;
            button.style.background = 'rgba(255, 255, 255, 0.8)';
        });
        
        button.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.keys[key] = false;
            button.style.background = 'rgba(255, 255, 255, 0.8)';
        });
        
        // Store button reference
        if (key === 'ArrowUp') this.upButton = button;
        else if (key === 'ArrowDown') this.downButton = button;
        else if (key === 'ArrowLeft') this.leftButton = button;
        else if (key === 'ArrowRight') this.rightButton = button;
    }
    
    createJumpButton() {
        this.jumpButton = document.createElement('div');
        this.jumpButton.textContent = 'JUMP';
        this.jumpButton.style.cssText = `
            width: 85px;
            height: 85px;
            background: rgba(255, 255, 255, 0.8);
            border: 3px solid #333;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: bold;
            color: #333;
            cursor: pointer;
            touch-action: manipulation;
            user-select: none;
            -webkit-user-select: none;
        `;
        
        // Add touch events for jump
        this.jumpButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchStartTime = Date.now();
            this.keys[' '] = true;
            this.keys['ArrowUp'] = true;
            this.jumpButton.style.background = 'rgba(100, 255, 100, 0.8)';
        });
        
        this.jumpButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys[' '] = false;
            this.keys['ArrowUp'] = false;
            this.jumpButton.style.background = 'rgba(255, 255, 255, 0.8)';
        });
        
        this.jumpButton.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.keys[' '] = false;
            this.keys['ArrowUp'] = false;
            this.jumpButton.style.background = 'rgba(255, 255, 255, 0.8)';
        });
        
        this.gamepadDiv.appendChild(this.jumpButton);
    }
    
    getKeys() {
        return this.keys;
    }
    
    destroy() {
        if (this.gamepadDiv && this.gamepadDiv.parentNode) {
            this.gamepadDiv.parentNode.removeChild(this.gamepadDiv);
        }
    }
}
