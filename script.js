// --- COMPILER INTEGRITY RUNTIME STATE ---
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

const genotypeNamesList = ["Thick Sprout", "Pixie Fern", "Cosmic Clover", "Ruby Succulent", "Bonsai Buddy", "Lunar Moss"];

const stringFontTransformationMappers = {
    styleScript: {
        'A':'𝒜','B':'ℬ','C':'𝒞','D':'𝒟','E':'ℰ','F':'ℱ','G':'𝒢','H':'ℋ','I':'ℐ','J':'𝒥','K':'𝒦','L':'ℒ','M':'ℳ','N':'𝒩','O':'𝒪','P':'𝒫','Q':'𝒬','R':'ℛ','S':'𝒮','T':'𝒯','U':'𝒰','V':'𝒱','W':'𝒲','X':'𝒳','Y':'𝒴','Z':'𝒵',
        'a':'𝒶','b':'𝒷','c':'𝒸','d':'𝒹','e':'ℯ','f':'𝒻','g':'ℊ','h':'𝒽','i':'𝒾','j':'𝒿','k':'𝓀','l':'𝓁','m':'𝓂','n':'𝓋','o':'ℴ','p':'𝓅','q':'𝓆','r':'𝓇','s':'𝓈','t':'𝓉','u':'𝓊','v':'𝓋','w':'𝓌','x':'𝓍','y':'𝓎','z':'𝓏'
    },
    styleGothic: {
        'A':'𝔄','B':'𝔅','C':'ℭ','D':'𝔇','E':'𝔈','F':'𝔉','G':'𝔊','H':'𝔏','I':'ℑ','J':'𝔍','K':'𝔎','L':'𝔏','M':'𝔐','N':'𝔓','O':'𝔒','P':'𝔓','Q':'𝔔','R':'ℜ','S':'𝔖','T':'𝔗','U':'𝔘','V':'𝔙','W':'𝔚','X':'𝔛','Y':'𝔜','Z':'  ',
        'a':'𝔞','b':'𝔟','c':'𝔠','d':'𝔡','e':'𝔢','f':'𝔣','g':'𝔤','h':'𝔥','i':'𝔦','j':'𝔧','k':'𝔨','l':'𝔩','m':'𝔪','n':'𝔫','o':'𝔬','p':'𝔭','q':'𝔮','r':'𝔯','s':'𝔰','t':'𝔱','u':'𝔲','v':'𝔳','w':'𝔴','x':'𝔵','y':'𝔶','z':'𝔷'
    }
};

// Application Bootstrapping Router Entrypoint
window.addEventListener('DOMContentLoaded', () => {
    synchronizeLocalStorageData();
    executeLiveTimestampClockSync();
    renderProceduralPixelSproutSVG();
    syncChecklistDOMDisplay();
    updateChoreTrackingDashboardUI();
    refreshNumericalTimerDisplayReadout();
    runFontTransformationPreviews();
    logWorkspaceEvent("Workspace configuration array initiated successfully.");
});

function logWorkspaceEvent(logStringText) {
    const historicalBoxNode = document.getElementById('history-log-box');
    if (!historicalBoxNode) return;
    
    const initialPlaceholderText = historicalBoxNode.querySelector('.history-empty-placeholder');
    if (initialPlaceholderText) initialPlaceholderText.remove();

    const modernTimestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dynamicRowElement = document.createElement('div');
    dynamicRowElement.className = 'history-log-item-row';
    dynamicRowElement.innerHTML = `<strong>[${modernTimestampStr}]</strong> ${logStringText}`;
    
    historicalBoxNode.appendChild(dynamicRowElement);
    historicalBoxNode.scrollTop = historicalBoxNode.scrollHeight; // FORCES VIEWPORT DESCENT TO PREVENT SCROLL LOG FREEZE
    writeStateToLocalStorageMemory();
}

// --- SYSTEM LOCAL MEMORY PIPELINES ---
function writeStateToLocalStorageMemory() {
    const statePackageObject = {
        plantStage: workspaceState.plantStage,
        plantTypeIndex: workspaceState.plantTypeIndex,
        completedTaskCount: workspaceState.completedTaskCount,
        choreMinutesAccumulated: workspaceState.choreMinutesAccumulated,
        choreGoalTarget: workspaceState.choreGoalTarget
    };
    localStorage.setItem('sproutOS_calibratedDataMemory', JSON.stringify(statePackageObject));
}

function synchronizeLocalStorageData() {
    const storedMemoryArrayValue = localStorage.getItem('sproutOS_calibratedDataMemory');
    if (storedMemoryArrayValue) {
        try {
            const decompiledDataStructure = JSON.parse(storedMemoryArrayValue);
            workspaceState.plantStage = decompiledDataStructure.plantStage || 1;
            workspaceState.plantTypeIndex = decompiledDataStructure.plantTypeIndex || 0;
            workspaceState.completedTaskCount = decompiledDataStructure.completedTaskCount || 0;
            workspaceState.choreMinutesAccumulated = decompiledDataStructure.choreMinutesAccumulated || 0;
            workspaceState.choreGoalTarget = decompiledDataStructure.choreGoalTarget || 15;
        } catch(runtimeError) { console.error("Memory parsing error", runtimeError); }
    }
}

function clearWorkspaceLogStorage() {
    localStorage.removeItem('sproutOS_calibratedDataMemory');
    workspaceState.plantStage = 1;
    workspaceState.completedTaskCount = 0;
    workspaceState.choreMinutesAccumulated = 0;
    
    document.getElementById('history-log-box').innerHTML = '<div class="history-empty-placeholder">No logged activities present. System standby.</div>';
    
    renderProceduralPixelSproutSVG();
    syncChecklistDOMDisplay();
    updateChoreTrackingDashboardUI();
    logWorkspaceEvent("System storage matrix cleared out and values reset to default states.");
}

function executeLiveTimestampClockSync() {
    const clockDisplayField = document.getElementById('live-clock');
    const syncTimeTick = () => {
        clockDisplayField.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    syncTimeTick();
    setInterval(syncTimeTick, 1000);
}

// --- PROCEDURAL HIGH-CLARITY GRID VECTOR PIXEL PLANT GENERATION ---
function renderProceduralPixelSproutSVG() {
    const targetSvgCanvas = document.getElementById('plant-svg');
    const levelDisplayBadgeNode = document.getElementById('level-badge');
    const menuDropdownSelector = document.getElementById('plant-select');
    if (!targetSvgCanvas) return;
    
    menuDropdownSelector.value = workspaceState.plantTypeIndex;
    levelDisplayBadgeNode.innerText = `Stage ${workspaceState.plantStage} / 15`;
    targetSvgCanvas.innerHTML = '';
    
    let compiledPotVectorHTML = `
        <rect x="11" y="24" width="10" height="1" fill="#a1705a" />
        <rect x="10" y="25" width="12" height="5" fill="#b8836b" />
        <rect x="11" y="30" width="10" height="1" fill="#8c5b47" />
        <rect x="11" y="25" width="10" height="1" fill="#4d2c18" opacity="0.4" />
    `;
    
    let calculatedPlantVectorHTML = '';
    let stageLevelRank = workspaceState.plantStage;
    
    if (stageLevelRank >= 1) calculatedPlantVectorHTML += `<rect x="15" y="22" width="2" height="2" fill="#7ebd7e" />`;
    if (stageLevelRank >= 2) calculatedPlantVectorHTML += `<rect x="15" y="19" width="2" height="3" fill="#7ebd7e" />`;
    if (stageLevelRank >= 3) calculatedPlantVectorHTML += `<rect x="13" y="20" width="2" height="1" fill="#5fa35f" /><rect x="17" y="20" width="2" height="1" fill="#5fa35f" />`;
    if (stageLevelRank >= 5) calculatedPlantVectorHTML += `<rect x="15" y="15" width="2" height="4" fill="#5fa35f" />`;
    
    if (stageLevelRank >= 7) {
        calculatedPlantVectorHTML += `
            <rect x="11" y="16" width="4" height="1" fill="#7ebd7e" />
            <rect x="10" y="14" width="2" height="2" fill="#4e8c4e" />
        `;
    }
    if (stageLevelRank >= 9) {
        calculatedPlantVectorHTML += `
            <rect x="17" y="15" width="4" height="1" fill="#7ebd7e" />
            <rect x="20" y="13" width="2" height="2" fill="#4e8c4e" />
        `;
    }
    
    if (stageLevelRank >= 11) calculatedPlantVectorHTML += `<rect x="15" y="11" width="2" height="4" fill="#4e8c4e" />`;
    
    if (stageLevelRank >= 13) {
        calculatedPlantVectorHTML += `
            <rect x="14" y="8" width="4" height="3" fill="#f28a9b" />
            <rect x="15" y="9" width="2" height="1" fill="#fae896" />
        `;
    } else if (stageLevelRank >= 8) {
        calculatedPlantVectorHTML += `<rect x="15" y="9" width="2" height="2" fill="#f2a7b5" />`;
    }
    
    targetSvgCanvas.innerHTML = compiledPotVectorHTML + calculatedPlantVectorHTML;
}

function handlePlantGenotypeChange() {
    workspaceState.plantTypeIndex = parseInt(document.getElementById('plant-select').value);
    logWorkspaceEvent(`Target botanical genotype profile shifted to: <strong>${genotypeNamesList[workspaceState.plantTypeIndex]}</strong>`);
    renderProceduralPixelSproutSVG();
    
    // Updates paragraph statement string variables seamlessly
    document.getElementById('ecosystem-paragraph-text').innerText = `Your selected ${genotypeNamesList[workspaceState.plantTypeIndex]} genotype profile coordinates carbon capture operations within this specific grid partition. Complete task milestones to expand leaf structures and maximize digital environmental filtering efficiency.`;
}
// --- DATA INTERFACE CHECKLIST MATRIX ---
const underlyingActiveTaskMemoryStore = [
    "Verify project layout constraints",
    "Refactor system workspace variables",
    "Analyze environmental grid blueprints",
    "Audit core compilation modules"
];

function syncChecklistDOMDisplay() {
    const listRootWrapperNode = document.getElementById('task-list-container');
    const numericalDisplayCounterNode = document.getElementById('done-counter');
    if (!listRootWrapperNode) return;
    
    numericalDisplayCounterNode.innerText = workspaceState.completedTaskCount;
    listRootWrapperNode.innerHTML = '';
    
    underlyingActiveTaskMemoryStore.forEach((taskStringText, taskIndexPosition) => {
        const rowListNodeElement = document.createElement('li');
        rowListNodeElement.className = 'task-item-row-node';
        rowListNodeElement.innerHTML = `
            <div class="task-item-left-block">
                <input type="checkbox" onchange="processTaskCompletionTrigger(${taskIndexPosition}, this)">
                <span>${taskStringText}</span>
            </div>
            <button class="task-delete-trigger-btn" style="background:none; border:none; cursor:pointer;" onclick="removeExistingTaskItem(${taskIndexPosition})">❌</button>
        `;
        listRootWrapperNode.appendChild(rowListNodeElement);
    });
}

function createNewTaskItem() {
    const textInputNodeField = document.getElementById('new-task-input');
    const extractedTaskString = textInputNodeField.value.trim();
    if (!extractedTaskString) return;
    
    underlyingActiveTaskMemoryStore.push(extractedTaskString);
    textInputNodeField.value = '';
    syncChecklistDOMDisplay();
    logWorkspaceEvent(`Injected target task parameter node: "${extractedTaskString}"`);
}

function removeExistingTaskItem(targetIndex) {
    const deletedTaskStringValue = underlyingActiveTaskMemoryStore.splice(targetIndex, 1);
    syncChecklistDOMDisplay();
    logWorkspaceEvent(`Removed task reference data element: "${deletedTaskStringValue}"`);
}

function processTaskCompletionTrigger(targetIndex, checkboxInputElement) {
    if (checkboxInputElement.checked) {
        checkboxInputElement.disabled = true;
        checkboxInputElement.parentElement.parentElement.classList.add('completed');
        workspaceState.completedTaskCount++;
        
        logWorkspaceEvent(`Task block verified! Session progress matrix tracking: <strong>${workspaceState.completedTaskCount} / 9 Checks</strong>`);
        
        if (workspaceState.completedTaskCount >= 9) {
            workspaceState.completedTaskCount = 0;
            if (workspaceState.plantStage < 15) {
                workspaceState.plantStage++;
                logWorkspaceEvent(`🎉 <strong>GROWTH LEVEL UPCEILING REACHED!</strong> Sprout genotype expanded to Stage Rank Level: <strong>${workspaceState.plantStage} / 15</strong>!`);
            }
            renderProceduralPixelSproutSVG();
        }
        
        setTimeout(() => {
            underlyingActiveTaskMemoryStore.splice(targetIndex, 1);
            syncChecklistDOMDisplay();
        }, 500);
    }
}

// --- MECHANICAL HAMSTER ACTIVE RUN STATION DRIVERS ---
function updateChoreTrackingDashboardUI() {
    document.getElementById('chore-current').innerText = workspaceState.choreMinutesAccumulated;
    document.getElementById('chore-goal').innerText = workspaceState.choreGoalTarget;
}

function adjustChoreGoalTarget() {
    workspaceState.choreGoalTarget = parseInt(document.getElementById('goal-select').value);
    updateChoreTrackingDashboardUI();
    logWorkspaceEvent(`Chore balance requirement barrier altered to: <strong>${workspaceState.choreGoalTarget} minutes</strong>.`);
}

function executeChoreTimeLog() {
    const selectionLogQuantity = parseInt(document.getElementById('log-select').value);
    const mechanicalWheelElementNode = document.getElementById('wheel-element');
    const runningStatusBarBadgeNode = document.getElementById('hamster-status');
    
    workspaceState.choreMinutesAccumulated += selectionLogQuantity;
    updateChoreTrackingDashboardUI();
    
    mechanicalWheelElementNode.classList.add('spinning');
    runningStatusBarBadgeNode.innerText = "RUNNING";
    runningStatusBarBadgeNode.className = "status-badge state-active";
    logWorkspaceEvent(`Active tracking spin loop engaged. Logged <strong>${selectionLogQuantity} minutes</strong> of physical chore operations.`);
    
    setTimeout(() => {
        mechanicalWheelElementNode.classList.remove('spinning');
        runningStatusBarBadgeNode.innerText = "IDLE";
        runningStatusBarBadgeNode.className = "status-badge state-idle";
        
        if (workspaceState.choreMinutesAccumulated >= workspaceState.choreGoalTarget) {
            logWorkspaceEvent("🏆 <strong>Chore Activity Milestone Logged!</strong> Personal physical fitness target attained.");
        }
    }, 1500);
}

// --- CHRONO CLOCK CALIBRATION AND POMODORO Presets ---
function refreshNumericalTimerDisplayReadout() {
    const floorMinsValue = Math.floor(workspaceState.timerSecondsRemaining / 60).toString().padStart(2, '0');
    const boundarySecsValue = (workspaceState.timerSecondsRemaining % 60).toString().padStart(2, '0');
    document.getElementById('timer-text').innerText = `${floorMinsValue}:${boundarySecsValue}`;
}

function applyTimerPreset(presetModeString, buttonContextReference) {
    workspaceState.activeTimerPresetMode = presetModeString;
    document.querySelectorAll('.timer-preset-row .preset-btn').forEach(buttonNode => buttonNode.classList.remove('active'));
    buttonContextReference.classList.add('active');
    
    if (presetModeString === 'focus') workspaceState.timerSecondsRemaining = 1500;
    else if (presetModeString === 'break') workspaceState.timerSecondsRemaining = 300;
    else if (presetModeString === 'short') workspaceState.timerSecondsRemaining = 600;
    else if (presetModeString === 'long') workspaceState.timerSecondsRemaining = 1800;
    
    refreshNumericalTimerDisplayReadout();
    logWorkspaceEvent(`Chrono registry shifted to preset profile mode: <strong>${presetModeString}</strong>.`);
}

function triggerTimerToggle() {
    const initiationButtonToggleNode = document.getElementById('start-btn');
    if (workspaceState.timerActiveState) {
        clearInterval(workspaceState.timerIntervalThread);
        workspaceState.timerActiveState = false;
        initiationButtonToggleNode.innerText = "Start";
        initiationButtonToggleNode.className = "action-btn btn-primary";
        logWorkspaceEvent("Chrono block sequence suspended temporarily.");
    } else {
        workspaceState.timerActiveState = true;
        initiationButtonToggleNode.innerText = "Pause";
        initiationButtonToggleNode.className = "action-btn btn-danger";
        logWorkspaceEvent("Chrono block timeline countdown track initialized.");
        
        workspaceState.timerIntervalThread = setInterval(() => {
            if (workspaceState.timerSecondsRemaining > 0) {
                workspaceState.timerSecondsRemaining--;
                refreshNumericalTimerDisplayReadout();
            } else {
                clearInterval(workspaceState.timerIntervalThread);
                workspaceState.timerActiveState = false;
                initiationButtonToggleNode.innerText = "Start";
                initiationButtonToggleNode.className = "action-btn btn-primary";
                logWorkspaceEvent("🔔 <strong>Pomodoro focus sequence accomplished successfully!</strong> Viewport reset.");
            }
        }, 1000);
    }
}

function executeTimerReset() {
    clearInterval(workspaceState.timerIntervalThread);
    workspaceState.timerActiveState = false;
    document.getElementById('start-btn').innerText = "Start";
    document.getElementById('start-btn').className = "action-btn btn-primary";
    
    let currentMode = workspaceState.activeTimerPresetMode;
    if (currentMode === 'focus') workspaceState.timerSecondsRemaining = 1500;
    else if (currentMode === 'break') workspaceState.timerSecondsRemaining = 300;
    else if (currentMode === 'short') workspaceState.timerSecondsRemaining = 600;
    else if (currentMode === 'long') workspaceState.timerSecondsRemaining = 1800;
    
    refreshNumericalTimerDisplayReadout();
    logWorkspaceEvent("Chrono timeline configuration metrics reset to preset base limits.");
}

// --- CUSTOM FONTS CONVERTER MANAGEMENT ---
function runFontTransformationPreviews() {
    const underlyingStringValue = document.getElementById('font-input').value || "Plant Pal";
    document.getElementById('preview-1').innerText = underlyingStringValue;
    document.getElementById('preview-2').innerText = parseStringThroughFontCharacterMapping(underlyingStringValue, stringFontTransformationMappers.styleScript);
    document.getElementById('preview-3').innerText = parseStringThroughFontCharacterMapping(underlyingStringValue, stringFontTransformationMappers.styleGothic);
}

function parseStringThroughFontCharacterMapping(initialStringValue, targetMappingAsset) {
    return initialStringValue.split('').map(characterKey => targetMappingAsset[characterKey] || characterKey).join('');
}

function copyStringToClipboard(domElementNodeReference) {
    const targetStringLiteralText = domElementNodeReference.innerText;
    navigator.clipboard.writeText(targetStringLiteralText).then(() => {
        const toastNotificationOverlayNode = document.getElementById('toast-element');
        toastNotificationOverlayNode.innerText = `Copied to clipboard: "${targetStringLiteralText}"`;
        toastNotificationOverlayNode.classList.add('display-active');
        setTimeout(() => toastNotificationOverlayNode.classList.remove('display-active'), 2000);
    });
}
