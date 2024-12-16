let timerElement = document.getElementById("timer");
let timesList = document.getElementById("times");
let scrambleElement = document.getElementById("scramble");

let startTime, elapsedTime = 0;
let running = false;
let times = JSON.parse(localStorage.getItem("times")) || []; // Load times from localStorage
let startDelay = 0; // To handle delay before starting the timer

// Generate a random scramble
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

// Display the scramble
function displayScramble() {
  scrambleElement.textContent = generateScramble();
}

// Start or stop the timer
function startStopTimer() {
  if (running) {
    // Stop the timer
    running = false;
    elapsedTime = Date.now() - startTime;
    const time = (elapsedTime / 1000).toFixed(2);
    saveTime(time);
    displayScramble();
    timerElement.textContent = time; // Show the final time on the timer
  } else {
    // Start the timer
    running = true;
    startTime = Date.now() - startDelay; // Set the time to the delay, to avoid offsetting the start
    timerElement.textContent = "0.00"; // Reset the timer to 0
    timerElement.style.color = "green"; // Turn the timer green when it starts

    // Update the timer every 10ms to reflect elapsed time
    requestAnimationFrame(updateTimer);
  }
}

// Save the time to localStorage and render the times list
function saveTime(time) {
  const scramble = scrambleElement.textContent;
  const solve = { time, scramble, status: "" };
  times.push(solve);
  localStorage.setItem("times", JSON.stringify(times));
  renderTimes();
}

// Render the times list
function renderTimes() {
  timesList.innerHTML = "";
  times.forEach((solve, index) => {
    const li = document.createElement("li");
    li.textContent = `${solve.time} ${solve.status}`;
    li.addEventListener("click", () => editTime(index));
    timesList.appendChild(li);
  });
}

// Edit the time (add +2, DNF, delete)
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

// Handle the space key to start or stop the timer
let spacePressed = false;
let startTimeout;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (!spacePressed) {
      spacePressed = true;
      startTimeout = setTimeout(() => {
        startStopTimer();
        spacePressed = false;
      }, 300); // Wait 0.3 seconds before starting
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    clearTimeout(startTimeout); // Cancel the start if the space key is released too early
  }
});

// Update the timer every frame when running
function updateTimer() {
  if (running) {
    elapsedTime = Date.now() - startTime;
    timerElement.textContent = (elapsedTime / 1000).toFixed(2);
    requestAnimationFrame(updateTimer); // Keep updating the timer
  }
}

// Initialize
displayScramble();
renderTimes();
