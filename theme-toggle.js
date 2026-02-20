(function () {
    const STORAGE_KEY = "site_theme";
    const DARK_CLASS = "theme-dark";
    const TOGGLE_SELECTOR = ".js-theme-toggle";

    const getStoredTheme = () => localStorage.getItem(STORAGE_KEY);
    const isDarkPreferred = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    const applyTheme = (theme) => {
        const isDark = theme === "dark";
        document.body.classList.toggle(DARK_CLASS, isDark);
        document.querySelectorAll(TOGGLE_SELECTOR).forEach((button) => {
            button.setAttribute("aria-pressed", String(isDark));
            button.textContent = isDark ? "Light mode" : "Dark mode";
        });
    };

    const setTheme = (theme) => {
        localStorage.setItem(STORAGE_KEY, theme);
        applyTheme(theme);
    };

    const initTheme = () => {
        const stored = getStoredTheme();
        const theme = stored || (isDarkPreferred() ? "dark" : "light");
        applyTheme(theme);
    };

    const initButtons = () => {
        document.querySelectorAll(TOGGLE_SELECTOR).forEach((button) => {
            button.addEventListener("click", () => {
                const nextTheme = document.body.classList.contains(DARK_CLASS) ? "light" : "dark";
                setTheme(nextTheme);
            });
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        initTheme();
        initButtons();
    });
})();
