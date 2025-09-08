// Handles all canvas rendering

class RenderSystem {
    constructor(game) {
        this.game = game;
        this.bgPulseTime = 0;

        // --- Level 1 background image ---
        this.level1BgImg = new window.Image();
        this.level1BgImgLoaded = false;
        this.level1BgImg.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/Sif_work_1757279673277.png";
        this.level1BgImg.onload = () => {
            this.level1BgImgLoaded = true;
        };

        // --- Level 2 (Foyer) background image ---
        this.level2BgImg = new window.Image();
        this.level2BgImgLoaded = false;
        // MODIFIED: Use the requested background image for LEVEL_2
        this.level2BgImg.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/inside_buil_1757288769976.png";
        this.level2BgImg.onload = () => {
            this.level2BgImgLoaded = true;
        };
    }
    render() {
        const ctx = this.game.ctx;
        ctx.clearRect(0, 0, window.GAME_WIDTH, window.GAME_HEIGHT);

        // Draw background
        this.renderBackground(ctx);
        // Draw hotspots
        this.renderHotspots(ctx);
        // Draw NPCs
        this.renderNPCs(ctx);
        // Draw Player
        if (this.game.player) this.game.player.render(ctx);
        // Draw items (hint coins and clues)
        this.renderItems(ctx);
        // Draw door (visual overlay)
        this.renderDoor(ctx);
    }

    renderBackground(ctx) {
        // Procedural gradient backgrounds
        const scene = this.game.state.currentScene;
        let grad;
        // --- Level 1: use image as background ---
        if (scene === window.SceneType.LEVEL_1) {
            if (this.level1BgImgLoaded) {
                ctx.drawImage(this.level1BgImg, 0, 0, window.GAME_WIDTH, window.GAME_HEIGHT);
            } else {
                // fallback: fill with a color while loading
                ctx.fillStyle = "#ffeab7";
                ctx.fillRect(0, 0, window.GAME_WIDTH, window.GAME_HEIGHT);
            }
        } else if (scene === window.SceneType.LEVEL_2) {
            // Level 2 foyer: use requested image or fallback
            if (this.level2BgImgLoaded) {
                ctx.drawImage(this.level2BgImg, 0, 0, window.GAME_WIDTH, window.GAME_HEIGHT);
            } else {
                ctx.fillStyle = "#e3e0d6";
                ctx.fillRect(0, 0, window.GAME_WIDTH, window.GAME_HEIGHT);
                // Draw simple foyer archway as fallback
                ctx.save();
                ctx.strokeStyle = "#b6a77e";
                ctx.lineWidth = 12;
                ctx.beginPath();
                ctx.arc(450, 340, 80, Math.PI, 0, false);
                ctx.stroke();
                ctx.restore();
            }
        } else if (scene === window.SceneType.VILLAGE) {
            grad = ctx.createLinearGradient(0, 0, window.GAME_WIDTH, window.GAME_HEIGHT);
            grad.addColorStop(0, "#ffeab7");
            grad.addColorStop(1, "#9dd9f7");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, window.GAME_WIDTH, window.GAME_HEIGHT);
            // Artistic clouds
            for (let i = 0; i < 3; ++i) {
                ctx.save();
                ctx.globalAlpha = 0.13 + 0.07*Math.sin(this.bgPulseTime/700+i);
                ctx.beginPath();
                ctx.ellipse(150 + i * 190, 110 + 12*i, 90, 30, 0, 0, 2 * Math.PI);
                ctx.fillStyle = "#fff";
                ctx.fill();
                ctx.restore();
            }
            // Village square: ground
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, 520);
            ctx.bezierCurveTo(300, 500, 600, 570, 900, 520);
            ctx.lineTo(900, 600); ctx.lineTo(0, 600);
            ctx.closePath();
            ctx.fillStyle = "#e0d47a";
            ctx.globalAlpha = 0.9;
            ctx.fill();
            ctx.restore();
        } else if (scene === window.SceneType.INN) {
            grad = ctx.createLinearGradient(0, 0, 0, window.GAME_HEIGHT);
            grad.addColorStop(0, "#fff3d4");
            grad.addColorStop(1, "#d7b87a");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, window.GAME_WIDTH, window.GAME_HEIGHT);
            // Fireplace
            ctx.save();
            ctx.globalAlpha = 0.5+0.1*Math.sin(this.bgPulseTime/500);
            ctx.beginPath();
            ctx.arc(770, 430, 38, 0, 2*Math.PI);
            ctx.fillStyle = "#f7c75b";
            ctx.shadowColor = "#f7c75b";
            ctx.shadowBlur = 30;
            ctx.fill();
            ctx.restore();
        } else if (scene === window.SceneType.LIBRARY) {
            grad = ctx.createLinearGradient(0, 0, window.GAME_WIDTH, window.GAME_HEIGHT);
            grad.addColorStop(0, "#e9f5ff");
            grad.addColorStop(1, "#b6cbe2");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, window.GAME_WIDTH, window.GAME_HEIGHT);
            // Bookshelves
            for (let i = 0; i < 4; i++) {
                ctx.save();
                ctx.fillStyle = "#c1b178";
                ctx.globalAlpha = 0.24;
                ctx.fillRect(190 + i * 110, 160, 70, 260);
                ctx.restore();
            }
        } else if (scene === window.SceneType.SHOP) {
            grad = ctx.createLinearGradient(0, 0, window.GAME_WIDTH, window.GAME_HEIGHT);
            grad.addColorStop(0, "#f6f7db");
            grad.addColorStop(1, "#e9f097");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, window.GAME_WIDTH, window.GAME_HEIGHT);
        } else if (scene === window.SceneType.FOREST) {
            grad = ctx.createRadialGradient(500, 350, 140, 400, 300, 600);
            grad.addColorStop(0, "#c9e7c2");
            grad.addColorStop(1, "#79a36a");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, window.GAME_WIDTH, window.GAME_HEIGHT);
            // Trees
            for (let i = 0; i < 5; i++) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(200+130*i, 220+Math.sin(this.bgPulseTime/800+i)*10, 60, 0, 2*Math.PI);
                ctx.fillStyle = "#557e43";
                ctx.globalAlpha = 0.5;
                ctx.fill();
                ctx.restore();
            }
        }
        this.bgPulseTime += 17;
    }

    renderHotspots(ctx) {
        const map = window.MapData[this.game.state.currentScene];
        if (!map || !map.hotspots) return;
        for (const hs of map.hotspots) {
            if (hs.type === "npc" || hs.type === "area") {
                ctx.save();
                ctx.globalAlpha = 0.14;
                ctx.beginPath();
                ctx.arc(hs.x, hs.y, hs.r, 0, 2*Math.PI);
                ctx.fillStyle = (hs.type === "npc") ? "#badefc" : "#e9d689";
                ctx.fill();
                ctx.restore();
            }
        }
    }

    renderNPCs(ctx) {
        const map = window.MapData[this.game.state.currentScene];
        if (!map || !map.hotspots) return;
        for (const hs of map.hotspots) {
            if (hs.type === "npc" && window.Characters[hs.npc]) {
                window.renderNPC(ctx, hs.npc, hs.x, hs.y);
            }
        }
    }

    renderItems(ctx) {
        const map = window.MapData[this.game.state.currentScene];
        if (!map || !map.hotspots) return;
        for (const hs of map.hotspots) {
            // --- BEGIN: Fallen Clue Render ---
            if (hs.type === "item" && hs.item === "fallen-clue") {
                // Only draw if not yet collected
                if (!this.game.state.inventory.includes(hs.id)) {
                    const pulse = 1 + Math.sin(this.bgPulseTime/180 + hs.x)*0.09;
                    window.renderFallenClue(ctx, hs.x, hs.y, pulse);
                }
            }
            // --- END: Fallen Clue Render ---
            if (hs.type === "item" && hs.item === "hint-coin") {
                // Only draw if not yet collected
                if (!this.game.state.inventory.includes(hs.id)) {
                    const pulse = 1 + Math.sin(this.bgPulseTime/200 + hs.x)*0.08;
                    window.renderHintCoin(ctx, hs.x, hs.y, pulse);
                }
            }
            // --- BEGIN: LEVEL_2 Story Clue Renders ---
            // Only draw clues in LEVEL_2 if not yet collected
            if (this.game.state.currentScene === window.SceneType.LEVEL_2) {
                if (hs.type === "item" && hs.item === "story-clue1") {
                    if (!this.game.state.inventory.includes(hs.id)) {
                        const pulse = 1 + Math.sin(this.bgPulseTime/210 + hs.x)*0.07;
                        window.renderStoryClue1(ctx, hs.x, hs.y, pulse);
                    }
                }
                if (hs.type === "item" && hs.item === "story-clue2") {
                    if (!this.game.state.inventory.includes(hs.id)) {
                        const pulse = 1 + Math.sin(this.bgPulseTime/220 + hs.x)*0.07;
                        window.renderStoryClue2(ctx, hs.x, hs.y, pulse);
                    }
                }
                if (hs.type === "item" && hs.item === "story-clue3") {
                    if (!this.game.state.inventory.includes(hs.id)) {
                        const pulse = 1 + Math.sin(this.bgPulseTime/230 + hs.x)*0.07;
                        window.renderStoryClue3(ctx, hs.x, hs.y, pulse);
                    }
                }
            }
            // --- END: LEVEL_2 Story Clue Renders ---
        }
    }

    renderDoor(ctx) {
        // Draw the door visually in LEVEL_1 and LEVEL_2 as an invisible square (for debugging, comment in the code below)
        // The door is still invisible, but now its hotspot is a square for interaction.
        // If you want to debug visually, uncomment the following:

        /*
        const scene = this.game.state.currentScene;
        if (
            (scene === window.SceneType.LEVEL_1 || scene === window.SceneType.LEVEL_2)
        ) {
            // Get the door hotspot
            const map = window.MapData[scene];
            if (map && map.hotspots) {
                const door = map.hotspots.find(hs => hs.id === "door1-l1" || hs.id === "door1-l2");
                if (door) {
                    ctx.save();
                    ctx.globalAlpha = 0.12;
                    ctx.beginPath();
                    // Draw a square instead of a circle
                    ctx.rect(door.x - door.r, door.y - door.r, door.r * 2, door.r * 2);
                    ctx.fillStyle = "#e9d689";
                    ctx.fill();
                    ctx.restore();
                }
            }
        }
        */
        // By default, do nothing (keep door invisible).
    }
}
window.RenderSystem = RenderSystem;