let timerElement = document.getElementById("timer");
let timesList = document.getElementById("times");
let scrambleElement = document.getElementById("scramble");
let bestSingleElement = document.getElementById("bestSingle");
let bestAo5Element = document.getElementById("bestAo5");
let bestAo12Element = document.getElementById("bestAo12");
let bestAo100Element = document.getElementById("bestAo100");

let startTime = null;
let elapsedTime = 0;
let running = false;
let holdStartTime = null;
let isReady = false;
let times = JSON.parse(localStorage.getItem("times")) || [];
let timerInterval = null;

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

function startTimer() {
  startTime = Date.now();
  elapsedTime = 0; // Reset elapsed time when starting
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    timerElement.textContent = formatTime(elapsedTime);
  }, 10); // Update every 10ms for smoother display
}

function stopTimer() {
  clearInterval(timerInterval);
  elapsedTime = Date.now() - startTime;
  const time = (elapsedTime / 1000).toFixed(2);
  saveTime(time);
}

function saveTime(time) {
  const scramble = scrambleElement.textContent;
  const solve = { time, scramble, status: "" };
  times.push(solve);
  localStorage.setItem("times", JSON.stringify(times));
  renderTimes();
  updateStatistics(); // Update stats (best single, Ao5, Ao12) after saving the time
}

function renderTimes() {
  timesList.innerHTML = "";
  times.forEach((solve, index) => {
    const li = document.createElement("li");
    li.textContent = formatTimeDisplay(solve.time) + " " + solve.status;
    li.addEventListener("click", () => editTime(index));
    timesList.appendChild(li);
  });
}

function updateStatistics() {
  const sortedTimes = times.map((solve) => parseFloat(solve.time)).sort((a, b) => a - b);

  // Update best single
  const bestSingle = sortedTimes[0];
  bestSingleElement.textContent = `Best Single: ${formatTime(bestSingle)}`;

  // Calculate and update best Ao5
  const ao5 = calculateAverage(sortedTimes.slice(0, 5));
  bestAo5Element.textContent = `Best Ao5: ${formatTime(ao5)}`;

  // Calculate and update best Ao12
  const ao12 = calculateAverage(sortedTimes.slice(0, 12));
  bestAo12Element.textContent = `Best Ao12: ${formatTime(ao12)}`;

  // Calculate and update best Ao100 (if there are 100 solves)
  const ao100 = calculateAverage(sortedTimes.slice(0, 100));
  bestAo100Element.textContent = `Best Ao100: ${formatTime(ao100)}`;
}

function calculateAverage(timesArray) {
  if (timesArray.length === 0) return 0; // Return 0 if no times

  const sum = timesArray.reduce((acc, time) => acc + time, 0);
  return sum / timesArray.length;
}

function formatTime(ms) {
  return (ms / 1000).toFixed(2); // Format time to 2 decimal places
}

function formatTimeDisplay(time) {
  // Remove any unnecessary prefixes or formatting for display
  return parseFloat(time).toFixed(2); // Ensure only normal time is displayed
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
  updateStatistics(); // Recalculate statistics after editing a time
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();

    if (!running && !holdStartTime) {
      holdStartTime = Date.now();
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    e.preventDefault();

    if (!running) {
      const holdDuration = Date.now() - holdStartTime;
      holdStartTime = null;

      if (isReady && holdDuration >= 150) {
        // Start the timer
        running = true;
        isReady = false;
        timerElement.textContent = "0.00"; // Reset only when starting
        startTimer();
        timerElement.style.color = "#ffffff"; // Reset color
      } else {
        resetTimerAppearance();
      }
    } else {
      // Stop the timer
      running = false;
      stopTimer();
      displayScramble();
    }
  }
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    const holdDuration = Date.now() - holdStartTime;

    if (!running && holdDuration >= 300) {
      // Ready to start
      isReady = true;
      timerElement.style.color = "#00ff00"; // Green color when ready
    }
  }
});

function resetTimerAppearance() {
  timerElement.style.color = "#ffffff"; // Reset to default color
}

// Initialize
displayScramble();
renderTimes();
updateStatistics(); // Initialize stats on page load
