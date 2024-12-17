let timerElement = document.getElementById("timer");
let startStopButton = document.getElementById("start-stop");
let timesList = document.getElementById("sessions");
let scrambleElement = document.getElementById("scramble");
let sessionNameInput = document.getElementById("session-name");

let startTime = null;
let elapsedTime = 0;
let running = false;
let holdStartTime = null;
let isReady = false;
let times = JSON.parse(localStorage.getItem("times")) || [];
let sessions = JSON.parse(localStorage.getItem("sessions")) || [];
let timerInterval = null;

let bestSingle = 0;
let bestAO5 = 0;
let bestAO12 = 0;

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
  elapsedTime = 0;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    timerElement.textContent = (elapsedTime / 1000).toFixed(2);
  }, 10); // Update every 10ms for smoother display
}

function stopTimer() {
  clearInterval(timerInterval);
  elapsedTime = Date.now() - startTime;
  const time = (elapsedTime / 1000).toFixed(2);
  saveTime(time);
  updateBestTimes(time);
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

function resetTimerAppearance() {
  timerElement.style.color = "#ffffff"; // Reset to default color
}

function updateBestTimes(time) {
  if (bestSingle === 0 || parseFloat(time) < bestSingle) {
    bestSingle = parseFloat(time);
    document.getElementById("best-single").textContent = `Best Single: ${bestSingle.toFixed(2)}`;
  }

  if (times.length >= 5) {
    let ao5Times = times.slice(-5).map(t => parseFloat(t.time));
    let ao5Average = ao5Times.reduce((a, b) => a + b, 0) / ao5Times.length;
    bestAO5 = ao5Average;
    document.getElementById("best-ao5").textContent = `Best AO5: ${bestAO5.toFixed(2)}`;
  }

  if (times.length >= 12) {
    let ao12Times = times.slice(-12).map(t => parseFloat(t.time));
    let ao12Average = ao12Times.reduce((a, b) => a + b, 0) / ao12Times.length;
    bestAO12 = ao12Average;
    document.getElementById("best-ao12").textContent = `Best AO12: ${bestAO12.toFixed(2)}`;
  }
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

    if (!running && holdDuration >= 150) {
      // Ready to start
      isReady = true;
      timerElement.style.color = "#00ff00"; // Green color when ready
    }
  }
});

document.getElementById("add-session").addEventListener("click", () => {
  const sessionName = sessionNameInput.value.trim();
  if (sessionName && !sessions.includes(sessionName)) {
    sessions.push(sessionName);
    localStorage.setItem("sessions", JSON.stringify(sessions));
    renderSessions();
    sessionNameInput.value = "";
  }
});

function renderSessions() {
  const sessionsList = document.getElementById("sessions");
  sessionsList.innerHTML = "";
  sessions.forEach(session => {
    const li = document.createElement("li");
    li.textContent = session;
    li.addEventListener("click", () => {
      times = [];  // Clear previous session's times when clicking a new session
      localStorage.setItem("times", JSON.stringify(times));
      renderTimes();
    });
    sessionsList.appendChild(li);
  });
}

renderSessions();
renderTimes();
displayScramble();
