(function(servicesModule) {
    'use strict';

    /**
     * localProvider provides the translation strings
     */
    servicesModule.provider('localeProvider', function() {
        var translations = {
            'app.title': 'veganaut.net',
            'navigation.register': 'Registrieren',
            'navigation.login': 'Login',
            'navigation.logout': 'Logout',
            'navigation.avatar': 'Mein Netzwerk',
            'navigation.openActivities': 'Offene Aktivitäten',
            'form.referenceCode.placeholder': 'Referenz-Code eingeben',
            'form.referenceCode.submit': 'Code absenden',
            'message.registered': 'Registrierung erfolgreich.',
            'register.title': 'Registrieren',
            'register.form.email': 'email@beispiel.com',
            'register.form.fullName': 'Vorname und Nachname',
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
            'activityLink.form.location': 'Wo?',
            'activityLink.form.startTime': 'Wann? (Format: JJJJ-MM-TT)',
            'activityLink.form.submit': 'Speichern und Weiter',
            'message.activityLinkCreated': 'Aktivität erstellt.',
            'socialGraph.title': 'Mein Netzwerk',
            'openActivities.title': 'Offene Aktivitäten',
            'openActivities.description': 'Referenz-Codes für alle offenen Aktivitäten.'
        };

        this.$get = function() {
            return {
                translations: translations
            };
        };
    });
})(window.monkeyFace.servicesModule);
