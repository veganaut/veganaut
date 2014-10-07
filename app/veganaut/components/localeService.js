(function(module) {
    'use strict';

    /**
     * locale service provides the translation strings
     */
    module.value('localeService', {
        app: {
            title: 'veganaut.net - beta'
        },
        general: {
            team: 'Team',
            person: 'VeganautIn'
        },
        navigation: {
            front: 'Home',
            register: 'Registrieren',
            login: 'Login',
            logout: 'Logout',
            map: 'Karte',
            score: 'Teams',
            profile: 'Profil',
            avatar: 'Netzwerk',
            activities: 'Einladungen',
            blog: 'Blog',
            contactForm: 'Kontakt',
            twitter: 'Twitter',
            facebook: 'Facebook',
            github: 'GitHub',
            bugs: 'Bugreport'
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
                addLocation: 'Neue Location',
                locationAction: 'Location anschauen'
            },
            location: {
                backToMap: 'Zurück zur Karte'
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
                fullName: 'Vorname und Nachname',
                nickname: 'Nickname (öffentlich sichtbar)',
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
            team3: 'Violett',
            team4: 'Rot',
            team5: 'Orange'
        },
        score: {
            points: 'Punkte',
            score: 'Punktestand',
            users: 'Spieler',
            captured: 'Gefangen',
            babies: 'Babies',
            teams: {
                title: 'Teams',
                locations: '# Locations',
                people: '# VeganautInnen'
            },
            people: {
                title: 'VeganautInnen',
                missions: '# Missionen',
                filter: {
                    onlyMyTeam: 'Nur meine Teammitglieder anzeigen.'
                }
            }
        },
        location: {
            form: {
                name: 'Name der Location',
                selectOnMap: 'Wähle einen Punkt auf der Karte aus',
                chooseType: 'Art der Location auswählen',
                submit: 'Fertig'
            },
            products: {
                title: 'Angebot',
                description: 'An dieser Location bestehen die folgenden veganen Angebote:',
                noProducts: {
                    anonymous: 'Es wurden noch keine Angebote eingetragen. <a href="/register">Registriere</a> dich, um vegane Angebote einzutragen.',
                    user: 'Es wurden noch keine Angebote eingetragen. Mit einer der Missionen kannst du Angebote eintragen.'
                }
            },
            type: {
                gastronomy: 'Gastro',
                retail: 'Shopping',
                event: 'Event',
                'private': 'Privat',
                explanation: 'Typ dieser Location'
            },
            score: {
                explanation: {
                    availablePoints: 'Momentan hier verfügbare Punkte',
                    scoreDiff: {
                        positive: 'So viele Punkte ist dein Team hier voraus',
                        negative: 'So viele Punkte fehlen deinem Team hier noch'
                    },
                    teamPoints: 'Dieses Team hat hier so viele Punkte'
                }
            },
            quality: {
                explanation: 'Je mehr Zweige, desto grösser und besser das vegane Angebot'
            }
        },
        map: {
           mission: {
               title: 'Missionen',
               totalPoints: 'Total Punkte aus Missionen',
               missionForm: {
                   submit: 'Fertig',
                   cancel: 'Abbrechen'
               },
               visitBonus: {
                   title: 'Besuche diese Location.',
                   explanation: 'Für deinen ersten Besuch innerhalb von ein paar Wochen erhälst du Punkte.',
                   description: 'Schliesse diese Mission nur ab, wenn du diese Location jetzt besuchst.'
               },
               hasOptions: {
                   title: 'Frag das Personal, ob es hier etwas Veganes gibt.',
                   description: 'Gibt es hier laut dem Personal etwas Veganes?',
                   description2: 'Was denkst du, gibt es etwas Veganes?',
                   explanation: 'Frage ausdrücklich nach etwas Veganem und benutze dazu das Wort "vegan". So stellst du sicher, dass das Personal merkt: "Unsere Kundschaft ist interessiert an veganen Produkten, es besteht eine Nachfrage." Das erhöht die Chance, dass das vegane Angebot vergrössert und verbessert wird.',
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
                       ratherYes: 'Das Personal weiss es nicht, aber du denkst, es gibt hier wohl etwas Veganes.',
                       noClue: 'Das Personal weiss es nicht, und auch du hast keine Ahnung, ob es hier etwas Veganes gibt.',
                       ratherNo: 'Das Personal weiss es nicht, aber du denkst, es gibt hier wohl nichts Veganes.'
                   }
               },
               wantVegan: {
                   title: 'Erkläre dem Personal, was "vegan" heisst.',
                   description: 'Welche Ausdrücke hast du beim Erklären gebraucht?',
                   explanation: 'Manchmal weiss das Personal nicht, was "vegan" bedeutet, oder du bist nicht sicher, ob sie es wissen. Manchmal meinen sie, sie wüssten es, aber verwechseln es offensichtlich mit etwas anderem, oder sie vergessen, dass z.B. Butter nicht vegan ist.',
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
                       description: 'Du hast dem Personal erklärt, was "vegan" heisst, indem du diese Ausdrücke verwendet hast:'
                   }
               },
               particularOption: { // @toebu was hälst du von dieser Mission?
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
               newOption: { // @toebu was hälst du von dieser Mission?
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
                   description2: 'Die folgenden musst du nicht mehr eintragen:',
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
                   explanation: 'Mit einem Kauf kannst du dem Personal zeigen, dass es sich lohnt, etwas Veganes anzubieten. Wenn du willst, kannst du beim Zahlen gerne ausdrücklich sagen, dass du dieses Angebot u.a. deshalb gewählt hast, weil es vegan ist. Je öfter das Personal das Wort "vegan" von der Kundschaft in einem positiven Zusammenhang hört, desto besser.',
                   outcome: {
                       description: 'Du hast diese veganen Angebote gekauft:'
                   }
               },
               giveFeedback: {
                   title: 'Gib dem Personal eine Rückmeldung.',
                   description: 'Was für eine Rückmeldung hast du dem Personal gegeben?',
                   explanation: 'Manchmal kannst du dem Personal einen guten Tipp geben. Manchmal hat das Personal eine Frage, die du beantwortet kannst. Manchmal bist du sehr zufrieden mit dem Angebot, manchmal weniger. Hier kannst du schreiben, worüber du mit dem Personal gesprochen hast.',
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
                   explanation: 'Über Geschmack lässt sich nicht streiten. Gib einfach deine persönliche Bewertung ab.',
                   outcome: {
                       description: 'Deine Bewertung:'
                   }
               },
               offerQuality: {
                   title: 'Beurteile, wie gut diese Location veganautische Bedürfnisse befriedigt.',
                   description: 'Wie gut befriedigt diese Location veganautische Bedürfnisse?',
                   explanation: 'Veganautinnen und Veganauten wollen ein möglichst grosses und möglichst gutes veganes Angebot. In manchen Locations hat es kaum etwas oder gar nichts Veganes, oder das vegane Angebot ist noch nicht befriedigend. In anderen Locations gibt es bereits eine gewisse vegane Auswahl, die z.T. auch überzeugt. Wieder andere Locations haben ein beachtliches veganes Angebot, sowohl was die Auswahl als auch die Qualität angeht. Schliesslich gibt es Locations, deren veganes Angebot nichts zu wünschen übrig lässt.',
                   outcome: {
                       description: 'Dein Urteil:'
                   }
               },
               effortValue: {
                   title: 'Schätze ab, wie gut die Chancen stehen, dass das vegane Angebot hier vergrössert und verbessert wird.',
                   description: 'Wie gut stehen die Chancen, dass das vegane Angebot hier vergrössert und verbessert wird?',
                   explanation: 'In manchen Locations hat das Personal Null Interesse an "vegan", anderswo ist man offener oder hat schon erste Schritte in Richtung grösseres und besseres veganes Angebot unternommen und wartet nur darauf, dass die Kundschaft mehr davon nachfragt.',
                   form: {
                       yes: 'gut',
                       ratherYes: 'eher gut',
                       ratherNo: 'eher schlecht',
                       no: 'schlecht'
                   },
                   outcome: {
                       yes: 'gut.',
                       ratherYes: 'eher gut',
                       ratherNo: 'eher schlecht',
                       no: 'schlecht.'
                   }
               }
           }
        },
        tour: {
            introBeta: [
                {
                    title: 'Willkommen!',
                    content: 'Interessierst du dich für veganes Essen? Auf Veganaut.net siehst du, wo andere etwas Veganes gefunden haben, und kannst deine eigenen Entdeckungen eintragen.'
                },
                {
                    title: 'Pflanzen-Symbol',
                    content: 'Die meisten Locations haben ein Pflanzen-Symbol. Je mehr Zweige, desto grösser und besser das vegane Angebot.' +
                    '<div class="text-center h4"><span class="icon icon-1"></span><span class="icon icon-2"></span><span class="icon icon-3"></span><span class="icon icon-4"></span><span class="icon icon-5"></span></div>' +
                    'Locations ohne Pflanzen-Symbol wurden noch nicht bewertet.'
                },
                {
                    title: 'Gastro und Shopping',
                    content: 'Es gibt zwei Typen von Locations: Gastro (Restaurant, Take Away...) und Shopping (Supermarkt, Bioladen, Bäckerei...)'
                },
                {
                    title: 'Registrieren',
                    content: 'Als registrierte Benutzerin oder registrierter Benutzer gehörst du einem von fünf Teams an: ' +
                    '<span class="color-team1">Blau</span>, <span class="color-team2">Grün</span>, <span class="color-team3">Violett</span>, <span class="color-team4">Rot</span> oder <span class="color-team5">Orange</span>. ' +
                    'Das Spiel geht darum, die Locations der anderen Teams zu erobern und die eigenen Locations zu verteidigen.'
                }
            ],
            mapUser: [
                {
                    title: 'Dein Team',
                    content: 'Du wurdest eben aus dem Weltraumschlaf aufgeweckt. Seit dem "Kleinen Weltuntergang" im 2086 (vor 5042 Jahren) bist du tiefgefroren in einem von fünf riesigen Raumschiffen um die Erde gekreist. An der Farbe der Knöpfe auf deinem Interface siehst du, in welchem Raumschiff du dich befindest: ' +
                    '<span class="color-team1">Blau</span>, <span class="color-team2">Grün</span>, <span class="color-team3">Violett</span>, <span class="color-team4">Rot</span> oder <span class="color-team5">Orange</span>.'
                },
                {
                    title: 'Dein Ziel',
                    content: 'Im Raumschiff gibt\'s nur "Space Gunk" zu essen: eine graue, geschmacklose Nährstoffmasse. Doch Veganautinnen und Veganauten, die von Erkundungsmissionen zurückkehren, erzählen neuerdings davon, dass auf der Erdoberfläche wieder essbare Pflanzen wachsen. Dein Ziel ist es, diese essbaren Pflanzen zu finden, zu vermehren und für dein Team zu sichern.'
                },
                {
                    title: 'Missionen',
                    content: 'Wähle auf der Karte einen Ort aus und klicke auf "Location anschauen", um die verfügbaren Missionen anzuzeigen.'
                },
                {
                    title: 'Locations hinzufügen',
                    content: 'Wenn du eine Location kennst, die auf der Karte noch fehlt, kannst du sie hinzufügen. Klicke dazu auf "Neue Location" und folge den Anweisungen.'
                },
                {
                    title: 'Sag uns deine Meinung',
                    content: 'Wenn du Anregungen oder Rückmeldungen hast, wie wir veganaut.net verbessern können: Das Kontaktformular ist im Menu oben verlinkt.'
                }
             ],
             locationUser: [
                {
                    title: 'Missionen',
                    content: ' Die meisten Missionen kannst du nur erfüllen, wenn du dich an diesem Ort befindest.'
                }
            ]
        }
    });
})(window.veganaut.mainModule);
