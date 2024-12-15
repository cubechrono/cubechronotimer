// Possible cube moves
const moves = ['U', 'D', 'L', 'R', 'F', 'B'];
const inverses = {
    'U': 'U\'', 'U\'': 'U',
    'D': 'D\'', 'D\'': 'D',
    'L': 'L\'', 'L\'': 'L',
    'R': 'R\'', 'R\'': 'R',
    'F': 'F\'', 'F\'': 'F',
    'B': 'B\'', 'B\'': 'B'
};

// Function to generate a random scramble
function generateScramble(numMoves) {
    let scramble = [];
    let lastMove = null;

    for (let i = 0; i < numMoves; i++) {
        let randomMove;
        let moveModifier = ''; // Start with no modifier

        // Pick a random move
        do {
            randomMove = moves[Math.floor(Math.random() * moves.length)];
        } while (lastMove && inverses[lastMove] === randomMove); // Avoid inverse of the last move

        // Randomly add a modifier (R2 or R')
        if (Math.random() < 0.1) { // 10% chance to add '2' (R2)
            moveModifier = '2';
        } else if (Math.random() < 0.2) { // 20% chance to add ' (inverse)
            moveModifier = '\'';
        }

        // Ensure the current move is not the same as the last one, even with modifiers
        while (scramble[scramble.length - 1] && scramble[scramble.length - 1].startsWith(randomMove)) {
            randomMove = moves[Math.floor(Math.random() * moves.length)];
            moveModifier = ''; // Reset modifier if we change the move
        }

        // Add the move with the modifier
        scramble.push(randomMove + moveModifier);
        lastMove = randomMove; // Store the last move for inverse checking
    }
    return scramble.join(' ');
}

// Display the scramble
function displayScramble() {
    const scramble = generateScramble(20); // Generate a scramble with 20 moves
    document.getElementById("scrambleDisplay").textContent = scramble;
}

// Apply the settings (remains unchanged from previous example)
function applySettings() {
    document.body.style.backgroundColor = document.getElementById("bgColor").value;
    document.getElementById("timerDisplay").style.color = document.getElementById("timeColor").value;
    document.getElementById("timerDisplay").style.backgroundColor = document.getElementById("boxColor").value;
    document.getElementById("timeList").style.backgroundColor = document.getElementById("listColor").value;
    document.body.style.fontFamily = document.getElementById("fontFamily").value;
    document.body.style.fontSize = `${document.getElementById("fontSize").value}px`;
    document.getElementById("timerDisplay").style.fontSize = `${document.getElementById("timeFontSize").value}px`;
    document.getElementById("scrambleDisplay").style.fontSize = `${document.getElementById("scrambleFontSize").value}px`;
    document.getElementById("scrambleDisplay").style.fontFamily = document.getElementById("scrambleFontFamily").value;
}

// Timer logic (remains unchanged from previous example)
let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let pastTimes = []; 
let spacePressCount = 0; 

const timerDisplay = document.getElementById("timerDisplay");
const timeList = document.getElementById("timeList");

function startStopTimer() {
    if (spacePressCount === 0) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 10);
        isRunning = true;
        spacePressCount++;
    } else if (spacePressCount === 1) {
        clearInterval(timerInterval);
        isRunning = false;
        saveTime();
        displayScramble(); 
        spacePressCount++;
    } else if (spacePressCount === 2) {
        resetTimer();
        spacePressCount = 0;
    }
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    let timeInSeconds = elapsedTime / 1000;
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = (timeInSeconds % 60).toFixed(2);
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    elapsedTime = 0;
    timerDisplay.textContent = "0.00";
}

function saveTime() {
    let timeInSeconds = elapsedTime / 1000;
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = (timeInSeconds % 60).toFixed(2);
    let timeString = `${minutes}:${seconds}`;
    pastTimes.push(timeString);
    updateTimesList();
}

function updateTimesList() {
    timeList.innerHTML = ""; 
    pastTimes.forEach(time => {
        const li = document.createElement("li");
        li.textContent = time;
        timeList.appendChild(li);
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === " ") {
        e.preventDefault();
        startStopTimer(); 
    }
});

document.getElementById("settingsButton").addEventListener('click', function() {
    const settingsMenu = document.getElementById("settingsMenu");
    settingsMenu.style.display = settingsMenu.style.display === "none" ? "block" : "none";
});
