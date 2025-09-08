// Tracks global game state

class StateManager {
    constructor() {
        this.reset();
    }

    reset() {
        this.picarats = window.INITIAL_PICARATS;
        this.hintCoins = window.INITIAL_HINT_COINS;
        this.inventory = [];
        this.puzzlesSolved = {};
        this.dialoguesSeen = {};
        this.currentScene = window.SceneType.TITLE;
        this.visitedScenes = [window.SceneType.TITLE];
        this.storyProgress = 0;
        this.lastPuzzleId = null;
        this.playerPos = { x: 0, y: 0 }; // set by scene
        this.activePuzzle = null;
        this.showInventory = false;
    }

    addPicarats(amount) {
        this.picarats += amount;
    }

    useHintCoin() {
        if (this.hintCoins > 0) {
            this.hintCoins--;
            return true;
        }
        return false;
    }
    
    addHintCoin() {
        this.hintCoins++;
    }

    addToInventory(item) {
        if (!this.inventory.includes(item)) this.inventory.push(item);
    }

    markPuzzleSolved(puzzleId) {
        this.puzzlesSolved[puzzleId] = true;
    }

    isPuzzleSolved(puzzleId) {
        return !!this.puzzlesSolved[puzzleId];
    }

    setScene(sceneType) {
        this.currentScene = sceneType;
        if (!this.visitedScenes.includes(sceneType)) {
            this.visitedScenes.push(sceneType);
        }
        this.showInventory = false;
    }
}

window.StateManager = StateManager;