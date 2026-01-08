import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'res.cloudinary.com' },
			{ protocol: 'https', hostname: 'via.placeholder.com' },
			{ protocol: 'https', hostname: 'images.unsplash.com' },
			{ protocol: 'http', hostname: 'localhost' },
			{ protocol: 'https', hostname: 'shop-backend-qf50.onrender.com' },
		],
		// Disable image optimization to prevent 404 errors with external backend images
		unoptimized: true,
	},
	// Enable aggressive prefetching for instant navigation
	onDemandEntries: {
		// Keep pages in memory longer for instant navigation
		maxInactiveAge: 60 * 1000, // 60 seconds
		pagesBufferLength: 10, // Keep 10 pages in memory
	},
	experimental: {
		optimizeCss: true,
		optimizePackageImports: [
			'lucide-react',
			'@radix-ui/react-icons',
			'@radix-ui/react-dialog',
			'@radix-ui/react-dropdown-menu',
			'@radix-ui/react-select',
			'react-icons',
			'@react-icons/all-files',
			'recharts', // Optimize recharts imports
		],
		// Enable instant navigation
		ppr: false, // Disable partial prerendering for instant loads
	},
	// Ensure Turbopack resolves from the dashboard root
	turbopack: {
		root: path.resolve(__dirname),
	},
	// External packages that should not be bundled (server-only)
	serverExternalPackages: ['mongoose', 'puppeteer', 'puppeteer-core', 'pdf-parse'],
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	// Disable source maps in production to prevent source-map module errors
	productionBrowserSourceMaps: false,
	// Ensure Next.js doesn't try to load source-map at runtime
	webpack: (config, { isServer, dev }) => {
		// Completely disable source maps in production
		if (!dev) {
			config.devtool = false;
		}
		
		// Exclude heavy dependencies from client bundle
		if (!isServer) {
			config.externals = config.externals || [];
			config.externals.push('puppeteer', 'puppeteer-core', 'pdf-parse', 'mongoose');
			
			// Fix for webpack module resolution issues
			config.resolve = config.resolve || {};
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
			};
			
			// Optimize chunk splitting for better caching
			config.optimization = {
				...config.optimization,
				splitChunks: {
					chunks: 'all',
					cacheGroups: {
						default: {
							minChunks: 2,
							priority: -20,
							reuseExistingChunk: true,
						},
						vendor: {
							test: /[\\/]node_modules[\\/]/,
							name: 'vendors',
							priority: -10,
							reuseExistingChunk: true,
						},
						recharts: {
							test: /[\\/]node_modules[\\/]recharts[\\/]/,
							name: 'recharts',
							priority: 10,
							reuseExistingChunk: true,
						},
						radix: {
							test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
							name: 'radix-ui',
							priority: 10,
							reuseExistingChunk: true,
						},
					},
				},
			};
		}
		
		return config;
	},
	// Vercel deployment configuration
	outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
