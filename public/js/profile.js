const edit = document.querySelector("#edit-btn");
const update = document.querySelector("#update-btn");
const del = document.querySelector("#del-btn");
const delYes = document.querySelector("#yes-del");
const delNo = document.querySelector("#no-del");

//edit profile details
edit.addEventListener("click", () => {
    let inputs = document.querySelector(".user-details").querySelectorAll(".editable");
    inputs.forEach(input => {
        edit.style.display = "none";
        update.style.display = "block";
        input.removeAttribute("readonly");
        input.style.border = "1px solid rgb(200, 71, 84)";
    });
});

// copy updated details into database and disable editing
update.addEventListener("click", () => {
    let inputs = document.querySelector(".user-details").querySelectorAll(".editable");
    inputs.forEach(input => {
        edit.style.display = "block";
        update.style.display = "none";
        input.setAttribute("readonly", "true");
        input.style.border = "none";
    });
});

//Pop up confirm section for user
del.addEventListener("click", () => {
    let controlBtn = document.querySelector(".user-details").querySelector("#control-op-btn");
    controlBtn.style.display = "none";
    let confirmDel = document.querySelector("#confirm-del");
    confirmDel.style.display = "block";
});

//collapse pop up section if choice is NO
delNo.addEventListener("click", () => {
    let controlBtn = document.querySelector(".user-details").querySelector("#control-op-btn");
    controlBtn.style.display = "block";
    let confirmDel = document.querySelector("#confirm-del");
    confirmDel.style.display = "none";
});

//If choise is yes, delete user's data and redirect towards login page closing profile page
//delYes.addEventListener("click", () => {});