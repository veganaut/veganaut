(function(servicesModule) {
    'use strict';

    /**
     * locale service provides the translation strings
     */
    servicesModule.value('locale', {
        app: {
            title: 'veganaut.net'
        },
        navigation: {
            register: 'Registrieren',
            login: 'Login',
            logout: 'Logout',
            avatar: 'Mein Netzwerk',
            openActivities: 'Offene Aktivitäten',
            referenceCode: 'Referenz-Code eingeben'
        },
        form: {
            referenceCode: {
                placeholder: 'Referenz-Code eingeben',
                submit: 'Code absenden'
            }
        },
        message: {
            registered: 'Registrierung erfolgreich.',
            activityLinkCreated: 'Aktivität erstellt.'
        },
        register: {
            title: 'Registrieren',
            form: {
                email: 'email@beispiel.com',
                fullName: 'Vorname und Nachname',
                role: 'Rolle auswählen',
                password: 'Passwort',
                passwordRepeat: 'Nochmals Passwort',
                submit: 'Registrieren'
            }
        },
        login: {
            title: 'Login',
            form: {
                email: 'email@beispiel.com',
                password: 'Passwort',
                submit: 'Login'
            }
        },
        action: {
            register: 'Registrieren',
            socialGraph: {
                createActivityLink: 'Aktivität erstellen'
            }
        },
        activityLink: {
            title: 'Neue Aktivität',
            label: {
                targetName: 'Mit / Für'
            },
            form: {
                targetName: 'Mit wem? / Für wen?',
                choose: 'Was?',
                submit: 'Speichern und Weiter'
            }
        },
        socialGraph: {
            title: 'Mein Netzwerk'
        },
        openActivities: {
            title: 'Offene Aktivitäten',
            description: 'Referenz-Codes für alle offenen Aktivitäten.'
        },
        person: {
            role: {
                veteran: 'Veteran',
                scout: 'Scout',
                rookie: 'Rookie'
            },
            type: {
                baby: 'Baby',
                maybe: 'Maybe'
            },
            captured: 'Gefangen',
            balance: 'Balance'
        }
    });
})(window.monkeyFace.servicesModule);
