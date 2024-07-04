const themeElement = document.getElementById('theme');
const mainElement = document.getElementById('main');

themeElement.addEventListener('change', () => {
    if (themeElement.value === "light") {
        mainElement.className = "light-theme";
    }
    else {
        mainElement.className = "dark-theme";
    }   
});
