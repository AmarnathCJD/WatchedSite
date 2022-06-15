const button = document.getElementById("dark-mode")
const topButton = document.getElementById("dark-mode-top");
const buttonsm = document.getElementById("dark-mode-sm");
const mainTitle = document.getElementById("header-main");
const main = document.getElementById("main-content");
const infoBox = document.getElementById("info-box");
const suggest = document.getElementById("suggest");
const titleCast = document.getElementById("title-cast");
const description = document.getElementById("description");
const sideTitle = document.getElementById("title-div");
const nav = document.getElementById("nav");
const footer = document.getElementById("footer");

function enableTheme() {
    document.body.classList.add("dark-mode");
    document.body.classList.add("bg-gray-700");
    if (mainTitle != null) {
        mainTitle.classList.replace("bg-white", "bg-gray-900");
        $("#main-title").css("color", "white");
    }
    if (main != null) {
        main.classList.toggle("bg-gray-800");
    }
    if (infoBox != null) {
        infoBox.classList.toggle("bg-gray-900");
    }
    if (suggest != null) {
        suggest.classList.toggle("text-white");
    }
    if (titleCast != null) {
        titleCast.classList.toggle("text-white");
    }
    if (description != null) {
        description.classList.replace("text-gray-700", "text-white");
    }
    if (sideTitle != null) {
        sideTitle.classList.replace("text-gray-900", "text-white");
    }
    if (nav != null) {
        nav.classList.replace("bg-red-500", "bg-gray-800");
    }
    if (footer != null) {
        footer.classList.toggle("bg-gray-800");
        $("#footer-text").toggleClass("text-gray-500", "text-gray-400");
        $("#footer-span").toggleClass("text-gray-500", "text-gray-400");
    }
    $("#result-count").toggleClass("text-gray-700", "text-gray-200");
    $("#main-content").toggleClass("bg-white", "bg-gray-800");
    $("#text-title").toggleClass("text-gray-900", "text-gray-200");
    $("#result-table").toggleClass("bg-white", "bg-gray-800");
    localStorage.setItem("dark-mode", "true");
}

function disableTheme() {
    document.body.classList.remove("dark-mode");
    document.body.classList.remove("bg-gray-700");
    if (mainTitle != null) {
        mainTitle.classList.replace("bg-gray-900", "bg-white");
        $("#main-title").css("color", "black");
    }
    if (main != null) {
        main.classList.toggle("bg-gray-800");
    }
    if (infoBox != null) {
        infoBox.classList.toggle("bg-gray-900");
    }
    if (suggest != null) {
        suggest.classList.toggle("text-white");
    }
    if (titleCast != null) {
        titleCast.classList.toggle("text-white");
    }
    if (description != null) {
        description.classList.replace("text-white", "text-gray-700");
    }
    if (sideTitle != null) {
        sideTitle.classList.replace("text-white", "text-gray-900");
    }
    if (nav != null) {
        nav.classList.replace("bg-gray-800", "bg-red-500");
    }
    if (footer != null) {
        footer.classList.toggle("bg-gray-800");
        $("#footer-text").toggleClass("text-gray-400", "text-gray-500");
        $("#footer-span").toggleClass("text-gray-400", "text-gray-500");
    }
    $("#result-count").toggleClass("text-gray-200", "text-gray-700");
    $("#main-content").toggleClass("bg-gray-800", "bg-white");
    $("#text-title").toggleClass("text-gray-200", "text-gray-900");
    $("#result-table").toggleClass("bg-gray-800", "bg-white");
    localStorage.setItem("dark-mode", "false");
}

function toggleTheme() {
    if (document.body.classList.contains("dark-mode")) {
        disableTheme();
    } else {
        enableTheme();
    }
    changeButtonAppearance();
}

function changeButtonAppearance() {
    if (document.body.classList.contains("dark-mode")) {
        topButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sun-fill" viewBox="0 0 16 16">
        <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
        </svg>`;
        topButton.classList.toggle("bg-white");
    } else {
        topButton.innerHTML = `<svg
        xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
        class="bi bi-moon-stars-fill" viewBox="0 0 16 16">
        <path
            d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
        <path
            d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
        </svg>`;
        topButton.classList.toggle("bg-white");
    }
}

if (button != null) {
    button.addEventListener("click", toggleTheme);
}
topButton.addEventListener("click", toggleTheme);
buttonsm.addEventListener("click", toggleTheme);

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("dark-mode") === "true") {
        enableTheme();
        changeButtonAppearance();
    }
});


// Fix Dark Mode Soom 