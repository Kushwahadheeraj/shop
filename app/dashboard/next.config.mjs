import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if NODE_OPTIONS is set (warns but doesn't fail - allows manual override)
if (process.env.NODE_ENV === 'production' && !process.env.NODE_OPTIONS?.includes('max-old-space-size')) {
	console.warn('\n⚠️  WARNING: NODE_OPTIONS not set with memory limit!');
	console.warn('⚠️  Use "npm run build" instead of "npx next build"\n');
}

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
		optimizePackageImports: [
			'lucide-react',
			'@radix-ui/react-icons',
			'@radix-ui/react-dialog',
			'@radix-ui/react-dropdown-menu',
			'@radix-ui/react-select',
			'react-icons',
			'@react-icons/all-files',
		],
	},
	// Reduce memory usage
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	// Reduce memory usage during build
	webpack: (config, { isServer, dev }) => {
		// Allow importing from backend directory
		if (isServer) {
			// Resolve mongoose and other backend dependencies from dashboard's node_modules first
			// This ensures backend models can find mongoose during build
			const dashboardNodeModules = path.resolve(__dirname, 'node_modules');
			const backendPath = path.resolve(__dirname, '../../backend');
			
			// Ensure resolve object exists
			config.resolve = config.resolve || {};
			
			// CRITICAL: Force mongoose to resolve from dashboard's node_modules
			// Backend models use require('mongoose'), so we must alias it explicitly
			// Point to the mongoose package directory - webpack will resolve the entry point
			const mongoosePackagePath = path.resolve(dashboardNodeModules, 'mongoose');
			
			// Add alias for backend models and mongoose
			config.resolve.alias = {
				...config.resolve.alias,
				'@backend': backendPath,
				// Alias mongoose to dashboard's node_modules version
				// This ensures backend models (which use require('mongoose')) can find it
				'mongoose': mongoosePackagePath,
			};
			
			// Also add to mainFields to ensure proper resolution
			config.resolve.mainFields = ['main', 'module', ...(config.resolve.mainFields || [])];
			
			// Prioritize dashboard's node_modules for all dependencies
			// This ensures that when webpack processes backend files, it looks in dashboard's node_modules
			config.resolve.modules = [
				dashboardNodeModules, // Dashboard's node_modules first - CRITICAL
				...(config.resolve.modules || []),
				'node_modules', // Fallback to standard node_modules resolution
			];
			
			// Ensure webpack doesn't try to resolve from backend's node_modules
			config.resolve.symlinks = false;
		}
		
		// Aggressive memory optimizations for production builds
		if (!dev) {
			// Optimize memory usage for both server and client
			config.optimization = {
				...config.optimization,
				splitChunks: {
					chunks: 'all',
					maxInitialRequests: 15,
					minSize: 20000,
					maxSize: 200000,
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
							chunks: 'all',
							enforce: true,
							maxSize: 200000,
						},
						common: {
							minChunks: 2,
							priority: -5,
							reuseExistingChunk: true,
							maxSize: 200000,
						},
					},
				},
				// Enable module concatenation to reduce memory
				concatenateModules: true,
			};
			
			// Reduce memory usage by limiting parallel processing
			config.parallelism = 1;
			
			// Disable source maps in production to save memory
			config.devtool = false;
			
			// Optimize module resolution and caching
			config.resolve.cache = true;
			if (!config.cache) {
				config.cache = {
					type: 'filesystem',
					buildDependencies: {
						config: [__filename],
					},
				};
			}
			
			// Reduce memory by limiting module processing
			config.module = {
				...config.module,
				unsafeCache: false,
			};
			
			// Additional memory optimizations
			config.performance = {
				...config.performance,
				hints: false,
				maxEntrypointSize: 512000,
				maxAssetSize: 512000,
			};
			
			// Reduce memory footprint by optimizing resolve (preserve existing settings)
			config.resolve.cache = true;
			config.resolve.symlinks = false;
		}
		
		return config;
	},
	// Optimize static generation
	generateBuildId: async () => {
		return 'build-' + Date.now();
	},
	// Set output file tracing root to fix workspace warning
	outputFileTracingRoot: path.resolve(__dirname, '../..'),
	// Only use standalone output in production
	...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
};

export default nextConfig;

