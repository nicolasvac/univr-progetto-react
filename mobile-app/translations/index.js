// Locale
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Languages
import english from './en.json'
import italian from './it.json'
const resources = {
    LANG_EN: english,
    LANG_IT: italian,
}

i18n.use(initReactI18next).init({
    resources,
    lng: "LANG_IT",

    keySeparator: false,

    interpolation: {
        escapeValue: false
    }
});

export default i18n;
