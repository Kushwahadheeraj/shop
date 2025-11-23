// Route handler to explicitly mark this route as static
// This prevents Vercel from expecting a Node.js lambda
import { NextResponse } from 'next/server';

// Mark as static - no server-side rendering needed
export const dynamic = 'force-static';
// Use edge runtime to avoid creating a Node.js lambda
export const runtime = 'edge';

export async function GET() {
	// Return a simple response - the actual page is a client component
	// This handler just tells Vercel the route is static
	return NextResponse.json({ 
		message: 'Static route - client component',
		static: true 
	});
}

