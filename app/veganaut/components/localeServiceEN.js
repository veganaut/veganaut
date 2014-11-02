/*
(function(module) {
    'use strict';
*/

    /**
     * locale service provides the translation strings
     */
    /*
    module.value('localeService', {
        app: {
            title: 'veganaut.net'
        },
        navigation: {
            front: 'Home',
            register: 'Register',
            login: 'Login',
            logout: 'Logout',
            map: 'Map',
            profile: 'My Profile',
            avatar: 'My Network',
            openActivities: 'Planned Invitations',
            referenceCode: 'Enter Invitation-Code'
        },
        form: {
            referenceCode: {
                placeholder: 'Enter invitation-code',
                submit: 'Submit code'
            }
        },
        message: {
            registered: 'Registered successfully.',
            activityLinkCreated: 'Invitation created.',
            profile: {
                update: {
                    success: 'Profile updated successfully.',
                    fail: 'Sorry, your profile couldn\'t be updated.'
                }
            }
        },
        register: {
            title: 'Register',
            form: {
                email: 'email@example.com',
                fullName: 'First name and last name',
                nickname: 'Nickname (publicly visible)',
                password: 'Password',
                passwordRepeat: 'Password again',
                submit: 'Register'
            }
        },
        login: {
            title: 'Login',
            form: {
                email: 'email@example.com',
                password: 'Password',
                submit: 'Login'
            }
        },
        action: {
            register: 'Registrieren',
            cancel: 'Cancel',
            socialGraph: {
                createActivityLink: {
                    attract: 'Invite',
                    support: 'Invite',
                    tempt: 'Invite',
                    unspecified: 'Invite someone'
                }
            },
            profile: {
                edit: 'Edit profile',
                save: 'Save profile',
                changePassword: 'Change password'
            },
            map: {
                addLocation: 'Add new location',
                locationAction: 'Visit this place now'
            }
        },
        activityLink: {
            title: 'New invitation',
            label: {
                targetName: 'With / For'
            },
            form: {
                targetName: 'Who?',
                choose: 'What?',
                submit: 'Save and continue'
            }
        },
        socialGraph: {
            title: 'My network'
        },
        openActivities: {
            title: 'Planned invitations',
            description: 'Codes for all planned invitations.'
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
                email: 'Email',
                fullName: 'Name',
                nickname: 'Nickname',
                role: 'Role',
                team: 'Team',
                balance: 'Balance',
                captured: 'Captured',
                password: 'Password',
                passwordRepeat: 'Repeat password'
            }
        },
        team: {
            blue: 'Blue',
            green: 'Green'
        },
        score: {
            points: 'Points',
            totalScore: 'Score',
            players: 'Players',
            captured: 'Captures',
            babies: 'Babies'
        },
        location: {
            form: {
                name: 'Name of the location',
                selectOnMap: 'Choose a point on the map',
                chooseType: 'Choose location type',
                submit: 'Save'
            },
            type: {
                gastronomy: 'Restaurant/Take-Away',
                retail: 'Retail',
                event: 'Event',
                'private': 'Private'
            }
        },
        map: {
            mission: {
                title: 'Missions',
                pointsForThisVisit: 'Points for this visit',
                missionForm: {
                    submit: 'Complete',
                    cancel: 'Cancel'
                },
                visitForm: {
                    submit: 'End visit',
                    validation: {
                        noMission: 'You have to complete a mission first.',
                        openMission: 'You have to cancel or complete all open missions first.'
                    }
                },
                visitBonus: {
                    title: 'Bonus for this visit',
                    explanation: 'For you first visit at a location within a few weeks you get additional points. If this is your second, third or one-hundredth visit within a few weeks you don\'t get anything extra. But maybe you know a teammate who hasn\'t been here yet, or who wasn\'t here for a long time. They\'d get the bonus points...'
                },
                hasOptions: {
                    title: 'Ask the staff whether there are any vegan options available here.',
                    description: 'Are there any vegan options available here?',
                    explanation: 'The staff can\'t read minds. Therefore, ask explicitly for something vegan and use the word "vegan" in doing so. In this way you can make sure that the staff realises: "Our customers are interested in vegan options, there\'s a demand." This improves the chances that they\'l supply more and better vegan options in future.',
                    form: {
                        yes: 'Yes',
                        no: 'No'
                    },
                    outcome: {
                        hasVegan: 'You said that there are vegan options available here.',
                        noVegan: 'You said that there are no vegan options available here.'
                    }
                },
                whatOptions: {
                    title: 'Find out what vegan options are available here.',
                    description: 'What vegan options are available here?',
                    explanation: 'The goal is to make the list of vegan options as complete and as up-to-date as possible. Add vegan options that aren\'t on the list yet, confirm vegan options that are already listed and indicate which vegan options on the list are not available (at the moment).',
                    form: {
                        placeholder: 'Enter a vegan option here'
                    },
                    outcome: {
                        description: 'You entered/confirmed these vegan options:'
                    }
                },
                buyOptions: {
                    title: 'Buy something vegan.',
                    description: 'What did you buy?',
                    explanation: 'Do you fancy one or the other vegan option available here? If so, you can show the staff that it pays off to supply vegan options by buying. And while you\'re paying, why not mention that you chose this option (in part) because it\'s vegan? The more the staff hears the word "vegan" in a positive context, the better.',
                    outcome: {
                        description: 'You bought these vegan options:'
                    }
                },
                giveFeedback: {
                    title: 'Give the staff feedback.',
                    description: 'What feedback did you give the staff?',
                    explanation: 'Sometimes the staff doesn\'t know what "vegan" means. Sometimes you can provide them with tips or suggestions. Sometimes you are very happy with what you got, sometimes less so. Write here what you talked about with the staff. Or what you\'d have wanted to talk about.',
                    form: {
                        placeholder: 'Feedback',
                        didNotDoIt: 'I wanted to give the staff this feedback but then I didn\'t.'
                    },
                    outcome: {
                        didIt: 'You gave the staff this feedback:',
                        didNotDoIt: 'You wanted to give the staff this feedback:'
                    }
                },
                rateOptions: {
                    title: 'Rate the vegan options available here.',
                    description: 'How do you rate these vegan option?',
                    explanation: 'There\'s no accounting for taste, but chances are that if you like something other people will like it too. Conversely, if something doesn\'t convince you then it\'s quite possible that other people won\'t fancy it either. But never mind other people\'s opinion here. Just provide the ratings that are right for you personally.',
                    outcome: {
                        description: 'Your rating:'
                    }
                },
                veganeed: {
                    title: 'Indicate how much there is still to do for veganauts here.',
                    description: 'How much is there still to do for veganauts here?',
                    explanation: 'At some places there are no or hardly any vegan options, or the vegan options aren\'t convincing yet. At places like these veganauts still have most to do. At other places there already are a few vegan options, some of which are satisfying. Veganauts still have quite something to do at such places. Yet other places have a quite remarkable range of vegan options, many of which are great. Here, veganauts have almost nothing left to do. Finally, there are places where there are only vegan options and they are all fantastic, so there\'s nothing left for veganauts to do except relax and enjoy.'
                }
            }
        },
        tour: {
            intro: [
                {
                    title: 'Welcome!',
                    content: 'Have fun exploring the vegan universe with veganaut.net. We\'re still developing this platform, but you can already use it. It\'s possible that not everything works perfeclty, so please excuse us. If you have suggestions or feedback we\'re grateful. The contact form is linked in the menu.'
                },
                {
                    title: 'Register',
                    content: 'If you register now you can use the full functionality of the platform.'
                }
            ]
        }
    });
})(window.veganaut.mainModule);
*/
