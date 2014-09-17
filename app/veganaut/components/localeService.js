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
            profile: 'Profil',
            avatar: 'Netzwerk',
            activities: 'Einladungen',
            blog: 'Blog',
            contactForm: 'Kontakt',
            twitter: 'Twitter',
            facebook: 'Facebook'
        },
        form: {
            referenceCode: {
                placeholder: 'Einladungs-Code eingeben',
                submit: 'Code absenden'
            }
        },
        message: {
            registered: 'Registrierung erfolgreich.',
            activityLinkCreated: 'Einladung erstellt.',
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
                    attract: 'Invite',
                    support: 'Invite',
                    tempt: 'Invite',
                    unspecified: 'Jemanden einladen'
                }
            },
            profile: {
                edit: 'Profil bearbeiten',
                save: 'Profil speichern',
                changePassword: 'Passwort ändern'
            },
            map: {
                addLocation: 'Neuen Ort hinzufügen',
                locationAction: 'Diesen Ort jetzt besuchen'
            }
        },
        activityLink: {
            title: 'Neue Einladung',
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
            title: 'Geplante Einladungen',
            description: 'Codes für deine geplanten Einladungen:'
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
            team1: 'Blau',
            team2: 'Grün',
            team3: 'Türkis',
            team4: 'Rot',
            team5: 'Braun'
        },
        score: {
            points: 'Punkte',
            score: 'Punktestand',
            users: 'Spieler',
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
            },
            score: {
                explanation: {
                    availablePoints: 'Momentan verfügbare Punkte',
                    scoreDiff: {
                        positive: 'So viele Punkte ist dein Team voraus',
                        negative: 'So viele Punkte fehlen deinem Team noch'
                    },
                    teamPoints: 'Dieses Team hat so viele Punkte'
                }
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
                   submit: 'Besuch beenden',
                   validation: {
                       noMission: 'Du musst zuerst eine Mission abschliessen.',
                       openMission: 'Du musst zuerst alle offenen Missionen abschliessen oder abbrechen.'
                   }
               },
               visitBonus: {
                   title: 'Bonus für den ersten Besuch',
                   explanation: 'Für deinen ersten Besuch an einem Ort innerhalb von ein paar Wochen erhälst du zusätzliche Punkte. Falls dies dein zweiter, dritter oder x-ter Besuch innerhalb von ein paar Wochen ist, erhälst du keine Zusatzpunkte mehr. Aber vielleicht kennst du ein anderes Teammitglied, das noch nie oder schon länger nicht mehr hier war und darum einen Bonus erhalten würde...'
               },
               hasOptions: {
                   title: 'Frag das Personal, ob es hier etwas Veganes gibt.',
                   description: 'Gibt es hier laut dem Personal etwas Veganes?',
                   explanation: 'Das Personal kann nicht Gedanken lesen. Frage darum ausdrücklich nach etwas Veganem und benutze dazu das Wort "vegan". So stellst du sicher, dass das Personal merkt: "Unsere Kundschaft ist interessiert an veganen Produkten, es besteht eine Nachfrage." Das erhöht die Chance, dass das vegane Angebot vergrössert und verbessert wird.',
                   form: {
                       yes: 'Ja',
                       no: 'Nein'
                   },
                   outcome: {
                       hasVegan: 'Du hast gesagt, es gebe hier laut dem Personal etwas Veganes.',
                       noVegan: 'Du hast gesagt, es gebe hier laut dem Personal nichts Veganes.'
                   }
               },
               wantVegan: {
                   title: 'Sag dem Personal, dass du an einem veganen Angebot interessiert bist.',
                   description: 'Welche Ausdrücke hast du gebraucht, um dem Personal dein Interesse an einem veganen Angebot mitzuteilen?',
                   explanation: 'Bringe irgendwie zum Ausdruck, dass du an einem veganen Angebot interessiert bist. Das Personal soll merken: "Unsere Kundschaft ist interessiert an veganen Produkten, es besteht eine Nachfrage." So steigt die Chance, dass das vegane Angebot hier vergrössert und verbessert wird.',
                   form: {
                       vegan: 'vegan',
                       plantbased: '(rein) pflanzlich',
                       noAnimalproducts: 'ohne Tierprodukte',
                       noMeat: 'ohne Fleisch',
                       noMilk: 'ohne Milchprodukte',
                       noEggs: 'ohne Eier',
                       noHoney: 'ohne Honig',
                       noWool: 'ohne Wolle',
                       noLeather: 'ohne Leder',
                       noFur: 'ohne Fell',
                       other: 'Andere:',
                       placeholder: 'Hier andere Ausdrücke eintragen, die du gebraucht hast'
                   },
                   outcome: {
                       wordsUsed: 'Du hast dem Personal gesagt, dass du an einem veganen Angebot interessiert bist, indem du diese Ausdrücke verwendet hast:'
                   }
               },
               particularOption: {
                   title: 'Frage nach einem bestimmten veganen Produkt.',
                   description: 'Nach welchen veganen Produkt hast du gefragt?',
                   explanation: 'Frag das Personal nach einem oder mehreren veganen Produkten, die dich interessieren. Wenn sie sie z.T. noch nicht im Angebot haben, nehmen sie sie vielleicht ins Sortiment auf, wenn genügend Leute danach fragen.',
                   form: {
                       placeholder: 'Hier Produkt eintragen, nach dem du gefragt hast',
                       haveIt: 'Gibt\'s hier',
                       doNotHaveIt: 'Gibt\'s hier nicht'
                   },
                   outcome: {
                       description: 'Du hast nach diesen veganen Produkten gefragt:'
                   }
               },
               newOption: {
                   title: 'Frage, ob es neue vegane Produkte im Angebot hat.',
                   description: 'Hat es laut dem Personal neue vegane Produkte im Angebot?',
                   explanation: 'Frag das Personal, ob sie hier in letzter Zeit neue vegane Produkte ins Angebot aufgenommen haben.',
                   form: {
                       placeholder: 'Hier neues veganes Produkt eintragen',
                       somethingNew: 'Neu erhältlich',
                       nothingNew: 'Nichts neues'
                   },
                   outcome: {
                       description: 'Laut dem Personal neu erhältlich:',
                       descriptionNothing: 'Laut dem Personal ist nichts neues erhältlich.'
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
               giveFeedback: {
                   title: 'Gib dem Personal eine Rückmeldung.',
                   description: 'Was für eine Rückmeldung hast du dem Personal gegeben?',
                   explanation: 'Manchmal weiss das Personal nicht, was "vegan" bedeutet. Manchmal kannst du dem Personal einen guten Tipp geben. Manchmal hat das Personal eine Frage, die du beantwortet kannst. Manchmal bist du sehr zufrieden mit dem Angebot, manchmal weniger. Hier kannst du schreiben, worüber du mit dem Personal gesprochen hast. Oder was du dem Personal hättest sagen wollen.',
                   form: {
                       placeholder: 'Rückmeldung',
                       didNotDoIt: 'Ich wollte dem Personal diese Rückmeldung geben, habe es dann aber nicht gemacht.'
                   },
                   outcome: {
                       didIt: 'Du hast dem Personal diese Rückmeldung gegeben:',
                       didNotDoIt: 'Du wolltest dem Personal diese Rückmeldung geben:'
                   }
               },
               rateOptions: {
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
                    content: 'Viel Spass beim Erkunden des veganen Universums. Wir sind noch daran, diese Platform zu entwickeln. Es kann sein, dass noch nicht alles richtig funktioniert. Wenn du Anregungen oder Rückmeldungen hast: Das Kontaktformular ist im Menu oben verlinkt.'
                },
                {
                    title: 'Registrieren',
                    content: 'Registriere dich, um die volle Funktionalität der Platform nützen zu können.'
                }
            ]
        }
    });
})(window.veganaut.mainModule);
