(function () {
    const DEFAULT_LANGUAGE = "nl";
    const STORAGE_KEY = "site_language";
    const SELECTOR_CLASS = "js-language-select";
    const GOOGLE_ELEMENT_ID = "google_translate_element";
    const MAX_ATTEMPTS = 60;

    const getSavedLanguage = () => localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE;

    const setGoogleTranslateCookie = (language) => {
        const target = `/nl/${language}`;
        const cookie = `googtrans=${target}; path=/`;
        document.cookie = cookie;
        if (window.location.hostname.includes(".")) {
            document.cookie = `${cookie}; domain=.${window.location.hostname}`;
        }
    };

    const clearGoogleTranslateCookie = () => {
        document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = `googtrans=; path=/; domain=.${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    };

    const syncSelectors = (language) => {
        const selects = document.querySelectorAll(`.${SELECTOR_CLASS}`);
        selects.forEach((select) => {
            select.value = language;
        });
    };

    const setGoogleComboLanguage = (language, attempt = 0) => {
        const combo = document.querySelector(".goog-te-combo");
        if (!combo) {
            if (attempt < MAX_ATTEMPTS) {
                setTimeout(() => setGoogleComboLanguage(language, attempt + 1), 200);
            }
            return;
        }

        if (combo.value !== language) {
            combo.value = language;
            combo.dispatchEvent(new Event("change"));
        }
    };

    const applyLanguage = (language) => {
        localStorage.setItem(STORAGE_KEY, language);
        syncSelectors(language);

        if (language === DEFAULT_LANGUAGE) {
            clearGoogleTranslateCookie();
            window.location.reload();
            return;
        }

        setGoogleTranslateCookie(language);
        setGoogleComboLanguage(language);
    };

    const applySavedLanguageOnLoad = () => {
        const current = getSavedLanguage();
        if (current === DEFAULT_LANGUAGE) return;
        setGoogleTranslateCookie(current);
        setGoogleComboLanguage(current);
    };

    const bindSelectors = () => {
        const selects = document.querySelectorAll(`.${SELECTOR_CLASS}`);
        const current = getSavedLanguage();
        syncSelectors(current);

        selects.forEach((select) => {
            select.addEventListener("change", (event) => {
                const next = event.target.value || DEFAULT_LANGUAGE;
                applyLanguage(next);
            });
        });
    };

    window.googleTranslateElementInit = function () {
        new window.google.translate.TranslateElement(
            {
                pageLanguage: DEFAULT_LANGUAGE,
                autoDisplay: false
            },
            GOOGLE_ELEMENT_ID
        );
        applySavedLanguageOnLoad();
    };

    document.addEventListener("DOMContentLoaded", () => {
        bindSelectors();
        applySavedLanguageOnLoad();
    });

    window.addEventListener("load", () => {
        applySavedLanguageOnLoad();
    });
})();
