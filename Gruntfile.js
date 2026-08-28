module.exports = function(grunt) {
    "use strict"

    var banner =
        "/*\n" +
        " * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n" +
        " * (c) <%= grunt.template.today('yyyy') %> <%= pkg.author %>\n" +
        " * Licensed under <%= pkg.license %>\n" +
        " */\n";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            dist: ["dist"]
        },

        copy: {
            imgs: {
                expand: true,
                cwd: "css/",
                src: "*.png",
                dest: "dist/"
            },
            i18n: {
                expand: true,
                cwd: "src/i18n/",
                src: "*.js",
                dest: "dist/i18n/",
                rename: function(dest, src) {
                    return dest + "jsgrid-" + src;
                }
            }
        },

        concat: {
            options: {
                banner: banner + "\n",
                separator: "\n"
            },
            js: {
                src: [
                    "src/jsgrid.core.js",
                    "src/jsgrid.load-indicator.js",
                    "src/jsgrid.load-strategies.js",
                    "src/jsgrid.sort-strategies.js",
                    "src/jsgrid.validation.js",
                    "src/jsgrid.field.js",
                    "src/fields/jsgrid.field.text.js",
                    "src/fields/jsgrid.field.number.js",
                    "src/fields/jsgrid.field.textarea.js",
                    "src/fields/jsgrid.field.select.js",
                    "src/fields/jsgrid.field.checkbox.js",
                    "src/fields/jsgrid.field.control.js",

                    // extra fields, brought in from xfields
                    "src/lib/jsgrid.popup.basic.js",
                    "src/lib/jsGridSummaryPlugin.js",
                    "src/fields/jsgrid.field.Xcheckbox.js",
                    "src/fields/jsgrid.field.XimgField.js",
                    "src/fields/jsgrid.field.Xselect.js",
                    "src/fields/jsgrid.field.Xtextarea.js",
                    "src/fields/jsgrid.field.Xjsoneditor.js",
                    "src/fields/jsgrid.field.XRowSelectField.js",
                    "src/fields/jsgrid.field.XDateTimeField.js"
                ],
                dest: "dist/<%= pkg.name %>.js"
            },
            css: {
                src: "css/jsgrid.css",
                dest: "dist/<%= pkg.name %>.css"
            },
            theme: {
                src: "css/theme.css",
                dest: "dist/<%= pkg.name %>-theme.css"
            }
        },

        uglify: {
            options : {
                banner: banner + "\n"
            },
            js: {
                src: "<%= concat.js.dest %>",
                dest: "dist/<%= pkg.name %>.min.js"
            },
            // extra fields, minified individually too so they can be loaded on their own
            fields: {
                files: [
                    { src: "src/lib/jsgrid.popup.basic.js", dest: "dist/fields/lib/jsgrid.popup.basic.min.js" },
                    { src: "src/lib/jsGridSummaryPlugin.js", dest: "dist/fields/lib/jsGridSummaryPlugin.min.js" },
                    { src: "src/fields/jsgrid.field.Xcheckbox.js", dest: "dist/fields/jsgrid.field.Xcheckbox.min.js" },
                    { src: "src/fields/jsgrid.field.XimgField.js", dest: "dist/fields/jsgrid.field.XimgField.min.js" },
                    { src: "src/fields/jsgrid.field.Xselect.js", dest: "dist/fields/jsgrid.field.Xselect.min.js" },
                    { src: "src/fields/jsgrid.field.Xtextarea.js", dest: "dist/fields/jsgrid.field.Xtextarea.min.js" },
                    { src: "src/fields/jsgrid.field.Xjsoneditor.js", dest: "dist/fields/jsgrid.field.Xjsoneditor.min.js" },
                    { src: "src/fields/jsgrid.field.XRowSelectField.js", dest: "dist/fields/jsgrid.field.XRowSelectField.min.js" },
                    { src: "src/fields/jsgrid.field.XDateTimeField.js", dest: "dist/fields/jsgrid.field.XDateTimeField.min.js" }
                ]
            }
        },

        cssmin: {
            options : {
                banner: banner
            },
            css: {
                src: "<%= concat.css.dest %>",
                dest: "dist/<%= pkg.name %>.min.css"
            },
            theme: {
                src: "<%= concat.theme.dest %>",
                dest: "dist/<%= pkg.name %>-theme.min.css"
            }
        },

        qunit: {
            files: ["tests/index.html"]
        }

    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-qunit");

    // Replaces the "@VERSION" placeholder in the built bundle with the real
    // package version. Used to be grunt-string-replace, dropped since this
    // is the only thing it did and the package is unmaintained.
    grunt.registerTask("replaceVersion", function() {
        var dest = grunt.config("concat.js.dest");
        var contents = grunt.file.read(dest).replace(/"@VERSION"/g, "'" + grunt.config("pkg.version") + "'");
        grunt.file.write(dest, contents);
    });

    grunt.registerTask("default", ["clean", "copy", "concat", "replaceVersion", "uglify", "cssmin"]);

    grunt.registerTask("test", "qunit");
};
