import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
            resources: {
                en: {
                    translation: {
                        //title
                        titleL: "Easily and automatically",
                        titleM:"transfer your IMAP emails",
                        titleR:"from one server to another!",
                        //Stepper
                        etape1:"Serveur source",
                        etape2:"de destination",
                        etape3:"finalisation",
                        //forms
                        ftitleS: "Source server informations",
                        ftitleD: "Destination server informations",
                        //Host
                        inputehost: "Host/server name:",
                        placeholderinputehost: "Enter the hostname",
                        errormessageinputehost: "Host name is required",
                        //Email
                        inputeemail: "Email address:",
                        placeholderinputeemail: "Enter the email address",
                        errormessageinputeemail1: "Email address is required",
                        errormessageinputeemail2: "Invalid email format",
                        //Password
                        inputePassword: "Password:",
                        placeholderinputePassword: "Enter the password",
                        errormessageinputePassword: "Password is required",
                        //Button
                        button:"Next",
                    },
                },
                fr: {
                    translation: {
                        titleL: "Transférez facilement et automatiquement",
                        titleM:"vos courriels IMAP",
                        titleR:"d'un serveur à un autre !",
                        //forms
                        ftitleS: "Informations sur le serveur source",
                        feTileD:"Informations sur le serveur de destination",

                        //Host
                        inputehost: "Nom de l'hôte/du serveur :",
                        placeholderinputehost: "Entrez le nom de l'hôte",
                        errormessageinputehost: "Le nom de l'hôte est requis",
                        //Email
                        inputeemail: "Adresse e-mail :",
                        placeholderinputeemail: "Entrez l'adresse e-mail",
                        errormessageinputeemail1: "L'adresse e-mail est requise",
                        errormessageinputeemail2: "Format de l'adresse e-mail invalide",
                        //Password
                        inputePassword: "Mot de passe :",
                        placeholderinputePassword: "Entrez le mot de passe",
                        errormessageinputePassword: "Le mot de passe est requis",
                        //Button
                        button:"Suivant"
                    },
                },

        },
        fallbackLng: "en",

        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: [
                'navigator',
                'querystring',
                'cookie',
                'localStorage',
                'sessionStorage',
                'htmlTag',
                'path',
                'subdomain',
            ],
            lookupQuerystring: 'lng',
            lookupCookie: 'i18next',
            lookupLocalStorage: 'i18nextLng',
            lookupFromPathIndex: 0,
            lookupFromSubdomainIndex: 0,
            caches: ['localStorage', 'cookie'],
            excludeCacheFor: ['cimode'],
            cookieMinutes: 10,
            cookieDomain: 'myDomain',
            htmlTag: document.documentElement,
            cookieOptions: { path: '/' },
        },
    });

export default i18n;