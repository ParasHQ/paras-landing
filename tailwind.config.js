module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true,
	},
	purge: ['./pages/**/*.js', './components/**/*.js'],
	theme: {
		fontFamily: {
			body: ['Anybody', 'sans-serif'],
		},
		extend: {
			colors: {
				'primary-color': '#1300BA'
			},
			boxShadow: {
				bold: '4px 4px 0px #000000;',
			},
		},
	},
	variants: {},
	plugins: [],
}
