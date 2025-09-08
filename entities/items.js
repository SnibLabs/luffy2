// Items: hint coin

function renderHintCoin(ctx, x, y, pulse=1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(pulse, pulse);
    // Glow
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 220, 80, 0.23)";
    ctx.shadowColor = "#ffe57c";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Coin
    const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, 13);
    grad.addColorStop(0, "#fff7b7");
    grad.addColorStop(1, "#f2d64b");
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, 2 * Math.PI);
    ctx.fillStyle = grad;
    ctx.fill();
    // Shine
    ctx.beginPath();
    ctx.arc(-4, -6, 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fill();
    ctx.restore();
}

// --- BEGIN: Fallen Clue Animation Sprite Loader (ACTUAL_CLUEY) ---
const clueAnimFrames = [
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/ACTUAL%20CLUEY_frame_1.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/ACTUAL_CLUEY_frame_1.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/ACTUAL_CLUEY_frame_2.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/ACTUAL_CLUEY_frame_3.png"
];
const clueAnimImages = [];
const clueAnimLoaded = [];
for (let i = 0; i < clueAnimFrames.length; ++i) {
    const img = new window.Image();
    img.src = clueAnimFrames[i];
    clueAnimImages.push(img);
    clueAnimLoaded.push(false);
    img.onload = () => { clueAnimLoaded[i] = true; };
}
// --- END: Fallen Clue Animation Sprite Loader ---

// --- BEGIN: Fallen Clue Render ---
function renderFallenClue(ctx, x, y, pulse=1) {
    // Animation timing: 500ms per frame (2fps), loop
    const frameDuration = 500;
    const now = performance.now();
    const frameIdx = Math.floor(now / frameDuration) % clueAnimImages.length;

    // --- BEGIN: Apply scaling and position offset for clue ---
    const scale = 0.5;
    const yOffset = -48 * 0.25 + 2; // up is negative y
    const xOffset = 48 * 0.15 + 2;
    x = x + xOffset;
    y = y + yOffset;
    // --- END: Apply scaling and position offset for clue ---

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.18); // Slightly askew
    ctx.scale(1.07 * pulse * scale, 1.07 * pulse * scale);

    // --- BEGIN: Powerful Yet Subtle Glow Effect ---
    // Outer radiant glow (large, soft, low alpha)
    ctx.save();
    const glowPulse = 0.72 + 0.18 * Math.sin(now / 900);
    ctx.globalAlpha = 0.34 * glowPulse;
    ctx.beginPath();
    ctx.arc(0, 0, 54, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 241, 180, 0.22)";
    ctx.shadowColor = "#fffbe6";
    ctx.shadowBlur = 36 + 18 * glowPulse;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Inner radiant glow (smaller, more intense)
    ctx.save();
    ctx.globalAlpha = 0.44 + 0.18 * Math.sin(now / 600);
    ctx.beginPath();
    ctx.arc(0, 0, 29, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 255, 210, 0.38)";
    ctx.shadowColor = "#ffe57c";
    ctx.shadowBlur = 32 + 8 * Math.sin(now / 700);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Subtle "aura ring" effect
    ctx.save();
    ctx.globalAlpha = 0.19 + 0.09 * Math.sin(now / 1300);
    ctx.beginPath();
    ctx.arc(0, 0, 38 + 2 * Math.sin(now / 800), 0, 2 * Math.PI);
    ctx.lineWidth = 6.5 + 1.2 * Math.sin(now / 600);
    ctx.strokeStyle = "rgba(255, 246, 180, 0.32)";
    ctx.shadowColor = "#fffbe6";
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
    // --- END: Powerful Yet Subtle Glow Effect ---

    // Shadow
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.ellipse(0, 18, 28, 8, 0, 0, 2 * Math.PI);
    ctx.fillStyle = "#222";
    ctx.fill();
    ctx.restore();

    // --- BEGIN: Enhanced Particle Glow Effects for Importance ---
    // Particle parameters
    const particleCount = 13; // more particles for importance
    const particleBaseRadius = 26; // slightly larger orbit
    const particleColor = "rgba(255, 241, 180, 0.38)";
    const particleGlowColor = "#ffe57c";
    const particleSize = 4.2;
    const particlePulse = Math.sin(now / 570) * 0.19 + 1.0;

    for (let i = 0; i < particleCount; ++i) {
        // Angle around the clue, slightly randomized
        const angle = (2 * Math.PI * i) / particleCount + Math.sin(now/1100 + i) * 0.13;
        // Orbit radius, with subtle pulsation
        const radius = particleBaseRadius + Math.sin(now/900 + i*1.7) * 2.8;
        // Particle position
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius * 0.85 + Math.sin(now/1600 + i) * 0.7;
        // Particle alpha flicker
        const alpha = 0.29 + 0.13 * Math.sin(now/400 + i*2.2);
        ctx.save();
        ctx.globalAlpha = alpha * particlePulse;
        ctx.beginPath();
        ctx.arc(px, py, particleSize + Math.sin(now/600 + i)*0.8, 0, 2 * Math.PI);
        ctx.fillStyle = particleColor;
        ctx.shadowColor = particleGlowColor;
        ctx.shadowBlur = 14 + Math.sin(now/800 + i)*4.5;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    // --- ADDITIONAL: Occasional Sparkle Effects ---
    const sparkleCount = 2;
    for (let s = 0; s < sparkleCount; ++s) {
        // Each sparkle has its own animation offset
        const sparkleTime = ((now/1200 + s*1.3) % 1);
        if (sparkleTime > 0.85) {
            // Sparkle appears briefly
            const sparkleAngle = (now/900 + s*2.1) % (2*Math.PI);
            const sparkleRadius = particleBaseRadius + 2 + Math.sin(now/700 + s)*2;
            const sx = Math.cos(sparkleAngle) * sparkleRadius;
            const sy = Math.sin(sparkleAngle) * sparkleRadius * 0.85;
            ctx.save();
            ctx.globalAlpha = (sparkleTime-0.85)/0.15 * 0.85;
            ctx.beginPath();
            ctx.arc(sx, sy, 7 * (1-(1-(sparkleTime-0.85)/0.15)), 0, 2*Math.PI);
            ctx.fillStyle = "rgba(255,255,220,0.74)";
            ctx.shadowColor = "#fffbe6";
            ctx.shadowBlur = 22;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();
        }
    }

    // --- END: Enhanced Particle Glow Effects for Importance ---

    // Draw animated clue sprite if loaded, else fallback to old vector art
    const allLoaded = clueAnimLoaded.every(v => v);
    let img = null;
    if (allLoaded) {
        img = clueAnimImages[frameIdx];
    } else if (clueAnimLoaded[0]) {
        img = clueAnimImages[0];
    }
    if (img) {
        // Draw at 0,0 centered, scale so width ~48px, height ~48px
        const drawW = 48, drawH = 48;
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    } else {
        // fallback: original vector clue
        // Paper base
        ctx.beginPath();
        ctx.moveTo(-22, -14);
        ctx.lineTo(22, -12);
        ctx.lineTo(20, 14);
        ctx.lineTo(-20, 12);
        ctx.closePath();
        ctx.fillStyle = "#f4f1e2";
        ctx.shadowColor = "#bdb7a1";
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Folded corner
        ctx.beginPath();
        ctx.moveTo(22, -12);
        ctx.lineTo(17, -7);
        ctx.lineTo(20, 14);
        ctx.closePath();
        ctx.fillStyle = "#e2dac3";
        ctx.fill();

        // Smudged writing lines
        ctx.save();
        ctx.strokeStyle = "#7d6e4a";
        ctx.globalAlpha = 0.43;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-14, -4);
        ctx.lineTo(10, -2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-12, 2);
        ctx.lineTo(12, 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-7, 9);
        ctx.lineTo(8, 11);
        ctx.stroke();
        ctx.restore();

        // "???" clue text (very faint)
        ctx.save();
        ctx.font = "italic 900 13px serif";
        ctx.fillStyle = "rgba(120, 100, 60, 0.18)";
        ctx.fillText("...", -7, 2);
        ctx.restore();
    }

    ctx.restore();
}

// --- BEGIN: LEVEL_2 Story Clue Renders ---

function renderStoryClue1(ctx, x, y, pulse=1) {
    // Torn Photograph
    // --- BEGIN MOD: Move slightly left and slightly up ---
    x = x - 18; // was -14
    y = y - 13; // was -10
    // --- END MOD ---
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.55 * 1.5 * pulse, 0.55 * 1.5 * pulse); // 50% larger
    // Glow
    ctx.save();
    ctx.globalAlpha = 0.22 + 0.09 * Math.sin(performance.now()/600);
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(230,230,255,0.22)";
    ctx.shadowColor = "#b8cfff";
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
    // Photograph base
    ctx.save();
    ctx.rotate(-0.12);
    ctx.beginPath();
    ctx.moveTo(-32, -22);
    ctx.lineTo(32, -18);
    ctx.lineTo(28, 24);
    ctx.lineTo(-28, 20);
    ctx.closePath();
    ctx.fillStyle = "#f6f6f6";
    ctx.shadowColor = "#bdb7a1";
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Torn edge
    ctx.beginPath();
    ctx.moveTo(-32, -22);
    ctx.lineTo(-28, 20);
    ctx.lineTo(-18, 18);
    ctx.lineTo(-22, -18);
    ctx.closePath();
    ctx.fillStyle = "#e0e0e0";
    ctx.fill();
    // Faded image: cat outline with monocle
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.ellipse(0, 2, 16, 18, 0, 0, 2 * Math.PI);
    ctx.fillStyle = "#b8b8c0";
    ctx.fill();
    // Monocle
    ctx.beginPath();
    ctx.arc(7, -4, 5, 0, 2 * Math.PI);
    ctx.strokeStyle = "#b8b8c0";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.restore();
}

function renderStoryClue2(ctx, x, y, pulse=1) {
    // Scrap of Fabric
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.53 * 1.5 * pulse, 0.53 * 1.5 * pulse); // 50% larger
    // Glow
    ctx.save();
    ctx.globalAlpha = 0.20 + 0.09 * Math.sin(performance.now()/700);
    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(180,120,255,0.21)";
    ctx.shadowColor = "#a080ff";
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
    // Fabric base
    ctx.save();
    ctx.rotate(0.16);
    ctx.beginPath();
    ctx.moveTo(-24, -12);
    ctx.bezierCurveTo(-18, -18, 18, -18, 24, -12);
    ctx.lineTo(22, 18);
    ctx.bezierCurveTo(10, 22, -10, 22, -22, 18);
    ctx.closePath();
    ctx.fillStyle = "#a68cff";
    ctx.shadowColor = "#7d5fd6";
    ctx.shadowBlur = 3;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Golden thread
    ctx.beginPath();
    ctx.moveTo(-20, 12);
    ctx.bezierCurveTo(-10, 16, 10, 16, 20, 12);
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.restore();
    ctx.restore();
}

function renderStoryClue3(ctx, x, y, pulse=1) {
    // Old Key
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.54 * 1.5 * pulse, 0.54 * 1.5 * pulse); // 50% larger
    // Glow
    ctx.save();
    ctx.globalAlpha = 0.21 + 0.09 * Math.sin(performance.now()/800);
    ctx.beginPath();
    ctx.arc(0, 0, 46, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255,230,120,0.19)";
    ctx.shadowColor = "#ffe57c";
    ctx.shadowBlur = 13;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
    // Key bow (question mark)
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, -10, 13, Math.PI * 0.15, Math.PI * 1.8, false);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#e0b94a";
    ctx.shadowColor = "#ffe57c";
    ctx.shadowBlur = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
    // Key shaft
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.lineTo(0, 22);
    ctx.lineWidth = 7;
    ctx.strokeStyle = "#e0b94a";
    ctx.stroke();
    // Key teeth
    ctx.beginPath();
    ctx.moveTo(0, 22);
    ctx.lineTo(-7, 26);
    ctx.moveTo(0, 22);
    ctx.lineTo(7, 26);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#e0b94a";
    ctx.stroke();
    ctx.restore();
    ctx.restore();
}

// --- END: LEVEL_2 Story Clue Renders ---

window.renderHintCoin = renderHintCoin;
window.renderFallenClue = renderFallenClue;
window.renderStoryClue1 = renderStoryClue1;
window.renderStoryClue2 = renderStoryClue2;
window.renderStoryClue3 = renderStoryClue3;