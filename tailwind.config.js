module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true,
	},
	purge: ['./pages/**/*.js', './components/**/*.js', './hooks/**/*.js'],
	theme: {
		fontFamily: {
			body: ['Anybody', 'sans-serif'],
		},
		extend: {
			colors: {
				primary: '#1300BA',
				'light-primary-1': '#efe6fa',
				'light-primary-2': '#9a6fe5',
				'dark-primary-1': '#11111F',
				'dark-primary-2': '#0F0F2B',
				'dark-primary-3': '#0D0D44',
			},
			boxShadow: {
				bold: '4px 4px 0px #000000;',
			},
		},
	},
	variants: {},
	plugins: [],
}