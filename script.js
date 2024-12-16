let timerElement = document.getElementById("timer");
let timesList = document.getElementById("times");
let scrambleElement = document.getElementById("scramble");

let startTime, elapsedTime = 0;
let running = false;
let waiting = false;
let times = JSON.parse(localStorage.getItem("times")) || []; // Load times from localStorage

let spacePressTime = null; // Variable to store the time when space is pressed
let holdingSpace = false; // Flag to check if spacebar is held

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

function startStopTimer() {
  if (running) {
    // Stop timer
    running = false;
    elapsedTime = Date.now() - startTime;
    const time = (elapsedTime / 1000).toFixed(2);
    saveTime(time);
    displayScramble();
    resetTimer();
  } else if (waiting) {
    // Timer hasn't started yet, so ignore the stop
  } else {
    // Start timer
    running = true;
    startTime = Date.now();
    timerElement.textContent = "0.00";
  }
}

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
    li.addEventListener("click", () => editTime(index));
    timesList.appendChild(li);
  });
}

function editTime(index) {
  const solve = times[index];
  const action = prompt(
    `Time: ${solve.time}\nScramble: ${solve.scramble}\nStatus: ${solve.status || "None"}\n\nEnter:\n+2 to add 2 seconds\nDNF to mark as Did Not Finish\ndelete to remove`
  );

  if (action === "+2") {
    solve.time = (parseFloat(solve.time) + 2).toFixed(2);
    solve.status = "+2";
  } else if (action === "DNF") {
    solve.status = "DNF";
  } else if (action === "delete") {
    times.splice(index, 1);
  }

  localStorage.setItem("times", JSON.stringify(times));
  renderTimes();
}

// Reset Timer and Color
function resetTimer() {
  timerElement.textContent = "0.00";
  timerElement.style.color = "white";
  holdingSpace = false;
  waiting = false;
}

function holdSpace(e) {
  if (e.code === "Space" && !waiting) {
    spacePressTime = Date.now();
    holdingSpace = true;
    timerElement.style.color = "green"; // Change timer color to green
  }
}

function releaseSpace(e) {
  if (e.code === "Space" && holdingSpace) {
    const holdDuration = (Date.now() - spacePressTime) / 1000;
    if (holdDuration >= 0.3) {
      waiting = false;
      startStopTimer();
    } else {
      resetTimer();
    }
    holdingSpace = false;
  }
}

// Event listeners for spacebar press and release
document.addEventListener("keydown", holdSpace);
document.addEventListener("keyup", releaseSpace);

// Initialize
displayScramble();
renderTimes();
