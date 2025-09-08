// Dialogue and puzzle UI

function showDialogueBox(name, text, onNext) {
    let box = document.getElementById('dialogue-box');
    if (!box) {
        box = document.createElement('div');
        box.id = 'dialogue-box';
        document.getElementById('ui-overlay').appendChild(box);
    }
    box.innerHTML = `
        <div id="dialogue-name">${name}</div>
        <div id="dialogue-text">${text}</div>
        <button id="dialogue-next" class="ui-btn">Continue</button>
    `;
    box.classList.remove('hide');
    box.style.display = 'block';
    document.getElementById('dialogue-next').onclick = () => {
        box.classList.add('hide');
        setTimeout(() => {
            box.style.display = 'none';
            if (onNext) onNext();
        }, 180);
    };
}

function hideDialogueBox() {
    let box = document.getElementById('dialogue-box');
    if (box) {
        box.classList.add('hide');
        setTimeout(() => { box.style.display = 'none'; }, 180);
    }
}

function showPuzzleModal(puzzle, state, onResult) {
    let modal = document.getElementById('puzzle-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'puzzle-modal';
        document.getElementById('ui-overlay').appendChild(modal);
    }
    modal.classList.add('active');
    let html = `<div class="puzzle-title">${puzzle.title}</div>
        <div class="puzzle-question">${puzzle.question}</div>`;
    if (puzzle.options) {
        html += `<div>`;
        puzzle.options.forEach((opt, i) => {
            html += `<button class="puzzle-option" data-idx="${i}" style="margin:0 0.8em;">${opt}</button>`;
        });
        html += `</div>`;
    } else {
        html += `<input class="puzzle-input" id="puzzle-input" placeholder="Type your answer..." maxlength="32" autocomplete="off"/>`;
    }
    html += `<div>
        <button class="puzzle-btn" id="puzzle-submit">Submit</button>
        <button class="puzzle-btn hint" id="puzzle-hint" ${state.hintCoins <= 0 ? "disabled" : ""}>Hint</button>
        <button class="puzzle-btn" id="puzzle-cancel">Cancel</button>
    </div>
    <div id="puzzle-result"></div>
    `;
    modal.innerHTML = html;

    let hintsUsed = 0;
    function revealHint() {
        if (hintsUsed < puzzle.hints.length && state.hintCoins > 0) {
            state.hintCoins--;
            hintsUsed++;
            window.updateHUD(state);
            document.getElementById('puzzle-result').textContent = puzzle.hints[hintsUsed-1];
            if (hintsUsed >= puzzle.hints.length || state.hintCoins <= 0) {
                document.getElementById('puzzle-hint').disabled = true;
            }
        }
    }
    if (puzzle.options) {
        modal.querySelectorAll('.puzzle-option').forEach(btn => {
            btn.addEventListener('click', function() {
                modal.querySelectorAll('.puzzle-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });
    }
    document.getElementById('puzzle-submit').onclick = () => {
        let correct = false;
        if (puzzle.options) {
            const sel = modal.querySelector('.puzzle-option.selected');
            if (sel && parseInt(sel.dataset.idx) === puzzle.correctIndex) correct = true;
        } else {
            const val = document.getElementById('puzzle-input').value.trim().toLowerCase();
            if (val === puzzle.answer.toLowerCase()) correct = true;
        }
        if (correct) {
            document.getElementById('puzzle-result').textContent = "Correct! 🎉";
            setTimeout(() => {
                modal.classList.remove('active');
                modal.innerHTML = '';
                onResult(true, hintsUsed);
            }, 850);
        } else {
            document.getElementById('puzzle-result').textContent = "Incorrect. Try again!";
            setTimeout(() => {
                document.getElementById('puzzle-result').textContent = '';
            }, 850);
        }
    };
    document.getElementById('puzzle-hint').onclick = revealHint;
    document.getElementById('puzzle-cancel').onclick = () => {
        modal.classList.remove('active');
        modal.innerHTML = '';
        onResult(false, hintsUsed, true);
    };
}

function hidePuzzleModal() {
    let modal = document.getElementById('puzzle-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.innerHTML = '';
    }
}

window.showDialogueBox = showDialogueBox;
window.hideDialogueBox = hideDialogueBox;
window.showPuzzleModal = showPuzzleModal;
window.hidePuzzleModal = hidePuzzleModal;