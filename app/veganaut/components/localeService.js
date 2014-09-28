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
            facebook: 'Facebook',
            github: 'GitHub',
            bugs: 'Fehler melden'
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
                nickname: 'Öffentlicher Name',
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
                addLocation: 'Neue Location hinzufügen',
                locationAction: 'Diese Location jetzt besuchen'
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
                nickname: 'Öffentlicher Name',
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
                name: 'Name der Location',
                selectOnMap: 'Wähle einen Punkt auf der Karte aus',
                chooseType: 'Art der Location auswählen',
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
               visitBonus: {
                   title: 'Bonus für den ersten Besuch',
                   explanation: 'Für deinen ersten Besuch an einer Location innerhalb von ein paar Wochen erhälst du zusätzliche Punkte. Falls dies dein zweiter, dritter oder x-ter Besuch innerhalb von ein paar Wochen ist, erhälst du keine Zusatzpunkte mehr. Aber vielleicht kennst du ein anderes Teammitglied, das noch nie oder schon länger nicht mehr hier war und darum einen Bonus erhalten würde...',
                   description: 'Besuche diese Location'
               },
               hasOptions: {
                   title: 'Frag das Personal, ob es hier etwas Veganes gibt.',
                   description: 'Gibt es hier laut dem Personal etwas Veganes?',
                   description2: 'Was denkst du, gibt es etwas Veganes?',
                   explanation: 'Das Personal kann nicht Gedanken lesen. Frage darum ausdrücklich nach etwas Veganem und benutze dazu das Wort "vegan". So stellst du sicher, dass das Personal merkt: "Unsere Kundschaft ist interessiert an veganen Produkten, es besteht eine Nachfrage." Das erhöht die Chance, dass das vegane Angebot vergrössert und verbessert wird.',
                   form: {
                       theyDoNotKnow: 'Sie wissen es nicht',
                       yes: 'Ja',
                       no: 'Nein',
                       ratherYes: 'Eher ja',
                       noClue: 'Keine Ahnung',
                       ratherNo: 'Eher nein'
                   },
                   outcome: {
                       yes: 'Du hast gesagt, es gebe hier laut dem Personal etwas Veganes.',
                       no: 'Du hast gesagt, es gebe hier laut dem Personal nichts Veganes.',
                       ratherYes: 'Eher ja',
                       noClue: 'Keine Ahnung',
                       ratherNo: 'Eher nein'
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
                       custom: 'Andere:',
                       placeholder: 'Andere gebrauchte Ausdrücke'
                   },
                   outcome: {
                       description: 'Du hast dem Personal gesagt, dass du an einem veganen Angebot interessiert bist, indem du diese Ausdrücke verwendet hast:'
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
                       placeholder: 'Rückmeldung'
                   },
                   outcome: {
                       description: 'Du hast dem Personal diese Rückmeldung gegeben:'
                   }
               },
               rateOptions: {
                   title: 'Bewerte einzelne vegane Angebote, die es hier gibt.',
                   description: 'Wie bewertest du diese veganen Angebote?',
                   explanation: 'Über Geschmack lässt sich nicht streiten, aber die Chancen stehen gut, dass etwas, was dir gefällt, auch anderen gefallen wird. Umgekehrt ist es auch gut möglich, dass etwas, was dich nicht überzeugt, auch bei anderen nicht gut ankommt. Aber die Meinung der anderen muss dich hier nicht kümmern. Gib einfach deine persönliche Bewertung ab.',
                   outcome: {
                       description: 'Deine Bewertung:'
                   }
               },
               offerQuality: {
                   title: 'Beurteile, wie gut diese Location veganautische Bedürfnisse befriedigt.',
                   description: 'Wie gut befriedigt diese Location veganautische Bedürfnisse?',
                   explanation: 'Veganautinnen und Veganauten wollen ein möglichst grosses und möglichst gutes veganes Angebot. In manchen Locations hat es kaum etwas oder gar nichts Veganes im Angebot, oder das vegane Angebot ist noch nicht befriedigend. In anderen Locations gibt es bereits eine gewisse vegane Auswahl, die z.T. auch überzeugt. Wieder andere Locations haben ein beachtliches veganes Angebot, sowohl was die Auswahl als auch die Qualität angeht. Schliesslich gibt es Locations, deren Angebot 100% vegan ist von der Qualität her nichts zu wünschen übrig lässt.',
                   outcome: {
                       description: 'Dein Urteil:'
                   }
               },
               effortValue: {
                   // TODO: @SebuLeugger: improve these texts
                   title: 'Schätze ab, wie stark sich das vegane Angebot in dieser Location vergrössern und verbessern wird, wenn mehr Veganautinnen und Veganauten hierher kommen.',
                   description: 'Wie stark wird sich das vegane Angebot in dieser Location deiner Einschätzung nach vergrössern und verbessern, wenn mehr Veganautinnen und Veganauten hierher kommen?',
                   explanation: 'In manchen Locations hat das Personal, die Chefin oder der Besitzer eine starke Abneigung gegenüber "vegan". Andere Locations sind 100% vegan. In beiden Locations wird sich am Angebot nicht viel ändern, wenn mehr Veganautinnen und Veganauten hingehen. Dann gibt es Locations, wo das Personal, der Chef und die Besitzerin zwar keine Abneigung gegenüber "vegan" haben, aber noch zweifeln, ob sich eine Investition in ein (besseres/grösseres) veganes Angebot lohnt oder nicht. Hier ist die Chance höher, dass sich das vegane Angebot verbessert, wenn mehr Veganautinnen und Veganauten hingehen. Weiter gibt es Locations, die gerne mehr veganes anbieten möchten, aber nicht wissen, was oder wie genau. Auch hier können Veganautinnen und Veganauten viel bewirken.',
                   form: {
                       yes: 'Eher ja',
                       no: 'Eher nein'
                   },
                   outcome: {
                       yes: 'Eher ja.',
                       no: 'Eher nein.'
                   }
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
