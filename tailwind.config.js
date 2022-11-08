/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx}',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}'
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#546fff'
				},
				secondary: {
					DEFAULT: '#23325f'
				},
				tertiary: {
					DEFAULT: '#354454'
				},
				gray: {
					DEFAULT: '#f5f5f5',
					1: '#8397ac'
				},
				white: {
					DEFAULT: '#ffffff',
					1: '#f8f9ff'
				}
			},
			boxShadow: {
				theme: '1px 1px 9px 0 hsl(0deg 0% 50% / 40%)'
			}
		}
	},
	plugins: []
};
