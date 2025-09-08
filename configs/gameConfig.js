// Maps, puzzles, dialogue, and collectibles configuration

// --- LEVEL MAPS ---
// Each level has its own map, characters, and puzzles.
// We'll use LEVEL_1 to LEVEL_10 as scene keys.

// Only include LEVEL_1 for now
const LevelMaps = [
    {
        key: "LEVEL_1",
        name: "Village Square",
        bg: "village_square",
        playerStart: { x: 210, y: 370 },
        hotspots: [
            {
                id: "npc1-l1",
                x: 330, y: 410, r: 40, // Moved left and down from the door
                label: "Sir Oinksalot",
                type: "npc",
                npc: "villager1_l1"
            },
            {
                id: "npc2-l1",
                x: 610, y: 440, r: 40,
                label: "Mrs. Moo",
                type: "npc",
                npc: "villager2_l1"
            },
            {
                id: "hint-coin-1-l1",
                x: 370, y: 540, r: 23,
                label: "Hint Coin",
                type: "item",
                item: "hint-coin"
            },
            // --- BEGIN: Fallen Clue Hotspot ---
            {
                id: "fallen-clue-1-l1",
                // Move to same horizontal height as top of interactive door,
                // then move about 10% away from the right edge of the screen
                // Door hotspot: x: 428, y: 356, r: 64 (top of door = y - r = 356 - 64 = 292)
                // 10% from right edge: x = GAME_WIDTH - 0.10 * GAME_WIDTH = 900 - 90 = 810
                // MODIFIED: Move clue down a little and to the right ever so slightly
                // MODIFIED: Move clue down by about 15% of screen height (600 * 0.15 = 90)
                x: 820, y: 302 + 90, r: 28,
                label: "Fallen Note",
                type: "item",
                item: "fallen-clue"
            },
            // --- END: Fallen Clue Hotspot ---
            // --- BEGIN: Door Hotspot ---
            {
                id: "door1-l1",
                x: 428, y: 356, r: 64, // MODIFIED: moved right (410->428), down (340->356), 1/3 bigger (48*4/3=64)
                label: "Mysterious Door",
                type: "area",
                dest: "LEVEL_2"
            }
            // --- END: Door Hotspot ---
            // Removed area hotspot to LEVEL_2
        ]
    },
    // --- BEGIN: LEVEL_2 Map ---
    {
        key: "LEVEL_2",
        name: "Foyer",
        bg: "foyer",
        playerStart: { x: 450, y: 420 },
        hotspots: [
            {
                id: "door1-l2",
                x: 428, y: 356, r: 64, // MODIFIED: moved right (410->428), down (340->356), 1/3 bigger (48*4/3=64)
                label: "Back to Village Square",
                type: "area",
                dest: "LEVEL_1"
            },
            // --- BEGIN: 3 clues for story in LEVEL_2, MOVED TO MARKED GRID LOCATIONS ---
            // Grid is 20 rows x 30 cols, 30px per cell. 1's in grid at:
            // (5,12)-(5,18), (6,11)-(6,18), (10,6)-(10,7), (11,6)-(11,8), (11,26)-(11,28), (12,26)-(12,28)
            // We'll pick three distinct clusters for the three clues.
            // 1. (5,15): x=15*30+15=465, y=5*30+15=165
            // 2. (11,7): x=7*30+15=225, y=11*30+15=345
            // 3. (12,27): x=27*30+15=825, y=12*30+15=375
            {
                id: "clue1-l2",
                x: 465, y: 165, r: 28,
                label: "Torn Photograph",
                type: "item",
                item: "story-clue1"
            },
            {
                id: "clue2-l2",
                x: 225, y: 345, r: 28,
                label: "Scrap of Fabric",
                type: "item",
                item: "story-clue2"
            },
            {
                id: "clue3-l2",
                x: 825, y: 375, r: 28,
                label: "Old Key",
                type: "item",
                item: "story-clue3"
            }
            // --- END: 3 clues for story in LEVEL_2, MOVED TO MARKED GRID LOCATIONS ---
        ]
    }
    // --- END: LEVEL_2 Map ---
];

// MapData mapping
const MapData = {};
for (const map of LevelMaps) {
    MapData[map.key] = map;
}

// --- PUZZLES ---
// Only include puzzles for Level 1

const Puzzles = [
    // Level 1
    {
        id: "logic_1_l1",
        title: "The Cat's Riddle",
        type: window.PuzzleType.LOGIC,
        npc: "villager1_l1",
        question: "I am always hungry and will die if not fed, but whatever I touch will soon turn red. What am I?",
        answer: "fire",
        hints: [
            "It's not an animal.",
            "It needs fuel to live.",
            "It's dangerous, and red is its color!"
        ],
        reward: 20,
        mandatory: true
    },
    {
        id: "visual_1_l1",
        title: "Mrs. Moo's Pattern",
        type: window.PuzzleType.VISUAL,
        npc: "villager2_l1",
        question: "Which of these shapes does NOT belong?",
        options: ["▲", "■", "●", "◆"],
        correctIndex: 2,
        hints: [
            "Look at the edges.",
            "It's the only round one.",
            "It's the circle!"
        ],
        reward: 18,
        mandatory: false
    }
];

// --- SCENE TYPE ENUM EXTENSION ---
window.SceneType.LEVEL_1 = "LEVEL_1";
window.SceneType.LEVEL_2 = "LEVEL_2";
// Remove other LEVEL_2+ enums for now

// --- EXPORT ---
window.MapData = MapData;
window.Puzzles = Puzzles;