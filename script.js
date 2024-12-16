let sections = JSON.parse(localStorage.getItem("sections")) || { Default: [] };
let currentSection = "Default";

const sectionsDropdown = document.getElementById("sections");
const addSectionButton = document.getElementById("add-section");
const renameSectionButton = document.getElementById("rename-section");
const deleteSectionButton = document.getElementById("delete-section");
const timerElement = document.getElementById("timer");
const timesList = document.getElementById("times");
const scrambleElement = document.getElementById("scramble");

let startTime, elapsedTime = 0;
let running = false;
let ready = false;

function updateSectionsDropdown() {
  sectionsDropdown.innerHTML = "";
  for (let sectionName in sections) {
    const option = document.createElement("option");
    option.value = sectionName;
    option.textContent = sectionName;
    if (sectionName === currentSection) {
      option.selected = true;
    }
    sectionsDropdown.appendChild(option);
  }
}

function switchSection(newSection) {
  currentSection = newSection;
  renderTimes();
  displayScramble();
}

function addSection() {
  const newSectionName = `Section ${Object.keys(sections).length + 1}`;
  sections[newSectionName] = [];
  localStorage.setItem("sections", JSON.stringify(sections));
  updateSectionsDropdown();
  switchSection(newSectionName);
}

function renameSection() {
  const newName = prompt("Enter new section name:", currentSection);
  if (newName && !sections[newName]) {
    sections[newName] = sections[currentSection];
    delete sections[currentSection];
    currentSection = newName;
    localStorage.setItem("sections", JSON.stringify(sections));
    updateSectionsDropdown();
  } else if (sections[newName]) {
    alert("A section with this name already exists.");
  }
}

function deleteSection() {
  if (Object.keys(sections).length === 1) {
    alert("You must have at least one section.");
    return;
  }

  if (confirm(`Are you sure you want to delete "${currentSection}"?`)) {
    delete sections[currentSection];
    currentSection = Object.keys(sections)[0];
    localStorage.setItem("sections", JSON.stringify(sections));
    updateSectionsDropdown();
    renderTimes();
  }
}

function saveTime(time) {
  const scramble = scrambleElement.textContent;
  const solve = { time, scramble, status: "" };
  sections[currentSection].push(solve);
  localStorage.setItem("sections", JSON.stringify(sections));
  renderTimes();
}

function renderTimes() {
  timesList.innerHTML = "";
  const solves = sections[currentSection] || [];
  solves.forEach((solve, index) => {
    const li = document.createElement("li");
    li.textContent = `${solve.time} ${solve.status}`;
    li.addEventListener("click", () => editTime(index));
    timesList.appendChild(li);
  });
}

function editTime(index) {
  const solve = sections[currentSection][index];
  const action = prompt(
    `Time: ${solve.time}\nScramble: ${solve.scramble}\nStatus: ${solve.status || "None"}\n\nEnter:\n+2 to add 2 seconds\nDNF to mark as Did Not Finish\ndelete to remove`
  );

  if (action === "+2") {
    solve.time = (parseFloat(solve.time) + 2).toFixed(2);
    solve.status = "+2";
  } else if (action === "DNF") {
    solve.status = "DNF";
  } else if (action === "delete") {
    sections[currentSection].splice(index, 1);
  }

  localStorage.setItem("sections", JSON.stringify(sections));
  renderTimes();
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

function startStopTimer() {
  if (running) {
    running = false;
    elapsedTime = Date.now() - startTime;
    const time = (elapsedTime / 1000).toFixed(2);
    timerElement.textContent = time;
    saveTime(time);
  } else {
    if (!ready) return;
    running = true;
    ready = false;
    startTime = Date.now();
    timerElement.textContent = "0.00";
  }
}

function handleKeyDown(e) {
  if (e.code === "Space") {
    e.preventDefault();
    if (!running) {
      timerElement.style.color = "green";
      ready = true;
    }
  }
}

function handleKeyUp(e) {
  if (e.code === "Space") {
    e.preventDefault();
    if (ready) {
      timerElement.style.color = "#ffffff";
      startStopTimer();
    }
  }
}

// Event Listeners
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
addSectionButton.addEventListener("click", addSection);
renameSectionButton.addEventListener("click", renameSection);
deleteSectionButton.addEventListener("click", deleteSection);
sectionsDropdown.addEventListener("change", (e) => switchSection(e.target.value));

// Initialize
updateSectionsDropdown();
switchSection(currentSection);
displayScramble();
