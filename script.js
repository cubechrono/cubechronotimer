let timerElement = document.getElementById("timer");
let timesList = document.getElementById("times");
let scrambleElement = document.getElementById("scramble");

let startTime, elapsedTime = 0;
let running = false;
let times = JSON.parse(localStorage.getItem("times")) || []; // Load times from localStorage

// Function to generate a random scramble
function generateScramble() {
  const moves = ["R", "L", "U", "D", "F", "B"];
  const suffixes = ["", "'", "2"];
  let scramble = [];
  let lastMove = "";

  for (let i = 0; i < 20; i++) {
    let move;
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
    } while (move === lastMove); // Prevent two consecutive moves from being the same
    lastMove = move;
    
    // Randomly choose a suffix ('', "'", or '2') to generate a move
    scramble.push(move + suffixes[Math.floor(Math.random() * suffixes.length)]);
  }

  return scramble.join(" ");
}

// Display scramble in the DOM
function displayScramble() {
  scrambleElement.textContent = generateScramble();
}

// Start/Stop the timer
function startStopTimer() {
  if (running) {
    // Stop the timer
    running = false;
    elapsedTime = Date.now() - startTime;
    const time = (elapsedTime / 1000).toFixed(2);
    saveTime(time);
    displayScramble(); // Show a new scramble after the timer stops
  } else {
    // Start the timer
    running = true;
    startTime = Date.now();
    timerElement.textContent = "0.00"; // Reset timer display
  }
}

// Save time and scramble to localStorage
function saveTime(time) {
  const scramble = scrambleElement.textContent;
  const solve = { time, scramble, status: "" };
  times.push(solve);
  localStorage.setItem("times", JSON.stringify(times)); // Save to localStorage
  renderTimes(); // Update the times list
}

// Render saved times in the list
function renderTimes() {
  timesList.innerHTML = ""; // Clear existing list
  times.forEach((solve, index) => {
    const li = document.createElement("li");
    li.textContent = `${solve.time} ${solve.status}`;
    li.addEventListener("click", () => editTime(index)); // Allow editing on click
    timesList.appendChild(li);
  });
}

// Edit a specific time in the list
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

  localStorage.setItem("times", JSON.stringify(times)); // Update localStorage
  renderTimes(); // Re-render the list
}

// Event listener for key press to start/stop the timer (Space key)
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    startStopTimer();
  }
});

// Initialize the app
displayScramble();
renderTimes();
