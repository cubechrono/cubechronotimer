let timerElement = document.getElementById("timer");
let scrambleElement = document.getElementById("scramble");
let timesList = document.getElementById("times");
let sessionsList = document.getElementById("sessions");

let startTime = null;
let elapsedTime = 0;
let running = false;
let holdStartTime = null;
let isReady = false;
let currentSession = "Default";
let sessions = JSON.parse(localStorage.getItem("sessions")) || { Default: [] };
let timerInterval = null;

function saveSessions() {
  localStorage.setItem("sessions", JSON.stringify(sessions));
}

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
  }, 10);
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
  sessions[currentSession].push(solve);
  saveSessions();
  renderTimes();
}

function renderTimes() {
  timesList.innerHTML = "";
  const sessionTimes = sessions[currentSession] || [];
  sessionTimes.forEach((solve, index) => {
    const li = document.createElement("li");
    li.textContent = `${solve.time} ${solve.status}`;
    li.addEventListener("click", () => editTime(index));
    timesList.appendChild(li);
  });
}

function editTime(index) {
  const solve = sessions[currentSession][index];
  const action = prompt(
    `Time: ${solve.time}\nScramble: ${solve.scramble}\nStatus: ${solve.status || "None"}\n\nEnter:\n+2 to add 2 seconds\nDNF to mark as Did Not Finish\ndelete to remove`
  );

  if (action === "+2") {
    solve.time = (parseFloat(solve.time) + 2).toFixed(2);
    solve.status = "+2";
  } else if (action === "DNF") {
    solve.status = "DNF";
  } else if (action === "delete") {
    sessions[currentSession].splice(index, 1);
  }

  saveSessions();
  renderTimes();
}

function addSession() {
  const sessionName = prompt("Enter a name for the new session:");
  if (sessionName && !sessions[sessionName]) {
    sessions[sessionName] = [];
    saveSessions();
    renderSessions();
    switchSession(sessionName);
  }
}

function deleteSession(sessionName) {
  if (confirm(`Are you sure you want to delete the session '${sessionName}'?`)) {
    delete sessions[sessionName];
    saveSessions();
    renderSessions();
    switchSession("Default");
  }
}

function switchSession(sessionName) {
  currentSession = sessionName;
  renderTimes();
}

function renderSessions() {
  sessionsList.innerHTML = "";
  for (const sessionName in sessions) {
    const li = document.createElement("li");
    li.textContent = sessionName;
    li.className = sessionName === currentSession ? "active" : "";
    li.addEventListener("click", () => switchSession(sessionName));

    if (sessionName !== "Default") {
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteSession(sessionName);
      });
      li.appendChild(deleteButton);
    }

    sessionsList.appendChild(li);
  }
}

document.getElementById("add-session").addEventListener("click", addSession);

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
        running = true;
        isReady = false;
        timerElement.textContent = "0.00";
        startTimer();
      }
    } else {
      running = false;
      stopTimer();
      displayScramble();
    }
  }
});

// Initialize
if (!sessions["Default"]) sessions["Default"] = [];
saveSessions();
displayScramble();
renderTimes();
renderSessions();
