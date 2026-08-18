// --- RUNTIME APPLICATION MATRIX STATE ---
let workspaceState = {
    plantStage: 1,
    plantTypeIndex: 0,
    completedTaskCount: 0,
    choreMinutesAccumulated: 0,
    choreGoalTarget: 15,
    timerSecondsRemaining: 1500,
    timerActiveState: false,
    timerIntervalThread: null,
    activeTimerPresetMode: 'focus'
};

// --- DYNAMIC TARGET ECOSYSTEM VIBE ARRAY CONFIGURATIONS ---
const genotypeAestheticProfiles = [
    {
        name: "Thick Sprout",
        bg: "#f4f6f4", primary: "#d1dfd1", shadow: "#eaedea",
        kaomojis: ["(🌱•.•)", "(⁀ᗢ⁀)🍃", "(•̤ᴗ•̤)🌿", "(⊃｡•́‿•̀｡)⊃", "(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧"],
        fonts: { s2: "𝒞𝓁𝒶𝓈𝓈𝒾𝒸 𝒮𝓅𝓇ℴ𝓊𝓉", s3: "𝔖𝔭𝔯𝔬𝔲𝔱𝔒𝔖" }
    },
    {
        name: "Pixie Fern",
        bg: "#edf5f0", primary: "#b3cbb4", shadow: "#dae5db",
        kaomojis: ["(🧚•̤ᴗ•̤)", "(*ﾟ▽ﾟ*)🌿", "(🌿ᵕᴗᵕ)", "(*>﹏<*)🍃", "(🍃'ᵕ'🍃)"],
        fonts: { s2: "𝒫𝒾𝓍𝒾ℯ ℱℯ𝓇𝓃 𝒮𝓉𝓎𝓁ℯ", s3: "𝔓𝔦𝔵𝔦𝔢𝔉𝔢𝔯𝔫" }
    },
    {
        name: "Cosmic Clover",
        bg: "#f3effa", primary: "#d3bee6", shadow: "#e8e1f2",
        kaomojis: ["(✨🍀.🍀)", "(🌌°o°)", "(🔮•̀ᴗ•́)", "(🚀🌟‿🌟)", "✧(⚙ 𖦹 ⚙)✧"],
        fonts: { s2: "𝒞ℴ𝓈𝓂𝒾𝒸 𝒞𝓁ℴ𝓋ℯ𝓇", s3: "ℭ𝔬𝔰𝔪𝔦𝔠ℭ𝔩𝔬𝔳𝔢𝔯" }
    },
    {
        name: "Ruby Succulent",
        bg: "#fcf4f2", primary: "#f7cbc1", shadow: "#fae5e0",
        kaomojis: ["(🌸•‿•)", "(🪷´▿`)", "(๑>ᴗ<๑)💕", "(🌵`･ω･´)", "(☀️_☀️)🌵"],
        fonts: { s2: "ℛ𝓊𝒷𝓎 𝒮𝓊𝒸𝒸𝓊𝓁ℯ𝓃𝓉", s3: "ℜ𝔲𝔟𝔶𝔖𝔲𝔠𝔠𝔲𝔩𝔢𝔫𝔱" }
    },
    {
        name: "Bonsai Buddy",
        bg: "#faf5ef", primary: "#dec9b8", shadow: "#eddcd0",
        kaomojis: ["( Bonsai 🧘 )", "(🍵_🍵)", "( `ᵕ` )🌸", "(o^^o)🌳", "(🥷•̀⤙•́)"],
        fonts: { s2: "ℬℴ𝓃𝓈𝒶𝒾 ℬ𝓊𝒹𝒹𝓎", s3: "𝔅𝔬𝔫𝔰𝔞𝔦𝔅𝔲𝔡𝔡𝔶" }
    },
    {
        name: "Lunar Moss",
        bg: "#f2f0f7", primary: "#cbc5f5", shadow: "#e4e1fa",
        kaomojis: ["(🌙💤.💤)", "(🛸★.★)", "(🌖𖦹⤙𖦹)", "(👾♫𖦹♫)", "✧(☄️.☄️)✧"],
        fonts: { s2: "ℒ𝓊𝓃𝒶𝓇 ℳℴ𝓈𝓈 𝒩𝒾ℊ𝒽𝓉", s3: "𝔏𝔲𝔫𝔞𝔯𝔐𝔬𝔰𝔰" }
    }
];

const stringFontTransformationMappers = {
    styleScript: {
        'A':'𝒜','B':'ℬ','C':'𝒞','D':'𝒟','E':'ℰ','F':'ℱ','G':'𝒢','H':'ℋ','I':'ℐ','J':'𝒥','K':'𝒦','L':'ℒ','M':'ℳ','N':'𝒩','O':'𝒪','P':'𝒫','Q':'𝒬','R':'ℛ','S':'𝒮','T':'𝒯','U':'𝒰','V':'𝒱','W':'𝒲','X':'𝒳','Y':'𝒴','Z':'𝒵',
        'a':'𝒶','b':'𝒷','c':'𝒸','d':'𝒹','e':'ℯ','f':'𝒻','g':'ℊ','h':'𝒽','i':'𝒾','j':'𝒿','k':'𝓀','l':'𝓁','m':'𝓂','n':'𝓃','o':'ℴ','p':'𝓅','q':'𝓆','r':'𝓇','s':'𝓈','t':'𝓉','u':'𝓊','v':'="𝓋"','w':'𝓌','x':'𝓍','y':'𝓎','z':'𝓏'
    },
    styleGothic: {
        'A':'𝔄','B':'𝔅','C':'ℭ','D':'𝔇','E':'𝔈','F':'𝔉','G':'𝔊','H':'𝔏','I':'ℑ','J':'𝔍','K':'𝔎','L':'="𝔏"','M':'𝔐','N':'𝔓','O':'𝔒','P':'𝔓','Q':'𝔔','R':'ℜ','S':'𝔖','T':'𝔗','U':'𝔘','V':'𝔙','W':'𝔚','X':'𝔛','Y':'𝔜','Z':'  ',
        'a':'𝔞','b':'𝔟','c':'𝔠','d':'𝔡','e':'𝔢','f':'𝔣','g':'𝔤','h':'𝔥','i':'𝔦','j':'𝔧','k':'𝔨','l':'𝔩','m':'𝔪','n':'𝔫','o':'𝔬','p':'𝔭','q':'𝔮','r':'𝔯','s':'𝔰','t':'𝔱','u':'𝔲','v':'𝔳','w':'𝔴','x':'𝔵','y':'𝔶','z':'𝔷'
    }
};

window.addEventListener('DOMContentLoaded', () => {
    synchronizeLocalStorageData();
    executeLiveTimestampClockSync();
    handlePlantGenotypeChange(); // Core initializer to fire themes & properties instantly
    syncChecklistDOMDisplay();
    setupSandboxEngine();
    updateChoreTrackingDashboardUI();
    refreshNumericalTimerDisplayReadout();
    logWorkspaceEvent("Workspace context arrays initialized successfully.");
});
function renderProceduralPixelSproutSVG() {
    const targetSvgCanvas = document.getElementById('plant-svg');
    const levelDisplayBadgeNode = document.getElementById('level-badge');
    if (!targetSvgCanvas) return;
    
    levelDisplayBadgeNode.innerText = `Stage ${workspaceState.plantStage} / 10`;
    targetSvgCanvas.innerHTML = '';
    
    let potHTML = `<rect x="11" y="24" width="10" height="1" fill="#a1705a" /><rect x="10" y="25" width="12" height="5" fill="#b8836b" /><rect x="11" y="30" width="10" height="1" fill="#8c5b47" />`;
    let plantHTML = '';
    let stage = workspaceState.plantStage;
    let type = workspaceState.plantTypeIndex;
    
    if (type === 0) { // Thick Sprout Vector Layout Matrix
        if (stage >= 1) plantHTML += `<rect x="15" y="22" width="2" height="2" fill="#7ebd7e" />`;
        if (stage >= 4) plantHTML += `<rect x="15" y="17" width="2" height="5" fill="#5fa35f" /><rect x="13" y="19" width="2" height="1" fill="#7ebd7e" />`;
        if (stage >= 7) plantHTML += `<rect x="17" y="16" width="3" height="1" fill="#7ebd7e" /><rect x="12" y="15" width="3" height="1" fill="#5fa35f" />`;
        if (stage >= 10) plantHTML += `<rect x="14" y="12" width="4" height="4" fill="#f28a9b" /><rect x="15" y="13" width="2" height="1" fill="#fae896" />`;
    } else if (type === 1) { // Pixie Fern Vector Layout Matrix
        if (stage >= 1) plantHTML += `<rect x="15" y="21" width="2" height="3" fill="#4d7c57" />`;
        if (stage >= 4) plantHTML += `<rect x="13" y="18" width="6" height="2" fill="#689f75" /><rect x="15" y="16" width="2" height="3" fill="#4d7c57" />`;
        if (stage >= 7) plantHTML += `<rect x="11" y="14" width="10" height="2" fill="#8bc39a" />`;
        if (stage >= 10) plantHTML += `<rect x="9" y="11" width="14" height="2" fill="#aee4bd" />`;
    } else if (type === 2) { // Cosmic Clover Vector Layout Matrix
        if (stage >= 1) plantHTML += `<rect x="15" y="21" width="2" height="3" fill="#704d9c" />`;
        if (stage >= 4) plantHTML += `<rect x="14" y="19" width="4" height="2" fill="#916bbd" />`;
        if (stage >= 7) plantHTML += `<rect x="12" y="16" width="3" height="3" fill="#b38cd9" /><rect x="17" y="16" width="3" height="3" fill="#b38cd9" />`;
        if (stage >= 10) plantHTML += `<rect x="14" y="13" width="4" height="3" fill="#d4adf7" /><circle cx="16" cy="11" r="2" fill="#ffd700" />`;
    } else if (type === 3) { // Ruby Succulent Vector Layout Matrix
        if (stage >= 1) plantHTML += `<rect x="14" y="22" width="4" height="2" fill="#d96262" />`;
        if (stage >= 4) plantHTML += `<rect x="12" y="20" width="8" height="3" fill="#f28080" />`;
        if (stage >= 7) plantHTML += `<rect x="10" y="18" width="12" height="3" fill="#ff9e9e" />`;
        if (stage >= 10) plantHTML += `<rect x="9" y="15" width="14" height="4" fill="#ffb3b3" /><rect x="15" y="13" width="2" height="2" fill="#960018" />`;
    } else if (type === 4) { // Bonsai Buddy Vector Layout Matrix
        if (stage >= 1) plantHTML += `<rect x="15" y="21" width="2" height="3" fill="#7a5230" />`;
        if (stage >= 4) plantHTML += `<rect x="13" y="17" width="3" height="4" fill="#7a5230" /><rect x="16" y="16" width="3" height="2" fill="#426b42" />`;
        if (stage >= 7) plantHTML += `<rect x="10" y="15" width="4" height="3" fill="#7a5230" /><rect x="9" y="13" width="5" height="2" fill="#528252" />`;
        if (stage >= 10) plantHTML += `<rect x="12" y="11" width="9" height="4" fill="#6ba36b" /><rect x="14" y="8" width="5" height="3" fill="#99cc99" />`;
    } else if (type === 5) { // Lunar Moss Vector Layout Matrix
        if (stage >= 1) plantHTML += `<rect x="12" y="23" width="8" height="1" fill="#444163" />`;
        if (stage >= 4) plantHTML += `<rect x="10" y="22" width="12" height="2" fill="#5c5887" />`;
        if (stage >= 7) plantHTML += `<rect x="9" y="20" width="14" height="3" fill="#7b75b3" />`;
        if (stage >= 10) plantHTML += `<rect x="8" y="18" width="16" height="3" fill="#9b95db" /><circle cx="20" cy="14" r="1.5" fill="#ffffcc" />`;
    }
    
    targetSvgCanvas.innerHTML = potHTML + plantHTML;
}
window.handlePlantGenotypeChange = function() {
    workspaceState.plantTypeIndex = parseInt(document.getElementById('plant-select').value);
    const profile = genotypeAestheticProfiles[workspaceState.plantTypeIndex];
    
    // ✨ CRITICAL FIX: Direct Injection to CSS Roots to change App & Card Backgrounds Instantly ✨
    document.documentElement.style.setProperty('--bg-slate', profile.bg);
    document.documentElement.style.setProperty('--sage-green', profile.primary);
    document.documentElement.style.setProperty('--peach-cream', profile.shadow);
    
    // Update structural card bodies directly to verify visual synchronization loops
    const elementsToTheme = ['garden-card', 'sandbox-card', 'checklist-card', 'hamster-card', 'audio-card', 'font-card'];
    elementsToTheme.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.style.borderColor = "var(--border-charcoal)";
    });

    logWorkspaceEvent(`Environment mutated to: <strong>${profile.name} Ecosystem</strong>`);
    renderProceduralPixelSproutSVG();
    populateKaomojisPack(profile.kaomojis);
    runFontTransformationPreviews();
    
    document.getElementById('ecosystem-paragraph-text').innerText = `The active ${profile.name} node balances atmospheric variables across this workstation layout sheet. Log your completed tasks to expand branch frameworks.`;
};

function populateKaomojisPack(kaomojiArray) {
    const container = document.querySelector('.kaomoji-grid-layout');
    if (!container) return;
    container.innerHTML = '';
    
    kaomojiArray.forEach(kaomojiStr => {
        const span = document.createElement('span');
        span.className = 'kaomoji-pill';
        span.setAttribute('onclick', 'copyStringToClipboard(this)');
        span.innerText = kaomojiStr;
        container.appendChild(span);
    });
}

function writeStateToLocalStorageMemory() {
    const dataObj = {
        plantStage: workspaceState.plantStage,
        plantTypeIndex: workspaceState.plantTypeIndex,
        completedTaskCount: workspaceState.completedTaskCount,
        choreMinutesAccumulated: workspaceState.choreMinutesAccumulated,
        choreGoalTarget: workspaceState.choreGoalTarget
    };
    localStorage.setItem('sproutOS_calibratedDataMemory_v5', JSON.stringify(dataObj));
}

function synchronizeLocalStorageData() {
    const saved = localStorage.getItem('sproutOS_calibratedDataMemory_v5');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            workspaceState.plantStage = data.plantStage || 1;
            workspaceState.plantTypeIndex = data.plantTypeIndex || 0;
            workspaceState.completedTaskCount = data.completedTaskCount || 0;
            workspaceState.choreMinutesAccumulated = data.choreMinutesAccumulated || 0;
            workspaceState.choreGoalTarget = data.choreGoalTarget || 15;
        } catch(e) { console.error("Memory sync block execution failure", e); }
    }
}

function executeLiveTimestampClockSync() {
    const clock = document.getElementById('live-clock');
    const syncTimeTick = () => { clock.innerText = new Date().toLocaleTimeString(); };
    syncTimeTick();
    setInterval(syncTimeTick, 1000);
}
const underlyingActiveTaskMemoryStore = ["Verify project layout constraints", "Refactor system workspace variables", "Analyze environmental grid blueprints", "Audit core compilation modules"];

function syncChecklistDOMDisplay() {
    const list = document.getElementById('task-list-container');
    const counter = document.getElementById('done-counter');
    if (!list) return;
    
    counter.innerText = workspaceState.completedTaskCount;
    list.innerHTML = '';
    
    underlyingActiveTaskMemoryStore.forEach((task, idx) => {
        const li = document.createElement('li');
        li.className = 'task-item-row-node';
        li.innerHTML = `
            <div class="task-item-left-block">
                <input type="checkbox" onchange="processTaskCompletionTrigger(${idx}, this)">
                <span>${task}</span>
            </div>
            <button style="background:none; border:none; cursor:pointer;" onclick="removeExistingTaskItem(${idx})">❌</button>
        `;
        list.appendChild(li);
    });
}

window.createNewTaskItem = function() {
    const input = document.getElementById('new-task-input');
    const text = input.value.trim();
    if (!text) return;
    underlyingActiveTaskMemoryStore.push(text);
    input.value = '';
    syncChecklistDOMDisplay();
    logWorkspaceEvent(`Injected task matrix index node: "${text}"`);
};

window.removeExistingTaskItem = function(idx) {
    const deleted = underlyingActiveTaskMemoryStore.splice(idx, 1);
    syncChecklistDOMDisplay();
    logWorkspaceEvent(`Purged task reference: "${deleted}"`);
};

window.processTaskCompletionTrigger = function(idx, checkbox) {
    if (checkbox.checked) {
        checkbox.disabled = true;
        checkbox.parentElement.parentElement.classList.add('completed');
        workspaceState.completedTaskCount++;
        
        logWorkspaceEvent(`Task audited! Progress trace: <strong>${workspaceState.completedTaskCount} / 3 Checks</strong>`);
        
        if (workspaceState.completedTaskCount >= 3) {
            workspaceState.completedTaskCount = 0;
            if (workspaceState.plantStage < 10) {
                workspaceState.plantStage++;
                logWorkspaceEvent(`🎉 <strong>GROWTH CEILING TRIGGERED!</strong> Flora advanced to Stage: <strong>${workspaceState.plantStage} / 10</strong>!`);
            }
            renderProceduralPixelSproutSVG();
        }
        setTimeout(() => { underlyingActiveTaskMemoryStore.splice(idx, 1); syncChecklistDOMDisplay(); }, 500);
    }
};

function setupSandboxEngine() {
    const container = document.getElementById('sandbox-container');
    if (!container) return;
    
    container.replaceWith(container.cloneNode(true));
    const activeSandbox = document.getElementById('sandbox-container');
    
    activeSandbox.addEventListener('mousemove', (e) => {
        const rect = activeSandbox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (Math.random() > 0.85) { 
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            // Pull high-visibility text-primary tone dynamically to prevent white sparkles on white backgrounds
            sparkle.style.backgroundColor = "var(--border-charcoal)";
            activeSandbox.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 500);
        }
    });
    
    activeSandbox.addEventListener('click', (e) => {
        if (e.target.classList.contains('sandbox-companion')) return;
        const rect = activeSandbox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const animal = playgroundCreatures[Math.floor(Math.random() * playgroundCreatures.length)];
        const node = document.createElement('div');
        node.className = 'sandbox-companion';
        node.innerText = animal;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        activeSandbox.appendChild(node);
        logWorkspaceEvent(`Hatched companion creature: <strong>${animal}</strong>`);
    });
}
function updateChoreTrackingDashboardUI() {
    document.getElementById('chore-current').innerText = workspaceState.choreMinutesAccumulated;
    document.getElementById('chore-goal').innerText = workspaceState.choreGoalTarget;
}

window.adjustChoreGoalTarget = function() {
    workspaceState.choreGoalTarget = parseInt(document.getElementById('goal-select').value);
    updateChoreTrackingDashboardUI();
    logWorkspaceEvent(`Target goal shifted to: <strong>${workspaceState.choreGoalTarget} minutes</strong>.`);
};

window.executeChoreTimeLog = function() {
    const mins = parseInt(document.getElementById('log-select').value);
    const wheel = document.getElementById('wheel-element');
    const status = document.getElementById('hamster-status');
    
    workspaceState.choreMinutesAccumulated += mins;
    updateChoreTrackingDashboardUI();
    wheel.classList.add('spinning');
    status.innerText = "RUNNING";
    status.className = "status-badge state-active";
    logWorkspaceEvent(`Logged <strong>${mins} minutes</strong> of active chore loops.`);
    
    setTimeout(() => {
        wheel.classList.remove('spinning');
        status.innerText = "IDLE";
        status.className = "status-badge state-idle";
    }, 1200);
};

window.resetChoreTracker = function() {
    workspaceState.choreMinutesAccumulated = 0;
    updateChoreTrackingDashboardUI();
    logWorkspaceEvent("🐹 Hamster station chore metrics reset back to zero minutes.");
};

// --- 📻 FIXED LO-FI RADIO AUDIO CONTROLLER ENGINE INTERFACE BINDINGS ---
window.toggleLoFiRadioPlayback = function() {
    const audioStream = document.getElementById('lofi-stream');
    const btn = document.getElementById('play-audio-btn');
    const statusBadge = document.getElementById('audio-status');
    
    if (audioStream.paused) {
        audioStream.play().then(() => {
            btn.innerText = "⏸️ Pause Radio";
            statusBadge.innerText = "LIVE STREAM";
            statusBadge.className = "status-badge state-active";
            logWorkspaceEvent("📻 Ambient Lo-Fi Radio deck connection online.");
        }).catch(err => {
            console.error("Audio block error", err);
            logWorkspaceEvent("⚠️ Radio connection blocked by sandbox browser parameters.");
        });
    } else {
        audioStream.pause();
        btn.innerText = "▶️ Play Radio";
        statusBadge.innerText = "MUTED";
        statusBadge.className = "status-badge state-idle";
        logWorkspaceEvent("📻 Lo-Fi Audio streaming feed paused.");
    }
};

window.adjustLoFiRadioVolume = function(volumeValue) {
    const audioStream = document.getElementById('lofi-stream');
    if (audioStream) audioStream.volume = volumeValue;
};

function refreshNumericalTimerDisplayReadout() {
    const m = Math.floor(workspaceState.timerSecondsRemaining / 60).toString().padStart(2, '0');
    const s = (workspaceState.timerSecondsRemaining % 60).toString().padStart(2, '0');
    document.getElementById('timer-text').innerText = `${m}:${s}`;
}

window.applyTimerPreset = function(mode, btn) {
    workspaceState.activeTimerPresetMode = mode;
    document.querySelectorAll('.timer-preset-row .preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (mode === 'focus') workspaceState.timerSecondsRemaining = 1500;
    else if (mode === 'break') workspaceState.timerSecondsRemaining = 300;
    else if (mode === 'short') workspaceState.timerSecondsRemaining = 600;
    else if (mode === 'long') workspaceState.timerSecondsRemaining = 1800;
    refreshNumericalTimerDisplayReadout();
};

window.triggerTimerToggle = function() {
    const btn = document.getElementById('start-btn');
    if (workspaceState.timerActiveState) {
        clearInterval(workspaceState.timerIntervalThread);
        workspaceState.timerActiveState = false;
        btn.innerText = "Start";
        btn.className = "action-btn btn-primary";
    } else {
        workspaceState.timerActiveState = true;
        btn.innerText = "Pause";
        btn.className = "action-btn btn-danger";
        workspaceState.timerIntervalThread = setInterval(() => {
            if (workspaceState.timerSecondsRemaining > 0) {
                workspaceState.timerSecondsRemaining--;
                refreshNumericalTimerDisplayReadout();
            } else {
                clearInterval(workspaceState.timerIntervalThread);
                workspaceState.timerActiveState = false;
                btn.innerText = "Start";
                btn.className = "action-btn btn-primary";
                logWorkspaceEvent("🔔 <strong>Focus countdown complete!</strong>");
            }
        }, 1000);
    }
};

window.executeTimerReset = function() {
    clearInterval(workspaceState.timerIntervalThread);
    workspaceState.timerActiveState = false;
    document.getElementById('start-btn').innerText = "Start";
    document.getElementById('start-btn').className = "action-btn btn-primary";
    let m = workspaceState.activeTimerPresetMode;
    if (m === 'focus') workspaceState.timerSecondsRemaining = 1500;
    else if (m === 'break') workspaceState.timerSecondsRemaining = 300;
    else if (m === 'short') workspaceState.timerSecondsRemaining = 600;
    else if (m === 'long') workspaceState.timerSecondsRemaining = 1800;
    refreshNumericalTimerDisplayReadout();
};

window.runFontTransformationPreviews = function() {
    const val = document.getElementById('font-input').value || "Plant Pal";
    document.getElementById('preview-1').innerText = val;
    document.getElementById('preview-2').innerText = parseStringThroughFontCharacterMapping(val, stringFontTransformationMappers.styleScript);
    document.getElementById('preview-3').innerText = parseStringThroughFontCharacterMapping(val, stringFontTransformationMappers.styleGothic);
};

function parseStringThroughFontCharacterMapping(str, map) {
    return str.split('').map(c => map[c] || c).join('');
}

window.copyStringToClipboard = function(el) {
    const text = el.innerText;
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('toast-element');
        toast.innerText = `Copied to clipboard: "${text}"`;
        toast.classList.add('display-active');
        setTimeout(() => toast.classList.remove('display-active'), 2000);
    });
};

window.clearWorkspaceLogStorage = function() {
    localStorage.removeItem('sproutOS_calibratedDataMemory_v5');
    workspaceState.plantStage = 1;
    workspaceState.completedTaskCount = 0;
    workspaceState.choreMinutesAccumulated = 0;
    document.getElementById('history-log-box').innerHTML = '<div class="history-empty-placeholder">No logged activities present. System standby.</div>';
    renderProceduralPixelSproutSVG();
    syncChecklistDOMDisplay();
    updateChoreTrackingDashboardUI();
    document.querySelectorAll('.sandbox-companion').forEach(el => el.remove());
    logWorkspaceEvent("Storage registry fully wiped clean.");
};
