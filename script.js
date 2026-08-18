// --- COZY WORKSPACE ENGINE STATE SETUP ---
let appState = {
    plantStage: 1,
    plantTypeIndex: 0,
    checkedTodoCount: 0,
    choreMinutes: 0,
    choreGoal: 15,
    timerSeconds: 1500,
    timerRunning: false,
    timerInterval: null,
    timerPreset: 'focus',
    audioPlaying: false,
    audioContext: null,
    oscillatorNodes: []
};

const plantNames = [
    "Thick Sprout", "Pixie Fern", "Cosmic Clover", "Ruby Succulent", "Bonsai Buddy",
    "Lunar Moss", "Golden Pothos", "Dream Cactus", "Star Flower", "Aero Ivy",
    "Amber Blossom", "Neon Shroom", "Zen Bamboo", "Aqua Lily", "Omega Bloom"
];

const sandboxAnimals = ["🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐣", "🐙", "🦄", "🐝"];

const fontMappers = {
    style2: {
        'A':'𝒜','B':'ℬ','C':'𝒞','D':'𝒟','E':'ℰ','F':'ℱ','G':'𝒢','H':'ℋ','I':'ℐ','J':'𝒥','K':'𝒦','L':'ℒ','M':'ℳ','N':'𝒩','O':'𝒪','P':'𝒫','Q':'𝒬','R':'ℛ','S':'𝒮','T':'𝒯','U':'𝒰','V':'𝒱','W':'𝒲','X':'𝒳','Y':'𝒴','Z':'𝒵',
        'a':'𝒶','b':'𝒷','c':'𝒸','d':'𝒹','e':'ℯ','f':'𝒻','g':'ℊ','h':'𝒽','i':'𝒾','j':'𝒿','k':'𝓀','l':'𝓁','m':'𝓂','n':'𝓃','o':'ℴ','p':'𝓅','q':'𝓆','r':'𝓇','s':'𝓈','t':'𝓉','u':'𝓊','v':'𝓋','w':'𝓌','x':'𝓍','y':'𝓎','z':'𝓏'
    },
    style3: {
        'A':'𝔄','B':'𝔅','C':'ℭ','D':'𝔇','E':'𝔈','F':'𝔉','G':'𝔊','H':'𝔏','I':'ℑ','J':'𝔍','K':'𝔎','L':'𝔏','M':'𝔐','N':'𝔓','O':'𝔒','P':'𝔓','Q':'𝔔','R':'ℜ','S':'𝔖','T':'𝔗','U':'𝔘','V':'𝔙','W':'𝔚','X':'𝔛','Y':'𝔜','Z':'  ',
        'a':'𝔞','b':'𝔟','c':'𝔠','d':'𝔡','e':'𝔢','f':'𝔣','g':'𝔤','h':'𝔥','i':'𝔦','j':'𝔧','k':'𝔨','l':'𝔩','m':'𝔪','n':'𝔫','o':'𝔬','p':'𝔭','q':'𝔮','r':'𝔯','s':'𝔰','t':'𝔱','u':'𝔲','v':'𝔳','w':'𝔴','x':'𝔵','y':'𝔶','z':'𝔷'
    }
};

// Initial Dashboard Boots Loop
window.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setupClockLoop();
    renderPlantGraphic();
    updateChecklistDisplay();
    setupSandboxEngine();
    updateChoreUI();
    updateTimerUI();
    updateFontPreviews();
    logActivity("✨ System Boot Completed! Your sweet workspace dashboard is active.");
});

function logActivity(text) {
    const logBox = document.getElementById('history-log-box');
    if (!logBox) return;
    const emptyMsg = logBox.querySelector('.history-empty');
    if (emptyMsg) emptyMsg.remove();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logItem = document.createElement('div');
    logItem.className = 'history-item';
    logItem.innerHTML = `<strong>[${timestamp}]</strong> ${text}`;
    
    logBox.appendChild(logItem);
    logBox.scrollTop = logBox.scrollHeight; // Core scrolling fix
    saveToLocalStorage();
}

// --- LOCAL STORAGE CORE ---
function saveToLocalStorage() {
    const data = {
        plantStage: appState.plantStage,
        plantTypeIndex: appState.plantTypeIndex,
        checkedTodoCount: appState.checkedTodoCount,
        choreMinutes: appState.choreMinutes,
        choreGoal: appState.choreGoal
    };
    localStorage.setItem('sproutOS_kawaiiSave', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('sproutOS_kawaiiSave');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            appState.plantStage = parsed.plantStage || 1;
            appState.plantTypeIndex = parsed.plantTypeIndex || 0;
            appState.checkedTodoCount = parsed.checkedTodoCount || 0;
            appState.choreMinutes = parsed.choreMinutes || 0;
            appState.choreGoal = parsed.choreGoal || 15;
        } catch(e) { console.error("Reloading parameters aborted", e); }
    }
}

function resetWorkspaceStorage() {
    localStorage.removeItem('sproutOS_kawaiiSave');
    appState.plantStage = 1;
    appState.checkedTodoCount = 0;
    appState.choreMinutes = 0;
    
    document.getElementById('history-log-box').innerHTML = '<div class="history-empty">No milestones logged for this session yet. <br>System Ready.</div>';
    
    renderPlantGraphic();
    updateChecklistDisplay();
    updateChoreUI();
    document.querySelectorAll('.sandbox-animal').forEach(a => a.remove());
    logActivity("🧹 Dashboard storage cleared out cleanly!");
}

function setupClockLoop() {
    const clockEl = document.getElementById('live-clock');
    const tick = () => {
        clockEl.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    tick();
    setInterval(tick, 1000);
}

// --- PROCEDURAL 32x32 CRISP PIXEL-ART SPROUT ENGINE RECONSTRUCTION ---
function renderPlantGraphic() {
    const svg = document.getElementById('plant-svg');
    const stageBadge = document.getElementById('level-badge');
    const selector = document.getElementById('plant-select');
    if (!svg) return;
    
    selector.value = appState.plantTypeIndex;
    stageBadge.innerText = `${appState.plantStage} / 15`;
    svg.innerHTML = '';
    
    // Cozy Pixel Pot (Hand Drawn SVG Matrix Grid Blocks)
    let potHTML = `
        <rect x="10" y="24" width="12" height="1" fill="#c2917c" />
        <rect x="9" y="25" width="14" height="5" fill="#d4a38f" />
        <rect x="10" y="30" width="12" height="1" fill="#a4735f" />
        <rect x="11" y="26" width="10" height="4" fill="#603813" opacity="0.3" /> <!-- Soil Depth -->
    `;
    
    let plantHTML = '';
    let stage = appState.plantStage;
    
    // Procedural Stalk growth logic calculations
    if (stage >= 1) plantHTML += `<rect x="15" y="22" width="2" height="2" fill="#4ade80" />`;
    if (stage >= 2) plantHTML += `<rect x="15" y="20" width="2" height="2" fill="#4ade80" />`;
    if (stage >= 3) plantHTML += `<rect x="14" y="21" width="1" height="1" fill="#22c55e" /><rect x="17" y="21" width="1" height="1" fill="#22c55e" />`; // Leaves 1
    
    if (stage >= 4) plantHTML += `<rect x="15" y="17" width="2" height="3" fill="#22c55e" />`;
    if (stage >= 6) { // Left branches
        plantHTML += `
            <rect x="12" y="16" width="3" height="1" fill="#4ade80" />
            <rect x="11" y="14" width="2" height="2" fill="#22c55e" />
        `;
    }
    if (stage >= 8) { // Right branches
        plantHTML += `
            <rect x="17" y="15" width="3" height="1" fill="#4ade80" />
            <rect x="19" y="13" width="2" height="2" fill="#16a34a" />
        `;
    }
    
    if (stage >= 10) plantHTML += `<rect x="15" y="13" width="2" height="4" fill="#16a34a" />`;
    
    // Magic Crown Blossom Explosion Level Triggers
    if (stage >= 12) {
        plantHTML += `
            <rect x="14" y="10" width="4" height="3" fill="#f43f5e" />
            <rect x="15" y="11" width="2" height="1" fill="#fef08a" />
            <rect x="13" y="11" width="1" height="1" fill="#fda4af" />
            <rect x="18" y="11" width="1" height="1" fill="#fda4af" />
        `;
    } else if (stage >= 7) { // Small bud configuration
        plantHTML += `<rect x="15" y="11" width="2" height="2" fill="#fda4af" />`;
    }
    
    svg.innerHTML = potHTML + plantHTML;
}

function changePlantType() {
    appState.plantTypeIndex = parseInt(document.getElementById('plant-select').value);
    logActivity(`Target seedling blueprint changed to: <strong>${plantNames[appState.plantTypeIndex]}</strong>`);
    renderPlantGraphic();
}

// --- CONTEXT CHECKLIST MATRIX ---
const presetTasks = ["Configure project index layout files", "Perform code file refactor routines", "Design graphical vector blueprints", "Audit code block structures"];

function updateChecklistDisplay() {
    const container = document.getElementById('task-list-container');
    const counter = document.getElementById('done-counter');
    if (!container) return;
    
    counter.innerText = appState.checkedTodoCount;
    container.innerHTML = '';
    
    presetTasks.forEach((task, idx) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox" onchange="resolveTaskTrigger(${idx}, this)">
                <span>${task}</span>
            </div>
            <button class="task-remove" onclick="deleteTask(${idx})">❌</button>
        `;
        container.appendChild(li);
    });
}
function addTask() {
    const input = document.getElementById('new-task-input');
    const val = input.value.trim();
    if (!val) return;
    presetTasks.push(val);
    input.value = '';
    updateChecklistDisplay();
    logActivity(`Added task notebook entry: "${val}"`);
}

function deleteTask(idx) {
    const removed = presetTasks.splice(idx, 1);
    updateChecklistDisplay();
    logActivity(`Deleted task entry: "${removed}"`);
}

function resolveTaskTrigger(idx, element) {
    if (element.checked) {
        element.disabled = true;
        element.parentElement.parentElement.classList.add('completed');
        appState.checkedTodoCount++;
        
        logActivity(`Completed task! Progress: <strong>${appState.checkedTodoCount} / 9</strong>`);
        
        if (appState.checkedTodoCount >= 9) {
            appState.checkedTodoCount = 0; 
            if (appState.plantStage < 15) {
                appState.plantStage++;
                logActivity("🎉 <strong>GROWTH CEILING ATTAINED!</strong> Plant evolved stage level upwards!");
            }
            spawnAnimalRandomly();
            renderPlantGraphic();
        }
        
        setTimeout(() => {
            presetTasks.splice(idx, 1);
            updateChecklistDisplay();
        }, 600);
    }
}

// --- CALIBRATED SANDBOX PLAYGROUND CORE ENGINE ---
function setupSandboxEngine() {
    const sandbox = document.getElementById('sandbox-container');
    if (!sandbox) return;
    
    sandbox.addEventListener('mousemove', (e) => {
        const rect = sandbox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (Math.random() > 0.8) { 
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            sandbox.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 500);
        }
    });
    
    sandbox.addEventListener('click', (e) => {
        if (e.target.classList.contains('sandbox-animal')) return;
        const rect = sandbox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        instantiateAnimal(x, y);
    });
}

function instantiateAnimal(x, y) {
    const sandbox = document.getElementById('sandbox-container');
    const randomAnimal = sandboxAnimals[Math.floor(Math.random() * sandboxAnimals.length)];
    const node = document.createElement('div');
    node.className = 'sandbox-animal';
    node.innerText = randomAnimal;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    
    bindDragEvents(node, sandbox);
    sandbox.appendChild(node);
    logActivity(`Hatched companion animal <strong>${randomAnimal}</strong> into the sandbox!`);
}

function spawnAnimalRandomly() {
    const sandbox = document.getElementById('sandbox-container');
    if (!sandbox) return;
    const rect = sandbox.getBoundingClientRect();
    instantiateAnimal(Math.random() * (rect.width - 40) + 20, Math.random() * (rect.height - 40) + 20);
}

function bindDragEvents(el, parent) {
    let active = false, startX, startY;
    el.addEventListener('mousedown', (e) => {
        active = true;
        startX = e.clientX - el.offsetLeft;
        startY = e.clientY - el.offsetTop;
        e.stopPropagation();
    });
    window.addEventListener('mousemove', (e) => {
        if (!active) return;
        const rect = parent.getBoundingClientRect();
        let nx = e.clientX - startX;
        let ny = e.clientY - startY;
        if (nx < 15) nx = 15; if (nx > rect.width - 15) nx = rect.width - 15;
        if (ny < 15) ny = 15; if (ny > rect.height - 15) ny = rect.height - 15;
        el.style.left = `${nx}px`; el.style.top = `${ny}px`;
    });
    window.addEventListener('mouseup', () => active = false);
}

// --- HAMSTER WHEEL AND TIMERS ---
function updateChoreUI() {
    document.getElementById('chore-current').innerText = appState.choreMinutes;
    document.getElementById('chore-goal').innerText = appState.choreGoal;
}

function updateChoreGoal() {
    appState.choreGoal = parseInt(document.getElementById('goal-select').value);
    updateChoreUI();
    logActivity(`Chore target adjusted to: <strong>${appState.choreGoal} mins</strong>.`);
}

function logChoreTime() {
    const mins = parseInt(document.getElementById('log-select').value);
    const wheel = document.getElementById('wheel-element');
    const status = document.getElementById('hamster-status');
    
    appState.choreMinutes += mins;
    updateChoreUI();
    
    wheel.classList.add('spinning');
    status.innerText = "RUNNING";
    status.className = "badge badge-active";
    logActivity(`Hamster spinning! Logged <strong>${mins} mins</strong> of chores.`);
    
    setTimeout(() => {
        wheel.classList.remove('spinning');
        status.innerText = "IDLE";
        status.className = "badge badge-idle";
        if (appState.choreMinutes >= appState.choreGoal) {
            logActivity("🏆 <strong>Chore Goal Attained!</strong> Superb productivity focus!");
        }
    }, 1500);
}

function updateTimerUI() {
    const mins = Math.floor(appState.timerSeconds / 60).toString().padStart(2, '0');
    const secs = (appState.timerSeconds % 60).toString().padStart(2, '0');
    document.getElementById('timer-text').innerText = `${mins}:${secs}`;
}

function setTimerPreset(type, buttonElement) {
    appState.timerPreset = type;
    document.querySelectorAll('.timer-presets .btn').forEach(b => b.classList.remove('active'));
    buttonElement.classList.add('active');
    
    if (type === 'focus') appState.timerSeconds = 1500;
    else if (type === 'break') appState.timerSeconds = 300;
    else if (type === 'short') appState.timerSeconds = 600;
    else if (type === 'long') appState.timerSeconds = 1800;
    
    updateTimerUI();
    logActivity(`Timer preset shifted to: <strong>${type}</strong>.`);
}

function toggleTimer() {
    const btn = document.getElementById('start-btn');
    if (appState.timerRunning) {
        clearInterval(appState.timerInterval);
        appState.timerRunning = false;
        btn.innerText = "Start";
        btn.className = "btn btn-primary";
    } else {
        appState.timerRunning = true;
        btn.innerText = "Pause";
        btn.className = "btn btn-danger";
        appState.timerInterval = setInterval(() => {
            if (appState.timerSeconds > 0) {
                appState.timerSeconds--;
                updateTimerUI();
            } else {
                clearInterval(appState.timerInterval);
                appState.timerRunning = false;
                btn.innerText = "Start";
                logActivity("🔔 <strong>Pomodoro focus block completed successfully!</strong>");
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(appState.timerInterval);
    appState.timerRunning = false;
    document.getElementById('start-btn').innerText = "Start";
    document.getElementById('start-btn').className = "btn btn-primary";
    if (appState.timerPreset === 'focus') appState.timerSeconds = 1500;
    else if (appState.timerPreset === 'break') appState.timerSeconds = 300;
    else if (appState.timerPreset === 'short') appState.timerSeconds = 600;
    else if (appState.timerPreset === 'long') appState.timerSeconds = 1800;
    updateTimerUI();
}

// --- AMBIENT SOUND GENERATOR ENGINE (TYPO COMPLETELY FIXED) ---
function handleAudioChange() {
    logActivity(`Soundscape set to: <strong>${document.getElementById('audio-select').value}</strong>`);
    if (appState.audioPlaying) { toggleAudioEngine(); toggleAudioEngine(); }
}

function toggleAudioEngine() {
    const btn = document.getElementById('audio-toggle-btn');
    if (appState.audioPlaying) {
        appState.oscillatorNodes.forEach(o => { try{o.stop();}catch(e){} });
        appState.oscillatorNodes = [];
        appState.audioPlaying = false;
        btn.innerText = "🔊 Play Web-Audio Soundscape";
        btn.style.background = "";
    } else {
        if (!appState.audioContext) appState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        appState.audioPlaying = true;
        btn.innerText = "🔇 Mute Mixer Pipeline";
        btn.style.background = "#ffb3b3";
        generateSynthesizedBeats(document.getElementById('audio-select').value);
    }
}

function generateSynthesizedBeats(mode) {
    if (!appState.audioContext || !appState.audioPlaying) return;
    const ctx = appState.audioContext;
    let freq = mode === 'space' ? 80 : (mode === 'forest' ? 130 : 100);
    
    let baseOsc = ctx.createOscillator();
    let baseGain = ctx.createGain();
    baseOsc.type = 'sine';
    baseOsc.frequency.setValueAtTime(freq, ctx.currentTime);
    baseGain.gain.setValueAtTime(0.015, ctx.currentTime);
    baseOsc.connect(baseGain); baseGain.connect(ctx.destination);
    baseOsc.start(); appState.oscillatorNodes.push(baseOsc);
    
    const playTick = () => {
        if (!appState.audioPlaying) return;
        // Synthesizer frequency array map is now cleanly defined without unparsed syntax symbols
        let chordMap = mode === 'cafe' ? [130.81, 164.81, 196.00, 246.94] : [146.83, 174.61, 220.00, 261.63];
        let note = ctx.createOscillator();
        let noteGain = ctx.createGain();
        note.type = 'sine';
        note.frequency.setValueAtTime(chordMap[Math.floor(Math.random() * chordMap.length)], ctx.currentTime);
        noteGain.gain.setValueAtTime(0, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.4);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);
        note.connect(noteGain); noteGain.connect(ctx.destination);
        note.start();
        setTimeout(playTick, 3500);
    };
    playTick();
}

// --- FONTS TRANSFORM AND COPIER ---
function updateFontPreviews() {
Use code with caution.const val = document.getElementById('font-input').value || "Plant Pal";document.getElementById('preview-1').innerText = val;document.getElementById('preview-2').innerText = transformStringFonts(val, fontMappers.style2);document.getElementById('preview-3').innerText = transformStringFonts(val, fontMappers.style3);}function transformStringFonts(str, mapper) { return str.split('').map(c => mapper[c] || c).join(''); }function copyText(element) {const text = element.innerText;navigator.clipboard.writeText(text).then(() => {const toast = document.getElementById('toast-element');toast.innerText = Copied: "${text}";toast.classList.add('show');setTimeout(() => toast.classList.remove('show'), 2000);});}
