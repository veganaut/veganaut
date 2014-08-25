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
                locationAction: 'Diesen Ort besuchen'
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
            points: 'Punkte',
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
                gastronomy: 'Gastro',
                retail: 'Detailhandel',
                event: 'Event',
                'private': 'Privat'
            }
        },
        map: {
           mission: {
               title: 'Missionen',
               pointsForThisVisit: 'Punkte für diesen Besuch',
               missionForm: {
                   submit: 'Abschliessen',
                   cancel: 'Abbrechen'
               },
               visitForm: {
                   submit: 'Besuch beenden'
               },
               visit: {
                   title: 'Bonus für die erste Mission',
                   explanation: 'Für deinen ersten Besuch an einem Ort innerhalb +/- einer Woche erhälst du zusätzliche Punkte. Sobald du hier die erste Mission erfüllt hast, werden dir diese Zusatzpunkte gutgeschrieben. Falls dies dein zweiter, dritter oder x-ter Besuch innerhalb +/- einer Woche ist, erhälst du keine Zusatzpunkte mehr. Aber vielleicht kennst du ein anderes Teammitglied, das schon länger nicht mehr hier war und darum einen Bonus erhalten würde...'
               },
               optionsAvailable: {
                   title: 'Frag das Personal, ob es hier etwas Veganes gibt.',
                   description: 'Gibt es hier etwas Veganes?',
                   explanation: 'Das Personal kann nicht Gedanken lesen. Frage darum ausdrücklich nach etwas Veganem und benutze dazu das Wort "vegan". So stellst du sicher, dass das Personal merkt: "Unsere Kundschaft ist interessiert an veganen Produkten, es besteht eine Nachfrage." Das erhöht die Chance, dass das vegane Angebot vergrössert und verbessert wird.',
                   form: {
                       yes: 'Ja',
                       no: 'Nein'
                   },
                   outcome: {
                       hasVegan: 'Du hast gesagt, es gebe hier etwas Veganes.',
                       noVegan: 'Du hast gesagt, es gebe hier nichts Veganes.'
                   }
               },
               whatOptions: {
                   title: 'Finde heraus, was für vegane Angebote es hier gibt.',
                   description: 'Welche veganen Angebote gibt es hier?',
                   explanation: 'Hilf mit, dass die Liste der veganen Angebote hier möglichst aktuell und vollständig ist. Füge vegane Angebote hinzu, die noch nicht auf der Liste sind, bestätige vegane Angebote, die bereits da stehen, und gib an, welche Angebote auf der Liste (im Moment) nicht mehr verfügbar sind.',
                   form: {
                       placeholder: 'Hier ein veganes Angebot eintragen'
                   },
                   outcome: {
                       description: 'Du hast diese veganen Angebote eingetragen/bestätigt:'
                   }
               },
               buyOptions: {
                   title: 'Kauf etwas Veganes.',
                   description: 'Was hast du gekauft?',
                   explanation: 'Interessiert dich das eine oder andere vegane Angebot, das es hier gibt? Dann kannst du dem Personal mit einem Kauf zeigen, dass es sich lohnt, etwas Veganes anzubieten. Wenn es passt, kannst du beim Zahlen gerne ausdrücklich sagen, dass du dieses Angebot u.a. deshalb gewählt hast, weil es vegan ist. Je öfter das Personal das Wort "vegan" von der Kundschaft in einem positiven Zusammenhang hört, desto besser.',
                   outcome: {
                       description: 'Du hast diese veganen Angebote gekauft:'
                   }
               },
               staffFeedback: {
                   title: 'Gib dem Personal eine Rückmeldung.',
                   description: 'Was für eine Rückmeldung hast du dem Personal gegeben?',
                   explanation: 'Manchmal weiss das Personal nicht, was "vegan" bedeutet. Manchmal kannst du dem Personal einen guten Tipp geben. Manchmal hat das Personal eine Frage, die du beantwortet kannst. Manchmal bist du sehr zufrieden mit dem Angebot, manchmal weniger. Hier kannst du schreiben, was du dem Personal gesagt hast. Oder was du dem Personal hättest sagen wollen.',
                   form: {
                       placeholder: 'Rückmeldung',
                       didNotDoIt: 'Ich wollte dem Personal diese Rückmeldung geben, habe es dann aber nicht gemacht.'
                   },
                   outcome: {
                       didIt: 'Du hast dem Personal diese Rückmeldung gegeben:',
                       didNotDoIt: 'Du wolltest dem Personal diese Rückmeldung geben:'
                   }
               },
               rateLocation: {
                   title: 'Bewerte die veganen Angebote, die es hier gibt.',
                   description: 'Wie bewertest du diese veganen Angebote?',
                   explanation: 'Über Geschmack lässt sich nicht streiten, aber die Chancen stehen gut, dass etwas, was dir gefällt, auch anderen gefallen wird. Umgekehrt ist es auch gut möglich, dass etwas, was dich nicht überzeugt, auch bei anderen nicht so gut ankommt. Aber die Meinung der anderen muss dich hier nicht kümmern. Gib einfach deine persönliche Bewertung ab.',
                   outcome: {
                       description: 'Deine Bewertung:'
                   }
               },
               veganeed: {
                   title: 'Gib an, wie viel es hier für Veganaut_innen noch zu tun gibt.',
                   description: 'Wie viel gibt es hier noch zu tun für Veganaut_innen?',
                   explanation: 'An manchen Orten hat es kaum etwas oder gar nichts Veganes im Angebot, oder das vegane Angebot ist noch nicht befriedigend. An solchen Orten gibt es für Veganaut_innen am meisten zu tun. An anderen Orten gibt es bereits eine gewisse vegane Auswahl, die z.T. auch überzeugt. Auch hier können Veganaut_innen noch viel bewirken. Wieder andere Orte haben ein beachtliches veganes Angebot, sowohl was die Auswahl als auch die Qualität angeht, und der Einsatz von Veganaut_innen kann nur noch wenig verbessern. Schliesslich gibt es Orte, deren Angebot 100% vegan ist von der Qualität her nichts zu wünschen übrig lässt. Hier können Veganaut_innen nur noch kommen, um zu geniessen.'
               }
           }
        },
        tour: {
            intro: [
                {
                    title: 'Willkommen!',
                    content: 'Veganaut.net wünscht dir viel Spass bei der Erkundung des veganen Universums! Wir sind noch daran, diese Platform zu entwickeln, aber du kannst sie bereits brauchen. Es kann sein, dass das eine oder andere noch nicht richtig funktioniert. Dafür bitten wir um Entschuldigung. Wenn du Anregungen oder Rückmeldungen hast, ist das für uns sehr wertvoll. Du kannst dazu das Kontaktformular (im Menu oben) verwenden.'
                },
                {
                    title: 'Das veganautische Netzwerk',
                    content: '[under construction]'
                },
                {
                    title: 'Veganautische Spiele',
                    content: '[under construction]'
                },
                {
                    title: 'Wie das Spiel funktioniert',
                    content: '[under construction]'
                },
                {
                    title: 'Wie die Punkte verteilt werden',
                    content: '[under construction]'
                },
                {
                    title: 'Registrieren',
                    content: 'Registriere dich jetzt und mach mit!'
                }
            ]
        }
    });
})(window.veganaut.mainModule);
