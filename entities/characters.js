// NPC character definitions, positions, dialogue/trigger links

const Characters = {
    villager1_l1: {
        name: "Sir Oinksalot",
        pose: "oldman",
        color: "#b8b8b8",
        x: 330, y: 410, // Moved left and down from the door
        dialogue: [
            { text: "Ah, the new face in Wirehair Point! Fancy a riddle?", nextPuzzle: "logic_1_l1" },
            { text: "Come back anytime, young one." }
        ]
    },
    villager2_l1: {
        name: "Mrs. Moo",
        pose: "ms_paws",
        color: "#e7a4c7",
        x: 610, y: 440,
        dialogue: [
            { text: "I love patterns! Want to try spotting one?" , nextPuzzle: "visual_1_l1" },
            { text: "Patterns are everywhere if you look close enough!" }
        ]
    }
    // Removed other NPCs for other levels
};

// --- Ms Moo Idle Animation Sprite Loader ---
const msMooIdleFrames = [
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/ms%20moo_frame_1.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/ms_moo_frame_1.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/ms_moo_frame_2.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/ms_moo_frame_3.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/ms_moo_frame_4.png"
];
const msMooIdleImages = [];
const msMooIdleLoaded = [];
for (let i = 0; i < msMooIdleFrames.length; ++i) {
    const img = new window.Image();
    img.src = msMooIdleFrames[i];
    msMooIdleImages.push(img);
    msMooIdleLoaded.push(false);
    img.onload = () => { msMooIdleLoaded[i] = true; };
}

// --- Swine Idle Animation Sprite Loader (Old Man Whiskers, left character) ---
const swineIdleFrames = [
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Swine_frame_1.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Swine_frame_2.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Swine_frame_3.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Swine_frame_4.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Swine_frame_5.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/6f1edf47-be71-4c38-9203-26202e227b0a/library/frames/Swine_frame_6.png"
];
const swineIdleImages = [];
const swineIdleLoaded = [];
for (let i = 0; i < swineIdleFrames.length; ++i) {
    const img = new window.Image();
    img.src = swineIdleFrames[i];
    swineIdleImages.push(img);
    swineIdleLoaded.push(false);
    img.onload = () => { swineIdleLoaded[i] = true; };
}

// --- Ms Moo Animation Timer State ---
let msMooAnimTime = 0;
let msMooLastFrame = 0;

// --- Swine Animation Timer State ---
let swineAnimTime = 0;
let swineLastFrame = 0;

// --- Helper: Detect if this NPC is Ms Moo (pink character on the right) ---
function isMsMoo(npcKey) {
    return npcKey === "villager2_l1";
}

// --- Helper: Detect if this NPC is Old Man Whiskers (left character) ---
function isSwine(npcKey) {
    // Old Man Whiskers is villager1_l1 at (330, 410)
    return npcKey === "villager1_l1";
}

function renderNPC(ctx, npc, x, y) {
    if (isMsMoo(npc)) {
        // --- Render Ms Moo's idle animation ---
        const now = performance.now();
        if (!window._msMooAnimStart) window._msMooAnimStart = now;
        const elapsed = now - window._msMooAnimStart;
        // --- MODIFIED: Animation speed to 1fps (1000ms per frame) ---
        const frameDuration = 1000;
        const frameIdx = Math.floor(elapsed / frameDuration) % msMooIdleImages.length;

        // Only draw if all frames loaded, else fallback to static first frame or fallback drawing
        const allLoaded = msMooIdleLoaded.every(v => v);
        ctx.save();
        ctx.translate(x, y);
        // Ms Moo should be scaled to match original oval size (ellipse 26x34)
        // Assume sprite is 64x64, scale so height ~68px (ellipse height*2)
        // --- MODIFIED: Make Ms Moo 1/3 bigger (scale by 4/3) ---
        const drawW = 64, drawH = 64;
        const baseScale = 68 / drawH; // 34*2=68
        const scale = baseScale * (4 / 3); // 1/3 bigger
        ctx.scale(scale, scale);
        // Center the sprite
        let img;
        if (allLoaded) {
            img = msMooIdleImages[frameIdx];
        } else if (msMooIdleLoaded[0]) {
            img = msMooIdleImages[0];
        }
        if (img) {
            ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        } else {
            // fallback: pink ellipse
            ctx.beginPath();
            ctx.ellipse(0, 0, 26 * (4 / 3), 34 * (4 / 3), 0, 0, 2 * Math.PI);
            ctx.fillStyle = "#e7a4c7";
            ctx.shadowColor = "#222";
            ctx.shadowBlur = 5;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        ctx.restore();
        return;
    }

    if (isSwine(npc)) {
        // --- Render Swine's (Old Man Whiskers) idle animation ---
        const now = performance.now();
        if (!window._swineAnimStart) window._swineAnimStart = now;
        const elapsed = now - window._swineAnimStart;
        // --- MODIFIED: Animation speed to 1fps (1000ms per frame) ---
        const frameDuration = 1000;
        const frameIdx = Math.floor(elapsed / frameDuration) % swineIdleImages.length;

        // Only draw if all frames loaded, else fallback to static first frame or fallback drawing
        const allLoaded = swineIdleLoaded.every(v => v);
        ctx.save();
        ctx.translate(x, y);
        // Swine: scale to match original oval size (ellipse 26x34)
        // Assume sprite is 64x64, scale so height ~68px (ellipse height*2)
        const drawW = 64, drawH = 64;
        const baseScale = 68 / drawH; // 34*2=68
        ctx.scale(baseScale, baseScale);
        // Center the sprite
        let img;
        if (allLoaded) {
            img = swineIdleImages[frameIdx];
        } else if (swineIdleLoaded[0]) {
            img = swineIdleImages[0];
        }
        if (img) {
            ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        } else {
            // fallback: gray ellipse
            ctx.beginPath();
            ctx.ellipse(0, 0, 26, 34, 0, 0, 2 * Math.PI);
            ctx.fillStyle = "#b8b8b8";
            ctx.shadowColor = "#222";
            ctx.shadowBlur = 5;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        ctx.restore();
        return;
    }

    // --- Default NPC rendering (cat people) ---
    ctx.save();
    ctx.translate(x, y);
    // Cat people: oval bodies, colored, with face
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 34, 0, 0, 2 * Math.PI);
    const grad = ctx.createLinearGradient(0, -34, 0, 34);
    grad.addColorStop(0, "#fff");
    grad.addColorStop(1, Characters[npc].color || "#eee");
    ctx.fillStyle = grad;
    ctx.shadowColor = "#222";
    ctx.shadowBlur = 5;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Ears
    ctx.beginPath();
    ctx.moveTo(-13, -32);
    ctx.lineTo(-5, -54);
    ctx.lineTo(2, -32);
    ctx.closePath();
    ctx.fillStyle = Characters[npc].color || "#eee";
    ctx.fill();
    // Face: eyes
    ctx.beginPath();
    ctx.arc(-6, -12, 2.8, 0, 2 * Math.PI);
    ctx.arc(6, -12, 2.8, 0, 2 * Math.PI);
    ctx.fillStyle = "#111";
    ctx.fill();
    // Nose
    ctx.beginPath();
    ctx.arc(0, -5, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#d27700";
    ctx.fill();
    ctx.restore();
}
window.Characters = Characters;
window.renderNPC = renderNPC;