(function(servicesModule) {
    'use strict';

    /**
     * locale service provides the translation strings
     */
    servicesModule.value('locale', {
        'app.title': 'veganaut.net',
        'navigation.register': 'Registrieren',
        'navigation.login': 'Login',
        'navigation.logout': 'Logout',
        'navigation.avatar': 'Mein Netzwerk',
        'navigation.openActivities': 'Offene Aktivitäten',
        'navigation.referenceCode': 'Referenz-Code eingeben',
        'form.referenceCode.placeholder': 'Referenz-Code eingeben',
        'form.referenceCode.submit': 'Code absenden',
        'message.registered': 'Registrierung erfolgreich.',
        'register.title': 'Registrieren',
        'register.form.email': 'email@beispiel.com',
        'register.form.fullName': 'Vorname und Nachname',
        'register.form.role': 'Rolle auswählen',
        'register.form.password': 'Passwort',
        'register.form.passwordRepeat': 'Nochmals Passwort',
        'register.form.submit': 'Registrieren',
        'login.title': 'Login',
        'login.form.email': 'email@beispiel.com',
        'login.form.password': 'Passwort',
        'login.form.submit': 'Login',
        'action.register': 'Registrieren',
        'activityLink.title': 'Neue Aktivität',
        'activityLink.form.targetName': 'Mit wem? / Für wen?',
        'activityLink.label.targetName': 'Mit / Für',
        'activityLink.form.choose': 'Was?',
        'activityLink.form.submit': 'Speichern und Weiter',
        'message.activityLinkCreated': 'Aktivität erstellt.',
        'socialGraph.title': 'Mein Netzwerk',
        'action.socialGraph.createActivityLink': 'Aktivität erstellen',
        'openActivities.title': 'Offene Aktivitäten',
        'openActivities.description': 'Referenz-Codes für alle offenen Aktivitäten.',
        'person.role.veteran': 'Veteran',
        'person.role.scout': 'Scout',
        'person.role.rookie': 'Rookie',
        'person.type.baby': 'Baby',
        'person.type.maybe': 'Maybe',
        'person.captured': 'Gefangen',
        'person.balance': 'Balance'
    });
})(window.monkeyFace.servicesModule);
