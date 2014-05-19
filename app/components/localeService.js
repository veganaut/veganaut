(function(servicesModule) {
    'use strict';

    /**
     * locale service provides the translation strings
     */
    servicesModule.value('localeService', {
        app: {
            title: 'veganaut.net'
        },
        navigation: {
            front: 'Home',
            register: 'Registrieren',
            login: 'Login',
            logout: 'Logout',
            profile: 'Mein Profil',
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
                nickname: 'Spitzname (öffentlich)',
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
                createActivityLink: {
                    attract: 'Attract',
                    support: 'Support',
                    tempt: 'Tempt',
                    unspecified: 'Make a move'
                }
            }
        },
        activityLink: {
            title: 'Neue Aktivität',
            label: {
                targetName: 'Mit / Für'
            },
            form: {
                targetName: 'Wen?',
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
            team: {
                blue: 'Blau',
                green: 'Grün'
            },
            label: {
                email: 'E-Mail Adresse',
                fullName: 'Name',
                nickname: 'Spitzname',
                role: 'Rolle',
                team: 'Team',
                balance: 'Balance',
                captured: 'Gefangen'
            }
        },
        score: {
            totalScore: 'Punktestand',
            players: 'Spieler',
            captured: 'Gefangen',
            babies: 'Babies'
        },
        tour: {
            intro: [
                {
                    title: 'Willkommen!',
                    content: 'Willkommen, das ist veganaut.net, ein Hub für Entdeckerinnen und Erkunder des veganen Universums. Ich bin Iris, deine Lotsin.'
                },
                {
                    title: 'Das veganautische Netzwerk',
                    content: 'Das ist das veganautische Netzwerk. Es umfasst alle Veganautinnen und Veganauten, von Rookies bis zu Veterans. Die Punkte stehen für die Leute, die Linien für die Interaktionen zwischen ihnen.'
                },
                {
                    title: 'Veganautische Spiele',
                    content: 'Veganautinnen sind Entdecker, die in kulinarische Galaxien vordringen, die nie ein Mensch zuvor erlebt hat, aber sie wollen auch Spass und Spiele. Deshalb teilen sie sich regelmässig in zwei Teams auf, das grüne und das blaue (die Farben ihres Heimatplaneten), und versuchen einander in einem freundlichen Wettbewerb zu übertrumpfen. Auf der Anzeigetafel siehst du, wer gerade die Nase vorne hat.'
                },
                {
                    title: 'Wie das Spiel funktioniert',
                    content: 'Das Spiel funktioniert ein bisschen wie Fangen (oder wie es in der Schweiz heisst: Fangis), nur musst du deine "Opfer" nicht fangen, sondern ihnen etwas veganes zu essen geben. Wenn sie es annehmen, hast du sie. Darum gib ihnen etwas super-leckeres, damit sie nicht widerstehen können!'
                },
                {
                    title: 'Wie die Punkte verteilt werden',
                    content: 'Ein Team verliert einen Punkt für jede Veganautin, die dem Essen des anderen Teams nicht widerstehen konnte. Punkte können zurückgewonnen werden, indem neue Veganautinnen für das Team rekrutiert oder Veganautinnen, die der Versuchung nicht widerstehen konnten, wieder "befreit" werden. Beides macht man mit veganem Essen.'
                },
                {
                    title: 'Registrieren',
                    content: 'Registriere dich jetzt und mach mit!'
                }
            ]
        }
    });
})(window.monkeyFace.servicesModule);
