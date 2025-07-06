import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
import en from './locales/en.json';
import vi from './locales/vi.json';
import ja from './locales/ja.json';

const resources = {
    en: {
        translation: en
    },
    vi: {
        translation: vi
    },
    ja: {
        translation: ja
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            lookupLocalStorage: 'selectedLanguage',
            caches: ['localStorage']
        },

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
