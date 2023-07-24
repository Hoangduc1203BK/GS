/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial":
					"radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			boxShadow: {
				price: "0 4px 4px rgba(0, 0, 0, 0.3)",
				beautiful: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
				shadowGood: "rgba(50, 50, 93, 0.25) 0px 10px 20px -5px, rgba(0, 0, 0, 0.3) 0px 5px 10px -8px",
				buttonHome: "0px 10px 30px 0px rgba(0, 67, 144, 0.3)",
				businessHome: "0px 10px 40px 10px rgba(47, 128, 237, 0.1)",
				hoverBusiness: "0 8px 16px 0 rgba(98,168,253,.4)",
				hoverButtonPrice: "0px 4px 4px 0px #00000040;",
			},
		},
		fontFamily: {
			custom: [
				'"SF Mono, Source Code Pro, Inconsolata,Arial, Helvetica, sans-serif"',
			],
			dacing: ['"Dancing Script", cursive'],
		},
	},
	plugins: [],
};
