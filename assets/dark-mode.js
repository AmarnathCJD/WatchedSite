const button = document.getElementById("dark-mode");

const mainTitle = document.getElementById("header-main");
const main = document.getElementById("main-content");
const infoBox = document.getElementById("info-box");
const suggest = document.getElementById("suggest");
const titleCast = document.getElementById("title-cast");
const description = document.getElementById("description");
const sideTitle = document.getElementById("title-div");
const nav = document.getElementById("nav");
const footer = document.getElementById("footer");
const footer_bottom = document.getElementById("footer-bottom");

function enableTheme() {
    document.body.classList.add("dark-mode");
    document.body.classList.add("bg-gray-700");
    mainTitle.classList.replace("bg-white", "bg-gray-900");
    $("#main-title").css("color", "white");
    main.classList.toggle("bg-gray-800");
    infoBox.classList.toggle("bg-gray-900");
    suggest.classList.toggle("text-white");
    titleCast.classList.toggle("text-white");
    description.classList.replace("text-gray-700", "text-white");
    sideTitle.classList.replace("text-gray-900", "text-white");
    nav.classList.replace("bg-red-500", "bg-gray-800");
    footer.classList.replace("bg-gray-100", "bg-gray-800");
    footer_bottom.classList.replace("bg-gray-200", "bg-gray-900");
    localStorage.setItem("dark-mode", "true");
}

function disableTheme() {
    document.body.classList.remove("dark-mode");
    document.body.classList.remove("bg-gray-700");
    mainTitle.classList.replace("bg-gray-900", "bg-white");
    $("#main-title").css("color", "black");
    main.classList.toggle("bg-gray-800");
    infoBox.classList.toggle("bg-gray-900");
    suggest.classList.toggle("text-white");
    titleCast.classList.toggle("text-white");
    description.classList.replace("text-white", "text-gray-700");
    sideTitle.classList.replace("text-white", "text-gray-900");
    nav.classList.replace("bg-gray-800", "bg-red-500");
    footer.classList.replace("bg-gray-900", "bg-gray-100");
    footer_bottom.classList.replace("bg-gray-900", "bg-gray-200");
    localStorage.setItem("dark-mode", "false");
}

function toggleTheme() {
    if (document.body.classList.contains("dark-mode")) {
        disableTheme();
    } else {
        enableTheme();
    }
}

button.addEventListener("click", toggleTheme);

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("dark-mode") === "true") {
        enableTheme();
    }
});
