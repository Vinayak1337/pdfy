const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	sassOptions: {
		includePaths: [
			path.join(__dirname, 'styles'),
			path.join(__dirname, 'components'),
			path.join(__dirname, 'app')
		]
	},
	swcMinify: true,
	experimental: {
		appDir: true
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack']
		});
		return config;
	}
};

module.exports = nextConfig;
