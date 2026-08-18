// --- STATE MANAGEMENT ---
let appState = {
    plantStage: 1,         // Evolution tracking levels 1-15
    plantTypeIndex: 0,     // Target dropdown option configurations
    checkedTodoCount: 0,   // Resets on reaching progress goals
    choreMinutes: 0,
    choreGoal: 15,
    timerSeconds: 1500,    // 25 minutes default timer focus block
    timerRunning: false,
    timerInterval: null,
    timerPreset: 'focus',
    audioPlaying: false,
    audioContext: null,
    oscillatorNodes: []
};

// Preset asset arrays
const plantNames = [
    "Thick Sprout", "Pixie Fern", "Cosmic Clover", "Ruby Succulent", "Bonsai Buddy",
    "Lunar Moss", "Golden Pothos", "Dream Cactus", "Star Flower", "Aero Ivy",
    "Amber Blossom", "Neon Shroom", "Zen Bamboo", "Aqua Lily", "Omega Bloom"
];

const sandboxAnimals = ["🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦆", "🦅", "🦉", "🦄", "🐝"];

const fontMappers = {
    style2: {
        'A':'𝒜','B':'ℬ','C':'𝒞','D':'𝒟','E':'ℰ','F':'ℱ','G':'𝒢','H':'ℋ','I':'ℐ','J':'𝒥','K':'𝒦','L':'ℒ','M':'ℳ','N':'𝒩','O':'𝒪','P':'𝒫','Q':'𝒬','R':'ℛ','S':'𝒮','T':'𝒯','U':'𝒰','V':'𝒱','W':'𝒲','X':'𝒳','Y':'𝒴','Z':'𝒵',
        'a':'𝒶','b':'𝒷','c':'𝒸','d':'𝒹','e':'ℯ','f':'𝒻','g':'ℊ','h':'𝒽','i':'𝒾','j':'𝒿','k':'𝓀','l':'𝓁','m':'𝓂','n':'𝓋','o':'ℴ','p':'𝓅','q':'𝓆','r':'𝓇','s':'𝓈','t':'𝓉','u':'𝓊','v':'𝓋','w':'𝓌','x':'𝓍','y':'𝓎','z':'𝓏'
    },
    style3: {
        'A':'𝔄','B':'𝔅','C':'ℭ','D':'𝔇','E':'𝔈','F':'𝔉','G':'𝔊','H':'𝔏','I':'ℑ','J':'𝔍','K':'𝔎','L':'𝔏','M':'𝔐','N':'𝔓','O':'𝔒','P':'𝔓','Q':'𝔔','R':'ℜ','S':'𝔖','T':'𝔗','U':'𝔘','V':'𝔙','W':'𝔚','X':'𝔛','Y':'𝔜','Z':'  ',
        'a':'𝔞','b':'𝔟','c':'𝔠','d':'𝔡','e':'𝔢','f':'𝔣','g':'𝔤','h':'𝔥','i':'𝔦','j':'𝔧','k':'𝔨','l':'𝔩','m':'𝔪','n':'𝔫','o':'𝔬','p':'𝔭','q':'𝔮','r':'𝔯','s':'𝔰','t':'𝔱','u':'𝔲','v':'𝔳','w':'𝔴','x':'𝔵','y':'𝔶','z':'𝔷'
    }
};

// Initial setup
window.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    initializeClock();
    renderPlantGraphic();
    updateChecklistDisplay();
    setupSandboxEngine();
    updateChoreUI();
    updateTimerUI();
    updateFontPreviews();
    logActivity("System Ready. Welcome back to your SproutOS workspace.");
});

// --- CORE SYSTEM LOGGING (FIX FOR BROKEN SCROLLING) ---
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
    logBox.scrollTop = logBox.scrollHeight; // Auto-scroll fix
    saveToLocalStorage();
}

// --- LOCAL STORAGE ENGINES ---
function saveToLocalStorage() {
    const dataToSave = {
        plantStage: appState.plantStage,
        plantTypeIndex: appState.plantTypeIndex,
        checkedTodoCount: appState.checkedTodoCount,
        choreMinutes: appState.choreMinutes,
        choreGoal: appState.choreGoal
    };
    localStorage.setItem('sproutOS_saveData', JSON.stringify(dataToSave));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('sproutOS_saveData');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            appState.plantStage = parsed.plantStage || 1;
            appState.plantTypeIndex = parsed.plantTypeIndex || 0;
            appState.checkedTodoCount = parsed.checkedTodoCount || 0;
            appState.choreMinutes = parsed.choreMinutes || 0;
            appState.choreGoal = parsed.choreGoal || 15;
        } catch(e) { console.error("Data tracking reload exception", e); }
    }
}

function resetWorkspaceStorage() {
    localStorage.removeItem('sproutOS_saveData');
    appState.plantStage = 1;
    appState.checkedTodoCount = 0;
    appState.choreMinutes = 0;
    
    const logBox = document.getElementById('history-log-box');
    logBox.innerHTML = '<div class="history-empty">No milestones logged for this session yet. <br>System Ready.</div>';
    
    renderPlantGraphic();
    updateChecklistDisplay();
    updateChoreUI();
    
    const sandbox = document.getElementById('sandbox-container');
    sandbox.querySelectorAll('.sandbox-animal').forEach(a => a.remove());
    logActivity("Workspace storage engine cleared and state fields reset.");
}

// --- CLOCK CONTROLLER ---
function initializeClock() {
    setInterval(() => {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        document.getElementById('live-clock').innerText = timeStr;
    }, 1000);
}

// --- PROCEDURAL SVG PLANT GRAPHICS ---
function renderPlantGraphic() {
    const svg = document.getElementById('plant-svg');
    const stageBadge = document.getElementById('level-badge');
    const selector = document.getElementById('plant-select');
    if (!svg) return;
    
    selector.value = appState.plantTypeIndex;
    stageBadge.innerText = `${appState.plantStage} / 15`;
    svg.innerHTML = ''; 
    
    const potHTML = `
        <ellipse cx="50" cy="85" rx="18" ry="6" fill="#b45309" stroke="#1a1a1a" stroke-width="2.5"/>
        <path d="M34 85 L37 68 L63 68 L66 85 Z" fill="#d97706" stroke="#1a1a1a" stroke-width="2.5" stroke-linejoin="round"/>
        <ellipse cx="50" cy="68" rx="13" ry="3" fill="#78350f" />
    `;
    
    let currentHeight = 15 + (appState.plantStage * 3.5);
    if(currentHeight > 62) currentHeight = 62; 
    
    const stemStartY = 68;
    const stemEndY = stemStartY - currentHeight;
    let plantHTML = '';
    
    plantHTML += `<path d="M50 ${stemStartY} Q ${48 + (appState.plantStage%3)} ${stemStartY - (currentHeight/2)}, 50 ${stemEndY}" fill="none" stroke="#15803d" stroke-width="${2 + (appState.plantStage * 0.4)}" stroke-linecap="round"/>`;
    
    for (let i = 1; i <= appState.plantStage; i++) {
        const branchY = stemStartY - (i * (currentHeight / (appState.plantStage + 1)));
        const isLeft = i % 2 === 0;
        const leafSize = 4 + (i * 0.5);
        
        if (isLeft) {
            plantHTML += `
                <path d="M50 ${branchY} Q 35 ${branchY - 8}, ${50 - leafSize} ${branchY - 4}" fill="none" stroke="#15803d" stroke-width="2"/>
                <ellipse cx="${50 - leafSize}" cy="${branchY - 4}" rx="${leafSize}" ry="${leafSize * 0.6}" transform="rotate(-20 ${50 - leafSize} ${branchY - 4})" fill="#4ade80" stroke="#1a1a1a" stroke-width="1.5"/>
            `;
        } else {
            plantHTML += `
                <path d="M50 ${branchY} Q 65 ${branchY - 8}, ${50 + leafSize} ${branchY - 4}" fill="none" stroke="#15803d" stroke-width="2"/>
                <ellipse cx="${50 + leafSize}" cy="${branchY - 4}" rx="${leafSize}" ry="${leafSize * 0.6}" transform="rotate(20 ${50 + leafSize} ${branchY - 4})" fill="#22c55e" stroke="#1a1a1a" stroke-width="1.5"/>
            `;
        }
    }
    
    if (appState.plantStage >= 7) {
        plantHTML += `<circle cx="50" cy="${stemEndY}" r="${3 + (appState.plantStage*0.4)}" fill="#f43f5e" stroke="#1a1a1a" stroke-width="1.5"/>`;
        plantHTML += `<circle cx="50" cy="${stemEndY}" r="${1 + (appState.plantStage*0.1)}" fill="#fef08a" />`;
    } else {
        plantHTML += `<ellipse cx="50" cy="${stemEndY}" rx="4" ry="6" fill="#86efac" stroke="#1a1a1a" stroke-width="1.5"/>`;
    }
    
    svg.innerHTML = potHTML + plantHTML;
}

function changePlantType() {
    const selector = document.getElementById('plant-select');
    appState.plantTypeIndex = parseInt(selector.value);
    logActivity(`Target seedling blueprint changed to: <strong>${plantNames[appState.plantTypeIndex]}</strong>`);
    renderPlantGraphic();
}

// --- CHECKLIST REWARD SYSTEM ---
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
        
        logActivity(`Completed task item! Progress tracking: <strong>${appState.checkedTodoCount}/9</strong>`);
        
        if (appState.checkedTodoCount >= 9) {
            appState.checkedTodoCount = 0; 
            if (appState.plantStage < 15) {
                appState.plantStage++;
                logActivity(`🎉 <strong>GROWTH LEVEL ACHIEVED!</strong> Evolved to Stage: <strong>${appState.plantStage}/15</strong>!`);
            }
            hatchRandomSandboxAnimal();
            renderPlantGraphic();
        }
        
        setTimeout(() => {
            presetTasks.splice(idx, 1);
            updateChecklistDisplay();
        }, 600);
    }
}

// --- CURSOR SANDBOX ENGINE (COORDINATE CALIBRATION FIX) ---
function setupSandboxEngine() {
    const sandbox = document.getElementById('sandbox-container');
    if (!sandbox) return;
    
    sandbox.addEventListener('mousemove', (e) => {
        const rect = sandbox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (Math.random() > 0.75) { 
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            sandbox.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 600);
        }
    });
    
    sandbox.addEventListener('click', (e) => {
        if (e.target.classList.contains('sandbox-animal')) return;
        const rect = sandbox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        deployAnimalAtCoords(x, y);
    });
}

function deployAnimalAtCoords(x, y) {
    const sandbox = document.getElementById('sandbox-container');
    const randomAnimal = sandboxAnimals[Math.floor(Math.random() * sandboxAnimals.length)];
    
    const animalNode = document.createElement('div');
    animalNode.className = 'sandbox-animal';
    animalNode.innerText = randomAnimal;
    animalNode.style.left = `${x}px`;
    animalNode.style.top = `${y}px`;
    
    attachDragMechanics(animalNode, sandbox);
    sandbox.appendChild(animalNode);
    logActivity(`Hatched companion animal <strong>${randomAnimal}</strong> into the playground.`);
}

function hatchRandomSandboxAnimal() {
    const sandbox = document.getElementById('sandbox-container');
    if (!sandbox) return;
    const rect = sandbox.getBoundingClientRect();
    const x = Math.random() * (rect.width - 40) + 20;
    const y = Math.random() * (rect.height - 40) + 20;
    deployAnimalAtCoords(x, y);
}

function attachDragMechanics(element, container) {
    let isDragging = false;
    let startX, startY;
    
    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - element.offsetLeft;
        startY = e.clientY - element.offsetTop;
        e.stopPropagation();
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = container.getBoundingClientRect();
        let targetX = e.clientX - startX;
        let targetY = e.clientY - startY;
        
        if (targetX < 15) targetX = 15;
        if (targetX > rect.width - 15) targetX = rect.width - 15;
        if (targetY < 15) targetY = 15;
        if (targetY > rect.height - 15) targetY = rect.height - 15;
        
        element.style.left = `${targetX}px`;
        element.style.top = `${targetY}px`;
    });
    
    window.addEventListener('mouseup', () => { isDragging = false; });
}

// --- HAMSTER WHEEL CONTROL ---
function updateChoreUI() {
    document.getElementById('chore-current').innerText = appState.choreMinutes;
    document.getElementById('chore-goal').innerText = appState.choreGoal;
}

function updateChoreGoal() {
    appState.choreGoal = parseInt(document.getElementById('goal-select').value);
    updateChoreUI();
    logActivity(`Chore balance target altered to: <strong>${appState.choreGoal} mins</strong>.`);
}

function logChoreTime() {
    const logAmount = parseInt(document.getElementById('log-select').value);
    const wheel = document.getElementById('wheel-element');
    const status = document.getElementById('hamster-status');
    
    appState.choreMinutes += logAmount;
    updateChoreUI();
    
    wheel.classList.add('spinning');
    status.innerText = "RUNNING";
    status.className = "badge badge-active";
    logActivity(`Logged <strong>${logAmount} minutes</strong> of chore productivity tracking.`);
    
    setTimeout(() => {
        wheel.classList.remove('spinning');
        status.innerText = "IDLE";
        status.className = "badge badge-idle";
        if (appState.choreMinutes >= appState.choreGoal) {
            logActivity("🏆 <strong>Chore Milestone Attained!</strong> Excellent performance!");
        }
    }, 2000);
}

// --- TIMER CLOCK ---
function updateTimerUI() {
    const mins = Math.floor(appState.timerSeconds / 60).toString().padStart(2, '0');
    const secs = (appState.timerSeconds % 60).toString().padStart(2, '0');
    document.getElementById('timer-text').innerText = `${mins}:${secs}`;
}

function setTimerPreset(type) {
    appState.timerPreset = type;
    document.querySelectorAll('.timer-presets .btn').forEach(b => b.classList.remove('active'));
    
    if (type === 'focus') appState.timerSeconds = 1500;
    else if (type === 'break') appState.timerSeconds = 300;
    else if (type === 'short') appState.timerSeconds = 600;
    else if (type === 'long') appState.timerSeconds = 1800;
    
    updateTimerUI();
    logActivity(`Timer shifted to: <strong>${type} mode</strong>.`);
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
                logActivity("🔔 <strong>Focus session completed successfully!</strong>");
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(appState.timerInterval);
    appState.timerRunning = false;
    document.getElementById('start-btn').innerText = "Start";
    document.getElementById('start-btn').className = "btn btn-primary";
    setTimerPreset(appState.timerPreset);
}

// --- WEB-AUDIO MUSIC SYNTHESIZER (FIXED CHORDS SYNTAX TYPO) ---
function handleAudioChange() {
    const track = document.getElementById('audio-select').value;
    logActivity(`Soundscape altered to: <strong>${track}</strong>`);
    if (appState.audioPlaying) { toggleAudioEngine(); toggleAudioEngine(); }
}

function toggleAudioEngine() {
    const btn = document.getElementById('audio-toggle-btn');
    if (appState.audioPlaying) {
        appState.oscillatorNodes.forEach(osc => { try { osc.stop(); } catch(e){} });
        appState.oscillatorNodes = [];
        appState.audioPlaying = false;
        btn.innerText = "🔊 Play Web-Audio Soundscape";
        btn.style.background = "#c084fc";
    } else {
        if (!appState.audioContext) appState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        appState.audioPlaying = true;
        btn.innerText = "🔇 Mute Mixer Pipeline";
        btn.style.background = "#ef4444";
        generateSynthesizedBeats(document.getElementById('audio-select').value);
    }
}

function generateSynthesizedBeats(mode) {
    if (!appState.audioContext || !appState.audioPlaying) return;
    const ctx = appState.audioContext;
    let baseFreq = mode === 'space' ? 73 : (mode === 'forest' ? 146 : 110);
    
    let osc = ctx.createOscillator();
    let gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); appState.oscillatorNodes.push(osc);
    
    const playChord = () => {
        if (!appState.audioPlaying) return;
        // Clean chord freq map array to avoid box-breaking code errors
        let chords = mode === 'cafe' ? [261, 329, 392, 493] :;
        let noteOsc = ctx.createOscillator();
        let noteGain = ctx.createGain();
        noteOsc.type = 'sine';
        noteOsc.frequency.setValueAtTime(chords[Math.floor(Math.random()*chords.length)], ctx.currentTime);
        noteGain.gain.setValueAtTime(0, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.5);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
        noteOsc.connect(noteGain); noteGain.connect(ctx.destination);
        noteOsc.start();
        setTimeout(() => playChord(), 3000);
    };
    playChord();
}

// --- FONTS TRANSFORM & CLIPBOARD TOASTS ---
Use code with caution.function updateFontPreviews() {const inputStr = document.getElementById('font-input').value || "Plant Pal";document.getElementById('preview-1').innerText = inputStr;document.getElementById('preview-2').innerText = transformStringFonts(inputStr, fontMappers.style2);document.getElementById('preview-3').innerText = transformStringFonts(inputStr, fontMappers.style3);}function transformStringFonts(str, mapper) { return str.split('').map(char => mapper[char] || char).join(''); }function copyText(element) {const txt = element.innerText;navigator.clipboard.writeText(txt).then(() => {const toast = document.getElementById('toast-element');toast.innerText = Copied: "${txt}";toast.classList.add('show');setTimeout(() => toast.classList.remove('show'), 2000);});}
