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
	// External packages for server components
	serverExternalPackages: ['mongoose'],
	// Reduce memory usage
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	// Reduce memory usage during build
	webpack: (config, { isServer, dev, webpack }) => {
		// Allow importing from backend directory
		if (isServer) {
			// Resolve mongoose and other backend dependencies from dashboard's node_modules first
			// This ensures backend models can find mongoose during build
			const dashboardNodeModules = path.resolve(__dirname, 'node_modules');
			const backendPath = path.resolve(__dirname, '../../backend');
			
			// Ensure resolve object exists
			config.resolve = config.resolve || {};
			
			// CRITICAL: Don't alias mongoose to an absolute path
			// Instead, ensure module resolution finds it in dashboard's node_modules
			// The modules array with dashboardNodeModules first should handle this
			
			// Add alias for backend models (but NOT mongoose - let webpack resolve it)
			config.resolve.alias = {
				...config.resolve.alias,
				'@backend': backendPath,
				// DO NOT alias mongoose - let webpack resolve it through modules array
			};
			
			// Also add to mainFields to ensure proper resolution
			config.resolve.mainFields = ['main', 'module', ...(config.resolve.mainFields || [])];
			
			// CRITICAL: Configure module resolution to always use dashboard's node_modules
			// When webpack processes backend files, it resolves relative to backend directory
			// We need to ensure it looks in dashboard's node_modules instead
			config.resolve.modules = [
				dashboardNodeModules, // Dashboard's node_modules first - CRITICAL
				...(config.resolve.modules || []),
				'node_modules', // Fallback to standard node_modules resolution
			];
			
			// Ensure webpack doesn't try to resolve from backend's node_modules
			config.resolve.symlinks = false;
			
			// The modules array should handle resolution, but webpack might still
			// try to resolve relative to backend directory. Let's add roots configuration
			// and ensure package resolution works correctly
			config.resolve.roots = [dashboardNodeModules];
			
			// Ensure package.json resolution works for mongoose
			// This tells webpack to look for package.json in dashboard's node_modules
			config.resolve.descriptionFiles = ['package.json'];
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
	// Set output file tracing root to current directory for Vercel compatibility
	// Vercel needs the root to be the dashboard directory, not the monorepo root
	outputFileTracingRoot: process.env.VERCEL ? path.resolve(__dirname) : path.resolve(__dirname, '../..'),
	// Only use standalone output in production, but not for Vercel
	// Vercel handles its own deployment and doesn't need standalone output
	// This also prevents "Unable to find lambda" errors for static client components
	...(process.env.NODE_ENV === 'production' && !process.env.VERCEL && { output: 'standalone' }),
};

export default nextConfig;

