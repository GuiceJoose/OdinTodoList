import { format, addDays, subDays, isWithinInterval, parseISO } from 'date-fns'

const createNewTask = (title, description, date, priority) => {
    let id = Math.random() + Date.now();
    if (date == '' || date == null) {
        date = 'No due date';
    }
    return { title, description, date, priority, id }
}

let taskList = [];


const newTaskButton = document.getElementById('new-task-button');
newTaskButton.addEventListener('click', showNewTaskForm);

const newTaskForm = document.getElementById('new-task-form');
newTaskForm.addEventListener('submit', handleAddTaskFormSubmit);

const cancelAddTaskButton = document.getElementById('cancel-add-task');
cancelAddTaskButton.addEventListener('click', hideNewTaskForm);

const newTaskTitleInput = document.getElementById('task-title');
const newTaskDescriptionInput = document.getElementById('details');
const newTaskDateInput = document.getElementById('due-date');
const newTaskPriorityInput = document.getElementById('priority');

function showNewTaskForm() {
    newTaskForm.classList.remove('hidden');
}

function hideNewTaskForm() {
    newTaskForm.classList.add('hidden');
}

function handleAddTaskFormSubmit(e) {
    e.preventDefault();
    if (newTaskTitleInput.value == '' || newTaskTitleInput.value == null) {return};
    let newTask = createNewTask(newTaskTitleInput.value, newTaskDescriptionInput.value, newTaskDateInput.value, newTaskPriorityInput.value);
    addTaskToList(newTask);
    resetNewTaskForm();
    renderTaskList(taskList);
    hideNewTaskForm();
}

function resetNewTaskForm () {
    newTaskTitleInput.value = '';
    newTaskDescriptionInput.value = '';
    newTaskDateInput.value = format(new Date(), 'yyyy-MM-dd');
    newTaskPriorityInput.value = 'Low';
}


function addTaskToList(task) {
    taskList.push(task);
}


function renderTaskList(taskList) {
    let taskListArea = document.getElementById('task-list-area');
    taskListArea.innerHTML = '';

    taskList.forEach(task => {
        let taskBox = createTaskInDOM(task);
        taskListArea.appendChild(taskBox);
    });
}

function createTaskInDOM(task) {
    let newTaskBox = document.createElement('div');
        newTaskBox.classList.add('task-box');
        newTaskBox.id = task.id;

    let newTaskTitle = document.createElement('div');
        newTaskTitle.textContent = task.title;

    let newTaskRightSide = document.createElement('div');
        newTaskRightSide.classList.add('new-task-right-side');

    let newTaskDate = document.createElement('div');
        newTaskDate.textContent = task.date;

    let newTaskPriority = task.priority; 
        if(newTaskPriority == 'Low') {
            newTaskBox.classList.add('Low');
        } else if(newTaskPriority == 'Medium') {
            newTaskBox.classList.add('Medium');
        } else if(newTaskPriority == 'High') {
            newTaskBox.classList.add('High');
        }

    let newTaskDetailsButton = document.createElement('button');
        newTaskDetailsButton.textContent = 'Details';
        newTaskDetailsButton.addEventListener('click', showTaskDetails);
        
    let newTaskDeleteButton = document.createElement('button');
        newTaskDeleteButton.classList.add('material-icons');
        newTaskDeleteButton.textContent = 'delete_outline';
        newTaskDeleteButton.addEventListener('click', handleTaskDelete);

        newTaskRightSide.append(newTaskDetailsButton, newTaskDate, newTaskDeleteButton);
        newTaskBox.append(newTaskTitle, newTaskRightSide);
        return newTaskBox;
}


function handleTaskDelete(e) {
    let thisTask = e.target.parentNode.parentNode.id;
    console.log(thisTask)
    taskList.splice(taskList.findIndex(task => task.id == thisTask), 1)
    renderTaskList(taskList);
}

function showTaskDetails(e) {
    let thisTaskID = e.target.parentNode.parentNode.id;
    let thisTask = taskList.find(x => x.id == thisTaskID);

    const taskDetailsOverlay = document.getElementById('task-details-overlay');
    taskDetailsOverlay.classList.add('show');

    const title = document.getElementById('details-title');
    title.textContent = thisTask.title;

    const date = document.getElementById('details-date');
    date.textContent = thisTask.date;

    const priority = document.getElementById('details-priority');
    priority.textContent = thisTask.priority;

    const details = document.getElementById('details-details');
    details.textContent = thisTask.description

    const closeButton = document.getElementById('details-close-button');
    closeButton.addEventListener('click', closeDetailsModal)

    function closeDetailsModal() {
        taskDetailsOverlay.classList.remove('show')
        title.textContent = '';
        date.textContent = '';
        priority.textContent = '';
        details.textContent = '';
    }
}


const newProjectForm = document.getElementById('new-project-form');
const newProjectInput = document.getElementById('new-project-input');
newProjectForm.addEventListener('submit', handleNewProject);

const projectsList = document.getElementById('projects-list');

function handleNewProject(e) {
    e.preventDefault();
    let newTitle = newProjectInput.value;
    let project = createNewProjectInDOM(newTitle);
    projectsList.appendChild(project);
    newProjectInput.value = '';

}

function createNewProjectInDOM(title) {
    let newProjectBox = document.createElement('div');
    newProjectBox.textContent = title;
    return newProjectBox;
}





const allTasksButton = document.getElementById('all-tasks');
allTasksButton.addEventListener('click', showAllTasks);

function showAllTasks() {
    renderTaskList(taskList);
}


const todayButton = document.getElementById('todays-tasks');
todayButton.addEventListener('click', showTodaysTasks);

function showTodaysTasks() {
    let todaysList = getTodaysTaskList(taskList);
    renderTaskList(todaysList);
}

function getTodaysTaskList(list) {
    let todaysDate = format(new Date(), 'yyyy-MM-dd')
    let todaysTasks = list.filter(function(x) {
        return x.date == todaysDate
    })
    return todaysTasks;
}


const weekButton = document.getElementById('weeks-tasks');
weekButton.addEventListener('click', showThisWeeksTasks);

function showThisWeeksTasks() {
    let weeksList = getThisWeeksTaskList(taskList)
    renderTaskList(weeksList);
}

function getThisWeeksTaskList(list) {
    let yesterday = subDays(new Date(), 1);
    let nextWeek = addDays(new Date(), 7);
    let weeksTasks = list.filter(function(x) {
        return isWithinInterval(parseISO(x.date), { start: yesterday, end: nextWeek })
    })
    return weeksTasks;
}