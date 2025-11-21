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
		optimizeCss: false, // Disable to prevent critters errors with Html stub
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
		// This prevents Html import errors from dependencies
		// BUT exclude pages/_document.js which needs the real next/document
		if (isServer) {
			const noopDocPath = path.resolve(dir, 'lib', 'noop-document.js');
			
			config.plugins = config.plugins || [];
			
			// Replace next/document imports with stub, but exclude pages/_document.js
			config.plugins.push(
				new webpack.NormalModuleReplacementPlugin(
					/^next[\/\\]document$/,
					(resource) => {
						// Check if the requesting file is pages/_document.js
						const requestContext = resource.context || '';
						const isDocumentFile = requestContext.includes(path.join('pages', '_document')) || 
						                       requestContext.includes('pages\\_document') ||
						                       requestContext.includes('pages/_document');
						
						if (isDocumentFile) {
							// Don't replace - keep original next/document
							return resource.request;
						}
						// Replace with stub for all other files
						return noopDocPath;
					}
				)
			);
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

