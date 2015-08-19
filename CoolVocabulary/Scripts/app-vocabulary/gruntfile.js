module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            options: {
              curly: true,
              eqeqeq: true,
              eqnull: true,
              browser: true,
              globals: {
                jQuery: true
              }
            },
            all: ["vocabulary.js",
                  "ct_adapter.js",
                  "components/**/*.js",
                  "controllers/**/*.js",
                  "helpers/**/*.js",
                  "models/**/*.js",
                  "routes/**/*.js"
             ]
        },
        clean: ["app/"],
        concat: {
            js: {
                src: ["vocabulary.js",
		          "ct_adapter.js",
	              "components/**/*.js",
	              "controllers/**/*.js",
	              "helpers/**/*.js",
	              "models/**/*.js",
	              "routes/**/*.js"
		     ],
                dest: 'app/vocabulary.js'
            },
            css: {
                src: ['content/**/*.css','!content/common.css'],
                dest: 'app/vocabulary.css'
            },
        },
        emberTemplates: {
            compile: {
                options: {
                    templateBasePath: "templates/",
                    templateName: function (sourceFile) {
                        return sourceFile.replace("templates/", "");
                    }
                },
                files: {
                        "app/vocabulary-templates.js" : "templates/**/*.hbs"
                }
            }
        },
    	uglify: {
                app: {
                  files: {
                    'app/vocabulary.min.js': ['app/vocabulary.js'],
                    'app/vocabulary-templates.min.js': ['app/vocabulary-templates.js'],

                  }
                }
            },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'app/vocabulary.min.css': ['app/vocabulary.css']
                }
            }
        },
        watch: {
            files: ["gruntfile.js",
            "content/**/*.css",
            "templates/**/*.hbs",
		    "vocabulary.js",
		    "ct_adapter.js",
            "components/**/*.js",
            "controllers/**/*.js",
            "helpers/**/*.js",
            "models/**/*.js",
            "routes/**/*.js"],
            tasks : ["jshint", "clean", "concat", "emberTemplates", "uglify", "cssmin"]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ember-templates');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', 'watch')
};