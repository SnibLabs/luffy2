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
        // --- BEGIN: Track collision drag state ---
        this._collisionDragActive = false;
        this._collisionDragLastCell = null;
        // --- END: Track collision drag state ---
        this._initDom();
        this._initAudio(); // <-- ADDED
        // --- BEGIN: World Map State ---
        this._worldMapActive = false;
        // --- END: World Map State ---
        this._initCollisionEditUI();
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
        // Remove any existing UI
        let box = document.getElementById('collision-edit-ui');
        if (box) box.remove();

        // Create the UI box
        box = document.createElement('div');
        box.id = 'collision-edit-ui';
        box.style.position = 'absolute';
        // Place off the playable screen, e.g. right of canvas
        box.style.left = (window.GAME_WIDTH + 20) + 'px';
        box.style.top = '30px';
        box.style.width = '220px';
        box.style.background = 'var(--ui-bg)';
        box.style.border = '2px solid var(--accent)';
        box.style.borderRadius = '13px';
        box.style.boxShadow = '0 1px 10px rgba(0,0,0,0.13)';
        box.style.padding = '0.8em 1em 1em 1em';
        box.style.zIndex = 999;
        box.style.display = 'none';
        box.style.userSelect = 'none';
        box.style.cursor = 'default';
        box.style.pointerEvents = 'auto';

        // --- BEGIN: Draggable header ---
        const dragHeader = document.createElement('div');
        dragHeader.style.fontWeight = 'bold';
        dragHeader.style.color = 'var(--accent)';
        dragHeader.style.marginBottom = '0.5em';
        dragHeader.style.cursor = 'move';
        dragHeader.style.userSelect = 'none';
        dragHeader.innerHTML = 'Collision Edit Mode';

        // Minimize button
        const minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '–';
        minimizeBtn.title = 'Minimize';
        minimizeBtn.style.float = 'right';
        minimizeBtn.style.marginLeft = '8px';
        minimizeBtn.style.fontSize = '1.2em';
        minimizeBtn.style.background = 'var(--accent)';
        minimizeBtn.style.color = '#222';
        minimizeBtn.style.border = 'none';
        minimizeBtn.style.borderRadius = '7px';
        minimizeBtn.style.padding = '0 0.6em';
        minimizeBtn.style.cursor = 'pointer';
        minimizeBtn.style.fontWeight = 'bold';
        minimizeBtn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.10)';
        minimizeBtn.style.lineHeight = '1.1';
        minimizeBtn.style.height = '1.5em';

        dragHeader.appendChild(minimizeBtn);
        box.appendChild(dragHeader);

        // --- END: Draggable header ---

        // Content area
        const contentDiv = document.createElement('div');
        contentDiv.id = 'collision-edit-ui-content';
        box.appendChild(contentDiv);

        // Export button
        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Export Collision Map';
        exportBtn.className = 'ui-btn';
        exportBtn.style.marginTop = '0.7em';
        exportBtn.onclick = () => {
            const sceneKey = this.state.currentScene;
            const grid = this.collisionGrid[sceneKey];
            if (!Array.isArray(grid)) {
                systemMessage('No collision grid to export.');
                return;
            }
            // Export as JS array
            let out = '[';
            for (let row = 0; row < grid.length; ++row) {
                out += '[' + grid[row].join(',') + ']';
                if (row < grid.length - 1) out += ',\n ';
            }
            out += ']';
            console.log(`// Collision grid for ${sceneKey}:\n${out}`);
            systemMessage('Collision map exported to console.');
        };
        contentDiv.appendChild(exportBtn);

        // --- BEGIN: Uncheck All button ---
        const uncheckAllBtn = document.createElement('button');
        uncheckAllBtn.textContent = 'Uncheck All';
        uncheckAllBtn.className = 'ui-btn';
        uncheckAllBtn.style.marginTop = '0.7em';
        uncheckAllBtn.style.marginLeft = '0.7em';
        uncheckAllBtn.onclick = () => {
            const sceneKey = this.state.currentScene;
            const grid = this.collisionGrid[sceneKey];
            if (!Array.isArray(grid)) {
                systemMessage('No collision grid to clear.');
                return;
            }
            for (let y = 0; y < grid.length; ++y) {
                for (let x = 0; x < grid[y].length; ++x) {
                    grid[y][x] = 0;
                }
            }
            this.render();
            systemMessage('All boxes unchecked.');
        };
        contentDiv.appendChild(uncheckAllBtn);
        // --- END: Uncheck All button ---

        // Instructions
        const instr = document.createElement('div');
        instr.style.fontSize = '0.98em';
        instr.style.marginTop = '0.7em';
        instr.style.color = '#fff';
        instr.innerHTML = `
            <b>Instructions:</b><br>
            - Click or drag on grid to toggle collision.<br>
            - Press <b>]</b> to toggle grid.<br>
            - Drag this box to move.<br>
            - Minimize to hide.<br>
            - Export to console.
        `;
        contentDiv.appendChild(instr);

        // Minimize logic
        let minimized = false;
        minimizeBtn.onclick = (e) => {
            e.stopPropagation();
            minimized = !minimized;
            if (minimized) {
                contentDiv.style.display = 'none';
                minimizeBtn.textContent = '+';
                box.style.height = 'auto';
                box.style.width = '110px';
            } else {
                contentDiv.style.display = '';
                minimizeBtn.textContent = '–';
                box.style.width = '220px';
            }
        };

        // Drag logic
        let dragOffsetX = 0, dragOffsetY = 0, dragging = false;
        dragHeader.onmousedown = (e) => {
            dragging = true;
            dragOffsetX = e.clientX - box.getBoundingClientRect().left;
            dragOffsetY = e.clientY - box.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        };
        document.addEventListener('mousemove', (e) => {
            if (dragging) {
                let newLeft = e.clientX - dragOffsetX;
                let newTop = e.clientY - dragOffsetY;
                // Clamp to window
                newLeft = Math.max(0, Math.min(window.innerWidth - box.offsetWidth, newLeft));
                newTop = Math.max(0, Math.min(window.innerHeight - box.offsetHeight, newTop));
                box.style.left = newLeft + 'px';
                box.style.top = newTop + 'px';
            }
        });
        document.addEventListener('mouseup', () => {
            dragging = false;
            document.body.style.userSelect = '';
        });

        document.getElementById('game-container').appendChild(box);
        this._collisionEditUIBox = box;
        this._collisionEditUIContent = contentDiv;
    }

    _showCollisionEditUI(show) {
        if (!this._collisionEditUIBox) this._initCollisionEditUI();
        this._collisionEditUIBox.style.display = show ? 'block' : 'none';
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
        // --- BEGIN: Pause game update if world map is active ---
        if (!this._worldMapActive) {
            this.physics.update(dt);
        }
        // --- END: Pause game update if world map is active ---
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
        // --- BEGIN: Render world map overlay if active ---
        if (this._worldMapActive) {
            this.renderWorldMapOverlay();
        }
        // --- END
    }

    renderCollisionGrid() {
        const ctx = this.ctx;
        const sceneKey = this.state.currentScene;
        // Defensive: create grid if not present
        if (!Array.isArray(this.collisionGrid[sceneKey])) {
            // 20 rows x 30 cols for 900x600, 30px each
            this.collisionGrid[sceneKey] = [];
            for (let y = 0; y < 20; ++y) {
                this.collisionGrid[sceneKey][y] = [];
                for (let x = 0; x < 30; ++x) {
                    this.collisionGrid[sceneKey][y][x] = 0;
                }
            }
        }
        const grid = this.collisionGrid[sceneKey];
        const gridSize = this.collisionGridSize;
        // Draw grid overlay
        ctx.save();
        for (let y = 0; y < 20; ++y) {
            for (let x = 0; x < 30; ++x) {
                const gx = x * gridSize;
                const gy = y * gridSize;
                // Cell background
                if (grid[y][x] === 1) {
                    ctx.fillStyle = "rgba(220,40,40,0.36)";
                    ctx.fillRect(gx, gy, gridSize, gridSize);
                } else {
                    ctx.fillStyle = "rgba(255,255,255,0.08)";
                    ctx.fillRect(gx, gy, gridSize, gridSize);
                }
                // Cell border
                ctx.strokeStyle = "rgba(0,0,0,0.18)";
                ctx.lineWidth = 1;
                ctx.strokeRect(gx, gy, gridSize, gridSize);
            }
        }
        ctx.restore();
    }

    handleClick(x, y) {
        // --- BEGIN: World map overlay click handling ---
        if (this._worldMapActive) {
            this.handleWorldMapClick(x, y);
            return;
        }
        // --- END: World map overlay click handling ---

        // --- BEGIN: Collision grid edit mode click handling ---
        if (this.collisionEditMode) {
            // Only handle grid clicks if within canvas
            if (
                x >= 0 && x < window.GAME_WIDTH &&
                y >= 0 && y < window.GAME_HEIGHT
            ) {
                const sceneKey = this.state.currentScene;
                if (!Array.isArray(this.collisionGrid[sceneKey])) {
                    // 20 rows x 30 cols for 900x600, 30px each
                    this.collisionGrid[sceneKey] = [];
                    for (let yy = 0; yy < 20; ++yy) {
                        this.collisionGrid[sceneKey][yy] = [];
                        for (let xx = 0; xx < 30; ++xx) {
                            this.collisionGrid[sceneKey][yy][xx] = 0;
                        }
                    }
                }
                const grid = this.collisionGrid[sceneKey];
                const gridSize = this.collisionGridSize;
                const gx = Math.floor(x / gridSize);
                const gy = Math.floor(y / gridSize);
                if (
                    gy >= 0 && gy < grid.length &&
                    gx >= 0 && gx < grid[0].length
                ) {
                    // Toggle collision state
                    grid[gy][gx] = grid[gy][gx] ? 0 : 1;
                    this._collisionDragLastCell = { gx, gy, state: grid[gy][gx] };
                    this.render();
                }
            }
            return;
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
    // Add mouse event listeners for drag-to-select
    // (This must be attached to the canvas)
    _collisionEditDragInit = false;
    _ensureCollisionEditDrag() {
        if (this._collisionEditDragInit) return;
        this._collisionEditDragInit = true;
        const canvas = this.canvas;
        canvas.addEventListener('mousedown', (e) => {
            if (!this.collisionEditMode) return;
            const rect = canvas.getBoundingClientRect();
            const x = Math.round((e.clientX - rect.left) * window.GAME_WIDTH / rect.width);
            const y = Math.round((e.clientY - rect.top) * window.GAME_HEIGHT / rect.height);
            this._collisionDragActive = true;
            this.handleClick(x, y);
        });
        canvas.addEventListener('mousemove', (e) => {
            if (!this.collisionEditMode || !this._collisionDragActive) return;
            const rect = canvas.getBoundingClientRect();
            const x = Math.round((e.clientX - rect.left) * window.GAME_WIDTH / rect.width);
            const y = Math.round((e.clientY - rect.top) * window.GAME_HEIGHT / rect.height);
            const sceneKey = this.state.currentScene;
            if (!Array.isArray(this.collisionGrid[sceneKey])) return;
            const grid = this.collisionGrid[sceneKey];
            const gridSize = this.collisionGridSize;
            const gx = Math.floor(x / gridSize);
            const gy = Math.floor(y / gridSize);
            if (
                gy >= 0 && gy < grid.length &&
                gx >= 0 && gx < grid[0].length
            ) {
                // Only update if not already same as drag last cell
                if (
                    !this._collisionDragLastCell ||
                    this._collisionDragLastCell.gx !== gx ||
                    this._collisionDragLastCell.gy !== gy
                ) {
                    // Set to last drag state if present, else toggle
                    let newState = 1;
                    if (this._collisionDragLastCell && typeof this._collisionDragLastCell.state === "number") {
                        newState = this._collisionDragLastCell.state;
                    } else {
                        newState = grid[gy][gx] ? 0 : 1;
                    }
                    grid[gy][gx] = newState;
                    this._collisionDragLastCell = { gx, gy, state: newState };
                    this.render();
                }
            }
        });
        window.addEventListener('mouseup', () => {
            this._collisionDragActive = false;
            this._collisionDragLastCell = null;
        });
    }
    // --- END: Drag-to-select for collision grid ---

    // --- BEGIN: Collision edit mode toggle ---
    toggleCollisionEditMode(forceState = null) {
        if (typeof forceState === "boolean") {
            this.collisionEditMode = forceState;
        } else {
            this.collisionEditMode = !this.collisionEditMode;
        }
        this._showCollisionEditUI(this.collisionEditMode);
        if (this.collisionEditMode) {
            this._ensureCollisionEditDrag();
            systemMessage("Collision Edit Mode Enabled");
        } else {
            systemMessage("Collision Edit Mode Disabled");
        }
        this.render();
    }
    // --- END: Collision edit mode toggle ---

    // --- BEGIN: World Map Overlay Implementation ---

    toggleWorldMap(forceState = null) {
        // Only allow world map if not in dialogue/puzzle/shop
        if (
            document.getElementById('dialogue-box')?.style.display === 'block' ||
            document.getElementById('puzzle-modal')?.classList.contains('active') ||
            document.getElementById('shop-panel')
        ) return;

        if (typeof forceState === "boolean") {
            this._worldMapActive = forceState;
        } else {
            this._worldMapActive = !this._worldMapActive;
        }
        this.render();
        if (this._worldMapActive) {
            systemMessage("World Map Opened");
        } else {
            systemMessage("World Map Closed");
        }
    }

    renderWorldMapOverlay() {
        const ctx = this.ctx;
        ctx.save();
        // Dim background
        ctx.globalAlpha = 0.72;
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, window.GAME_WIDTH, window.GAME_HEIGHT);
        ctx.globalAlpha = 1.0;

        // Panel
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(90, 60, 720, 480, 32);
        ctx.fillStyle = "rgba(245, 238, 210, 0.97)";
        ctx.shadowColor = "#b8a664";
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // Title
        ctx.save();
        ctx.font = "bold 2.2em Arial";
        ctx.fillStyle = "#b98d00";
        ctx.textAlign = "center";
        ctx.fillText("World Map", 450, 110);
        ctx.restore();

        // Draw 5 locations as circles with icons/text
        const locations = [
            { key: "LEVEL_1", name: "Village Square", x: 200, y: 220, icon: "🏘️" },
            { key: "LEVEL_2", name: "Foyer", x: 700, y: 220, icon: "🚪" },
            { key: "LEVEL_3", name: "Forest Edge", x: 200, y: 400, icon: "🌲" },
            { key: "LEVEL_4", name: "Village Inn", x: 700, y: 400, icon: "🏨" },
            { key: "LEVEL_5", name: "Grand Library", x: 450, y: 320, icon: "📚" }
        ];
        // Save for click detection
        this._worldMapLocs = locations.map(loc => ({
            ...loc,
            cx: 90 + loc.x,
            cy: 60 + loc.y,
            r: 56
        }));

        // Draw lines between some locations for flavor
        ctx.save();
        ctx.strokeStyle = "#b8a664";
        ctx.lineWidth = 6;
        ctx.globalAlpha = 0.22;
        ctx.beginPath();
        ctx.moveTo(90 + 200, 60 + 220); // LEVEL_1
        ctx.lineTo(90 + 450, 60 + 320); // LEVEL_5
        ctx.lineTo(90 + 700, 60 + 220); // LEVEL_2
        ctx.moveTo(90 + 450, 60 + 320);
        ctx.lineTo(90 + 200, 60 + 400); // LEVEL_3
        ctx.lineTo(90 + 700, 60 + 400); // LEVEL_4
        ctx.lineTo(90 + 450, 60 + 320);
        ctx.stroke();
        ctx.restore();

        // Draw location circles
        for (const loc of this._worldMapLocs) {
            // Highlight current scene
            const isCurrent = this.state.currentScene === loc.key;
            ctx.save();
            ctx.beginPath();
            ctx.arc(loc.cx, loc.cy, loc.r, 0, 2 * Math.PI);
            ctx.fillStyle = isCurrent ? "#ffe264" : "#fffbe6";
            ctx.shadowColor = isCurrent ? "#ffe264" : "#b8a664";
            ctx.shadowBlur = isCurrent ? 24 : 10;
            ctx.globalAlpha = isCurrent ? 0.98 : 0.82;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1.0;
            ctx.lineWidth = isCurrent ? 5 : 2.5;
            ctx.strokeStyle = isCurrent ? "#b98d00" : "#b8a664";
            ctx.stroke();
            ctx.restore();

            // Icon
            ctx.save();
            ctx.font = isCurrent ? "2.7em serif" : "2.2em serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(loc.icon, loc.cx, loc.cy - 10);
            ctx.restore();

            // Label
            ctx.save();
            ctx.font = isCurrent ? "bold 1.25em Arial" : "1.1em Arial";
            ctx.fillStyle = isCurrent ? "#b98d00" : "#222";
            ctx.textAlign = "center";
            ctx.fillText(loc.name, loc.cx, loc.cy + 38);
            ctx.restore();
        }

        // Instructions
        ctx.save();
        ctx.font = "1.07em Arial";
        ctx.fillStyle = "#b98d00";
        ctx.textAlign = "center";
        ctx.fillText("Click a location to fast travel. Press M or ESC to close.", 450, 540);
        ctx.restore();

        ctx.restore();
    }

    handleWorldMapClick(x, y) {
        // Only allow clicks inside the world map panel
        if (!this._worldMapLocs) return;
        for (const loc of this._worldMapLocs) {
            const dx = x - loc.cx, dy = y - loc.cy;
            if (Math.sqrt(dx * dx + dy * dy) <= loc.r) {
                // Fast travel to this level
                this._worldMapActive = false;
                this.sceneManager.enterScene(loc.key);
                systemMessage(`Fast traveled to ${loc.name}!`);
                this.render();
                return;
            }
        }
        // If click outside any location, but inside panel, do nothing
        // If click outside panel, close world map
        if (x < 90 || x > 810 || y < 60 || y > 540) {
            this.toggleWorldMap(false);
        }
    }

    // --- END: World Map Overlay Implementation ---
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