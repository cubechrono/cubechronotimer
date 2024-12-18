const scrambleElement = document.getElementById("scramble");
const timerElement = document.getElementById("timer");
const timesList = document.getElementById("times");
const sessionsElement = document.getElementById("sessions");
const bestSingleElement = document.getElementById("best-single");
const bestAo5Element = document.getElementById("best-ao5");
const bestAo12Element = document.getElementById("best-ao12");

let sessions = JSON.parse(localStorage.getItem("sessions")) || { "Default": [] };
let currentSession = "Default";

let startTime = null;
let elapsedTime = 0;
let running = false;
let timerInterval = null;
let holdStartTime = null;
let isReady = false;

// Generate and display scramble
function generateScramble() {
  const moves = ["R", "L", "U", "D", "F", "B"];
  const suffixes = ["", "'", "2"];
  let scramble = [];
  let lastMove = "";

  for (let i = 0; i < 20; i++) {
    let move;
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
    } while (move === lastMove);
    lastMove = move;
    scramble.push(move + suffixes[Math.floor(Math.random() * suffixes.length)]);
  }

  return scramble.join(" ");
}

function displayScramble() {
  scrambleElement.textContent = generateScramble();
}

// Timer start/stop
function startTimer() {
  startTime = Date.now();
  elapsedTime = 0;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    timerElement.textContent = (elapsedTime / 1000).toFixed(2);
  }, 10);
}

function stopTimer() {
  clearInterval(timerInterval);
  const time = (elapsedTime / 1000).toFixed(2);
  saveTime(time);
}

// Save and render times
function saveTime(time) {
  const scramble = scrambleElement.textContent;
  const solve = { time, scramble };
  sessions[currentSession].push(solve);
  localStorage.setItem("sessions", JSON.stringify(sessions));
  renderTimes();
}

function renderTimes() {
  timesList.innerHTML = "";
  const times = sessions[currentSession] || [];
  times.forEach((solve) => {
    const li = document.createElement("li");
    li.textContent = `${solve.time} - ${solve.scramble}`;
    timesList.appendChild(li);
  });
  updateStats();
}

// Sessions
function renderSessions() {
  sessionsElement.innerHTML = "";
  for (const session in sessions) {
    const button = document.createElement("button");
    button.textContent = session;
    button.addEventListener("click", () => switchSession(session));
    sessionsElement.appendChild(button);
  }
}

function switchSession(session) {
  currentSession = session;
  renderTimes();
}

// Statistics
function updateStats() {
  const times = sessions[currentSession].map((solve) => parseFloat(solve.time));
  if (times.length > 0) {
    bestSingleElement.textContent = Math.min(...times).toFixed(2);
  }

  function calculateAo(times, n) {
    if (times.length < n) return "N/A";
    const relevantTimes = times.slice(-n).sort((a, b) => a - b);
    relevantTimes.pop();
    relevantTimes.shift();
    const avg = relevantTimes.reduce((a, b) => a + b, 0) / (n - 2);
    return avg.toFixed(2);
  }

  bestAo5Element.textContent = calculateAo(times, 5);
  bestAo12Element.textContent = calculateAo(times, 12);
}

// Event listeners
document.getElementById("add-session").addEventListener("click", () => {
  const newSessionName = document.getElementById("new-session-name").value.trim();
  if (newSessionName && !sessions[newSessionName]) {
    sessions[newSessionName] = [];
    localStorage.setItem("sessions", JSON.stringify(sessions));
    renderSessions();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (!running && !holdStartTime) {
      holdStartTime = Date.now();
      isReady = true; // Mark ready when key is pressed
      timerElement.style.color = "#00ff00"; // Green color
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    const holdDuration = Date.now() - holdStartTime;
    holdStartTime = null;

    if (isReady && holdDuration >= 150) {
      if (!running) {
        running = true;
        timerElement.textContent = "0.00";
        startTimer();
        timerElement.style.color = "#ffffff"; // Reset color
      } else {
        running = false;
        stopTimer();
        displayScramble();
      }
    } else {
      isReady = false;
      timerElement.style.color = "#ffffff"; // Reset color
    }
  }
});

// Initialize
displayScramble();
renderSessions();
renderTimes();
