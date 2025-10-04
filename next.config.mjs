/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'res.cloudinary.com' },
			{ protocol: 'https', hostname: 'via.placeholder.com' },
			{ protocol: 'https', hostname: 'images.unsplash.com' },
			{ protocol: 'http', hostname: 'localhost' },
		],
	},
	// Optimize build for large codebases
	experimental: {
		optimizeCss: true,
		optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
		// Increase build timeout for large static generation
		buildTimeout: 300000, // 5 minutes
	},
	// Reduce memory usage during build
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.optimization.splitChunks = {
				chunks: 'all',
				cacheGroups: {
					default: {
						minChunks: 1,
						priority: -20,
						reuseExistingChunk: true,
					},
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						priority: -10,
						chunks: 'all',
					},
				},
			};
		}
		return config;
	},
	// Optimize static generation
	generateBuildId: async () => {
		return 'build-' + Date.now();
	},
	// Reduce static generation load
	output: 'standalone',
};

export default nextConfig;
