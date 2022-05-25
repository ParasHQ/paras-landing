const colors = require('tailwindcss/colors')

module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true,
	},
	content: ['./pages/**/*.js', './components/**/*.js', './hooks/**/*.js', './constants/*.js'],
	theme: {
		fontFamily: {
			body: ['Epilogue', 'sans-serif'],
		},
		extend: {
			opacity: {
				15: '0.15',
			},
			spacing: {
				'1/20': '5%',
				'1/10': '10%',
				21: '5.2rem',
				22: '5.5rem',
			},
			height: {
				'100vh': '100vh',
				'90vh': '90vh',
				'80vh': '80vh',
				'70vh': '70vh',
				'60vh': '60vh',
			},
			colors: {
				primary: '#1300BA',
				'light-primary-1': '#efe6fa',
				'light-primary-2': '#9a6fe5',
				'dark-primary-1': '#1F1D23',
				'dark-primary-2': '#26222C',
				'dark-primary-3': '#2C2835',
				'dark-primary-4': '#332D3E',
				'dark-primary-5': '#3A3346',
				'dark-primary-6': '#40384F',
				'dark-primary-7': '#473E58',
				'dark-primary-8': '#4D4360',
				'dark-primary-9': '#544869',
				green: colors.emerald,
				yellow: colors.amber,
				purple: colors.violet,
			},
			boxShadow: {
				bold: '4px 4px 0px #000000;',
			},
			lineClamp: {
				7: '7',
				8: '8',
				9: '9',
				10: '10',
				11: '11',
				12: '12',
				13: '13',
				14: '14',
				15: '15',
			},
		},
	},
	plugins: [require('@tailwindcss/line-clamp')],
}
