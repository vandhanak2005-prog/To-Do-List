
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const message = document.getElementById("message");

// Load saved tasks, or start with an empty list
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editId = null;

// Save tasks in the browser
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display all tasks
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function(task) {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task completed");

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function() {
            taskInput.value = task.text;
            editId = task.id;
            addBtn.textContent = "Update Task";
            taskInput.focus();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.background = "#dc2626";

        deleteBtn.addEventListener("click", function() {
            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            if (editId === task.id) {
                editId = null;
                addBtn.textContent = "Add Task";
                taskInput.value = "";
            }

            saveTasks();
            renderTasks();
        });

        actions.append(editBtn, deleteBtn);
        li.append(checkbox, span, actions);
        taskList.appendChild(li);
    });

    const remaining = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    taskCount.textContent = remaining + " tasks remaining";
}

// Add a new task or update an existing task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        message.textContent = "Please enter a task!";
        return;
    }

    message.textContent = "";

    if (editId !== null) {
        const task = tasks.find(function(item) {
            return item.id === editId;
        });

        if (task) {
            task.text = text;
        }

        editId = null;
        addBtn.textContent = "Add Task";
    } else {
        tasks.push({
            id: Date.now(),
            text: text,
            completed: false
        });
    }

    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
}

// Add task when the button is clicked
addBtn.addEventListener("click", addTask);

// Also add task when Enter is pressed
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Display previously saved tasks on startup
renderTasks();
