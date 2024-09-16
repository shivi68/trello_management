document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskNameInput = document.getElementById('taskName');
    const taskDescriptionInput = document.getElementById('taskDescription');

    let tasks = []; 

    function loadTasks() {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function showToast(message) {
        const toastMessage = document.getElementById('toastMessage');
        toastMessage.textContent = message;
        const toastElement = document.getElementById('taskToast');
        const toast = new bootstrap.Toast(toastElement, {
            delay: 2000
        });
        toast.show();
    }
    
    // Edit Task
    function updateTask(taskItem, task) {
        const taskTitleElement = taskItem.querySelector('.card-title');
        const taskTextElement = taskItem.querySelector('.card-text');
        const taskBodyElement = taskItem.closest('.card-body');

        if (taskTitleElement && taskTextElement && taskBodyElement) {
            task.name = taskTitleElement.textContent;
            task.description = taskTextElement.textContent;
            task.status = taskBodyElement.id;

            saveTasks();
        }
    }

    // Adding the task
    function addTaskToDOM(task) {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item mb-2';
        taskItem.setAttribute('draggable', 'true');

        const taskBody = document.createElement('div');
        taskBody.className = 'card-body d-flex flex-column';

        // Task Title and Action Buttons Container
        const titleActionsContainer = document.createElement('div');
        titleActionsContainer.className = 'd-flex justify-content-between align-items-center mb-1';

        // Task Title
        const taskTitle = document.createElement('h5');
        taskTitle.className = 'card-title mb-0';
        taskTitle.textContent = task.name;

        // Task Description
        const taskText = document.createElement('p');
        taskText.className = 'card-text';
        taskText.textContent = task.description;

        // Edit Button
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-primary btn-sm ms-5';
        editButton.innerHTML = '<i class="bi bi-pencil"></i>';

        editButton.addEventListener('click', () => {
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.className = 'form-control mb-2';
            titleInput.value = taskTitle.textContent;
            taskTitle.replaceWith(titleInput);

            const descriptionTextarea = document.createElement('textarea');
            descriptionTextarea.className = 'form-control mb-2';
            descriptionTextarea.textContent = taskText.textContent;
            taskText.replaceWith(descriptionTextarea);

            const saveButton = document.createElement('button');
            saveButton.className = 'btn btn-success btn-sm mt-2';
            saveButton.textContent = 'Save';
            saveButton.addEventListener('click', () => {
                task.name = titleInput.value;
                task.description = descriptionTextarea.value;

                taskTitle.textContent = titleInput.value;
                taskText.textContent = descriptionTextarea.value;

                // Update the task in the global tasks array
                const taskIndex = tasks.findIndex(t => t === task);
                if (taskIndex !== -1) {
                    tasks[taskIndex] = task;
                }

                saveTasks(); 

                // Remove input fields and show task title and description
                titleInput.replaceWith(taskTitle);
                descriptionTextarea.replaceWith(taskText);
                saveButton.remove();

                showToast('Task edited successfully!!!')
            });

            taskBody.appendChild(saveButton);
            descriptionTextarea.focus();
        });

        // Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';

        deleteButton.addEventListener('click', () => {
            // Show confirm delete modal
            showConfirmDeleteModal(task, taskItem);
        });

        titleActionsContainer.appendChild(taskTitle);
        titleActionsContainer.appendChild(editButton);
        titleActionsContainer.appendChild(deleteButton);

        taskBody.appendChild(titleActionsContainer);
        taskBody.appendChild(taskText);
        taskItem.appendChild(taskBody);

        document.getElementById(task.status).appendChild(taskItem);

        // Add drag event listeners
        taskItem.addEventListener('dragstart', () => {
            taskItem.classList.add('is-dragging');
        });

        taskItem.addEventListener('dragend', () => {
            taskItem.classList.remove('is-dragging');
            updateTask(taskItem, task);
        });
    }

    // Function to show confirm delete modal
    function showConfirmDeleteModal(task, taskItem) {
        const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        confirmDeleteModal.show();

        const deleteTaskButton = document.getElementById('deleteTaskButton');
        deleteTaskButton.addEventListener('click', () => {
            deleteTask(task, taskItem);
            confirmDeleteModal.hide();
        });
    }

    // Function to delete task
    function deleteTask(task, taskItem) {
        taskItem.remove();
        tasks = tasks.filter(t => t !== task);
        saveTasks();
        showToast('Task deleted successfully!!');
    }

    // Form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskName = taskNameInput.value.trim();
        const taskDescription = taskDescriptionInput.value.trim();

        if (taskName && taskDescription) {
            const task = {
                name: taskName,
                description: taskDescription,
                status: 'todoList'
            };
            tasks.push(task);
            addTaskToDOM(task);
            saveTasks();

            taskNameInput.value = '';
            taskDescriptionInput.value = '';

            // Hide the modal after adding task
            const taskModalElement = document.getElementById('taskModal');
            const taskModal = bootstrap.Modal.getInstance(taskModalElement);
            if (taskModal) {
                taskModal.hide();
            }

            showToast('Task added successfully!!!');
        }
    });

    loadTasks();
});
