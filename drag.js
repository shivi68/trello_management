document.addEventListener('DOMContentLoaded', () => {
    const cardBodies = document.querySelectorAll('.card-body');

    cardBodies.forEach(cardBody => {
        // Prevent default dragover behavior to allow drop
        cardBody.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingItem = document.querySelector('.is-dragging');
            const afterElement = getDragAfterElement(cardBody, e.clientY);
            if (afterElement == null) {
                cardBody.appendChild(draggingItem);
            } else {
                cardBody.insertBefore(draggingItem, afterElement);
            }
        });

        // Handle drop event
        cardBody.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggingItem = document.querySelector('.is-dragging');
            cardBody.appendChild(draggingItem);
            saveTasks();
        });

        // Touch event listeners
        cardBody.addEventListener('touchstart', handleTouchStart, { passive: false });
        cardBody.addEventListener('touchmove', handleTouchMove, { passive: false });
        cardBody.addEventListener('touchend', handleTouchEnd);
    });

    let draggingItem = null;
    let touchOffsetX = 0;
    let touchOffsetY = 0;

    function handleTouchStart(e) {
        const touch = e.touches[0];
        draggingItem = e.target.closest('.task-item');
        if (draggingItem) {
            draggingItem.classList.add('is-dragging');
            draggingItem.style.position = 'absolute';
            draggingItem.style.zIndex = 1000;
            const rect = draggingItem.getBoundingClientRect();
            touchOffsetX = touch.clientX - rect.left;
            touchOffsetY = touch.clientY - rect.top;
            moveAt(touch.pageX, touch.pageY);
            // Prevent scrolling while dragging
            document.body.style.overflow = 'hidden';
        }
    }

    function handleTouchMove(e) {
        if (draggingItem) {
            const touch = e.touches[0];
            moveAt(touch.pageX - touchOffsetX, touch.pageY - touchOffsetY);
            const cardBody = document.elementFromPoint(touch.clientX, touch.clientY).closest('.card-body');
            if (cardBody) {
                const afterElement = getDragAfterElement(cardBody, touch.clientY);
                if (afterElement == null) {
                    cardBody.appendChild(draggingItem);
                } else {
                    cardBody.insertBefore(draggingItem, afterElement);
                }
            }
            // Prevent scrolling while dragging
            e.preventDefault();
        }
    }

    function handleTouchEnd() {
        if (draggingItem) {
            draggingItem.classList.remove('is-dragging');
            draggingItem.style.position = '';
            draggingItem.style.zIndex = '';
            draggingItem.style.left = '';
            draggingItem.style.top = '';
            draggingItem = null;
            // Restore scrolling after dragging ends
            document.body.style.overflow = '';
            saveTasks();
        }
    }

    function moveAt(pageX, pageY) {
        if (draggingItem) {
            draggingItem.style.left = pageX - touchOffsetX + 'px';
            draggingItem.style.top = pageY - touchOffsetY + 'px';
        }
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.is-dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(taskItem => {
            const taskTitleElement = taskItem.querySelector('.card-title');
            const taskTextElement = taskItem.querySelector('.card-text');
            const taskBodyElement = taskItem.closest('.card-body');
            if (taskTitleElement && taskTextElement && taskBodyElement) {
                const task = {
                    name: taskTitleElement.textContent,
                    description: taskTextElement.textContent,
                    status: taskBodyElement.id
                };
                tasks.push(task);
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
