class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = new window.StateManager();
        this.player = new window.Player(210, 370);
        this.inputSystem = new window.InputSystem(this);
        this.physics = new window.PhysicsSystem(this);
        this.renderSystem = new window.RenderSystem(this);
        this.sceneManager = new window.SceneManager(this);
        this.gameManager = new window.GameManager(this);
        this.lastTimestamp = 0;
        this.running = false;
        // --- BEGIN: Collision Edit Mode State ---
        this.collisionEditMode = false;
        this.collisionGrid = {}; // { [sceneKey]: 2D array }
        this.collisionGridSize = 30; // 30x30 px squares (30x20 grid for 900x600)
        // --- BEGIN: Prepopulate LEVEL_1 collision map ---
        this.collisionGrid["LEVEL_1"] = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,0],
            [1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ];
        // --- END: Prepopulate LEVEL_1 collision map ---
        // --- BEGIN: Prepopulate LEVEL_2 collision map (will be set after entering door) ---
        this.collisionGrid["LEVEL_2"] = null; // will be set after entering the door
        // --- END: Prepopulate LEVEL_2 collision map ---
        this._initCollisionEditUI();
        // --- BEGIN: Track collision drag state ---
        this._collisionDragActive = false;
        this._collisionDragLastCell = null;
        // --- END: Track collision drag state ---
        // --- END: Collision Edit Mode State ---
        this._initDom();
        this._initAudio(); // <-- ADDED
        this._start();
    }

    _initDom() {
        // System messages div
        let sys = document.getElementById('system-messages');
        if (!sys) {
            sys = document.createElement('div');
            sys.id = 'system-messages';
            document.getElementById('game-container').appendChild(sys);
        }
        // HUD
        window.updateHUD(this.state);
    }

    _initAudio() {
        // --- BEGIN: Level 1 BGM ---
        // Only create once
        if (!window._level1BgmAudio) {
            const audio = document.createElement('audio');
            audio.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/audio-assets/6f1edf47-be71-4c38-9203-26202e227b0a/0fcabcb9-bfaa-4db8-9621-2fb1a9d89766.mp3";
            audio.loop = true;
            audio.preload = "auto";
            audio.volume = 0.55;
            audio.setAttribute('data-bgm', 'level1');
            audio.style.display = 'none';
            document.body.appendChild(audio);
            window._level1BgmAudio = audio;
        }
        // --- BEGIN: Level 2 BGM ---
        if (!window._level2BgmAudio) {
            const audio2 = document.createElement('audio');
            audio2.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/audio-assets/6f1edf47-be71-4c38-9203-26202e227b0a/f1ad8de1-59d5-4637-ac38-27ca64181a93.mp3";
            audio2.loop = true;
            audio2.preload = "auto";
            audio2.volume = 0.55;
            audio2.setAttribute('data-bgm', 'level2');
            audio2.style.display = 'none';
            document.body.appendChild(audio2);
            window._level2BgmAudio = audio2;
        }
        // --- END: Level 2 BGM ---
    }

    _initCollisionEditUI() {
        // Create edit mode UI (offscreen, like HUD)
        let editBox = document.getElementById('collision-edit-box');
        if (!editBox) {
            editBox = document.createElement('div');
            editBox.id = 'collision-edit-box';
            // Move UI off the game screen (right of canvas)
            editBox.style.position = 'absolute';
            editBox.style.left = '940px'; // Off the right edge (canvas is 900px wide)
            editBox.style.top = '40px';
            editBox.style.width = '220px';
            editBox.style.background = 'var(--ui-bg)';
            editBox.style.border = '2px solid var(--accent)';
            editBox.style.borderRadius = '13px';
            editBox.style.boxShadow = '0 1px 10px rgba(0,0,0,0.13)';
            editBox.style.padding = '1em 1.2em';
            editBox.style.zIndex = 200;
            editBox.style.display = 'none';
            // --- BEGIN: Add minimize button and state ---
            editBox.innerHTML = `
                <div id="collision-edit-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5em;">
                    <span style="font-weight:bold;color:var(--accent);">Collision Edit Mode</span>
                    <button id="collision-edit-min-btn" title="Minimize" style="background:none;border:none;color:var(--accent);font-size:1.25em;line-height:1;padding:0 0.2em;cursor:pointer;border-radius:6px;transition:background 0.13s;"><span id="collision-edit-min-icon" style="display:inline-block;">&#8211;</span></button>
                </div>
                <div id="collision-edit-content">
                    <div style="font-size:0.98em;margin-bottom:0.7em;">Click grid squares to toggle collision.<br>Press <b>[</b> or <b>]</b> to exit.</div>
                    <button class="ui-btn" id="collision-export-btn" style="font-size:0.98em;">Export Collision Map</button>
                    <button class="ui-btn" id="collision-clear-red-btn" style="font-size:0.98em;margin-top:0.7em;">Clear All Red Grids</button>
                </div>
            `;
            document.getElementById('game-container').appendChild(editBox);
        }
        // --- END: Add minimize button and state ---

        // Export button handler
        editBox.querySelector('#collision-export-btn').onclick = () => {
            this.exportCollisionMap();
        };

        // --- BEGIN: Add clear red grids button handler ---
        const clearBtn = editBox.querySelector('#collision-clear-red-btn');
        if (clearBtn) {
            clearBtn.onclick = () => {
                this.clearAllRedCollisionGrids();
            };
        }
        // --- END: Add clear red grids button handler ---

        // --- BEGIN: Add drag-to-select for collision edit mode ---
        // Only add listeners once
        if (!this._collisionEditListenersAdded) {
            const canvas = this.canvas;
            // Mouse down: start drag
            canvas.addEventListener('mousedown', (e) => {
                if (!this.collisionEditMode) return;
                this._collisionDragActive = true;
                const pos = this.inputSystem.getCanvasPos(e);
                this._collisionDragLastCell = null;
                this._handleCollisionDragAt(pos.x, pos.y);
                // Prevent text selection
                e.preventDefault();
            });
            // Mouse up: end drag
            window.addEventListener('mouseup', (e) => {
                if (!this.collisionEditMode) return;
                this._collisionDragActive = false;
                this._collisionDragLastCell = null;
            });
            // Mouse move: if dragging, select cells
            canvas.addEventListener('mousemove', (e) => {
                if (!this.collisionEditMode) return;
                if (!this._collisionDragActive) return;
                const pos = this.inputSystem.getCanvasPos(e);
                this._handleCollisionDragAt(pos.x, pos.y);
            });
            // Mouse leave: end drag
            canvas.addEventListener('mouseleave', (e) => {
                if (!this.collisionEditMode) return;
                this._collisionDragActive = false;
                this._collisionDragLastCell = null;
            });
            this._collisionEditListenersAdded = true;
        }
        // --- END: Add drag-to-select for collision edit mode ---

        // --- BEGIN: Minimize logic ---
        // Track minimized state
        this._collisionEditMinimized = false;
        const minBtn = editBox.querySelector('#collision-edit-min-btn');
        const contentDiv = editBox.querySelector('#collision-edit-content');
        const minIcon = editBox.querySelector('#collision-edit-min-icon');
        if (minBtn && contentDiv) {
            minBtn.onclick = () => {
                this._collisionEditMinimized = !this._collisionEditMinimized;
                if (this._collisionEditMinimized) {
                    contentDiv.style.display = 'none';
                    minIcon.innerHTML = '&#9633;'; // Unicode for square (restore)
                    minBtn.title = "Restore";
                } else {
                    contentDiv.style.display = '';
                    minIcon.innerHTML = '&#8211;'; // Unicode for minus (minimize)
                    minBtn.title = "Minimize";
                }
            };
        }
        // --- END: Minimize logic ---
    }

    _showCollisionEditUI(show) {
        let editBox = document.getElementById('collision-edit-box');
        if (editBox) {
            editBox.style.display = show ? 'block' : 'none';
            // If showing, always restore to unminimized state
            if (show) {
                this._collisionEditMinimized = false;
                const contentDiv = editBox.querySelector('#collision-edit-content');
                const minIcon = editBox.querySelector('#collision-edit-min-icon');
                const minBtn = editBox.querySelector('#collision-edit-min-btn');
                if (contentDiv) contentDiv.style.display = '';
                if (minIcon) minIcon.innerHTML = '&#8211;';
                if (minBtn) minBtn.title = "Minimize";
            }
        }
    }

    _start() {
        // Title menu
        window.showTitleMenu(() => {
            this.state.reset();
            this.sceneManager.enterScene(window.SceneType.LEVEL_1);
            this.running = true;
            requestAnimationFrame(ts => this.gameLoop(ts));
            this.canvas.focus();
        });
    }

    gameLoop(timestamp) {
        if (!this.running) return;
        const dt = Math.min((timestamp - (this.lastTimestamp || timestamp)) / 16.67, 2.6);
        this.lastTimestamp = timestamp;
        this.physics.update(dt);
        this.render();
        requestAnimationFrame(ts => this.gameLoop(ts));
    }

    render() {
        this.renderSystem.render();
        // --- BEGIN: Render collision grid if in edit mode ---
        if (this.collisionEditMode) {
            this.renderCollisionGrid();
        }
        // --- END
    }

    renderCollisionGrid() {
        const ctx = this.ctx;
        const gridSize = this.collisionGridSize;
        const cols = Math.ceil(window.GAME_WIDTH / gridSize);
        const rows = Math.ceil(window.GAME_HEIGHT / gridSize);
        // Overlay semi-transparent grid
        ctx.save();
        ctx.globalAlpha = 0.55;
        for (let gx = 0; gx < cols; ++gx) {
            for (let gy = 0; gy < rows; ++gy) {
                const x = gx * gridSize;
                const y = gy * gridSize;
                // Draw square
                ctx.beginPath();
                ctx.rect(x, y, gridSize, gridSize);
                // Highlight if this cell has collision
                const sceneKey = this.state.currentScene;
                const grid = this.collisionGrid[sceneKey] || [];
                const hasCollision = grid[gy]?.[gx] === 1;
                ctx.fillStyle = hasCollision ? "rgba(255, 80, 80, 0.40)" : "rgba(80, 220, 255, 0.10)";
                ctx.fill();
                ctx.lineWidth = 1.2;
                ctx.strokeStyle = hasCollision ? "#ff4444" : "#44c6ff";
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    handleClick(x, y) {
        // --- BEGIN: Collision grid edit mode click handling ---
        if (this.collisionEditMode) {
            // Only toggle on click, not drag (drag handled separately)
            if (!this._collisionDragActive) {
                const gridSize = this.collisionGridSize;
                const gx = Math.floor(x / gridSize);
                const gy = Math.floor(y / gridSize);
                const cols = Math.ceil(window.GAME_WIDTH / gridSize);
                const rows = Math.ceil(window.GAME_HEIGHT / gridSize);
                if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
                    const sceneKey = this.state.currentScene;
                    if (!this.collisionGrid[sceneKey]) {
                        // Initialize empty grid for this scene
                        this.collisionGrid[sceneKey] = Array.from({length: rows}, () => Array(cols).fill(0));
                    }
                    // Toggle collision
                    this.collisionGrid[sceneKey][gy][gx] = this.collisionGrid[sceneKey][gy][gx] ? 0 : 1;
                    this.render(); // Redraw grid immediately
                }
            }
            return; // Don't move player in edit mode
        }
        // --- END: Collision grid edit mode click handling ---

        // Only if not in dialogue/puzzle
        if (document.getElementById('dialogue-box')?.style.display === 'block' ||
            document.getElementById('puzzle-modal')?.classList.contains('active')) return;
        // Interact with hotspots/NPCs/items
        const map = window.MapData[this.state.currentScene];
        for (const hs of map.hotspots) {
            const dx = x - hs.x, dy = y - hs.y;
            if (Math.sqrt(dx*dx + dy*dy) <= hs.r + 9) {
                this.player.setTarget(hs.x, hs.y + 24);
                setTimeout(() => {
                    // When close enough, interact
                    const pdx = this.player.x - hs.x, pdy = this.player.y - (hs.y+24);
                    if (Math.sqrt(pdx*pdx + pdy*pdy) < 32) {
                        this.gameManager.handleHotspotInteract(hs);
                    }
                }, 290);
                return;
            }
        }
        // Otherwise, move player to location
        this.player.setTarget(x, y);
    }

    // --- BEGIN: Drag-to-select for collision grid ---
    _handleCollisionDragAt(x, y) {
        const gridSize = this.collisionGridSize;
        const gx = Math.floor(x / gridSize);
        const gy = Math.floor(y / gridSize);
        const cols = Math.ceil(window.GAME_WIDTH / gridSize);
        const rows = Math.ceil(window.GAME_HEIGHT / gridSize);
        if (gx < 0 || gx >= cols || gy < 0 || gy >= rows) return;
        const sceneKey = this.state.currentScene;
        if (!this.collisionGrid[sceneKey]) {
            // Initialize empty grid for this scene
            this.collisionGrid[sceneKey] = Array.from({length: rows}, () => Array(cols).fill(0));
        }
        // Only set if not already set (avoid flicker)
        if (!this._collisionDragLastCell || this._collisionDragLastCell.gx !== gx || this._collisionDragLastCell.gy !== gy) {
            this.collisionGrid[sceneKey][gy][gx] = 1;
            this._collisionDragLastCell = { gx, gy };
            this.render(); // Redraw grid immediately
        }
    }
    // --- END: Drag-to-select for collision grid ---

    toggleInventory() {
        this.state.showInventory = !this.state.showInventory;
        window.updateInventoryPanel(this.state);
    }

    closeDialogs() {
        window.hideDialogueBox();
        window.hidePuzzleModal();
        const shopPanel = document.getElementById('shop-panel');
        if (shopPanel) shopPanel.remove();
    }

    // --- BEGIN: Collision Edit Mode Toggle ---
    toggleCollisionEditMode(forceState = null) {
        if (typeof forceState === "boolean") {
            this.collisionEditMode = forceState;
        } else {
            this.collisionEditMode = !this.collisionEditMode;
        }
        this._showCollisionEditUI(this.collisionEditMode);
        this.render();
        if (this.collisionEditMode) {
            systemMessage("Collision Edit Mode ON");
        } else {
            systemMessage("Collision Edit Mode OFF");
        }
    }

    exportCollisionMap() {
        const sceneKey = this.state.currentScene;
        const grid = this.collisionGrid[sceneKey];
        if (!grid) {
            systemMessage("No collision map for this scene!");
            return;
        }
        // Export as a JS array of arrays (copy-pasteable)
        const exportStr = JSON.stringify(grid);
        // Print to console with scene key
        console.log(`// Collision map for scene ${sceneKey} (gridSize=${this.collisionGridSize})`);
        console.log(exportStr);
        systemMessage("Collision map exported to console!");
    }

    // --- BEGIN: Clear all red grids (collision=1) in current scene ---
    clearAllRedCollisionGrids() {
        const sceneKey = this.state.currentScene;
        const grid = this.collisionGrid[sceneKey];
        if (!grid) {
            systemMessage("No collision map for this scene!");
            return;
        }
        let cleared = 0;
        for (let gy = 0; gy < grid.length; ++gy) {
            for (let gx = 0; gx < grid[gy].length; ++gx) {
                if (grid[gy][gx] === 1) {
                    grid[gy][gx] = 0;
                    cleared++;
                }
            }
        }
        this.render();
        systemMessage(`Cleared ${cleared} red grid${cleared === 1 ? '' : 's'}.`);
    }
    // --- END: Clear all red grids (collision=1) in current scene ---
    // --- END: Collision Edit Mode Toggle ---
}

// --- BEGIN: BGM scene switching logic ---

// Helper: Play/pause Level 1 and Level 2 BGM depending on scene
function updateBgmForScene(sceneType) {
    const audio1 = window._level1BgmAudio;
    const audio2 = window._level2BgmAudio;
    if (!audio1 || !audio2) return;
    if (sceneType === window.SceneType.LEVEL_1) {
        // Play Level 1 BGM, pause Level 2 BGM
        if (audio2 && !audio2.paused) {
            audio2.pause();
            audio2.currentTime = 0;
        }
        if (audio1.paused) {
            const playPromise = audio1.play();
            if (playPromise && typeof playPromise.then === "function") {
                playPromise.catch(() => {});
            }
        }
    } else if (sceneType === window.SceneType.LEVEL_2) {
        // Play Level 2 BGM, pause Level 1 BGM
        if (audio1 && !audio1.paused) {
            audio1.pause();
            audio1.currentTime = 0;
        }
        if (audio2.paused) {
            const playPromise = audio2.play();
            if (playPromise && typeof playPromise.then === "function") {
                playPromise.catch(() => {});
            }
        }
    } else {
        // Pause both BGMs for other scenes
        if (audio1 && !audio1.paused) {
            audio1.pause();
            audio1.currentTime = 0;
        }
        if (audio2 && !audio2.paused) {
            audio2.pause();
            audio2.currentTime = 0;
        }
    }
}
window.updateBgmForScene = updateBgmForScene;

// Expose globally
window.Game = Game;

window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});