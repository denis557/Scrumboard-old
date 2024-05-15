const blockContainer = document.querySelector("body");
const inputs = window.document.querySelectorAll('.input');
const blackout = window.document.getElementById("bg");
const addPopup = window.document.getElementById("add-popup");
const todo = window.document.getElementById("todo");
const submitCreate = document.getElementById("submit-create");
const submitChange = document.getElementById("submit-change");
const titleHTML = document.getElementById("title-input");
const descriptionHTML = document.getElementById("description-input");
const dateHTML = document.getElementById("date");
const timeHTML = document.getElementById("time");
const titleChangeHTML = document.getElementById("change-title-input");
const descriptionChangeHTML = document.getElementById("change-description-input");
const dateChangeHTML = document.getElementById("change-date");
const timeChangeHTML = document.getElementById("change-time");
const changePopup = document.getElementById("update-popup");
const select = document.getElementById("select");
const bin = document.getElementById("bin");
const pin = document.getElementById("pin");
const deletePopup = document.getElementById("delete-popup");
const confirmDelete = document.getElementById("confirm-delete");
const cancelDelete = document.getElementById("cancel-delete");
const confirmClose = document.getElementById("confirm-close");
const cancelClose = document.getElementById("cancel-close");
const closePopup = document.getElementById("close-task-popup")
const blackoutDelete = document.getElementById("second-blackout");
const search = document.getElementById("search");
const searchBlock = document.getElementById("search-block");
const blockWrapper = document.getElementById("block-wrapper");
const emptySearch = document.getElementById("empty-search");
let tasks;
let id;
let taskId = localStorage.getItem("taskIdStorage") || 0;
localStorage.setItem("taskIdStorage", taskId);
let currentTaskId;
let currentTaskSearch;
let num = -1

dateHTML.min = new Date().toLocaleDateString("fr-ca");
dateChangeHTML.min = new Date().toLocaleDateString("fr-ca");
dateHTML.value = new Date().toLocaleDateString("fr-ca");

const clearInputs = () => {
    inputs.forEach((input) => {
        input.value = "";
        dateHTML.value = new Date().toLocaleDateString("fr-ca");
        timeHTML.value = "00:00";
    })
};

function sendMessage(taskTitle, taskTime) {
    const notification = new Notification("reminder", {
        body: `${taskTitle} has ${taskTime} left!`
    });

    notification.onclick = () => {
        console.log("works!")
    }
}

function hidePopup() {
    addPopup.classList.add("hidden");
    blackout.classList.add("hidden");
    clearInputs();
}

function hideChangePopup() {
    changePopup.classList.add("hidden");
    blackout.classList.add("hidden");
    clearInputs();
}

function openPopup() {
    addPopup.classList.remove("hidden");
    blackout.classList.remove("hidden");
    titleHTML.placeholder = ""
    document.getElementById("title-label").classList.remove("required")
}

function openChangePopup() {
    changePopup.classList.remove("hidden");
    blackout.classList.remove("hidden");
    titleChangeHTML.placeholder = ""
    document.getElementById("title-label").classList.remove("required")
}

const calculateDate = (date, time) => {
    const userDate = new Date(`${date}T${time}`);
    const currentDate = new Date();
    const difference = userDate - currentDate;
    
    let days = Math.floor(difference / (1000 * 60 * 60 * 24));
    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if(days > 1) {
        return days + " days";
    }else if(days == 1) {
        return days + " day";
    } else if(days <= 1) {
        if(hours > 1) {
            return hours + " hours";
        } else if(hours == 1) {
            return hours + " hour";
        } else if(hours < 1) {
            if(minutes > 1) {
                return minutes + " minutes"
            } else if(minutes == 1) {
                return minutes + " minute"
            } else if(minutes < 1 && hours < 1 && days < 1) {
                return "time is up!"
            }
        }
    }
}

class NewBlock {
    constructor() {
        this.items = [];
    }

    addTask(title, description, date, time) {
        titleHTML.placeholder = ""
        document.getElementById("title-label").classList.remove("required")
        const block = window.document.getElementById(`${id}-block`);
        if(title === "" || title.trim() == 0) {
            titleHTML.placeholder = "Please fill in the title!"
            document.getElementById("title-label").classList.add("required")
        } else {
            if(id === "in-review") {
                block.innerHTML += `
                <div class="task" id="${taskId}" draggable="true">
                    <p class="task-title">${title}</p>
                    <p class="task-date">in review</p>
                </div>
                `;
            } else if(id === "done") {
                block.innerHTML += `
                <div class="task" id="${taskId}" draggable="true">
                    <p class="task-title">${title}</p>
                    <p class="task-date">done</p>
                </div>
                `;
            } else {
                block.innerHTML += `
                <div class="task" id="${taskId}" draggable="true">
                    <p class="task-title">${title}</p>
                    <p class="task-date">${calculateDate(date, time)}</p>
                </div>
                `;
            }
            this.items.push({
                taskId,
                title: title,
                description: description,
                date: date,
                time: time,
                id: id,
                isPinned: false
            })
            taskId++;
            localStorage.setItem("taskIdStorage", taskId);
            localStorage.setItem("item", JSON.stringify(this.items));
            titleHTML.placeholder = "";
            document.getElementById("title-label").classList.remove("required")
            hidePopup();
        }
        addTasksEventListeners();
    }

    openTask(currentId) {
        const currentTask = this.items.find((task) => task.taskId === currentId);
        titleChangeHTML.value = currentTask.title;
        descriptionChangeHTML.value = currentTask.description;
        dateChangeHTML.value = currentTask.date;
        timeChangeHTML.value = currentTask.time;
        select.value = currentTask.id;
    }

    changeTask(currentId) {
        titleHTML.placeholder = ""
        document.getElementById("change-title-label").classList.remove("required")
        const currentTask = this.items.find((task) => task.taskId === currentId);
        const currentTaskHtml = document.getElementById(currentId);
        const newBlock = document.getElementById(`${select.value}-block`);
        if(titleChangeHTML.value == "" || titleChangeHTML.value.trim() == 0) {
            titleChangeHTML.placeholder = "Please fill in the title!"
            document.getElementById("change-title-label").classList.add("required")
        } else {
            currentTaskHtml.remove();
            currentTask.title = titleChangeHTML.value;
            currentTask.description = descriptionChangeHTML.value;
            currentTask.date = dateChangeHTML.value;
            currentTask.time = timeChangeHTML.value;
            currentTask.taskId = currentTask.taskId;
            currentTask.id = select.value;
            if(currentTask.id === "in-review") {
                newBlock.innerHTML += `
                <div class="task" id="${currentTask.taskId}" draggable="true">
                    <p class="task-title">${titleChangeHTML.value}</p>
                    <p class="task-date">in review</p>
                </div>
                `;
            } else if(currentTask.id === "done") {
                newBlock.innerHTML += `
                <div class="task" id="${currentTask.taskId}" draggable="true">
                    <p class="task-title">${titleChangeHTML.value}</p>
                    <p class="task-date">done</p>
                </div>
                `;
            } else {
                newBlock.innerHTML += `
                <div class="task" id="${currentTask.taskId}" draggable="true">
                    <p class="task-title">${titleChangeHTML.value}</p>
                    <p class="task-date">${calculateDate(dateChangeHTML.value, timeChangeHTML.value)}</p>
                </div>
                `;
            }
            localStorage.setItem("item", JSON.stringify(this.items));
            hideChangePopup();
        }
        addTasksEventListeners()
    }

    removeTask(currentId) {
        const currentTask = this.items.find((task) => task.taskId === currentId);
        const currentTaskHtml = document.getElementById(currentId);
        currentTaskHtml.remove();
        const index = this.items.indexOf(currentTask);
        this.items.splice(index, 1);
        localStorage.setItem("item", JSON.stringify(this.items));
    }

    pinTask(currentId) {
        const currentTaskHtml = document.getElementById(currentId);
        const currentTask = this.items.find((task) => task.taskId === currentId);
        if(currentTask.isPinned == true) {
            currentTask.isPinned = false;
            currentTaskHtml.classList.remove("pinned");
        } else {
            currentTask.isPinned = true;
            currentTaskHtml.classList.add("pinned");
        }
        localStorage.setItem("item", JSON.stringify(this.items));
        hideChangePopup();
    }

    hideBlock(currentCheckbox) {
        const currentTaskHtml = document.getElementById(`${currentCheckbox.name}-block-wrapper`);
        const currentOption = document.getElementById(`${currentCheckbox.name}-option`)
        if(!currentCheckbox.checked) {
            currentTaskHtml.classList.add("hidden-block");
            currentOption.disabled = true;
        } else {
            currentTaskHtml.classList.remove("hidden-block")
            currentOption.disabled = false;
        }

        const allBlocks = document.querySelectorAll(".block");
        const allHidden = Array.from(allBlocks).every((block) => block.classList.contains("hidden-block"));
        const blockP = document.getElementById("empty-block")
        if(allHidden){
            blockP.classList.remove("hidden");
        } else {
            blockP.classList.add("hidden");
        }
    }

    changeSearchMenu() {
        if(search.value == "") {
            searchBlock.innerHTML = "";
            this.items.forEach((task) => {
                const currentBlock = task.id;
                const currentBlockHtml = document.getElementById(`${currentBlock}-block-wrapper`);
                if(currentBlockHtml.classList.contains("hidden-block")) {
                    return
                } else {
                    searchBlock.innerHTML += `
                    <div class="search-task" id="${task.taskId}-search">
                        <p class="search-title" id="${task.taskId}-search-title">${task.title}</p>
                    </div>
                `;
                document.querySelectorAll(".search-title").forEach((title) => {
                    title.addEventListener("click", (event) => {
                        blockClass.searchTask(event.target.id);
                    })
                })
                }
            })
        } else {
            searchBlock.innerHTML = "";
            const searchInput = search.value;
            this.items.forEach((task) => {
                const currentBlock = task.id;
                const currentBlockHtml = document.getElementById(`${currentBlock}-block-wrapper`);
                if(currentBlockHtml.classList.contains("hidden-block")) {
                    return
                } else {
                    if(task.title.includes(searchInput)) {
                        searchBlock.innerHTML += `
                            <div class="search-task" id="${task.taskId}-search">
                                <p class="search-title" id="${task.taskId}-search-title">${task.title}</p>
                            </div>
                        `;
                        document.querySelectorAll(".search-title").forEach((title) => {
                            title.addEventListener("click", (event) => {
                                blockClass.searchTask(event.target.id);
                            })
                        })
                    }
                }
            })
        }
        if(searchBlock.children.length == 0) {
            emptySearch.classList.remove("hidden")
        } else {
            emptySearch.classList.add("hidden")
        }
    }

    searchTask(currentId) {
        const formattedId = currentId.split("-")[0];
        const currentTaskHtml = document.getElementById(`${formattedId}`);
        const currentTask = this.items.find((task) => task.taskId == formattedId);
        const currentBlock = document.getElementById(`${currentTask.id}-block-wrapper`);
        currentBlock.scrollTop = currentTaskHtml.offsetTop - 70;
        currentTaskHtml.classList.add("searched-block");
        setTimeout(() => {
            currentTaskHtml.classList.remove("searched-block");
        }, 1000);
        searchBlock.classList.add("hidden");
    }

    selectTask(key) {
        const blockChildren = searchBlock.children;
        if(num === -1) {
            if(key === "ArrowUp") {
                return
            } else if(key === "ArrowDown") {
                num++
                blockChildren[num].classList.add("selected");
                searchBlock.scrollTop = blockChildren[num].offsetTop - 10;
                currentTaskSearch = blockChildren[num].id;
            }
        }else if(num + 1 >= blockChildren.length){
            if(key === "ArrowUp") {
                num--;
                let nextTask = num + 1;
                blockChildren[nextTask].classList.remove("selected");
                blockChildren[num].classList.add("selected");
                searchBlock.scrollTop = blockChildren[num].offsetTop - 10;
                currentTaskSearch = blockChildren[num].id;
            } else if(key === "ArrowDown") {
                return
            }
        } else if(num === 0) {
            if(key === "ArrowUp") {
                return
            } else if(key === "ArrowDown") {
                num++;
                let prevoiusTask = num - 1;
                blockChildren[prevoiusTask].classList.remove("selected");
                blockChildren[num].classList.add("selected");
                searchBlock.scrollTop = blockChildren[num].offsetTop - 10;
                currentTaskSearch = blockChildren[num].id;
            }
        } else {
            if(key === "ArrowUp") {
                num--;
                let nextTask = num + 1;
                blockChildren[nextTask].classList.remove("selected");
                blockChildren[num].classList.add("selected");
                searchBlock.scrollTop = blockChildren[num].offsetTop - 10;
                currentTaskSearch = blockChildren[num].id;
            } else if(key === "ArrowDown") {
                num++;
                let prevoiusTask = num - 1;
                blockChildren[prevoiusTask].classList.remove("selected");
                blockChildren[num].classList.add("selected");
                searchBlock.scrollTop = blockChildren[num].offsetTop - 10;
                currentTaskSearch = blockChildren[num].id;
            }
        }
    }

    updateTime() {
        blockClass.items.forEach((task) => {
            if(task.id == "todo" || task.id == "in-progress") {
                const currentTaskHtml = document.getElementById(`${task.taskId}`);
                const dateP = currentTaskHtml.querySelector(".task-date");
                dateP.remove();
                currentTaskHtml.innerHTML += `
                    <p class="task-date">${calculateDate(task.date, task.time)}</p>
                `;
                if(calculateDate(task.date, task.time) == "59 minutes") {
                    sendMessage(task.title, "59 minutes")
                }
            } else {
                return
            }
        })
    }
}

const blockClass = new NewBlock();

submitCreate.addEventListener("click", () => {
    blockClass.addTask(titleHTML.value, descriptionHTML.value, dateHTML.value, timeHTML.value);
})

addPopup.addEventListener("keydown", (e) => {
    if(e.key == "Enter") {
        blockClass.addTask(titleHTML.value, descriptionHTML.value, dateHTML.value, timeHTML.value);
    }
})

blockContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("add")) {
        id = event.target.id;
        openPopup();
    } else if(event.target.classList.contains("task")) {
        openChangePopup();
        currentTaskId = Number(event.target.id);
        blockClass.openTask(currentTaskId);
    } else if(event.target.classList.contains("checkbox")) {
        blockClass.hideBlock(event.target);
        const checkboxes = [
            {
                name: "todo",
                checked: document.getElementById("todo-checkbox").checked
            },
            {
                name: "in-progress",
                checked: document.getElementById("in-progress-checkbox").checked
            },
            {
                name: "in-review",
                checked: document.getElementById("in-review-checkbox").checked
            },
            {
                name: "done",
                checked: document.getElementById("done-checkbox").checked
            }
        ];
        localStorage.setItem("checkboxes", JSON.stringify(checkboxes));
    } else if(!event.target.classList.contains("search-block") && !event.target.classList.contains("search") && !event.target.classList.contains("search-task")) {
        if(!searchBlock.classList.contains("hidden")) {
            searchBlock.classList.add("hidden");
            emptySearch.classList.add("hidden")
        }
    } else if(event.target.classList.contains("search-task")) {
        blockClass.searchTask(event.target.id);
    }
});

bin.addEventListener("click", () => {
    deletePopup.classList.remove("hidden");
    blackoutDelete.classList.remove("hidden");
    confirmDelete.addEventListener("click", () => {
        hideChangePopup();
        deletePopup.classList.add("hidden");
        blackoutDelete.classList.add("hidden");
        blockClass.removeTask(currentTaskId);
    })
    cancelDelete.addEventListener("click", () => {
        deletePopup.classList.add("hidden");
        blackoutDelete.classList.add("hidden");
    })
});

pin.addEventListener("click", () => {
    blockClass.pinTask(currentTaskId)
})

submitChange.addEventListener("click", () => {
    blockClass.changeTask(currentTaskId);
})

changePopup.addEventListener("keydown", (e) => {
    if(e.key == "Enter") {
        blockClass.changeTask(currentTaskId);
    }
})

blackout.addEventListener("click", () => {
    closePopup.classList.remove("hidden");
    blackoutDelete.classList.remove("hidden");
    confirmClose.addEventListener("click", () => {
        hidePopup();
        hideChangePopup();
        closePopup.classList.add("hidden");
        blackoutDelete.classList.add("hidden");
    })
    cancelClose.addEventListener("click", () => {
        closePopup.classList.add("hidden");
        blackoutDelete.classList.add("hidden");
    })
});

blockContainer.addEventListener("keydown", (e) => {
    if(addPopup.classList.contains("hidden") && changePopup.classList.contains("hidden")) {
        return
    } else {
        if(e.key === "Escape") {
            hidePopup();
            hideChangePopup();
        }
    }
})

search.addEventListener("click", () => {
    searchBlock.classList.remove("hidden");
    blockClass.changeSearchMenu();
})

search.addEventListener("input", () => {
    blockClass.changeSearchMenu();
})

search.addEventListener("keydown", (e) => {
    if(e.key === "ArrowDown" || e.key === "ArrowUp") {
        blockClass.selectTask(e.key);
    } else if(e.key === "Tab" || e.key === "Enter") {
        blockClass.searchTask(currentTaskSearch);
        searchBlock.scrollTop = 0;
        num = -1;
    }
})

function loadTasks() {
    const rawTasks = JSON.parse(localStorage.getItem("item")); 
    const rawCheckboxes = JSON.parse(localStorage.getItem("checkboxes"));
    taskId = JSON.parse(localStorage.getItem("taskIdStorage"));
    if(rawCheckboxes == null) {
        return
    } else {
        rawCheckboxes.forEach((checkbox) => {
            blockClass.hideBlock(checkbox);
            document.getElementById(`${checkbox.name}-checkbox`).checked = checkbox.checked;
        })
    }
    if(rawTasks == null) {
        return
    } else {
        rawTasks.forEach((task) => {
            const block = window.document.getElementById(`${task.id}-block`);
            blockClass.items.push({
                taskId: task.taskId,
                title: task.title,
                description: task.description,
                date: task.date,
                time: task.time,
                id: task.id,
                isPinned: task.isPinned
            });
            if(task.id === "in-review") {
                if(task.isPinned == true) {
                    block.innerHTML += `
                    <div class="task pinned" id="${task.taskId}" draggable="true">
                        <p class="task-title">${task.title}</p>
                        <p class="task-date">in review</p>
                    </div>
                    `;
                } else {
                    block.innerHTML += `
                    <div class="task" id="${task.taskId}" draggable="true">
                        <p class="task-title">${task.title}</p>
                        <p class="task-date">in review</p>
                    </div>
                    `;
                }
            } else if(task.id === "done") {
                if(task.isPinned == true) {
                    block.innerHTML += `
                    <div class="task pinned" id="${task.taskId}" draggable="true">
                        <p class="task-title">${task.title}</p>
                        <p class="task-date">done</p>
                    </div>
                    `;
                } else {
                    block.innerHTML += `
                    <div class="task" id="${task.taskId}" draggable="true">
                        <p class="task-title">${task.title}</p>
                        <p class="task-date">done</p>
                    </div>
                    `;
                }
            } 
            else {
                if(task.isPinned == true) {
                    block.innerHTML += `
                    <div class="task pinned" id="${task.taskId}" draggable="true">
                        <p class="task-title">${task.title}</p>
                        <p class="task-date">${calculateDate(task.date, task.time)}</p>
                    </div>
                    `;
                } else {
                    block.innerHTML += `
                    <div class="task" id="${task.taskId}" draggable="true">
                        <p class="task-title">${task.title}</p>
                        <p class="task-date">${calculateDate(task.date, task.time)}</p>
                    </div>
                    `;
                }
            }
        })
    }
}

window.addEventListener("load", loadTasks());

const allBlocks = document.querySelectorAll(".block");

function addTasksEventListeners() {
    tasks = document.querySelectorAll(".task");
    tasks.forEach((task) => {
        task.addEventListener("dragstart", () => {
            tasks = document.querySelectorAll(".task");
            task.classList.add("dragging");
        });

        task.addEventListener("dragend", () => {
            tasks = document.querySelectorAll(".task");
            task.classList.remove("dragging")
            localStorage.setItem("item", JSON.stringify(blockClass.items));
        })
    })
}

addTasksEventListeners()

allBlocks.forEach((block) => {
    block.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        const currentTask = blockClass.items.find((task) => task.taskId == dragging.id);
        if(block.id == "in-progress-block-wrapper") {
            currentTask.id = "in-progress"
            dragging.querySelector(".task-date").remove();
            dragging.innerHTML += `
                <p class="task-date">${calculateDate(currentTask.date, currentTask.time)}</p>
            `
        } else if(block.id == "in-review-block-wrapper"){
            currentTask.id = "in-review"
            dragging.querySelector(".task-date").remove();
            dragging.innerHTML += `
                <p class="task-date">in review</p>
            `
        } else {
            const formattedId = block.id.split("-")[0];
            currentTask.id = formattedId
            if(formattedId == "done") {
                dragging.querySelector(".task-date").remove();
                dragging.innerHTML += `
                    <p class="task-date">done</p>
                `
            } else {
                dragging.querySelector(".task-date").remove();
                dragging.innerHTML += `
                    <p class="task-date">${calculateDate(currentTask.date, currentTask.time)}</p>
                `
            }
        }
        block.appendChild(dragging)
    })
})

setInterval(blockClass.updateTime, 60000)