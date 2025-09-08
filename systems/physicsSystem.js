/*
// For this game, physics is minimal: only player movement

class PhysicsSystem {
    constructor(game) {
        this.game = game;
    }
    update(dt) {
        if (this.game.player) {
            this.game.player.update(dt);
        }
    }
}
window.PhysicsSystem = PhysicsSystem;
*/

// --- BEGIN MODIFIED FOR COLLISION GRID ---

// For this game, physics is minimal: only player movement, but now with collision grid for LEVEL_1

class PhysicsSystem {
    constructor(game) {
        this.game = game;
    }
    update(dt) {
        if (!this.game.player) return;

        // Save current position
        const prevX = this.game.player.x;
        const prevY = this.game.player.y;

        // Simulate movement
        this.game.player.update(dt);

        // --- BEGIN: Collision grid blocking for LEVEL_1 and LEVEL_2 ---
        const sceneKey = this.game.state.currentScene;
        const grid = this.game.collisionGrid[sceneKey];
        if (
            (sceneKey === "LEVEL_1" || sceneKey === "LEVEL_2")
            && Array.isArray(grid)
        ) {
            // Player's position after movement
            const px = this.game.player.x;
            const py = this.game.player.y;
            const gridSize = this.game.collisionGridSize;
            const gx = Math.floor(px / gridSize);
            const gy = Math.floor(py / gridSize);
            // Defensive: clamp to grid bounds
            if (
                gy >= 0 && gy < grid.length &&
                gx >= 0 && gx < grid[0].length
            ) {
                if (grid[gy][gx] === 1) {
                    // Blocked: revert to previous position and stop movement
                    this.game.player.x = prevX;
                    this.game.player.y = prevY;
                    this.game.player.isMoving = false;
                    this.game.player.targetX = prevX;
                    this.game.player.targetY = prevY;
                }
            }
        }
        // --- END: Collision grid blocking for LEVEL_1 and LEVEL_2 ---
    }
}
window.PhysicsSystem = PhysicsSystem;