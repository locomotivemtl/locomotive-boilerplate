module.exports = {
    javascript_app: {
        files: [
            'www/assets/scripts/src/**/*.js',
            '!www/assets/scripts/src/vendors/*.js'
        ],
        tasks: ['browserify:dev', 'eslint', 'notify:javascript']
    },
    javascript_vendors: {
        files: [
            'www/assets/scripts/src/vendors/*.js'
        ],
        tasks: ['concat', 'notify:javascript']
    },
    sass: {
        files: ['www/assets/styles/src/**/*.scss'],
        tasks: ['sass', 'postcss', 'notify:sass'],
        options: {
            spawn: false,
            livereload: true
        }
    },
    svg: {
        files: ['www/assets/images/**/*.svg'],
        tasks: ['svgstore', 'notify:svg']
    },
    tasks: {
        files: ['grunt_tasks/*.js'],
        options: {
            reload: true
        }
    }
}
