import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from './assets/translations/';

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en-US',
    whitelist: ['en-US', 'es', 'fr', 'pt-BR'],
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
