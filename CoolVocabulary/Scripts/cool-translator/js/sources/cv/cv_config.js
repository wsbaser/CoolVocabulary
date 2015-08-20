var CVConfig = function() {
	var siteHost = "http://localhost:13189";
    return {
        id: "cv",
        name: "Cool Vocabulary",
        ajax: {
            getBooks: siteHost + "/vocabulary/api/getbooks",
            isAuthenticated: siteHost + "/account/isAuthenticated",
            login: siteHost + '/account/apilogin'
        },
        path: {
            vocabulary: siteHost,
        }
    };
};