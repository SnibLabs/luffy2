// HUD: picarats, hint coins, inventory, etc

function updateHUD(state) {
    let hud = document.getElementById('hud-bar');
    if (!hud) {
        hud = document.createElement('div');
        hud.id = 'hud-bar';
        document.getElementById('game-container').appendChild(hud);
    }
    hud.innerHTML = `
        <span class="hud-icon" title="Picarats">
            <svg width="26" height="26"><circle cx="13" cy="13" r="12" fill="#ffe264" stroke="#e0aa0a" stroke-width="2"/><text x="13" y="18" text-anchor="middle" font-size="16" fill="#b98d00" font-family="Arial" font-weight="bold">P</text></svg>
        </span>
        <span style="margin-right:0.95em;font-weight:bold;color:var(--picarat);">${state.picarats}</span>
        <span class="hud-icon" title="Hint Coins">
            <svg width="24" height="24"><circle cx="12" cy="12" r="9" fill="#b7e7fc" stroke="#1ab6e9" stroke-width="2"/><text x="12" y="17" text-anchor="middle" font-size="13" fill="#1986c7" font-family="Arial" font-weight="bold">?</text></svg>
        </span>
        <span style="margin-right:1.8em;font-weight:bold;color:var(--hint);">${state.hintCoins}</span>
        <button class="ui-btn" id="hud-inv-btn" style="font-size:0.94em;padding:0.3em 1em;margin-left:0.5em;">Inventory</button>
    `;
    document.getElementById('hud-inv-btn').onclick = () => {
        state.showInventory = !state.showInventory;
        updateInventoryPanel(state);
    };
    updateInventoryPanel(state);
}

function updateInventoryPanel(state) {
    let inv = document.getElementById('inventory-panel');
    if (!inv) {
        inv = document.createElement('div');
        inv.id = 'inventory-panel';
        document.getElementById('game-container').appendChild(inv);
    }
    inv.className = state.showInventory ? 'active' : '';
    if (state.showInventory) {
        inv.innerHTML = `<div class="inventory-title">Inventory</div>
        <div class="inventory-items">` +
        (state.inventory.length === 0 ? '<div class="inventory-item">Empty</div>' :
            state.inventory.map(item => `<div class="inventory-item">${item}</div>`).join('')) +
        `</div>`;
    } else {
        inv.innerHTML = '';
    }
}
window.updateHUD = updateHUD;
window.updateInventoryPanel = updateInventoryPanel;