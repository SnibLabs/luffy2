// Controls scene transitions and map logic

class SceneManager {
    constructor(game) {
        this.game = game;
        // --- BEGIN: Track if door in LEVEL_2 has been moved down extra ---
        this._level2DoorMovedExtra = false;
        // --- END
        // --- BEGIN: Track if collision grid for LEVEL_2 has been set after entering door ---
        this._level2CollisionSet = false;
        // --- END
    }
    enterScene(sceneType, options = {}) {
        this.game.state.setScene(sceneType);
        // Set player position
        const map = window.MapData[sceneType];
        if (map && map.playerStart) {
            this.game.player.x = map.playerStart.x;
            this.game.player.y = map.playerStart.y;
            this.game.player.setTarget(map.playerStart.x, map.playerStart.y);
        }

        // --- BEGIN: Door repositioning for LEVEL_2 ---
        // If coming from LEVEL_1 and entering LEVEL_2, move the door hotspot to the bottom of the screen
        if (
            sceneType === "LEVEL_2"
            && window.MapData["LEVEL_2"]
            && window.MapData["LEVEL_2"].hotspots
        ) {
            // Find the door hotspot in LEVEL_2
            const door = window.MapData["LEVEL_2"].hotspots.find(hs => hs.id === "door1-l2");
            if (door) {
                // If entering via the interactive door, put it at the bottom center
                if (options.enteredViaDoor) {
                    // Place the door at the bottom center of the screen
                    door.x = window.GAME_WIDTH / 2;
                    door.y = window.GAME_HEIGHT - door.r - 12; // 12px margin from bottom
                    // Mark that the door has not yet been moved down extra
                    this._level2DoorMovedExtra = false;
                } else {
                    // If not entering via the door, reset to original position
                    door.x = 428;
                    door.y = 356;
                    this._level2DoorMovedExtra = false;
                }
            }
        }
        // --- END: Door repositioning for LEVEL_2 ---

        // --- BEGIN: BGM switching ---
        if (window.updateBgmForScene) window.updateBgmForScene(sceneType);
        // --- END: BGM switching ---
        this.game.render();

        // --- BEGIN: Move door down 50% more after entering LEVEL_2 via door ---
        if (
            sceneType === "LEVEL_2"
            && window.MapData["LEVEL_2"]
            && window.MapData["LEVEL_2"].hotspots
        ) {
            const door = window.MapData["LEVEL_2"].hotspots.find(hs => hs.id === "door1-l2");
            // Only do this if we just entered via the interactive door and haven't moved it down extra yet
            if (door && options.enteredViaDoor && !this._level2DoorMovedExtra) {
                // Move the door down 50% more from its current y position toward the bottom edge
                // Compute the distance from current y to the bottom (minus margin)
                const bottomY = window.GAME_HEIGHT - door.r - 12;
                const currentY = door.y;
                const extraDown = (bottomY - currentY) * 0.5;
                door.y = currentY + extraDown;
                this._level2DoorMovedExtra = true;
                // Re-render to update door position
                this.game.render();
            }
        }
        // --- END: Move door down 50% more after entering LEVEL_2 via door ---

        // --- BEGIN: Set collision grid for LEVEL_2 after entering via interactive door ---
        if (
            sceneType === "LEVEL_2"
            && options.enteredViaDoor
        ) {
            // Only set once per entry
            // The grid is 20 rows x 30 cols (30x30 px for 900x600)
            this.game.collisionGrid["LEVEL_2"] = [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1],
                [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1],
                [1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1],
                [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1]
            ];
            this._level2CollisionSet = true;
        } else if (sceneType === "LEVEL_2" && !options.enteredViaDoor) {
            // If not entered via door, clear the collision grid for LEVEL_2 (allow editing or default)
            this.game.collisionGrid["LEVEL_2"] = null;
            this._level2CollisionSet = false;
        }
        // --- END: Set collision grid for LEVEL_2 after entering via interactive door ---
    }
}
window.SceneManager = SceneManager;