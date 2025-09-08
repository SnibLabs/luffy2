// Orchestrates overall game logic

class GameManager {
    constructor(game) {
        this.game = game;
        this.dialogueActive = false;
        this.puzzleActive = false;
    }

    handleHotspotInteract(hotspot) {
        if (hotspot.type === "area" && hotspot.dest) {
            // --- BEGIN MOD: Pass info for door entry for LEVEL_2 repositioning ---
            // If entering LEVEL_2 via door, pass an option to indicate this
            if (
                hotspot.id === "door1-l1"
                && hotspot.dest === "LEVEL_2"
            ) {
                this.game.sceneManager.enterScene(hotspot.dest, { enteredViaDoor: true });
            } else {
                this.game.sceneManager.enterScene(hotspot.dest);
            }
            systemMessage(`Entering ${window.MapData[hotspot.dest].name}`);
            return;
        }
        if (hotspot.type === "npc" && window.Characters[hotspot.npc]) {
            this.triggerNPCDialogue(hotspot.npc);
            return;
        }
        if (hotspot.type === "item" && hotspot.item === "hint-coin") {
            if (!this.game.state.inventory.includes(hotspot.id)) {
                this.game.state.addHintCoin();
                this.game.state.addToInventory(hotspot.id);
                updateHUD(this.game.state);
                systemMessage("Hint Coin found!");
            }
            return;
        }
        // --- BEGIN: Fallen Clue Interaction ---
        if (hotspot.type === "item" && hotspot.item === "fallen-clue") {
            if (!this.game.state.inventory.includes(hotspot.id)) {
                this.game.state.addToInventory(hotspot.id);
                updateHUD(this.game.state);
                showDialogueBox(
                    "You",
                    "You pick up a crumpled note from the ground. The ink is smudged, but you can make out a few words:<br><br><em>\"...door only opens for those who know the answer... Whiskers knows...\"</em>",
                    () => {
                        hideDialogueBox();
                        systemMessage("Clue added to Inventory!");
                    }
                );
            } else {
                showDialogueBox(
                    "You",
                    "You've already picked up the fallen note. It reads:<br><br><em>\"...door only opens for those who know the answer... Whiskers knows...\"</em>",
                    () => {
                        hideDialogueBox();
                    }
                );
            }
            return;
        }
        // --- END: Fallen Clue Interaction ---
        // --- BEGIN: LEVEL_2 Story Clue Interactions ---
        if (hotspot.type === "item" && hotspot.item === "story-clue1") {
            if (!this.game.state.inventory.includes(hotspot.id)) {
                this.game.state.addToInventory(hotspot.id);
                updateHUD(this.game.state);
                showDialogueBox(
                    "You",
                    "You find a torn photograph. The image is faded, but you can just make out the outline of a cat wearing a monocle.",
                    () => {
                        hideDialogueBox();
                        systemMessage("Photograph added to Inventory!");
                    }
                );
            } else {
                showDialogueBox(
                    "You",
                    "It's the torn photograph you found earlier. The cat with a monocle seems important.",
                    () => {
                        hideDialogueBox();
                    }
                );
            }
            return;
        }
        if (hotspot.type === "item" && hotspot.item === "story-clue2") {
            if (!this.game.state.inventory.includes(hotspot.id)) {
                this.game.state.addToInventory(hotspot.id);
                updateHUD(this.game.state);
                showDialogueBox(
                    "You",
                    "You pick up a scrap of fabric. It's silky and purple, with a golden thread running along the edge.",
                    () => {
                        hideDialogueBox();
                        systemMessage("Fabric Scrap added to Inventory!");
                    }
                );
            } else {
                showDialogueBox(
                    "You",
                    "The purple fabric scrap is soft to the touch. That golden thread must mean something.",
                    () => {
                        hideDialogueBox();
                    }
                );
            }
            return;
        }
        if (hotspot.type === "item" && hotspot.item === "story-clue3") {
            if (!this.game.state.inventory.includes(hotspot.id)) {
                this.game.state.addToInventory(hotspot.id);
                updateHUD(this.game.state);
                showDialogueBox(
                    "You",
                    "You discover an old, ornate key. Its bow is shaped like a question mark.",
                    () => {
                        hideDialogueBox();
                        systemMessage("Old Key added to Inventory!");
                    }
                );
            } else {
                showDialogueBox(
                    "You",
                    "You already have the old key. Its question mark shape feels like a riddle itself.",
                    () => {
                        hideDialogueBox();
                    }
                );
            }
            return;
        }
        // --- END: LEVEL_2 Story Clue Interactions ---
    }

    triggerNPCDialogue(npcKey) {
        const state = this.game.state;
        const npc = window.Characters[npcKey];
        if (!npc) return;
        let idx = 0;
        // If puzzle attached and unsolved, show puzzle after dialogue
        const puzzle = window.Puzzles.find(pz => pz.npc === npcKey && !state.isPuzzleSolved(pz.id));
        function nextDialogue() {
            if (idx < npc.dialogue.length) {
                const dlg = npc.dialogue[idx];
                showDialogueBox(npc.name, dlg.text, () => {
                    idx++;
                    if (dlg.nextPuzzle && puzzle && !state.isPuzzleSolved(puzzle.id)) {
                        hideDialogueBox();
                        setTimeout(() => {
                            this.triggerPuzzle(puzzle, npcKey);
                        }, 120);
                    } else if (dlg.shop) {
                        hideDialogueBox();
                        setTimeout(() => {
                            this.openShop();
                        }, 120);
                    } else {
                        nextDialogue.call(this);
                    }
                });
            }
        }
        nextDialogue.call(this);
    }

    triggerPuzzle(puzzle, npcKey) {
        this.puzzleActive = true;
        const state = this.game.state;
        showPuzzleModal(puzzle, state, (solved, hintsUsed, cancelled) => {
            this.puzzleActive = false;
            if (solved) {
                const baseReward = puzzle.reward;
                const reward = Math.max(5, baseReward - hintsUsed * 7);
                state.addPicarats(reward);
                state.markPuzzleSolved(puzzle.id);
                updateHUD(state);
                systemMessage(`+${reward} Picarats!`);
                if (puzzle.mandatory) {
                    // Progress story
                    state.storyProgress++;
                    // All mandatory puzzles solved?
                    const remain = window.Puzzles.filter(p => p.mandatory && !state.isPuzzleSolved(p.id)).length;
                    if (remain === 0) {
                        setTimeout(() => {
                            this.triggerEndScene();
                        }, 1200);
                    }
                }
            }
            hidePuzzleModal();
        });
    }

    openShop() {
        // Shop: buy hint coins for 15 picarats
        const state = this.game.state;
        const overlay = document.getElementById('ui-overlay');
        overlay.innerHTML += `
            <div class="ui-panel" id="shop-panel" style="position:absolute;left:50%;top:52%;transform:translate(-50%,-50%);z-index:150;text-align:center;">
                <div style="font-size:1.12em;color:var(--accent);font-weight:bold;margin-bottom:0.8em;">Shop</div>
                <div>Buy a hint coin for <span style="color:var(--picarat);font-weight:bold;">15 Picarats</span>?</div>
                <button class="ui-btn" id="shop-buy-btn" style="margin:1.1em 0 0.3em 0;">Buy</button>
                <button class="ui-btn" id="shop-cancel-btn" style="margin:1.1em 0 0.3em 0;">Cancel</button>
            </div>
        `;
        overlay.style.pointerEvents = 'auto';
        document.getElementById('shop-buy-btn').onclick = () => {
            if (state.picarats >= 15) {
                state.picarats -= 15;
                state.addHintCoin();
                updateHUD(state);
                systemMessage("You bought a Hint Coin!");
            } else {
                systemMessage("Not enough Picarats!");
            }
            closeShop();
        };
        document.getElementById('shop-cancel-btn').onclick = closeShop;
        function closeShop() {
            const panel = document.getElementById('shop-panel');
            if (panel) panel.remove();
            overlay.style.pointerEvents = 'none';
        }
    }

    triggerEndScene() {
        showEndMenu(this.game.state.picarats, () => {
            location.reload();
        });
    }
}
window.GameManager = GameManager;