(function(module) {
    'use strict';

    /**
     * locale service provides the translation strings
     */
    module.value('localeService', {
        app: {
            title: 'veganaut.net'
        },
        navigation: {
            front: 'Home',
            register: 'Registrieren',
            login: 'Login',
            logout: 'Logout',
            map: 'Karte',
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
            activityLinkCreated: 'Aktivität erstellt.',
            profile: {
                update: {
                    success: 'Profil wurde erfolgreich aktualisiert.',
                    fail: 'Profil konnte nicht aktualisiert werden.'
                }
            }
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
            cancel: 'Abbrechen',
            socialGraph: {
                createActivityLink: {
                    attract: 'Attract',
                    support: 'Support',
                    tempt: 'Tempt',
                    unspecified: 'Make a move'
                }
            },
            profile: {
                edit: 'Profil bearbeiten',
                save: 'Profil speichern',
                changePassword: 'Passwort ändern'
            },
            map: {
                addLocation: 'Neuen Ort hinzufügen',
                viewDetails: 'Details anschauen'
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
            label: {
                email: 'E-Mail Adresse',
                fullName: 'Name',
                nickname: 'Spitzname',
                role: 'Rolle',
                team: 'Team',
                balance: 'Balance',
                captured: 'Gefangen',
                password: 'Passwort',
                passwordRepeat: 'Passwort wiederholen'
            }
        },
        team: {
            blue: 'Blau',
            green: 'Grün'
        },
        score: {
            totalScore: 'Punktestand',
            players: 'Spieler',
            captured: 'Gefangen',
            babies: 'Babies'
        },
        location: {
            form: {
                name: 'Name des Ortes',
                selectOnMap: 'Wähle einen Punkt auf der Karte aus',
                chooseType: 'Typ des Ortes auswählen',
                submit: 'Speichern'
            },
            type: {
                gastronomy: 'Gastronomy',
                retail: 'Retail',
                event: 'Event',
                'private': 'Private'
            }
        },
        map: {
           mission: {
               title: 'Missionen',
               form: {
                   submit: 'Abschliessen',
                   cancel: 'Abbrechen'
               },
               optionsAvailable: {
                   title: 'Frag das Personal, ob es hier etwas veganes gibt.',
                   description: 'Gibt es hier etwas veganes?',
                   explanation: 'Das Personal kann nicht Gedanken lesen. Frage darum ausdrücklich nach etwas veganem und benutze dazu das Wort "vegan". So stellst du sicher, dass das Personal merkt: "Unsere Kundschaft ist interessiert an veganen Produkten, es besteht eine Nachfrage." Das erhöht die Chance, dass das vegane Angebot vergrössert und verbessert wird.'
               },
               whatOptions: {
                   title: 'Finde heraus, was für vegane Angebote es hier gibt.',
                   description: 'Welche veganen Angebote gibt es hier?',
                   explanation: 'Hilf mit, dass die Liste der veganen Angebote hier möglichst aktuell und vollständig ist. Füge vegane Angebote hinzu, die noch nicht auf der Liste sind, bestätige vegane Angebote, die bereits da stehen, und gib an, welche Angebote auf der Liste (im Moment) nicht mehr verfügbar sind.'
               },
               buyOptions: {
                   title: 'Kauf etwas veganes.',
                   description: 'Was hast du gekauft?',
                   explanation: 'Interessiert dich das eine oder andere vegane Angebot, das es hier gibt? Dann kannst du dem Personal mit einem Kauf zeigen, dass es sich für das Geschäft lohnt, etwas veganes anzubieten. Wenn es passt, kannst du beim Zahlen gerne ausdrücklich sagen, dass du dieses Angebot gewählt hast, weil es vegan ist. Je öfter das Personal das Wort "vegan" von der Kundschaft in einem positiven Zusammenhang hört, desto besser.'
               },
               staffFeedback: {
                   title: 'Gib dem Personal eine Rückmeldung.',
                   description: 'Was für eine Rückmeldung hast du dem Personal gegeben?',
                   explanation: 'Manchmal weiss das Personal nicht, was "vegan" bedeutet. Manchmal kannst du dem Personal einen guten Tipp geben. Manchmal hat das Personal eine Frage, die du beantwortet kannst. Manchmal bist du sehr zufrieden mit dem Angebot, manchmal weniger. Hier kannst du schreiben, was du dem Personal gesagt hast. Oder was du dem Personal hättest sagen wollen.'
               },
               rateLocation: {
                   title: 'Bewerte die veganen Angebote, die es hier gibt.',
                   description: 'Wie bewertest du diese veganen Angebote?',
                   explanation: 'Über Geschmack lässt sich nicht streiten, aber die Chancen stehen gut, dass etwas, was dir gefällt, auch anderen gefallen wird. Umgekehrt ist es auch gut möglich, dass etwas, was dich nicht überzeugt, auch bei anderen nicht so gut ankommt. Aber die Meinung der anderen muss dich hier nicht kümmern. Gib einfach deine persönliche Bewertung ab.'
               }
           }
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
})(window.veganaut.mainModule);
