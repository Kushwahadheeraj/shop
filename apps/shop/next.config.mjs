import path from 'path';

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
	},
	// Reduce memory usage during build
	webpack: (config, { isServer, dir }) => {
		// Allow importing backend models via "backend/..." alias
		// Use `dir` from Next.js (project root) instead of `__dirname` (not defined in ESM)
		config.resolve = config.resolve || {};
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			backend: path.join(dir, 'backend'),
		};

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
	// Only use standalone output in production
	...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
};

export default nextConfig;

