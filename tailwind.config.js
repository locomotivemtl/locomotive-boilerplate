/** @type {import('tailwindcss').Config} */
export default {
    prefix: 'u-',
    content: [
        './www/**/*.html',
        './assets/scripts/**/*'
    ],
    theme: {
        screens: {
            'tiny':     '500px',
            'small':    '700px',
            'medium':   '1000px',
            'large':    '1200px',
            'big':      '1400px',
            'huge':     '1600px',
            'enormous': '1800px',
            'gigantic': '2000px',
            'colossal': '2400px'
        }
    },
    plugins: [],
}

