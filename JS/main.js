/*
Author: Abdalla Sakr
Date: 11/4/2025
Description: Manages a task list application with add, edit, delete, and completion features.
Tasks are stored in localStorage, with persistent checkbox states and dark mode support.
The application is designed with a responsive layout using Flexbox,
ensuring compatibility across all devices.
*/

// Element selectors
const themeToggle = document.getElementById("theme-toggle");
const taskInput = document.getElementById("task");
const addButton = document.getElementById("add");
const tableBody = document.querySelector("#tab tbody");


// Initialize tasks and states
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let taskStates = JSON.parse(localStorage.getItem("taskStates")) || {};

// Initialize dark mode from localStorage
const isDarkMode = localStorage.getItem("darkMode") === "true";
if (isDarkMode) {
    document.body.classList.add("dark-mode");
}
themeToggle.checked = isDarkMode;

// Create checkbox cell with persistent state
function createCheckBoxCell(taskCell, index) {
    const checkBoxCell = document.createElement("td");
    const checkBox = document.createElement("input");
    checkBox.className = "check-box";
    checkBox.type = "checkbox";
    checkBox.checked = taskStates[index] || false;

    checkBox.addEventListener("change", () => {
        taskStates[index] = checkBox.checked;
        taskCell.style.textDecoration = checkBox.checked ? "line-through" : "none";
        localStorage.setItem("taskStates", JSON.stringify(taskStates));
    });

    checkBoxCell.appendChild(checkBox);
    return checkBoxCell;
}

// Create action cell with edit and delete buttons
function createActionCell(taskCell, index) {
    const actionCell = document.createElement("td");
    actionCell.className = "action-cell";

    const editButton = createActionButton("&#x270F;&#xFE0F;", () => {
        if (!editButton.dataset.editing) {
            const input = document.createElement("input");
            input.type = "text";
            className = "edit-input";
            input.value = taskCell.textContent;
            taskCell.innerHTML = "";
            taskCell.appendChild(input);
            input.focus();
            editButton.dataset.editing = "true";
            editButton.innerHTML = "&#x1F4BE;";
        } else {
            const newTask = taskCell.querySelector("input").value.trim();
            if (newTask) {
                tasks[index] = newTask;
                saveTasks();
                renderTasks();
            }
        }
    });

    const deleteButton = createActionButton("&#x1F5D1;&#xFE0F;", () => {
        if (confirm("Are you sure you want to delete this task?")) {
            tasks.splice(index, 1);
            delete taskStates[index];
            saveTasks();
            saveTaskStates();
            renderTasks();
        }
    });

    actionCell.append(editButton, deleteButton);
    return actionCell;
}

// Helper to create action buttons
function createActionButton(icon, onClick) {
    const button = document.createElement("button");
    button.className = "action-btn";
    button.innerHTML = icon;
    button.addEventListener("click", onClick);
    return button;
}

// Save tasks and states to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveTaskStates() {
    localStorage.setItem("taskStates", JSON.stringify(taskStates));
}

// Render tasks with preserved states
function renderTasks() {
    tableBody.innerHTML = `<tr>
        <th>Done</th>
        <th>Task</th>
        <th>Action</th>
    </tr>`;

    tasks.forEach((task, index) => {
        const tr = document.createElement("tr");
        const taskCell = document.createElement("td");
        taskCell.textContent = task;
        if (taskStates[index]) {
            taskCell.style.textDecoration = "line-through";
        }

        tr.appendChild(createCheckBoxCell(taskCell, index));
        tr.appendChild(taskCell);
        tr.appendChild(createActionCell(taskCell, index));
        tableBody.appendChild(tr);
    });

    updateRowBackgrounds();
}

// Update row backgrounds based on theme
function updateRowBackgrounds() {
    const rows = tableBody.querySelectorAll("tr");
    const isDarkMode = document.body.classList.contains("dark-mode");

    rows.forEach((row, index) => {
        row.style.backgroundColor = isDarkMode
            ? index % 2 === 0 ? "#2c2c2c" : "#1e1e1e"
            : index % 2 === 0 ? "#fff" : "#ddd";
        row.style.color = isDarkMode ? "white" : "black";
    });
}

// Add new task
function addTask() {
    const taskDesc = taskInput.value.trim();
    if (taskDesc) {
        tasks.push(taskDesc);
        taskStates[tasks.length - 1] = false;
        saveTasks();
        saveTaskStates();
        renderTasks();
        taskInput.value = "";
    }
}

// Toggle dark mode
themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    updateRowBackgrounds();
});

// Event listeners
addButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

// Initial render
renderTasks();