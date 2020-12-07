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
			opacity: {
				'15': '0.15'
			},
			colors: {
				primary: '#1300BA',
				'light-primary-1': '#efe6fa',
				'light-primary-2': '#9a6fe5',
				// 'dark-primary-1': '#12111F',
				// 'dark-primary-2': '#121026',
				// 'dark-primary-3': '#120F2D',
				// 'dark-primary-4': '#120E34',
				// 'dark-primary-5': '#120D41',
				// 'dark-primary-6': '#120D41',
				// 'dark-primary-7': '#120C48',
				// 'dark-primary-8': '#120C4E',
				// 'dark-primary-9': '#120B55',
				'dark-primary-1': '#1F1D23',
				'dark-primary-2': '#26222C',
				'dark-primary-3': '#2C2835',
				'dark-primary-4': '#332D3E',
				'dark-primary-5': '#3A3346',
				'dark-primary-6': '#40384F',
				'dark-primary-7': '#473E58',
				'dark-primary-8': '#4D4360',
				'dark-primary-9': '#544869',
			},
			boxShadow: {
				bold: '4px 4px 0px #000000;',
			},
		},
	},
	variants: {},
	plugins: [],
}
