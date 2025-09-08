class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        // Make the player 1/3 smaller: scale radius by 2/3
        this.radius = (window.PLAYER_SIZE / 2) * (2 / 3);
        this.speed = window.PLAYER_SPEED;
        this.isMoving = false;
        this.moveTimer = 0;

        // --- Animation frames for walking away ---
        this.walkAwayFrames = [
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Sif%20walkinng%20away_frame_1.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Sif_walkinng_away_frame_1.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Sif_walkinng_away_frame_2.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Sif_walkinng_away_frame_3.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Sif_walkinng_away_frame_4.png"
        ];
        this.walkAwayImages = [];
        this.walkAwayLoaded = [];
        for (let i = 0; i < this.walkAwayFrames.length; ++i) {
            const img = new window.Image();
            img.src = this.walkAwayFrames[i];
            this.walkAwayImages.push(img);
            this.walkAwayLoaded.push(false);
            img.onload = () => { this.walkAwayLoaded[i] = true; };
        }

        // --- Animation frames for turning/walking left ---
        this.walkLeftFrames = [
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/sif%20turn%20right%20)his%20perspective)_frame_1.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/sif_turn_right__his_perspective__frame_1.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/sif_turn_right__his_perspective__frame_2.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/sif_turn_right__his_perspective__frame_3.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/sif_turn_right__his_perspective__frame_4.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/sif_turn_right__his_perspective__frame_5.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/sif_turn_right__his_perspective__frame_6.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/sif_turn_right__his_perspective__frame_7.png"
        ];
        this.walkLeftImages = [];
        this.walkLeftLoaded = [];
        for (let i = 0; i < this.walkLeftFrames.length; ++i) {
            const img = new window.Image();
            img.src = this.walkLeftFrames[i];
            this.walkLeftImages.push(img);
            this.walkLeftLoaded.push(false);
            img.onload = () => { this.walkLeftLoaded[i] = true; };
        }

        // --- Animation frames for turning/walking right ---
        this.walkRightFrames = [
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Sif%20turn%20Left_frame_1.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Sif_turn_Left_frame_1.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Sif_turn_Left_frame_2.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Sif_turn_Left_frame_3.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Sif_turn_Left_frame_4.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Sif_turn_Left_frame_5.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Sif_turn_Left_frame_6.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Sif_turn_Left_frame_7.png",
            "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Sif_turn_Left_frame_8.png"
        ];
        this.walkRightImages = [];
        this.walkRightLoaded = [];
        for (let i = 0; i < this.walkRightFrames.length; ++i) {
            const img = new window.Image();
            img.src = this.walkRightFrames[i];
            this.walkRightImages.push(img);
            this.walkRightLoaded.push(false);
            img.onload = () => { this.walkRightLoaded[i] = true; };
        }

        this.walkFrameIdx = 0;
        this.walkAnimTimer = 0;
        this.walkAnimSpeed = 120; // ms per frame

        // Track last movement direction for animation
        this.lastMoveDir = { x: 0, y: 1 }; // Default: down/away

        // --- FIX: Remove any movement limit ---
        // (no movement counter or limit is set)

        // --- BEGIN: Idle facing player image ---
        this.idleFacingPlayerImg = new window.Image();
        this.idleFacingPlayerLoaded = false;
        this.idleFacingPlayerImg.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/sif_idle_1757300204691.png";
        this.idleFacingPlayerImg.onload = () => { this.idleFacingPlayerLoaded = true; };
        // --- END: Idle facing player image ---
    }

    setTarget(x, y) {
        // Allow unlimited movement: remove clamping to GAME_WIDTH/GAME_HEIGHT
        // Instead, clamp only to safe JS numbers
        // But for practical reasons, allow movement to any coordinate (including off-canvas)
        this.targetX = x;
        this.targetY = y;
        this.isMoving = true;
        // --- FIX: Remove any movement limit logic here ---
        // (no movement counter or limit is set)
    }

    update(dt) {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.isMoving = false;
            // Reset walk animation to first frame when stopped
            this.walkFrameIdx = 0;
            this.walkAnimTimer = 0;
            return;
        }
        const angle = Math.atan2(dy, dx);
        const moveDist = Math.min(dist, this.speed * dt);
        this.x += Math.cos(angle) * moveDist;
        this.y += Math.sin(angle) * moveDist;
        this.isMoving = true;

        // Track last movement direction for animation
        // We'll use a threshold to determine "left", "right", or "away"
        if (Math.abs(dx) > Math.abs(dy) && dx < 0) {
            // Moving left
            this.lastMoveDir = { x: -1, y: 0 };
        } else if (Math.abs(dx) > Math.abs(dy) && dx > 0) {
            // Moving right
            this.lastMoveDir = { x: 1, y: 0 };
        } else if (Math.abs(dy) >= Math.abs(dx) && dy > 0) {
            // Moving away/down
            this.lastMoveDir = { x: 0, y: 1 };
        } else if (Math.abs(dy) >= Math.abs(dx) && dy < 0) {
            // Moving up/toward (not used for animation here)
            this.lastMoveDir = { x: 0, y: -1 };
        }

        // Advance walk animation timer only when moving
        this.walkAnimTimer += dt * 16.67;
        if (this.walkAnimTimer > this.walkAnimSpeed) {
            this.walkAnimTimer = 0;
            // Use correct frame count for current animation
            const animLen = this._getCurrentAnimImages().length;
            this.walkFrameIdx = (this.walkFrameIdx + 1) % animLen;
        }
    }

    _getCurrentAnimImages() {
        // Show left animation if moving left, right animation if moving right, else away animation
        if (this.isMoving && this.lastMoveDir.x === -1) {
            return this.walkLeftImages;
        }
        if (this.isMoving && this.lastMoveDir.x === 1) {
            return this.walkRightImages;
        }
        return this.walkAwayImages;
    }
    _getCurrentAnimLoaded() {
        if (this.isMoving && this.lastMoveDir.x === -1) {
            return this.walkLeftLoaded;
        }
        if (this.isMoving && this.lastMoveDir.x === 1) {
            return this.walkRightLoaded;
        }
        return this.walkAwayLoaded;
    }

    // --- BEGIN MODIFICATION: Dynamic scaling based on y position ---
    _getScaleByY() {
        // At top (y=0): smallest, at bottom (y=GAME_HEIGHT): largest
        // Let's use a scale range from 0.55 (top) to 1.15 (bottom)
        const minScale = 0.55;
        const maxScale = 1.15;
        const yNorm = window.clamp((this.y - 0) / (window.GAME_HEIGHT - 0), 0, 1);
        return minScale + (maxScale - minScale) * yNorm;
    }
    // --- END MODIFICATION ---

    render(ctx) {
        // Only draw player if within visible canvas bounds (avoid runtime errors)
        // (Allow some margin for large player sprite)
        // --- PATCH: Remove runtime errors when walking too much ---
        // Clamp player position to safe canvas range before rendering
        // (But allow offscreen movement, just don't render if way off)
        if (
            typeof this.x !== 'number' || typeof this.y !== 'number' ||
            isNaN(this.x) || isNaN(this.y) ||
            !isFinite(this.x) || !isFinite(this.y)
        ) {
            // If player position is invalid, reset to center of canvas
            this.x = window.GAME_WIDTH / 2;
            this.y = window.GAME_HEIGHT / 2;
        }

        if (
            this.x < -window.PLAYER_SIZE ||
            this.x > window.GAME_WIDTH + window.PLAYER_SIZE ||
            this.y < -window.PLAYER_SIZE ||
            this.y > window.GAME_HEIGHT + window.PLAYER_SIZE
        ) {
            // Player is far offscreen, don't draw
            return;
        }

        // --- MODIFICATION: Compute dynamic scale based on y position ---
        const scaleY = this._getScaleByY();
        // --- END MODIFICATION ---

        // Draw walking animation if images loaded
        let allLoaded = this._getCurrentAnimLoaded().every(v => v);
        const images = this._getCurrentAnimImages();
        let img = null;

        if (this.isMoving) {
            // Moving: use walking animation as before
            if (allLoaded) {
                img = images[this.walkFrameIdx];
            }
            // Defensive: Ensure img is a valid image and is fully loaded
            if (img && img instanceof window.Image && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                ctx.save();
                ctx.translate(this.x, this.y);
                // Center the sprite
                // Assume sprite is 64x64, scale to player size
                const drawW = 64, drawH = 64;
                // --- MODIFICATION: Use dynamic scale ---
                // Also apply 2/3 scaling to baseScale
                const baseScale = ((this.radius * 2) / drawW); // radius already has 2/3 applied
                ctx.scale(baseScale * scaleY, baseScale * scaleY);
                ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
                ctx.restore();
                return;
            }
        } else {
            // Idle: use the requested static image facing the player
            if (this.idleFacingPlayerLoaded) {
                ctx.save();
                ctx.translate(this.x, this.y);
                // Assume image is 64x64, scale to player size
                const drawW = 64, drawH = 64;
                const baseScale = ((this.radius * 2) / drawW); // radius already has 2/3 applied
                ctx.scale(baseScale * scaleY, baseScale * scaleY);
                ctx.drawImage(this.idleFacingPlayerImg, -drawW / 2, -drawH / 2, drawW, drawH);
                ctx.restore();
                return;
            }
        }

        // Fallback: original cat explorer drawing
        ctx.save();
        ctx.translate(this.x, this.y);
        // --- MODIFICATION: Use dynamic scale for fallback drawing ---
        // Also apply 2/3 scaling to fallback drawing (radius already has it)
        ctx.scale(scaleY, scaleY);
        // Body
        const grad = ctx.createRadialGradient(0, 0, 6 * 4, 0, 0, this.radius);
        grad.addColorStop(0, '#fff8dc');
        grad.addColorStop(1, '#e8b264');
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.shadowColor = "#e0a62d";
        ctx.shadowBlur = 16 * 4;
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.shadowBlur = 0;
        // Ears
        ctx.beginPath();
        ctx.moveTo(-12 * 4, -this.radius + 9 * 4);
        ctx.lineTo(-2 * 4, -this.radius - 10 * 4);
        ctx.lineTo(7 * 4, -this.radius + 9 * 4);
        ctx.closePath();
        ctx.fillStyle = "#e8b264";
        ctx.fill();
        // Face
        ctx.beginPath();
        ctx.arc(-8 * 4, -6 * 4, 4 * 4, 0, 2 * Math.PI);
        ctx.arc(8 * 4, -6 * 4, 4 * 4, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.fill();
        // Eyes
        ctx.beginPath();
        ctx.arc(-8 * 4, -6 * 4, 1.5 * 4, 0, 2 * Math.PI);
        ctx.arc(8 * 4, -6 * 4, 1.5 * 4, 0, 2 * Math.PI);
        ctx.fillStyle = "#111";
        ctx.fill();
        // Nose
        ctx.beginPath();
        ctx.moveTo(0, 2 * 4);
        ctx.lineTo(-2 * 4, 6 * 4);
        ctx.lineTo(2 * 4, 6 * 4);
        ctx.closePath();
        ctx.fillStyle = "#d27700";
        ctx.fill();
        ctx.restore();
    }
}
window.Player = Player;