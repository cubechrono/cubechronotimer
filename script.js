let sections = JSON.parse(localStorage.getItem("sections")) || { Default: [] };
let currentSection = "Default";

const sectionsDropdown = document.getElementById("sections");
const addSectionButton = document.getElementById("add-section");
const renameSectionButton = document.getElementById("rename-section");
const deleteSectionButton = document.getElementById("delete-section");

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
  renderTimes(); // Update the times list for the selected section
  displayScramble(); // Reset scramble
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

// Event Listeners for Section Actions
addSectionButton.addEventListener("click", addSection);
renameSectionButton.addEventListener("click", renameSection);
deleteSectionButton.addEventListener("click", deleteSection);
sectionsDropdown.addEventListener("change", (e) => switchSection(e.target.value));

// Initialize
updateSectionsDropdown();
switchSection(currentSection);
