// Utility functions

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function randomInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

// Fade in/out system message
function systemMessage(msg, time=1300) {
    const sys = document.getElementById('system-messages');
    if (!sys) return;
    const el = document.createElement('div');
    el.className = 'system-message';
    el.textContent = msg;
    sys.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 250);
    }, time);
}

window.lerp = lerp;
window.randomInt = randomInt;
window.clamp = clamp;
window.systemMessage = systemMessage;