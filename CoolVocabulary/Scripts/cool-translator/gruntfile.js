
module.exports = function (grunt) {

    grunt.initConfig({
        concat: {
            dist: {
                src: ["Scripts/user-admin.js", "Scripts/user-admin/**/*.js"],
                dest: 'Scripts/user-admin-app.js',
            },
        },
        watch: {
            files: ["Scripts/user-admin/templates/**/*.hbs","Scripts/user-admin.js", "Scripts/user-admin/**/*.js"],
            tasks : ["emberTemplates", "concat"]
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', 'watch')
};