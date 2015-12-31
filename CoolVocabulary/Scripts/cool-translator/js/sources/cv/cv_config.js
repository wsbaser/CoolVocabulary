var CVConfig = function() {
	var siteOrigin = DEBUG?
        'http://localhost:13189':
        'http://coolvocabulary.com';
    return {
        id: "cv",
        name: "Cool Vocabulary",
        siteOrigin: siteOrigin,
        ajax: {
            checkAuthentication: siteOrigin + "/account/checkAuthentication",
            login: siteOrigin + '/account/apilogin',
            externalLogin: siteOrigin + '/account/ExternalLogin',
            getBooks: siteOrigin + "/api/book",
            addTranslation: siteOrigin + '/api/translation'
        },
        path: {
            CTOAuth: siteOrigin+ '/CTOAuth',
            vocabulary: siteOrigin+'/vocabulary'
        }
    };
};