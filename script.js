// Timer and scramble variables
let scrambleElement = document.getElementById("scramble");
let timerElement = document.getElementById("timer");
let timesList = document.getElementById("times");

let running = false;
let startTime = 0;
let elapsedTime = 0;
let times = JSON.parse(localStorage.getItem("times")) || [];

// Generate a scramble
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

// Render times on the list
function renderTimes() {
  timesList.innerHTML = "";
  times.forEach((solve, index) => {
    const li = document.createElement("li");
    li.textContent = `${solve.time} ${solve.status}`;
    li.addEventListener("click", () => editTime(index));
    timesList.appendChild(li);
  });
}

// Edit a specific solve
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

// Timer start/stop logic
function startStopTimer() {
  if (running) {
    // Stop timer
    running = false;
    elapsedTime = Date.now() - startTime;
    const time = (elapsedTime / 1000).toFixed(2);
    saveTime(time);
    displayScramble();
  } else {
    // Start timer
    running = true;
    startTime = Date.now();
    timerElement.textContent = "0.00";
  }
}

// Save the current time
function saveTime(time) {
  const scramble = scrambleElement.textContent;
  const solve = { time, scramble, status: "" };
  times.push(solve);
  localStorage.setItem("times", JSON.stringify(times));
  renderTimes();
}

// Timer rendering logic
function updateTimer() {
  if (running) {
    const currentTime = ((Date.now() - startTime) / 1000).toFixed(2);
    timerElement.textContent = currentTime;
    requestAnimationFrame(updateTimer);
  }
}

// Event listeners
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (!running) {
      timerElement.style.color = "green"; // Ready state
      setTimeout(() => {
        timerElement.style.color = "white";
        if (!running && e.repeat === false) {
          startStopTimer();
          updateTimer();
        }
      }, 300);
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space" && running) {
    startStopTimer();
  }
});

// Initialize the app
displayScramble();
renderTimes();
