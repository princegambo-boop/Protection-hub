const dynamicLocalDatabase = [
    { name: "National GBV Helpline (HAK)", contact: "1195", type: "Toll-Free Helpline", description: "24/7 medical referral, crisis counseling, and physical rescue tracking options across Kenya." },
    { name: "Childline Kenya", contact: "116", type: "Toll-Free Helpline", description: "National reporting center for child protection, abuse management, and legal assistance tracking." },
    { name: "Gender Violence Recovery Centre (GVRC)", contact: "0709667000", type: "Medical Emergency", description: "Nairobi Women's Hospital 24hr line offering emergency medical care, PEP infrastructure, and shelter guidance." },
    { name: "FIDA Kenya Legal Aid", contact: "0800720501", type: "Legal Support", description: "Federation of Women Lawyers toll-free line for free advisory support and psycho-social resources." },
    { name: "COVAW Crisis Line", contact: "0800720553", type: "Toll-Free Helpline", description: "Coalition on Violence Against Women hotline for swift structural transition and safety housing updates." },
    { name: "LVCT Health (one2one)", contact: "1190", type: "Counseling Support", description: "Confidential youth-friendly hotline handling reproductive health guidance and direct local referrals." },
    { name: "National Police Emergency", contact: "999", type: "Law Enforcement", description: "Immediate deployment response for physical security threats and active security coordination." }
];

let liveCountdownInterval = null;
let currentEmergencyNumber = "999";
let breathingSequenceTimeout = null;
let breathingInterval = null;
let bancaResponseTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
    evaluateRegionalMetadata();
    setupDecoyNavigation();
    setupCalculatorEngine();
    setupMiniGame();
    setupCoreNavigation();
    renderNodes();
    setupBreathingEngine();
    setupDispatchEngine();
    setupBancaEngine();
});

function evaluateRegionalMetadata() {
    try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        if (timeZone.includes('America')) currentEmergencyNumber = "911";
        else if (timeZone.includes('Europe')) currentEmergencyNumber = "112";
        else currentEmergencyNumber = "999";
    } catch {
        currentEmergencyNumber = "999";
    }

    const displayNum = document.getElementById('detected-local-num');
    const callHref = document.getElementById('persistent-emergency-trigger');
    if (displayNum) displayNum.innerText = currentEmergencyNumber;
    if (callHref) callHref.setAttribute('href', `tel:${currentEmergencyNumber}`);
}

function setupDecoyNavigation() {
    const btnCalc = document.getElementById('tab-calc');
    const btnGame = document.getElementById('tab-game');
    const wrapCalc = document.getElementById('calc-wrapper');
    const wrapGame = document.getElementById('game-wrapper');
    if (!btnCalc || !btnGame || !wrapCalc || !wrapGame) return;

    btnCalc.addEventListener('click', () => {
        btnCalc.classList.add('active');
        btnGame.classList.remove('active');
        wrapCalc.classList.add('active');
        wrapGame.classList.remove('active');
    });

    btnGame.addEventListener('click', () => {
        btnGame.classList.add('active');
        btnCalc.classList.remove('active');
        wrapGame.classList.add('active');
        wrapCalc.classList.remove('active');
    });
}

function setupCalculatorEngine() {
    const display = document.getElementById('calc-display');
    const buttons = document.querySelectorAll('.calc-btn');
    if (!display || !buttons.length) return;

    let expression = '';

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const val = button.getAttribute('data-val');

            if (val === 'C') {
                expression = '';
                display.value = '0';
            } else if (val === 'del') {
                expression = expression.slice(0, -1);
                display.value = expression || '0';
            } else if (val === '=') {
                if (!expression) return;

                if (expression === '1010') {
                    revealSecretCrisisSuite();
                    expression = '';
                    display.value = '0';
                    return;
                }

                try {
                    if (/^[0-9.+\-*/\s]+$/.test(expression)) {
                        const result = new Function(`return (${expression})`)();
                        if (!Number.isFinite(result)) throw new Error();
                        display.value = Number.isInteger(result) ? String(result) : String(parseFloat(result.toFixed(4)));
                        expression = display.value;
                    } else {
                        throw new Error();
                    }
                } catch {
                    display.value = 'Error';
                    expression = '';
                }
            } else {
                const lastChar = expression.slice(-1);
                if (['+', '-', '*', '/'].includes(val) && ['+', '-', '*', '/'].includes(lastChar)) {
                    expression = expression.slice(0, -1) + val;
                } else {
                    if (expression === '' && ['+', '*', '/'].includes(val)) return;
                    expression += val;
                }
                display.value = expression;
            }
        });
    });
}

function revealSecretCrisisSuite() {
    const nav = document.getElementById('master-nav');
    if (nav) nav.classList.remove('hidden');

    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
    const radar = document.getElementById('radar-screen');
    if (radar) radar.classList.add('active');

    document.querySelectorAll('.nav-tab-item').forEach(t => t.classList.remove('active'));
    const radarTab = document.querySelector('[data-target="radar-screen"]');
    if (radarTab) radarTab.classList.add('active');
}

function setupCoreNavigation() {
    const tabs = document.querySelectorAll('.nav-tab-item');
    const screens = document.querySelectorAll('.app-screen');
    if (!tabs.length || !screens.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            screens.forEach(s => s.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.getAttribute('data-target');
            const targetScreen = document.getElementById(target);
            if (targetScreen) targetScreen.classList.add('active');
        });
    });
}

function setupBancaEngine() {
    const chatLog = document.getElementById('banca-chat-log');
    const userInput = document.getElementById('banca-user-input');
    const sendBtn = document.getElementById('banca-send-btn');
    const clearBtn = document.getElementById('clear-session-trigger');
    if (!chatLog || !userInput || !sendBtn || !clearBtn) return;

    const systemGreeting = () => {
        chatLog.innerHTML = `
            <div class="chat-bubble banca-msg">
                I am Banca, your Emergency Guidance Assistant. Tell me what is happening right now so I can guide you through safe, prioritized steps.
            </div>
        `;
    };

    const injectBancaBubble = (text) => {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble banca-msg';
        bubble.innerHTML = text;
        chatLog.appendChild(bubble);
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    systemGreeting();

    const processMessage = () => {
        const rawText = userInput.value.trim();
        if (!rawText) return;

        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble user-msg';
        userBubble.innerText = rawText;
        chatLog.appendChild(userBubble);
        userInput.value = '';
        chatLog.scrollTop = chatLog.scrollHeight;

        if (bancaResponseTimeout) clearTimeout(bancaResponseTimeout);
        bancaResponseTimeout = setTimeout(() => {
            const text = rawText.toLowerCase();

            if (text.includes("joke") || text.includes("weather") || text.includes("recipe") || text.includes("game")) {
                injectBancaBubble("This assistant is only for active emergency or safety guidance. Are you safe right now? Please tell me what is going on.");
                return;
            }

            if (text.includes("bleed") || text.includes("blood")) {
                injectBancaBubble(`Apply firm pressure to the wound now and call ${currentEmergencyNumber} immediately.`);
                return;
            }

            if (text.includes("unconscious") || text.includes("not breathing") || text.includes("breathing")) {
                injectBancaBubble(`Call ${currentEmergencyNumber} now. If they are not breathing, start CPR if you know how.`);
                return;
            }

            if (text.includes("weapon") || text.includes("gun") || text.includes("knife") || text.includes("attack") || text.includes("assault")) {
                injectBancaBubble(`Move to the nearest safe place you can lock or hide in, keep quiet, and call ${currentEmergencyNumber} now.`);
                return;
            }

            if (text.includes("fire")) {
                injectBancaBubble("Get low and move out now. Do not use elevators. Once outside, stay outside and call emergency services.");
                return;
            }

            if (text.includes("yes")) {
                injectBancaBubble("Understood. Tell me one specific detail about what changed.");
            } else if (text.includes("no")) {
                injectBancaBubble("Understood. Stay where you are and keep listening for movement.");
            } else {
                injectBancaBubble("Tell me one specific safety detail about what is happening right now.");
            }
        }, 700);
    };

    sendBtn.addEventListener('click', processMessage);
    userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') processMessage(); });
    clearBtn.addEventListener('click', systemGreeting);
}

function setupDispatchEngine() {
    const dispatchBtn = document.getElementById('dispatch-btn');
    const cancelBtn = document.getElementById('cancel-dispatch-btn');
    const formView = document.getElementById('dispatch-form-view');
    const trackingView = document.getElementById('dispatch-tracking-view');
    const headline = document.getElementById('tracking-headline');
    const subtext = document.getElementById('tracking-subtext');
    const countdownDisplay = document.getElementById('live-countdown');
    const unitsList = document.getElementById('active-units-list');
    if (!dispatchBtn || !cancelBtn || !formView || !trackingView || !headline || !subtext || !countdownDisplay || !unitsList) return;

    dispatchBtn.addEventListener('click', () => {
        const typeEl = document.getElementById('dispatch-type');
        const locationEl = document.getElementById('dispatch-location');
        if (!typeEl || !locationEl) return;

        const type = typeEl.value;
        const rawLocation = locationEl.value.trim();
        const locationStr = rawLocation || "Detected Node (Kiambu / Nairobi Hub)";

        formView.classList.add('hidden');
        trackingView.classList.remove('hidden');
        headline.innerText = "AI System Processing Request...";
        subtext.innerText = `Pinpointing responders near "${locationStr}"`;
        countdownDisplay.innerText = "--:--";
        unitsList.innerHTML = "";

        setTimeout(() => {
            headline.innerText = "Responders Successfully En Route";
            subtext.innerText = "Encrypted tactical communication line verified";

            let localUnits = [];
            if (type === 'medical') {
                localUnits = [
                    { name: "AMREF Response Team Echo", detail: "Ambulance Hub — 4.2km away" },
                    { name: "St. John Ambulance Support", detail: "Regional Clinic Unit — 7.1km away" }
                ];
            } else if (type === 'security') {
                localUnits = [
                    { name: "Local Area Patrol Unit", detail: "Rapid Deployment Vehicle — 2.8km away" },
                    { name: "Critical Security Node Alpha", detail: "Private Patrol Car — 5.0km away" }
                ];
            } else {
                localUnits = [
                    { name: "Emergency Field Unit 1", detail: "First Responder Core — 5.3km away" }
                ];
            }

            unitsList.innerHTML = localUnits.map(unit => `
                <div class="active-unit-card">
                    <h5>${unit.name}</h5>
                    <p>${unit.detail}</p>
                </div>
            `).join('');

            const totalSeconds = Math.floor(Math.random() * (900 - 480) + 480);
            startLiveArrivalCountdown(totalSeconds, countdownDisplay);
        }, 2200);
    });

    cancelBtn.addEventListener('click', () => {
        clearInterval(liveCountdownInterval);
        liveCountdownInterval = null;
        formView.classList.remove('hidden');
        trackingView.classList.add('hidden');
    });
}

function startLiveArrivalCountdown(duration, display) {
    clearInterval(liveCountdownInterval);
    liveCountdownInterval = null;

    let timer = duration;

    function updateDisplay() {
        const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
        const seconds = String(timer % 60).padStart(2, '0');
        display.innerText = `${minutes}:${seconds}`;

        if (timer <= 0) {
            clearInterval(liveCountdownInterval);
            liveCountdownInterval = null;
            display.innerText = "ARRIVED";
            const headline = document.getElementById('tracking-headline');
            if (headline) headline.innerText = "Responders Arrived At Destination";
            return;
        }

        timer -= 1;
    }

    updateDisplay();
    liveCountdownInterval = setInterval(updateDisplay, 1000);
}

function setupMiniGame() {
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('game-status');
    const resetBtn = document.getElementById('reset-game-btn');
    if (!cells.length || !statusText || !resetBtn) return;

    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let isGameActive = true;

    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = Number(cell.getAttribute('data-index'));
            if (Number.isNaN(index) || board[index] !== "" || !isGameActive) return;

            board[index] = currentPlayer;
            cell.innerText = currentPlayer;
            cell.style.color = currentPlayer === "X" ? "#0a84ff" : "#bf5af2";
            checkResult();
        });
    });

    function checkResult() {
        let won = false;
        for (const condition of winConditions) {
            if (board[condition[0]] && board[condition[0]] === board[condition[1]] && board[condition[0]] === board[condition[2]]) {
                won = true;
                break;
            }
        }

        if (won) {
            statusText.innerText = `Player ${currentPlayer} Wins!`;
            isGameActive = false;
            return;
        }

        if (!board.includes("")) {
            statusText.innerText = "Draw Match!";
            isGameActive = false;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.innerText = `Player ${currentPlayer}'s Turn`;
    }

    resetBtn.addEventListener('click', () => {
        board = ["", "", "", "", "", "", "", "", ""];
        isGameActive = true;
        currentPlayer = "X";
        statusText.innerText = "Player X's Turn";
        cells.forEach(cell => {
            cell.innerText = "";
            cell.style.color = "";
        });
    });
}

function renderNodes() {
    const container = document.getElementById('resources-container');
    if (!container) return;

    container.innerHTML = dynamicLocalDatabase.map(node => `
        <div class="node-card">
            <div class="node-info">
                <h3>${node.name}</h3>
                <p style="color: #0a84ff; font-size: 0.75rem; font-weight:500; margin-bottom:2px;">${node.type} • ${node.contact}</p>
                <p>${node.description}</p>
            </div>
            <div><a href="tel:${node.contact}" class="call-btn">CALL</a></div>
        </div>
    `).join('');
}

function setupBreathingEngine() {
    const bubble = document.getElementById('breath-bubble');
    const instruction = document.getElementById('breath-instruction');
    const timerText = document.getElementById('breath-timer');
    if (!bubble || !instruction || !timerText) return;

    const cycleTime = 4;

    function clearBreathingTimers() {
        if (breathingSequenceTimeout) clearTimeout(breathingSequenceTimeout);
        if (breathingInterval) clearInterval(breathingInterval);
        breathingSequenceTimeout = null;
        breathingInterval = null;
    }

    function updateCountdown(seconds, onComplete) {
        clearBreathingTimers();
        let current = seconds;
        timerText.innerText = String(current).padStart(2, '0');

        breathingInterval = setInterval(() => {
            current -= 1;
            timerText.innerText = String(Math.max(current, 0)).padStart(2, '0');
            if (current <= 0) {
                clearBreathingTimers();
                onComplete();
            }
        }, 1000);
    }

    function runBreathingSequence() {
        instruction.innerText = "Inhale";
        bubble.className = "breathing-circle inhale";
        updateCountdown(cycleTime, () => {
            instruction.innerText = "Hold";
            bubble.className = "breathing-circle";
            breathingSequenceTimeout = setTimeout(() => {
                updateCountdown(cycleTime, () => {
                    instruction.innerText = "Exhale";
                    bubble.className = "breathing-circle exhale";
                    breathingSequenceTimeout = setTimeout(runBreathingSequence, 0);
                });
            }, 0);
        });
    }

    runBreathingSequence();
}
