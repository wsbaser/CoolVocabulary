var CVConfig = function() {
	var siteOrigin = "http://localhost:13189";
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
        },
        iconBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wgZCQgZkb5OyQAAAqBJREFUOMudkl1I3XUYxz+/3//o6bxo6lELmWhqbdDxQsmQCI/Diw3pokLY3TBYd1msYYVgZUUEMjKJgthYsVEMxmgUbGFjvoxlXrSbU2jGP0/zJTueHY7mOf1fny7c5AijYN/b7/f5PC88jF7fCF24uRoAmPr5FvfSuPl65Kp5MXgvTzui4tczkSsiM2WJx+v3mJnfNwFYJ3VqkguXxBTjJ3N2L0AJTs4xel640jY/PJl9+q7xoXmC2CPlnDSPH95m80iOzKExBvvamzr3ArKuERDA9lVdKl8y/fL3uTMicLzpJOfNT5pvsfCth6sEnwyrHwBMmZd3AYEtR5fYvgLAFaU2rED/se+2ts6tjL03Z12e83D1TlSR5a/GJTNV39jUsHss9dGNjRdns6HPVNFYSmk8JpZrDny8r3hcHygNd8SHk/nDRuGPhF0WHwyk8iXzGpCioOfZrK9E94WqW4jWLCKiCAq02x7PJGeThrWNGGG0kxnSjqg1rSRf1J/CdhqlFcvJ51DapcoTXs3aPPu3i2EVQGkQdx3PTev9ZdaqVqwU1eN6BZQC1wnjpDoYyFmU+4K/6e1kxMcLPrQ4dejTtH6psybfHLbe8u/uIGAYIUSAoEft1w1EEBBQWwJK8EqryTUO9TyvlK/fncrwZiL21WNRa1zfIYTCVYBP6W0H41cfXzT8I+D4iBHZth584qmGeJsNoIcTMd6fzvBOd9UrzVG7q0TJQiAQIhiOEf2lgAruQFXaxYm0JN0H6h+t7X77h9W5z3ceCWCoK8bpuXVGEpUzX/RGD8TL80cqKx6eKU17RMsL6NuyZpe1vlHZe7bVC9b+CVD3ZD//qQlZDh49eOm3L4dHrsnSQAX3o9f6vpn48cZKNfer06PTvf+X+Re3wyE2uAyk0AAAAABJRU5ErkJggg=="
    };
};