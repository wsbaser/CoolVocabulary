var CVConfig = function() {
	var siteOrigin = "http://coolvocabulary.com";
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
            vocabulary: siteOrigin+'/vocabulary'
        }
    };
};