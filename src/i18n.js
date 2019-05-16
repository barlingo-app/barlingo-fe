import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';


i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(reactI18nextModule)
    .init({
        fallbackLng: {
            'en-GB': ['en-US'],
            'default': ['es-ES']
        },
        debug: process.env.REACT_APP_I18N_DEBUG,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        whitelist: [
            'en-US', 
            'es-ES'
        ],
        load: [
            'en-US', 
            'es-ES'
        ],
        preload: [
            'en-US', 
            'es-ES'
        ],
        ns: [
            'translations'
        ],
        defaultNS: 'translations',
        // special options for react-i18next
        // learn more: https://react.i18next.com/components/i18next-instance
        react: {
            wait: true,
        },
    });

export default i18n;