class InputSystem {
    constructor(game) {
        this.game = game;
        this.mouse = { x: 0, y: 0, down: false };
        this.keyState = {};
        this._bindHandlers();
    }
    _bindHandlers() {
        const canvas = this.game.canvas;
        canvas.addEventListener('mousedown', e => this.onMouseDown(e));
        canvas.addEventListener('mouseup', e => this.onMouseUp(e));
        canvas.addEventListener('mousemove', e => this.onMouseMove(e));
        canvas.addEventListener('click', e => this.onClick(e));
        window.addEventListener('keydown', e => this.onKeyDown(e));
        window.addEventListener('keyup', e => this.onKeyUp(e));
    }
    getCanvasPos(e) {
        const rect = this.game.canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left) * window.GAME_WIDTH / rect.width),
            y: Math.round((e.clientY - rect.top) * window.GAME_HEIGHT / rect.height)
        };
    }
    onMouseDown(e) { this.mouse.down = true; }
    onMouseUp(e) { this.mouse.down = false; }
    onMouseMove(e) {
        const pos = this.getCanvasPos(e);
        this.mouse.x = pos.x;
        this.mouse.y = pos.y;
    }
    onClick(e) {
        const pos = this.getCanvasPos(e);
        this.game.handleClick(pos.x, pos.y);
    }
    onKeyDown(e) {
        this.keyState[e.code] = true;
        if (e.code === 'KeyI') {
            this.game.toggleInventory();
        }
        if (e.code === 'Escape') {
            this.game.closeDialogs();
        }
        // --- BEGIN: Collision Edit Mode Keybinds ---
        if (e.key === ']') {
            // Toggle collision edit mode ON/OFF with ]
            this.game.toggleCollisionEditMode();
        }
        if (e.key === '[') {
            this.game.toggleCollisionEditMode(false);
        }
        // --- END: Collision Edit Mode Keybinds ---
        // --- BEGIN: Collision grid clear toggle ---
        if (e.key === '\\') {
            // Backslash key: clear all red grids in current scene (only in collision edit mode)
            if (this.game.collisionEditMode) {
                this.game.clearAllRedCollisionGrids();
            }
        }
        // --- END: Collision grid clear toggle ---
        // --- BEGIN: World Map Keybind ---
        if (e.code === 'KeyM') {
            if (typeof this.game.toggleWorldMap === "function") {
                this.game.toggleWorldMap();
            }
        }
        // --- END: World Map Keybind ---
    }
    onKeyUp(e) {
        this.keyState[e.code] = false;
    }
}
window.InputSystem = InputSystem;