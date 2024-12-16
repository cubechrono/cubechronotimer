// Sections management logic
let sections = JSON.parse(localStorage.getItem("sections")) || { Default: [] };
let currentSection = "Default";

function updateSectionsDropdown() {
  const sectionsDropdown = document.getElementById("sections");
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

// Add event listeners to buttons
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("add-section").addEventListener("click", addSection);
  document.getElementById("rename-section").addEventListener("click", renameSection);
  document.getElementById("delete-section").addEventListener("click", deleteSection);

  // Initialize dropdown and sections
  updateSectionsDropdown();
  document.getElementById("sections").addEventListener("change", (e) => {
    switchSection(e.target.value);
  });
});
