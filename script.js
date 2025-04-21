document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('newTask');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    let tasks = loadTasks();

    renderTasks();

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    taskList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const taskId = event.target.dataset.id;
            deleteTask(taskId);
        } else if (event.target.classList.contains('complete-btn')) {
            const taskId = event.target.dataset.id;
            toggleComplete(taskId);
        }
    });

    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        return storedTasks ? JSON.parse(storedTasks) : [];
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                <div class="actions">
                    <button class="complete-btn" data-id="${task.id}">${task.completed ? '&#10003;' : '&#x2713;'}</button>
                    <button class="delete-btn" data-id="${task.id}">&#10006;</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });
    }

    function addTask(text) {
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== parseInt(id));
        saveTasks();
        renderTasks();
    }

    function toggleComplete(id) {
        tasks = tasks.map(task =>
            task.id === parseInt(id) ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    }
});
