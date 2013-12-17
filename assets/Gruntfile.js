module.exports = function(grunt) {
    // 配置
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        clean : {
            js : ['js/**/*-min.js'],
            css : ['css/**/*-min.css']
        },
        cssmin : {
            minify: {
                expand: true,
                cwd: 'css/',
                src: ['*.css', '!*-min.css'],
                dest: 'css/',
                ext: '-min.css'
            } 
        },
        uglify : {
            options : {
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            }, 
            minify: {
                expand: true,
                cwd: 'js/',
                src: ['**/*.js', '!**/*-min.js'],
                dest: 'js/',
                ext: '-min.js'
            }
            
        }
    });
    // 载入concat和uglify插件，分别对于合并和压缩
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // 注册任务
    grunt.registerTask('default', ['clean','cssmin','uglify']);
}; 