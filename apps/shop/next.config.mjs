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
		// Allow importing code from outside the app directory (for monorepo backend)
		externalDir: true,
	},
	// Reduce memory usage during build
	webpack: (config, { isServer, dir, webpack }) => {
		// Allow importing backend models via "backend/..." alias
		// Use `dir` from Next.js (project root) instead of `__dirname` (not defined in ESM)
		config.resolve = config.resolve || {};
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			// `dir` for this app is ".../apps/shop", backend is at ".../backend" (two levels up)
			backend: path.join(dir, '..', '..', 'backend'),
		};

		// Exclude puppeteer and other heavy dependencies from client bundle
		if (!isServer) {
			config.externals = config.externals || [];
			config.externals.push('puppeteer', 'puppeteer-core');
			
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

		// Replace next/document imports with stub (server-side only)
		if (isServer) {
			const noopDocPath = path.resolve(dir, 'lib', 'noop-document.js');
			
			config.plugins = config.plugins || [];
			
			// Use NormalModuleReplacementPlugin to replace next/document
			// This catches both direct imports and imports from dependencies
			config.plugins.push(
				new webpack.NormalModuleReplacementPlugin(
					/next\/document/,
					(resource) => {
						resource.request = noopDocPath;
					}
				)
			);
			
			// Also add alias as fallback for all contexts
			config.resolve.alias = {
				...config.resolve.alias,
				'next/document': noopDocPath,
			};
			
			// Exclude qrcode.react from server-side bundle if it's causing issues
			config.externals = config.externals || [];
			if (Array.isArray(config.externals)) {
				config.externals.push({
					'qrcode.react': 'commonjs qrcode.react',
				});
			}
		}

		return config;
	},
	// Optimize static generation
	generateBuildId: async () => {
		return 'build-' + Date.now();
	},
	// Only use standalone output in production
	...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
	// Skip static generation for error pages
	skipTrailingSlashRedirect: true,
};

export default nextConfig;

