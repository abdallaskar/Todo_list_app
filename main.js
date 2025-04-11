// Author: Abdalla Sakr
// Date: 11/4/2025
// Description: 
                /* This script manages a simple task list application. 
                It allows users to add, edit, delete, and mark tasks as done.
                The tasks are stored in localStorage, and the UI updates dynamically based on user interactions.*/

// select all element on bage 
const addButton = document.getElementById("add");
const tableShow = document.querySelector("#tab tbody");
const taskInput = document.getElementById("task");
const toggleDarkMode = document.getElementById("toggleDarkMode");
const form = document.querySelector('form');



// Initialize tasks array from localStorage or as empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Create checkbox cell and add event on it and return it 
function createCheckBoxCell(taskCell) {
    const checkBoxCell = document.createElement("td");
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.addEventListener("click", () => {
        taskCell.style.textDecoration = checkBox.checked ? "line-through" : "none";
    });

    checkBoxCell.appendChild(checkBox);
    return checkBoxCell;
}

function createActionCell(taskCell, index) {
    // Create action cell container
    const actionCell = document.createElement('td');
    actionCell.className = 'action-cell'; // Use CSS class instead of inline styles

    // Create and configure edit button
    const editButton = createActionButton('✏️', () => {
        if (editButton.textContent === '✏️') 
        {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'edit-input';
            input.value = taskCell.textContent;

            taskCell.innerHTML = '';
            taskCell.appendChild(input);
            input.focus();

            editButton.textContent = '💾';
        }
        else 
        {
            const newTask = taskCell.querySelector('input').value.trim();
            if (newTask) 
            {
                tasks[index] = newTask;
                saveTasks();
                renderTasks();
            }
        }
    });

    // Create and configure delete button
    const deleteButton = createActionButton('🗑️', () => {
        if (confirm('Are you sure delete this task?'))
        {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }
    });

    // Append buttons to cell
    actionCell.append(editButton, deleteButton);
    return actionCell;
}

// Helper function to create styled action buttons
function createActionButton(icon, onClick) {
    const button = document.createElement('button');
    button.className = 'action-btn';
    button.textContent = icon;
    button.addEventListener('click', onClick);
    return button;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render all tasks
function renderTasks() {
    tableShow.innerHTML = `<tr>
            <th>Done</th>
            <th>Task </th>
            <th>Action</th>
            </tr>`;
    tasks.forEach((task, index) => {
    const tr = document.createElement("tr");

    const taskCell = document.createElement("td");
    taskCell.textContent = task;

    const checkBoxCell = createCheckBoxCell(taskCell);
    const actionCell = createActionCell(taskCell, index);

    tr.appendChild(checkBoxCell);
    tr.appendChild(taskCell);
    tr.appendChild(actionCell);


    tableShow.appendChild(tr);
    });
    updateRowBackgrounds();
}


// Add new task
function addTask() {
    const taskDesc = taskInput.value.trim();
    if (taskDesc !== "") {
        tasks.push(taskDesc);
        saveTasks();
        renderTasks();
        taskInput.value = "";
    }
}

// Alternate row backgrounds
function updateRowBackgrounds() {
    const rows = tableShow.querySelectorAll("tr");
    const isDarkMode = document.body.classList.contains("dark-mode");
    
    rows.forEach((row, index) => {
        if (isDarkMode) {
            // Dark mode colors
            row.style.backgroundColor = index % 2 === 0 ? "#2c2c2c" : "#1e1e1e";
            console.log(row.length);
            console.log(index);
            row.style.color = "white";
        } else {
            // Light mode colors
            row.style.backgroundColor = index % 2 === 0 ? "#fff" : "#ddd";
            row.style.color = "black";
        }
    });
}

// Toggle to Dark Mode and revers to white mode 
toggleDarkMode.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    updateRowBackgrounds()
});
// Event Listeners
addButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});
// Prevent form submission from reloading the page
form.addEventListener('submit', function(event) {
  event.preventDefault(); // This stops the page from reloading
});

// Initial render
renderTasks();
