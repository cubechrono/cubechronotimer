let timerElement = document.getElementById("timer");
let scrambleElement = document.getElementById("scramble");
let timesList = document.getElementById("times");

let startTime = null;
let elapsedTime = 0;
let running = false;
let holdStartTime = null;
let isReady = false;
let times = JSON.parse(localStorage.getItem("times")) || [];
let timerInterval = null;

// Mobile-specific event handling
let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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

// Start and stop timer
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
  elapsedTime = Date.now() - startTime;
  const time = (elapsedTime / 1000).toFixed(2);
  saveTime(time);
}

// Save and render times
function saveTime(time) {
  const scramble = scrambleElement.textContent;
  const solve = { time, scramble, status: "" };
  times.push(solve);
  localStorage.setItem("times", JSON.stringify(times));
  renderTimes();
}

function renderTimes() {
  timesList.innerHTML = "";
  times.forEach((solve, index) => {
    const li = document.createElement("li");
    li.textContent = `${solve.time} ${solve.status}`;
    timesList.appendChild(li);
  });
}

function toggleTimer() {
  if (running) {
    running = false;
    stopTimer();
    displayScramble();
  } else {
    running = true;
    startTimer();
  }
}

// Mobile touch handler
if (isMobile) {
  const mobileButton = document.getElementById("mobile-timer");
  mobileButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    holdStartTime = Date.now();
  });

  mobileButton.addEventListener("touchend", (e) => {
    e.preventDefault();
    const holdDuration = Date.now() - holdStartTime;

    if (holdDuration >= 150) {
      toggleTimer();
    }
    holdStartTime = null;
  });
}

// Initialize
displayScramble();
renderTimes();
