// Virtual Gamepad for Mobile Support
// This file contains the virtual gamepad implementation for mobile devices

class VirtualGamepad {
    constructor() {
        this.keys = {};
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.touchStartTime = 0;
        this.movementMultiplier = 0; // 0 to 1 based on joystick deflection
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
        const joystickContainer = document.createElement('div');
        joystickContainer.style.cssText = `
            position: relative;
            width: 120px;
            height: 120px;
        `;
        
        // Create joystick base (outer circle)
        this.joystickBase = document.createElement('div');
        this.joystickBase.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100px;
            height: 100px;
            background: rgba(100, 100, 100, 0.5);
            border: 3px solid rgba(80, 80, 80, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Create joystick stick (inner circle)
        this.joystickStick = document.createElement('div');
        this.joystickStick.style.cssText = `
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.9);
            border: 3px solid rgba(50, 50, 50, 0.8);
            border-radius: 50%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            transition: background 0.1s;
        `;
        
        this.joystickBase.appendChild(this.joystickStick);
        joystickContainer.appendChild(this.joystickBase);
        
        // Joystick state
        this.joystickActive = false;
        this.joystickCenterX = 0;
        this.joystickCenterY = 0;
        this.joystickMaxDistance = 25; // Maximum distance the stick can move from center
        
        // Touch event handlers for joystick
        const handleJoystickTouch = (e) => {
            e.preventDefault();
            
            const rect = this.joystickBase.getBoundingClientRect();
            this.joystickCenterX = rect.left + rect.width / 2;
            this.joystickCenterY = rect.top + rect.height / 2;
            
            if (e.touches && e.touches.length > 0) {
                const touch = e.touches[0];
                this.updateJoystick(touch.clientX, touch.clientY);
            }
        };
        
        const handleJoystickEnd = (e) => {
            e.preventDefault();
            this.resetJoystick();
        };
        
        this.joystickBase.addEventListener('touchstart', (e) => {
            this.joystickActive = true;
            this.joystickStick.style.background = 'rgba(100, 150, 255, 0.9)';
            handleJoystickTouch(e);
        });
        
        this.joystickBase.addEventListener('touchmove', (e) => {
            if (this.joystickActive) {
                handleJoystickTouch(e);
            }
        });
        
        this.joystickBase.addEventListener('touchend', handleJoystickEnd);
        this.joystickBase.addEventListener('touchcancel', handleJoystickEnd);
        
        this.gamepadDiv.appendChild(joystickContainer);
    }
    
    updateJoystick(touchX, touchY) {
        // Calculate distance from center
        const deltaX = touchX - this.joystickCenterX;
        const deltaY = touchY - this.joystickCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Clamp to max distance
        let stickX = deltaX;
        let stickY = deltaY;
        
        if (distance > this.joystickMaxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            stickX = Math.cos(angle) * this.joystickMaxDistance;
            stickY = Math.sin(angle) * this.joystickMaxDistance;
        }
        
        // Update stick visual position
        this.joystickStick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
        
        // Update key states based on stick position
        // Use a deadzone to prevent drift
        const deadzone = 5;
        
        // Calculate movement multiplier based on horizontal deflection (0 to 1)
        // This represents how far the stick is pushed (for progressive speed)
        const horizontalDistance = Math.abs(stickX);
        if (horizontalDistance > deadzone) {
            // Map the distance to a 0-1 range, with smooth acceleration
            // Minimum speed at deadzone, maximum at max distance
            const normalizedDistance = (horizontalDistance - deadzone) / (this.joystickMaxDistance - deadzone);
            // Apply a slight curve for better feel (square root makes initial movement more responsive)
            this.movementMultiplier = Math.sqrt(Math.min(1, normalizedDistance));
        } else {
            this.movementMultiplier = 0;
        }
        
        // Horizontal movement (left/right)
        if (Math.abs(stickX) > deadzone) {
            if (stickX < 0) {
                this.keys['ArrowLeft'] = true;
                this.keys['ArrowRight'] = false;
            } else {
                this.keys['ArrowRight'] = true;
                this.keys['ArrowLeft'] = false;
            }
        } else {
            this.keys['ArrowLeft'] = false;
            this.keys['ArrowRight'] = false;
        }
        
        // Note: We don't use vertical movement (up/down) for jump
        // Jump is only triggered by the jump button
        this.keys['ArrowUp'] = false;
        this.keys['ArrowDown'] = false;
    }
    
    resetJoystick() {
        this.joystickActive = false;
        this.joystickStick.style.transform = 'translate(-50%, -50%)';
        this.joystickStick.style.background = 'rgba(255, 255, 255, 0.9)';
        this.movementMultiplier = 0;
        
        // Clear all directional keys
        this.keys['ArrowLeft'] = false;
        this.keys['ArrowRight'] = false;
        this.keys['ArrowUp'] = false;
        this.keys['ArrowDown'] = false;
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
    
    getMovementMultiplier() {
        return this.movementMultiplier;
    }
    
    destroy() {
        if (this.gamepadDiv && this.gamepadDiv.parentNode) {
            this.gamepadDiv.parentNode.removeChild(this.gamepadDiv);
        }
    }
}
