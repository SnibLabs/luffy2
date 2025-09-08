// Title and end menus

function showTitleMenu(startCallback) {
    const overlay = document.getElementById('ui-overlay');
    overlay.innerHTML = `
        <div class="ui-panel" style="position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);z-index:101;">
            <div style="font-size:2.2em;font-weight:bold;color:var(--accent);margin-bottom:0.3em;text-align:center;">Wirehair Point</div>
            <div style="font-size:1.14em;margin-bottom:1.1em;text-align:center;color:#fff;">A Puzzle Adventure</div>
            <button class="ui-btn" id="start-btn" style="width:180px;">Start Game</button>
        </div>
    `;
    overlay.style.pointerEvents = 'auto';
    document.getElementById('start-btn').onclick = () => {
        overlay.innerHTML = '';
        overlay.style.pointerEvents = 'none';
        startCallback();
    };
}

function showEndMenu(picarats, restartCallback) {
    const overlay = document.getElementById('ui-overlay');
    overlay.innerHTML = `
        <div class="ui-panel" style="position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);z-index:101;">
            <div style="font-size:2.1em;font-weight:bold;color:var(--accent);margin-bottom:0.3em;text-align:center;">The End!</div>
            <div style="font-size:1.13em;margin-bottom:1.1em;text-align:center;color:#fff;">
                Congratulations on solving the mystery of Wirehair Point.<br>
                Your total Picarats: <span style="color:var(--picarat);font-weight:bold;">${picarats}</span>
            </div>
            <button class="ui-btn" id="restart-btn" style="width:180px;">Play Again</button>
        </div>
    `;
    overlay.style.pointerEvents = 'auto';
    document.getElementById('restart-btn').onclick = () => {
        overlay.innerHTML = '';
        overlay.style.pointerEvents = 'none';
        restartCallback();
    };
}
window.showTitleMenu = showTitleMenu;
window.showEndMenu = showEndMenu;