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
		],
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
		],
	},
	serverExternalPackages: ['mongoose'],
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
		return config;
	},
	// Vercel deployment configuration
	outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
