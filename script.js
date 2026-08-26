// --- CENTRAL ENVIRONMENT STORAGE STATE MAP ---
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

const genotypeAestheticProfiles = [
    {
        name: "Thick Sprout", bg: "#f4f6f4", primary: "#d1dfd1", shadow: "#eaedea",
        kaomojis: ["(🌱•.•)", "(⁀ᗢ⁀)🍃", "(•̤ᴗ•̤)🌿", "(⊃｡•́‿•̀｡)⊃", "(ﾉ◕ヮ◕)ﾉ・ﾟ✧"],
        fonts: { s2: "𝒞𝓁𝒶𝓈𝓈𝒾ᶜ 𝒮𝓅𝓇ℴ𝓊𝓉", s3: "𝔖𝔭𝔯𝔬𝔲𝔱𝔒𝔖" }
    },
    {
        name: "Pixie Fern", bg: "#edf5f0", primary: "#b3cbb4", shadow: "#dae5db",
        kaomojis: ["(🧚•̤ᴗ•̤)", "(*• - •*)🌿", "(🌿ᵕᴗᵕ)", "(*>﹏<*)🍃", "(🍃'ᵕ'🍃)"],
        fonts: { s2: "𝒫𝒾𝓍𝒾ℯ ℱℯ𝓇𝓃 𝒮𝓉𝓎𝓁ℯ", s3: "𝔓𝔦𝔵𝔦ℯ𝔉𝔢𝔯𝔫" }
    },
    {
        name: "Cosmic Clover", bg: "#f3effa", primary: "#d3bee6", shadow: "#e8e1f2",
        kaomojis: ["(✨🍀.🍀)", "(🌌°o°)", "(🔮•̀ᴗ•́)", "(🚀🌟‿🌟)", "✧(^ - ^)✧"],
        fonts: { s2: "𝒞ℴ𝓈𝓂𝒾𝒸 𝒞𝓁ℴ𝓋ℯ𝓇", s3: "ℭ𝔬𝔰𝔪𝔦ℭ  𝔬𝔳𝔢𝔯" }
    },
    {
        name: "Ruby Succulent", bg: "#fcf4f2", primary: "#f7cbc1", shadow: "#fae5e0",
        kaomojis: ["(🌸•‿•)", "(🪷´▿`)", "(๑>ᴗ<๑)💕", "(🌵`･ω･´)", "(☀️_☀️)🌵"],
        fonts: { s2: "ℛ...ℯ𝓃𝓉", s3: "ℜ𝔲𝔟𝔶𝔖𝔲𝔠𝔠𝔲𝔩ℯ𝔫𝔱" }
    },
    {
        name: "Bonsai Buddy", bg: "#faf5ef", primary: "#dec9b8", shadow: "#eddcd0",
        kaomojis: ["( ~.~ )", "(🍵_🍵)", "( `ᵕ` )🌸", "(o^^o)🌳", "(🥷•̀⤙•́)"],
        fonts: { s2: "ℬℴ𝓃𝓈𝒶𝒾 ℬ𝓊𝒹𝒹𝓎", s3: "𝔅𝔬𝔫𝔰𝔞𝔦𝔅𝔲𝔡𝔡𝔶" }
    },
    {
        name: "Lunar Moss", bg: "#f2f0f7", primary: "#cbc5f5", shadow: "#e4e1fa",
        kaomojis: ["(🌙💤.💤)", "(🛸★.★)", "(🌖𖦹⤙𖦹)", "(👾♫-.-)", "✧(☄️.☄️)✧"],
        fonts: { s2: "ℳℴ𝓈𝓈 𝒩𝒾ℊ𝒽𝓉", s3: "𝔏𝔲𝔫𝔞𝔯𝔐𝔬𝔰𝔰" }
    }
];

const stringFontTransformationMappers = {
    styleScript: {
        'A':'𝒜','B':'ℬ','C':'𝒞','D':'𝒟','E':'ℰ','F':'ℱ','G':'𝒢','H':'ℋ','I':'ℐ','J':'𝒥','K':'𝒦','L':'ℒ','M':'ℳ','N':'𝒩','O':'𝒪','P':'𝒫','Q':'𝒬','R':'ℛ','S':'𝒮','T':'𝒯','U':'𝒰','V':'𝒱','W':'𝒲','X':'𝒳','Y':'𝒴','Z':'𝒵',
        'a':'𝒶','b':'𝒷','c':'𝒸','d':'𝒹','e':'ℯ','f':'𝒻','g':'ℊ','h':'𝒽','i':'𝒾','j':'𝒿','k':'𝓀','l':'𝓁','m':'𝓂','n':'𝑛','o':'ℴ','p':'𝓅','q':'𝓆','r':'𝓇','s':'𝓈','t':'𝓉','u':'𝓊','v':'𝓋','w':'𝓌','x':'𝓍','y':'𝓎','z':'𝓏'
    },
    styleGothic: {
        'A':'𝔄','B':'𝔅','C':'ℭ','D':'𝔇','E':'𝔈','F':'𝔉','G':'𝔊','H':'𝔏','I':'ℑ','J':'𝔍','K':'𝔎','L':'𝔏','M':'𝔐','N':'𝔓','O':'𝔒','P':'𝔓','Q':'𝔔','R':'ℜ','S':'𝔖','T':'𝔗','U':'𝔘','V':'𝔙','W':'𝔚',// Change this line inside stringFontTransformationMappers.styleGothic:
'X':'𝔛','Y':'𝔜','Z':'ℨ',

        'a':'𝔞','b':'𝔟','c':'𝔠','d':'𝔡','e':'𝔢','f':'𝔣','g':'𝔤','h':'𝔥','i':'𝔦','j':'𝔧','k':'𝔨','l':'𝔩','m':'𝔪','n':'𝔫','o':'𝔬','p':'𝔭','q':'𝔮','r':'𝔯','s':'𝔰','t':'𝔱','u':'𝔲','v':'𝔳','w':'𝔴','x':'𝔵','y':'𝔶','z':'𝔷'
    }
};

window.addEventListener('DOMContentLoaded', () => {
    synchronizeLocalStorageData();
    executeLiveTimestampClockSync();
    handlePlantGenotypeChange();
    syncChecklistDOMDisplay();
    setupSandboxEngine();
    updateChoreTrackingDashboardUI();
    refreshNumericalTimerDisplayReadout();
    logWorkspaceEvent("Workspace node online.");
});
function renderProceduralPixelSproutSVG() {
    const targetSvgCanvas = document.getElementById('plant-svg');
    const levelDisplayBadgeNode = document.getElementById('level-badge');
    if (!targetSvgCanvas) return;

    levelDisplayBadgeNode.innerText = `Stage ${workspaceState.plantStage} / 5`;
    targetSvgCanvas.innerHTML = '';

    let potHTML = `<rect x="11" y="24" width="10" height="1" fill="#a1705a" /><rect x="10" y="25" width="12" height="5" fill="#b8836b" /><rect x="11" y="30" width="10" height="1" fill="#8c5b47" />`;
    let plantHTML = '';
    let stage = workspaceState.plantStage;
    let type = workspaceState.plantTypeIndex;

    if (type === 0) {
        if (stage >= 1) plantHTML += `<rect x="15" y="22" width="2" height="2" fill="#7ebd7e" />`;
        if (stage >= 2) plantHTML += `<rect x="15" y="17" width="2" height="5" fill="#5fa35f" /><rect x="13" y="19" width="2" height="1" fill="#7ebd7e" />`;
        if (stage >= 4) plantHTML += `<rect x="17" y="16" width="3" height="1" fill="#7ebd7e" /><rect x="12" y="15" width="3" height="1" fill="#5fa35f" />`;
        if (stage >= 5) plantHTML += `<rect x="14" y="12" width="4" height="4" fill="#f28a9b" /><rect x="15" y="13" width="2" height="1" fill="#fae896" />`;
    } else if (type === 1) {
        if (stage >= 1) plantHTML += `<rect x="15" y="21" width="2" height="3" fill="#4d7c57" />`;
        if (stage >= 2) plantHTML += `<rect x="13" y="18" width="6" height="2" fill="#689f75" /><rect x="15" y="16" width="2" height="3" fill="#4d7c57" />`;
        if (stage >= 4) plantHTML += `<rect x="11" y="14" width="10" height="2" fill="#8bc39a" />`;
        if (stage >= 5) plantHTML += `<rect x="9" y="11" width="14" height="2" fill="#aee4bd" />`;
    } else if (type === 2) {
        if (stage >= 1) plantHTML += `<rect x="15" y="21" width="2" height="3" fill="#704d9c" />`;
        if (stage >= 2) plantHTML += `<rect x="14" y="19" width="4" height="2" fill="#916bbd" />`;
        if (stage >= 4) plantHTML += `<rect x="12" y="16" width="3" height="3" fill="#b38cd9" /><rect x="17" y="16" width="3" height="3" fill="#b38cd9" />`;
        if (stage >= 5) plantHTML += `<rect x="14" y="13" width="4" height="3" fill="#d4adf7" /><circle cx="16" cy="11" r="2" fill="#ffd700" />`;
    } else if (type === 3) {
        if (stage >= 1) plantHTML += `<rect x="14" y="22" width="4" height="2" fill="#d96262" />`;
        if (stage >= 2) plantHTML += `<rect x="12" y="20" width="8" height="3" fill="#f28080" />`;
        if (stage >= 4) plantHTML += `<rect x="10" y="18" width="12" height="3" fill="#ff9e9e" />`;
        if (stage >= 5) plantHTML += `<rect x="9" y="15" width="14" height="4" fill="#ffb3b3" /><rect x="15" y="13" width="2" height="2" fill="#960018" />`;
    } else if (type === 4) {
        if (stage >= 1) plantHTML += `<rect x="15" y="21" width="2" height="3" fill="#7a5230" />`;
        if (stage >= 2) plantHTML += `<rect x="13" y="17" width="3" height="4" fill="#7a5230" /><rect x="16" y="16" width="3" height="2" fill="#426b42" />`;
        if (stage >= 4) plantHTML += `<rect x="10" y="15" width="4" height="3" fill="#7a5230" /><rect x="9" y="13" width="5" height="2" fill="#528252" />`;
        if (stage >= 5) plantHTML += `<rect x="12" y="11" width="9" height="4" fill="#6ba36b" /><rect x="14" y="8" width="5" height="3" fill="#99cc99" />`;
    } else if (type === 5) {
        if (stage >= 1) plantHTML += `<rect x="12" y="23" width="8" height="1" fill="#444163" />`;
        if (stage >= 2) plantHTML += `<rect x="10" y="22" width="12" height="2" fill="#5c5887" />`;
        if (stage >= 4) plantHTML += `<rect x="9" y="20" width="14" height="3" fill="#7b75b3" />`;
        if (stage >= 5) plantHTML += `<rect x="8" y="18" width="16" height="3" fill="#9b95db" /><circle cx="20" cy="14" r="1.5" fill="#ffffcc" />`;
    }

    targetSvgCanvas.innerHTML = potHTML + plantHTML;
}

function logWorkspaceEvent(logStringText) {
    const historicalBoxNode = document.getElementById('history-log-box');
    if (!historicalBoxNode) return;

    const placeholder = historicalBoxNode.querySelector('.history-empty-placeholder');
    if (placeholder) placeholder.remove();

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logRow = document.createElement('div');
    logRow.className = 'history-log-item-row';
    logRow.innerHTML = `<strong>[${timeStr}]</strong> ${logStringText}`;

    historicalBoxNode.appendChild(logRow);
    historicalBoxNode.scrollTop = historicalBoxNode.scrollHeight; 
    writeStateToLocalStorageMemory();
}
function executeLiveTimestampClockSync() {
    const clock = document.getElementById('live-clock');
    // Finds your date element container on the screen
    const dateDisplayNode = document.getElementById('live-date'); 
    
    const syncTimeTick = () => { 
        const now = new Date();
        
        // Updates the clock time if it exists
        if (clock) {
            clock.innerText = now.toLocaleTimeString(); 
        }
        
        // Dynamically forces your date container text to update its calendar layout live
        if (dateDisplayNode) {
            dateDisplayNode.innerText = now.toLocaleDateString([], { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
            });
        }
    };
    syncTimeTick();
    setInterval(syncTimeTick, 1000);
}

// ==========================================
// GOAL 2: DETAILED BOTANICAL IMAGINARY PARAGRAPHS
// ==========================================
function generateComprehensiveBotanicalImpactStatement(profileName, stageLevel) {
  // Clean up the name by making it lowercase so it always matches perfectly
  const cleanName = String(profileName).toLowerCase().trim();

  if (cleanName.includes("sprout")) {
    return `🌱 The active Thick Sprout node anchors your micro-ecosystem at Stage ${stageLevel}/5. This dense flora genotype absorbs vital pressurized water vapors from your active focus sessions, driving rapid cellular expansion and inflating its thick emerald stem architecture.`;
  } 
  else if (cleanName.includes("fern")) {
    return `🧚 The active Pixie Fern node anchors your micro-ecosystem at Stage ${stageLevel}/5. Flourishing under low-light ambient conditions, this delicate organism generates miniature bioluminescent spore rings that shimmer softly and purify surrounding workspace code stress patterns.`;
  } 
  else if (cleanName.includes("clover")) {
    return `🌌 The active Cosmic Clover node anchors your micro-ecosystem at Stage ${stageLevel}/5. It pulls kinetic energy directly from planetary rotations, triggering small localized gravity ripples that force its purple crowns to expand and mirror deep space stardust patterns.`;
  } 
  else if (cleanName.includes("succulent")) {
    return `💎 The active Ruby Succulent node anchors your micro-ecosystem at Stage ${stageLevel}/5. This rare rock-botanical hybrid locks high-heat thermal fluids into its thick glass-like petals, turning them into a deep, vivid glowing scarlet hue as your timer counts down.`;
  } 
  else if (cleanName.includes("buddy")) {
    return `🪴 The active Bonsai Buddy node anchors your micro-ecosystem at Stage ${stageLevel}/5. This sentient wood-spirit terminal responds to your systematic dashboard clicks, triggering automatic care routines that train its woody trunk to wrap elegantly around your interface layouts.`;
  } 
  else if (cleanName.includes("moss")) {
    return `🌙 The active Lunar Moss node anchors your micro-ecosystem at Stage ${stageLevel}/5. This creeping moss matrix captures glowing moonlight frequencies, injecting synthetic silver nutrients into your dashboard rootbed to make its velvet patches pulse in soft cyan hues.`;
  } 

  // Safe backup fallback text just in case the name doesn't match anything
  return `The active ${profileName} node anchors your micro-ecosystem, regulating oxygen production and atmospheric moisture balances. Scaling up to Stage ${stageLevel}/5, its expanded structural roots optimize water absorption and fortify organic links.`;
}

window.wipeAllPlantProgressMemory = function() {
    workspaceState.plantStage = 1;
    workspaceState.completedTaskCount = 0;
    renderProceduralPixelSproutSVG();
    const profile = genotypeAestheticProfiles[workspaceState.plantTypeIndex];
    document.getElementById('ecosystem-paragraph-text').innerHTML = generateComprehensiveBotanicalImpactStatement(profile.name, workspaceState.plantStage);
    logWorkspaceEvent("🚨 Progress metrics reset back to Stage 1.");
};

window.handlePlantGenotypeChange = function() {
    const selectElement = document.getElementById('plant-select');
    if(selectElement) workspaceState.plantTypeIndex = parseInt(selectElement.value);
    const profile = genotypeAestheticProfiles[workspaceState.plantTypeIndex];

    document.documentElement.style.setProperty('--bg-slate', profile.bg);
    document.documentElement.style.setProperty('--sage-green', profile.primary);
    document.documentElement.style.setProperty('--peach-cream', profile.shadow);

    logWorkspaceEvent(`Environment mutated to: <strong>${profile.name}</strong>`);
    renderProceduralPixelSproutSVG();
    populateKaomojisPack(profile.kaomojis);
    runFontTransformationPreviews();
    document.getElementById('ecosystem-paragraph-text').innerHTML = generateComprehensiveBotanicalImpactStatement(profile.name, workspaceState.plantStage);

    // 🐷 DYNAMIC PIGGY COLOR SYNC FIX:
    // Forces the piggy bank interface layout window to repaint using the new plant profile color assets instantly!
    if (typeof refreshPiggyBankVisualLayoutDisplay === 'function') {
        refreshPiggyBankVisualLayoutDisplay();
    }
};


function populateKaomojisPack(kaomojiArray) {
    const container = document.querySelector('.kaomoji-grid-layout');
    if (!container) return;
    container.innerHTML = '';
    kaomojiArray.forEach(str => {
        const span = document.createElement('span');
        span.className = 'kaomoji-pill';
        span.setAttribute('onclick', 'copyStringToClipboard(this)');
        span.innerText = str;
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
    localStorage.setItem('sproutOS_calibratedDataMemory_v16', JSON.stringify(dataObj));
}

function synchronizeLocalStorageData() {
    const saved = localStorage.getItem('sproutOS_calibratedDataMemory_v16');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            workspaceState.plantStage = data.plantStage || 1;
            workspaceState.plantTypeIndex = data.plantTypeIndex || 0;
            workspaceState.completedTaskCount = data.completedTaskCount || 0;
            workspaceState.choreMinutesAccumulated = data.choreMinutesAccumulated || 0;
            workspaceState.choreGoalTarget = data.choreGoalTarget || 15;
            if(workspaceState.plantStage > 5) workspaceState.plantStage = 5;
        } catch(e) { console.error("Storage load bypassed.", e); }
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
    logWorkspaceEvent(`Injected task: "${text}"`);
};

window.removeExistingTaskItem = function(idx) {
    const deleted = underlyingActiveTaskMemoryStore.splice(idx, 1);
    syncChecklistDOMDisplay();
    logWorkspaceEvent(`Purged task: "${deleted}"`);
};

window.processTaskCompletionTrigger = function(idx, checkbox) {
    if (checkbox.checked) {
        checkbox.disabled = true;
        checkbox.parentElement.parentElement.classList.add('completed');
        workspaceState.completedTaskCount++;

        logWorkspaceEvent(`Task audited! Progress: <strong>${workspaceState.completedTaskCount} / 3 Checks</strong>`);

        if (workspaceState.completedTaskCount >= 3) {
            workspaceState.completedTaskCount = 0;
            if (workspaceState.plantStage < 5) {
                workspaceState.plantStage++;
                logWorkspaceEvent("🎉 <strong>GROWTH RANK BOOST!</strong> Flora advanced!");
            }
            renderProceduralPixelSproutSVG();
            document.getElementById('ecosystem-paragraph-text').innerHTML = generateComprehensiveBotanicalImpactStatement(genotypeAestheticProfiles[workspaceState.plantTypeIndex].name, workspaceState.plantStage);
        }
        setTimeout(() => { underlyingActiveTaskMemoryStore.splice(idx, 1); syncChecklistDOMDisplay(); }, 500);
    }
};
// Inside script.js

// 1. A dictionary map that assigns an aesthetic font style name to each plant ID number
const plantFontMap = {
  "0": "style-standard", // Thick Sprout -> Clean Fredoka Font
  "1": "style-script",   // Pixie Fern -> Elegant Cursive Font
  "2": "style-gothic",   // Cosmic Clover -> Pixel/Gothic Font
  "3": "style-standard", // Ruby Succulent
  "4": "style-script",   // Bonsai Buddy
  "5": "style-gothic"    // Lunar Moss
};

// 2. Your updated plant handler function
function handlePlantGenotypeChange() {
  const plantSelect = document.getElementById('plant-select');
  if (!plantSelect) return;

  const selectedValue = plantSelect.value;

  // --- YOUR EXISTING PLANT CODE ---
  // (Keep whatever code you already had here that changes your SVG plant graphics!)
  console.log("Plant genotype changed to option ID: " + selectedValue);


  // --- ADDED FONT CHANGES BLOCK ---
  // Find your font preview container box element
  const fontInputPreview = document.getElementById('font-input');

  if (fontInputPreview) {
    // Get the matching font style name from our dictionary map above
    const newFontStyleClass = plantFontMap[selectedValue] || "style-standard";

    // Clear out any old font class tags first so they don't fight each other
    fontInputPreview.classList.remove('style-standard', 'style-script', 'style-gothic');

    // Inject the matching aesthetic class to change the typography style
    fontInputPreview.classList.add(newFontStyleClass);

    // Optional: Trigger a refresh of your font list if your preview system needs it
    if (typeof runFontTransformationPreviews === 'function') {
      runFontTransformationPreviews();
    }
  }
      // === FORCE PARAGRAPH UPDATE ON DROPDOWN CHANGE ===
  const textContainer = document.getElementById('ecosystem-paragraph-text');
  const plantMenu = document.getElementById('plant-select');
  const stageBadge = document.getElementById('level-badge');

  if (textContainer && plantMenu) {
    const currentName = plantMenu.options[plantMenu.selectedIndex].text.toLowerCase();
    const currentStage = stageBadge ? stageBadge.textContent.replace(/[^0-9]/g, '') || '1' : '1';

    if (currentName.includes("sprout")) {
      textContainer.textContent = `🌱 The active Thick Sprout node anchors your micro-ecosystem at Stage ${currentStage}/5. This dense flora genotype absorbs vital pressurized water vapors from your active focus sessions, driving rapid cellular expansion and inflating its thick emerald stem architecture.`;
    } else if (currentName.includes("fern")) {
      textContainer.textContent = `🧚 The active Pixie Fern node anchors your micro-ecosystem at Stage ${currentStage}/5. Flourishing under low-light ambient conditions, this delicate organism generates miniature bioluminescent spore rings that shimmer softly and purify surrounding workspace code stress patterns.`;
    } else if (currentName.includes("clover")) {
      textContainer.textContent = `🌌 The active Cosmic Clover node anchors your micro-ecosystem at Stage ${currentStage}/5. It pulls kinetic energy directly from planetary rotations, triggering small localized gravity ripples that force its purple crowns to expand and mirror deep space stardust patterns.`;
    } else if (currentName.includes("succulent")) {
      textContainer.textContent = `💎 The active Ruby Succulent node anchors your micro-ecosystem at Stage ${currentStage}/5. This rare rock-botanical hybrid locks high-heat thermal fluids into its thick glass-like petals, turning them into a deep, vivid glowing scarlet hue as your timer counts down.`;
    } else if (currentName.includes("buddy")) {
      textContainer.textContent = `🪴 The active Bonsai Buddy node anchors your micro-ecosystem at Stage ${currentStage}/5. This sentient wood-spirit terminal responds to your systematic dashboard clicks, triggering automatic care routines that train its woody trunk to wrap elegantly around your interface layouts.`;
    } else if (currentName.includes("moss")) {
      textContainer.textContent = `🌙 The active Lunar Moss node anchors your micro-ecosystem at Stage ${currentStage}/5. This creeping moss matrix captures glowing moonlight frequencies, injecting synthetic silver nutrients into your dashboard rootbed to make its velvet patches pulse in soft cyan hues.`;
    }
  }

}

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
            sparkle.style.cssText = `left: ${x}px; top: ${y}px; position: absolute; font-size: 1rem; pointer-events: none;`;
            sparkle.innerText = Math.random() > 0.5 ? '✨' : '⭐';
            activeSandbox.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 400);
        }
    });

    activeSandbox.addEventListener('click', (e) => {
        // Ignores clicks if you click directly on a creature so they don't stack up
        if (e.target.classList.contains('sandbox-companion')) return;
        
        const rect = activeSandbox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Randomly picks 1 of your 6 new pixel art drawings
        const totalSpritesCount = 6; 
        const randomizedIndexId = Math.floor(Math.random() * totalSpritesCount) + 1;
        
        const node = document.createElement('div');
        // Injects classes that draw the pixel backgrounds instead of innerText emojis!
        node.className = `sandbox-companion pixel-sprite-buddy-node sprite-id-${randomizedIndexId}`;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        
        // Makes clicking an individual animal delete it cleanly from your garden
        node.onclick = (event) => {
            event.stopPropagation();
            node.remove();
            if (typeof logWorkspaceEvent === 'function') {
                logWorkspaceEvent("Returned pixel companion back to nature.");
            }
        };
        
        activeSandbox.appendChild(node);
        
        if (typeof logWorkspaceEvent === 'function') {
            logWorkspaceEvent(`Hatched pixel companion ID: <strong>#${randomizedIndexId}</strong>`);
        }
    });
}


function updateChoreTrackingDashboardUI() {
    document.getElementById('chore-current').innerText = workspaceState.choreMinutesAccumulated;
    document.getElementById('chore-goal').innerText = workspaceState.choreGoalTarget;
}

window.syncGoalDropdownToInput = function(dropdownEl) {
    const customInput = document.getElementById('goal-custom-input');
    if (dropdownEl.value !== "custom") {
        customInput.value = dropdownEl.value;
        workspaceState.choreGoalTarget = parseInt(dropdownEl.value);
        updateChoreTrackingDashboardUI();
    }
};

window.syncGoalInputToDropdown = function(inputEl) {
    let val = parseInt(inputEl.value);
    if (isNaN(val) || val <= 0) val = 15;
    workspaceState.choreGoalTarget = val;
    updateChoreTrackingDashboardUI();
    const select = document.getElementById('goal-select');
    select.value = ["15", "30", "45", "60"].includes(val.toString()) ? val.toString() : "custom";
};

window.syncLogDropdownToInput = function(dropdownEl) {
    const customInput = document.getElementById('chore-custom-input');
    if (dropdownEl.value !== "custom") customInput.value = dropdownEl.value;
};

window.syncLogInputToDropdown = function(inputEl) {
    let val = parseInt(inputEl.value);
    if (isNaN(val) || val <= 0) val = 5;
    const select = document.getElementById('log-select');
    select.value = ["5", "15", "30"].includes(val.toString()) ? val.toString() : "custom";
};

window.executeChoreTimeLog = function() {
    const status = document.getElementById('hamster-status');
    const customInputNode = document.getElementById('chore-custom-input');
    const wheelTrackNode = document.getElementById('wheel-element');
    const hamsterSpriteNode = document.getElementById('hamster-element');

    // 1. BLOCKING BLOCK: If badge already says DONE, block inputs
    if (status && status.innerText === "DONE") {
        if (typeof logWorkspaceEvent === 'function') {
            logWorkspaceEvent("✨ Your target is complete! Reset the chores board to log a new goal.");
        }
        return; 
    }

    // 2. PARSE CHORE MINUTES SAFELY
    let mins = 5; 
    if (customInputNode && customInputNode.value) {
        let parsedMins = parseInt(customInputNode.value);
        if (!isNaN(parsedMins) && parsedMins > 0) {
            mins = parsedMins;
        }
    }

    // 3. UPDATE SYSTEM DATA STATE
    if (typeof workspaceState !== 'undefined' && workspaceState.choreMinutesAccumulated !== undefined) {
        workspaceState.choreMinutesAccumulated += mins;
    } else {
        if (!window.fallbackMinutes) window.fallbackMinutes = 0;
        window.fallbackMinutes += mins;
    }
    
    // 4. UPDATE VISUAL COUNTERS ON DASHBOARD
    if (typeof updateChoreTrackingDashboardUI === 'function') {
        updateChoreTrackingDashboardUI();
    }

    // 5. GET PROGRESS TARGET VALUES
    let currentProgress = 0;
    let targetGoal = 100;
    if (typeof workspaceState !== 'undefined') {
        currentProgress = workspaceState.choreMinutesAccumulated || 0;
        targetGoal = workspaceState.choreGoalTarget || 100;
    } else {
        currentProgress = window.fallbackMinutes || 0;
    }

    // 6. CHECK FOR GOAL COMPLETION CELEBRATION!
    if (currentProgress >= targetGoal) {
        // Make the hamster spin super fast for a victory lap!
        if (wheelTrackNode) wheelTrackNode.classList.add('spinning');
        if (hamsterSpriteNode) hamsterSpriteNode.classList.add('active-running');
        
        if (status) {
            status.innerText = "RUNNING";
            status.className = "status-badge state-active";
        }

        if (typeof logWorkspaceEvent === 'function') {
            logWorkspaceEvent(`Logged <strong>${mins} minutes</strong> of chores.`);
        }

        // Wait 1.5 seconds so the user sees the final run animation finish!
        setTimeout(() => {
            if (wheelTrackNode) wheelTrackNode.classList.remove('spinning');
            if (hamsterSpriteNode) hamsterSpriteNode.classList.remove('active-running');
            
            if (status) {
                status.innerText = "DONE";
                status.className = "status-badge state-done";
            }
            
            if (typeof logWorkspaceEvent === 'function') {
                logWorkspaceEvent("🎉 ── GOAL REACHED! ── 🎉 Your hamster helper is so proud of you! You crushed your chore target! 🐹✨");
            }
        }, 1500);

    } else {
        // NORMAL LOOP: Run hamster normally, then return to IDLE
        if (wheelTrackNode) wheelTrackNode.classList.add('spinning');
        if (hamsterSpriteNode) hamsterSpriteNode.classList.add('active-running');

        if (status) {
            status.innerText = "RUNNING";
            status.className = "status-badge state-active";
        }
        
        if (typeof logWorkspaceEvent === 'function') {
            logWorkspaceEvent(`Logged <strong>${mins} minutes</strong> of chores.`);
        }

        setTimeout(() => {
            let checkProgress = (typeof workspaceState !== 'undefined') ? workspaceState.choreMinutesAccumulated : (window.fallbackMinutes || 0);
            let checkTarget = (typeof workspaceState !== 'undefined') ? workspaceState.choreGoalTarget : 100;
            
            if (checkProgress < checkTarget) {
                if (wheelTrackNode) wheelTrackNode.classList.remove('spinning');
                if (hamsterSpriteNode) hamsterSpriteNode.classList.remove('active-running');
                if (status) {
                    status.innerText = "IDLE";
                    status.className = "status-badge state-idle";
                }
            }
        }, 1200);
    }
};





window.resetChoreTracker = function() {
    // 1. Reset your numerical numbers back to 0
    if (typeof workspaceState !== 'undefined') {
        workspaceState.choreMinutesAccumulated = 0;
    } else {
        window.fallbackMinutes = 0;
    }

    // 2. CLEAR THE "DONE" STATUS SHIELD LOCK (This is the missing piece!)
    const status = document.getElementById('hamster-status');
    const wheelTrackNode = document.getElementById('wheel-element');
    const hamsterSpriteNode = document.getElementById('hamster-element');

    if (status) {
        status.innerText = "IDLE";
        status.className = "status-badge state-idle"; // Clear out the done styling classes
    }

    // 3. Make sure animations are stopped cleanly
    if (wheelTrackNode) wheelTrackNode.classList.remove('spinning');
    if (hamsterSpriteNode) hamsterSpriteNode.classList.remove('active-running');

    // 4. Force the dashboard counters to redraw their text visuals
    if (typeof updateChoreTrackingDashboardUI === 'function') {
        updateChoreTrackingDashboardUI();
    }

    // 5. Post a confirmation note in your activity box
    if (typeof logWorkspaceEvent === 'function') {
        logWorkspaceEvent("🔄 Chore tracker progress has been fully reset. Ready for a new goal!");
    }
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
        if (btn) btn.innerText = "Start"; 
    } else { 
        workspaceState.timerActiveState = true; 
        if (btn) btn.innerText = "Pause"; 
        
        workspaceState.timerIntervalThread = setInterval(() => { 
            if (workspaceState.timerSecondsRemaining > 0) { 
                workspaceState.timerSecondsRemaining--; 
                refreshNumericalTimerDisplayReadout(); 
                
                // CRITICAL FIX: If it just hit 0 on this tick, ring IMMEDIATELY!
                if (workspaceState.timerSecondsRemaining === 0) {
                    clearInterval(workspaceState.timerIntervalThread); 
                    workspaceState.timerActiveState = false; 
                    if (btn) btn.innerText = "Start"; 
                    
                    // Call the improved loud ringtone
                    if (typeof playTimerChimeAlert === 'function') {
                        playTimerChimeAlert();
                    }
                    
                    logWorkspaceEvent("🔔 <strong>Countdown completed!</strong>"); 
                }
            } 
        }, 1000); 
    } 
};


window.executeTimerReset = function() {
    clearInterval(workspaceState.timerIntervalThread);
    workspaceState.timerActiveState = false;
    document.getElementById('start-btn').innerText = "Start";
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

function parseStringThroughFontCharacterMapping(str, map) { return str.split('').map(c => map[c] || c).join(''); }

window.copyStringToClipboard = function(el) {
    const text = el.innerText;
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('toast-element');
        toast.innerText = `Copied: "${text}"`;
        toast.classList.add('display-active');
        setTimeout(() => toast.classList.remove('display-active'), 2000);
    });
};

window.clearWorkspaceLogStorage = function() {
    localStorage.removeItem('sproutOS_calibratedDataMemory_v16');
    workspaceState.plantStage = 1;
    workspaceState.completedTaskCount = 0;
    workspaceState.choreMinutesAccumulated = 0;
    document.getElementById('history-log-box').innerHTML = '<div class="history-empty-placeholder">System standby.</div>';
    renderProceduralPixelSproutSVG();
    syncChecklistDOMDisplay();
    updateChoreTrackingDashboardUI();
    document.querySelectorAll('.sandbox-companion').forEach(el => el.remove());
    logWorkspaceEvent("Storage system reset.");
};
// Inside script.js (At the very bottom of the file)
function changeWorkspaceMusicTrack(selectedTrackUrl) {
  const audioPlayer = document.getElementById('workspace-audio-player');
  const audioSource = document.getElementById('audio-player-source');

  if (audioPlayer && audioSource) {
    // 1. Swap the media file link path
    audioSource.src = selectedTrackUrl;

    // 2. Force the browser node to load up the new file asset
    audioPlayer.load();

    // 3. Keep playing smoothly if the user was already listening
    audioPlayer.play().catch(error => {
      console.log("Playback standby. Waiting for user interaction trigger.");
    });
  }
}

// Inside script.js (Paste at the very bottom of the file)
// Inside script.js (Paste at the very bottom of the file)
function clearSandboxPlaygroundArea() {
  const sandboxContainer = document.getElementById('sandbox-container');
  if (!sandboxContainer) return;

  const companions = sandboxContainer.querySelectorAll('.sandbox-companion');
  companions.forEach(buddy => buddy.remove());

  const elementsToWipe = sandboxContainer.children;

  if (typeof logToActivityRegistry === 'function') {
    logToActivityRegistry("Sandbox playground cleared of all companion entities.");
  } else {
    console.log("Sandbox playground cleared.");
  } // <--- THIS WAS THE MISSING CLOSING BRACKET!

  for (let i = elementsToWipe.length - 1; i >= 0; i--) {
    const currentElement = elementsToWipe[i];
    if (!currentElement.classList.contains('sandbox-hint')) {
      currentElement.remove();
    }
  }
}

function playTimerChimeAlert() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const audioContextInstance = new AudioCtx();
    const playbackTime = audioContextInstance.currentTime;
    
    // Play 3 loud, clear digital alarm tones
    for (let index = 0; index < 3; index++) {
      const audioOscillator = audioContextInstance.createOscillator();
      const soundGainNode = audioContextInstance.createGain();
      
      audioOscillator.type = 'sine';
      audioOscillator.frequency.setValueAtTime(index % 2 === 0 ? 900 : 1100, playbackTime + (index * 0.25));
      
      // Volume boosted from 0.08 to 0.30 for clear hearing!
      soundGainNode.gain.setValueAtTime(0.30, playbackTime + (index * 0.25));
      soundGainNode.gain.exponentialRampToValueAtTime(0.001, playbackTime + (index * 0.25) + 0.22);
      
      audioOscillator.connect(soundGainNode);
      soundGainNode.connect(audioContextInstance.destination);
      
      audioOscillator.start(playbackTime + (index * 0.25));
      audioOscillator.stop(playbackTime + (index * 0.25) + 0.25);
    }
  } catch (error) {
    console.log("Audio layout engine notice: ", error);
  }
}
// 📦 1. INITIALIZE & BOOTSTRAP BALANCE FROM LOCALSTORAGE
// 📦 1. INITIALIZE DATA FROM STORAGE
window.loadPiggyBankDataOnBoot = function() {
    const savedCoins = localStorage.getItem('sproutOS_piggy_balance');
    window.currentPiggyCoinsBalance = savedCoins !== null ? parseInt(savedCoins) : 0;
    window.refreshPiggyBankVisualLayoutDisplay();
};

// 🖨️ 2. REDRAW DATA READOUT SCREENS
window.refreshPiggyBankVisualLayoutDisplay = function() {
    const displayNode = document.getElementById('piggy-balance-display');
    if (displayNode) displayNode.innerText = window.currentPiggyCoinsBalance;
};

// 🪙 3. ADD AND SPEND TRANSACTION ENGINE
window.modifyPiggyBankBalance = function(actionType) {
    const inputField = document.getElementById('piggy-amount-input');
    if (!inputField) return;

    let transactionAmount = parseInt(inputField.value);
    if (isNaN(transactionAmount) || transactionAmount <= 0) {
        if (typeof logWorkspaceEvent === 'function') logWorkspaceEvent("⚠️ Enter a valid coin amount first!");
        return;
    }

    if (actionType === 'add') {
        window.currentPiggyCoinsBalance += transactionAmount;
        
        // Trigger the vertical slot dropping sequence and bounce the pig body
        window.triggerFallingPixelCoinsShower(transactionAmount);
        window.makePigDanceJoyfully();
        
        if (typeof logWorkspaceEvent === 'function') {
            logWorkspaceEvent(`🪙 Deposited <strong>${transactionAmount} pixel coins</strong> into your piggy bank!`);
        }
    } else if (actionType === 'spend') {
        if (transactionAmount > window.currentPiggyCoinsBalance) {
            if (typeof logWorkspaceEvent === 'function') logWorkspaceEvent("⚠️ Not enough coins inside the piggy bank!");
            return;
        }
        window.currentPiggyCoinsBalance -= transactionAmount;
        window.makePigShakeDisappointedly();
        
        if (typeof logWorkspaceEvent === 'function') {
            logWorkspaceEvent(`💸 Spent <strong>${transactionAmount} pixel coins</strong> from your bank stash.`);
        }
    }

    localStorage.setItem('sproutOS_piggy_balance', window.currentPiggyCoinsBalance);
    window.refreshPiggyBankVisualLayoutDisplay();
    inputField.value = "";
};

// 🔄 4. FULL HARD RESET REMOVAL UTILITY
window.resetPiggyBankData = function() {
    if (confirm("Reset pixel bank?")) {
        window.currentPiggyCoinsBalance = 0;
        localStorage.setItem('sproutOS_piggy_balance', 0);
        window.refreshPiggyBankVisualLayoutDisplay();
        if (typeof logWorkspaceEvent === 'function') logWorkspaceEvent("🔨 Piggy bank reset back to zero!");
    }
};

// 🎯 5. THE TARGETED SLOT COIN INJECTION physics engine
window.triggerFallingPixelCoinsShower = function(coinCount) {
    const chamber = document.getElementById('pig-sandbox-chamber');
    if (!chamber) return;

    // Limit active blocks to keep rendering fast and clean
    let visualLimit = Math.min(coinCount, 8);

    for (let i = 0; i < visualLimit; i++) {
        const pixelCoinBlock = document.createElement('div');
        pixelCoinBlock.className = "true-pixel-coin-asset";
        
        // Stagger dropping timelines sequentially
        pixelCoinBlock.style.animationDelay = (i * 0.2) + "s";

        chamber.appendChild(pixelCoinBlock);

        // Delete the block instantly when it drops through the slot line cleanly
        setTimeout(() => { pixelCoinBlock.remove(); }, 600);
    }
};

// 🕺 6. TRIGGER THE VICTORY HOP
window.makePigDanceJoyfully = function() {
    const pig = document.getElementById('pixel-pig-sprite');
    if (!pig) return;
    pig.className = "pig-dancing-animation";
    setTimeout(() => { pig.className = ""; }, 600);
};

// 💢 7. TRIGGER THE DEFENSIVE LOSS SHAKE
window.makePigShakeDisappointedly = function() {
    const pig = document.getElementById('pixel-pig-sprite');
    if (!pig) return;
    pig.className = "pig-shaking-animation";
    setTimeout(() => { pig.className = ""; }, 400);
};

// 🏁 8. DOM LISTEN ENGINE BOOTSTRAPPER
document.addEventListener("DOMContentLoaded", () => {
    window.loadPiggyBankDataOnBoot();
});
// --- 📅 STANDALONE CELL CALENDAR COMPONENT ENGINE ---
let globalCalendarActiveDate = new Date();
let localCalendarRemindersDatabaseMemory = JSON.parse(localStorage.getItem('sproutOS_calendar_reminders_v1') || '{}');
let activeSelectedCalendarDateStringKey = null;

// Initialize background scheduler scanning sweeps once file reads loop out
setTimeout(() => {
    buildVisualCalendarGrid();
    setInterval(verifyScheduledCalendarNotificationAlarms, 30000); // Scans once every 30 seconds
}, 200);

function buildVisualCalendarGrid() {
    const daysGrid = document.getElementById('calendar-days-grid');
    const monthYearLabel = document.getElementById('calendar-month-year-label');
    if (!daysGrid || !monthYearLabel) return;

    daysGrid.innerHTML = '';
    
    const targetYear = globalCalendarActiveDate.getFullYear();
    const targetMonth = globalCalendarActiveDate.getMonth();

    // Sets header title strings dynamically
    const nameStringArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearLabel.innerText = `${nameStringArr[targetMonth]} ${targetYear}`;

    // Calculates variations in total month lengths cleanly
    const totalDaysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const leadingDayOfWeekIndex = new Date(targetYear, targetMonth, 1).getDay();

    // Spawns layout placeholders for trailing space padding offsets
    for (let i = 0; i < leadingDayOfWeekIndex; i++) {
        const spacer = document.createElement('div');
        spacer.className = 'calendar-day-tile empty-space';
        daysGrid.appendChild(spacer);
    }

    // Spawns actual functional date cells mapping days
    for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
        const tile = document.createElement('div');
        tile.className = 'calendar-day-tile';
        tile.innerText = dayNum;

        // Formats memory mapping lookup string patterns (YYYY-MM-DD)
        const currentTrackingDateKey = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        
        if (localCalendarRemindersDatabaseMemory[currentTrackingDateKey]) {
            tile.classList.add('has-reminder');
        }

        tile.onclick = () => revealCalendarReminderModalSheet(currentTrackingDateKey, dayNum, nameStringArr[targetMonth]);
        daysGrid.appendChild(tile);
    }
}

function shiftActiveCalendarMonth(directionOffsetAmount) {
    globalCalendarActiveDate.setMonth(globalCalendarActiveDate.getMonth() + directionOffsetAmount);
    buildVisualCalendarGrid();
}

// --- 📑 REVEAL MODAL PREVIEW AND POPULATE EXISTING ARRAY METRICS ---
function revealCalendarReminderModalSheet(dateKeyString, dateNumber, monthStringLabel) {
    activeSelectedCalendarDateStringKey = dateKeyString;
    const modal = document.getElementById('calendar-reminder-modal');
    const heading = document.getElementById('modal-date-heading');
    const textInput = document.getElementById('calendar-task-input');
    
    heading.innerText = `Milestones for ${monthStringLabel} ${dateNumber}`;
    textInput.value = ''; // Clears input box for a fresh entry
    
    // Automatically renders a clean list view of existing milestones inside the slider modal
    renderModalMilestoneItemsList(dateKeyString);
    modal.classList.remove('hidden-layout');
}

// Helper layout function to display list rows inside your modal popup
function renderModalMilestoneItemsList(dateKeyString) {
    let listContainer = document.getElementById('modal-milestones-list-view');
    
    // Lazy-creates the list block if it doesn't exist inside your editor layout container
    if (!listContainer) {
        listContainer = document.createElement('div');
        listContainer.id = 'modal-milestones-list-view';
        listContainer.style.cssText = 'max-height: 80px; overflow-y: auto; margin-bottom: 8px; display: flex; flex-direction: column; gap: 4px;';
        const inputFieldNode = document.getElementById('calendar-task-input');
        if (inputFieldNode) inputFieldNode.parentNode.insertBefore(listContainer, inputFieldNode);
    }
    
    listContainer.innerHTML = '';
    const dayRecordsArray = localCalendarRemindersDatabaseMemory[dateKeyString] || [];
    
    if (dayRecordsArray.length === 0) {
        listContainer.innerHTML = '<div style="font-size:0.75rem; color:#888; font-style:italic;">No tasks saved for today.</div>';
        return;
    }
    
    // Renders matching rows with independent ❌ buttons for each item entry
    dayRecordsArray.forEach((item, index) => {
        const itemRow = document.createElement('div');
        itemRow.style.cssText = 'display:flex; justify-content:space-between; align-items:center; background:#fafafa; border:1px solid #ddd; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600;';
        itemRow.innerHTML = `
            <span>⏰ <b>[${item.time}]</b> ${item.text}</span>
            <span style="cursor:pointer; color:#ff4d4d; margin-left:6px;" onclick="deleteSingleCalendarMilestoneItem('${dateKeyString}', ${index})">❌</span>
        `;
        listContainer.appendChild(itemRow);
    });
}

// --- 💾 APPEND AN ENTRY PROFILE TO THE ACTIVE ARRAY TARGET ---
function commitCalendarTaskToMemoryStore() {
    if (!activeSelectedCalendarDateStringKey) return;

    const textVal = document.getElementById('calendar-task-input').value.trim();
    const timeVal = document.getElementById('calendar-task-time').value;

    if (!textVal) return; // Ignores blank form actions

    // Initializes data slots as a clean list map if it was empty
    if (!Array.isArray(localCalendarRemindersDatabaseMemory[activeSelectedCalendarDateStringKey])) {
        localCalendarRemindersDatabaseMemory[activeSelectedCalendarDateStringKey] = [];
    }

    // Safely pushes the fresh milestone configuration entry to the list array
    localCalendarRemindersDatabaseMemory[activeSelectedCalendarDateStringKey].push({
        text: textVal,
        time: timeVal,
        triggered: false
    });

    localStorage.setItem('sproutOS_calendar_reminders_v1', JSON.stringify(localCalendarRemindersDatabaseMemory));
    
    if (typeof logWorkspaceEvent === 'function') {
        logWorkspaceEvent(`Added item entry to milestone register: <strong>${activeSelectedCalendarDateStringKey}</strong>`);
    }

    // Refresh view structures immediately without shutting down window panels
    document.getElementById('calendar-task-input').value = '';
    renderModalMilestoneItemsList(activeSelectedCalendarDateStringKey);
    buildVisualCalendarGrid();
}

// --- 🗑️ PURGE AN INDEPENDENT SUBROW BY KEY SELECTION INDEX ---
window.deleteSingleCalendarMilestoneItem = function(dateKeyString, itemIndex) {
    if (!localCalendarRemindersDatabaseMemory[dateKeyString]) return;
    
    localCalendarRemindersDatabaseMemory[dateKeyString].splice(itemIndex, 1);
    
    // Clears the empty memory key register slot entirely if no items remain
    if (localCalendarRemindersDatabaseMemory[dateKeyString].length === 0) {
        delete localCalendarRemindersDatabaseMemory[dateKeyString];
    }
    
    localStorage.setItem('sproutOS_calendar_reminders_v1', JSON.stringify(localCalendarRemindersDatabaseMemory));
    
    // Updates UI layers immediately
    renderModalMilestoneItemsList(dateKeyString);
    buildVisualCalendarGrid();
    
    if (typeof logWorkspaceEvent === 'function') {
        logWorkspaceEvent("Removed isolated schedule track row entry.");
    }
};


function verifyScheduledCalendarNotificationAlarms() {
    const now = new Date();
    const localDateStringKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const localTimeStringKey = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const matchCandidateArrayList = localCalendarRemindersDatabaseMemory[localDateStringKey];
    if (Array.isArray(matchCandidateArrayList)) {
        let updatedDatabaseStateFlag = false;

        // Iterates down over every assigned milestone saved under today's key
        matchCandidateArrayList.forEach(item => {
            if (!item.triggered && item.time === localTimeStringKey) {
                item.triggered = true;
                updatedDatabaseStateFlag = true;
                
                // Triggers browser native modal notifications instantly
                alert(`✨ SproutOS Milestone Reminder Alert! ✨\n\n📌 Task: ${item.text}`);
            }
        });

        if (updatedDatabaseStateFlag) {
            localStorage.setItem('sproutOS_calendar_reminders_v1', JSON.stringify(localCalendarRemindersDatabaseMemory));
        }
    }
}

// --- 🗑️ PURGE CALENDAR RECOVERY METRICS ACTION ---
window.clearAllCalendarPlannerReminders = function() {
    // Shows a native browser popup verification modal window to protect against accidental clicks
    if (confirm("Are you sure you want to clear your pixel planner? This will permanently wipe out all saved task items and active milestones!")) {
        
        // Destroys database object profiles entirely 
        localCalendarRemindersDatabaseMemory = {};
        
        // Clears out browser cache slots matching our system namespace key
        localStorage.removeItem('sproutOS_calendar_reminders_v1');
        
        // Closes the editor menu row overlay if it was open on a date cell
        hideCalendarReminderModalSheet();
        
        // Rebuilds the visual day block elements completely clean
        buildVisualCalendarGrid();
        
        // Logs updates directly to your system sidebar activity track history window if it's available
        if (typeof logWorkspaceEvent === 'function') {
            logWorkspaceEvent("🚨 <strong>Calendar cleared!</strong> All saved milestone tasks purged.");
        }
    }
};
// --- 🚪 MULTI-NAMING BUTTON OVERLAY FALLBACK CLOSER ---
window.hideCalendarReminderModalSheet = function() {
    const modalElementNode = document.getElementById('calendar-reminder-modal');
    if (modalElementNode) {
        // Instantly slides the item editor sheet back down out of the viewport view
        modalElementNode.classList.add('hidden-layout');
    }
};

// Alternate shortcut reference name layout fallback to handle both versions perfectly
window.hideCalendarReminderModalSheetAction = window.hideCalendarReminderModalSheet;


// --- 🔌 AUTOMATED SANDBOX BOOTSTRAPPER TRIGGER ---
setTimeout(() => {
    // Verifies the engine functions are configured properly before execution
    if (typeof setupSandboxEngine === 'function') {
        setupSandboxEngine();
        console.log("SproutOS Sandbox Engine linked successfully.");
    }
}, 800); // Waits a split second to guarantee your HTML elements are ready


