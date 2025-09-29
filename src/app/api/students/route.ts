
import { NextResponse } from 'next/server';

async function handleRequest(request: Request) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) {
        return NextResponse.json({ status: 'error', message: 'API URL or Key is not configured on the server.' }, { status: 500 });
    }
    
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return NextResponse.json({ status: 'error', message: 'Authentication is required.' }, { status: 401 });
    }

    try {
        if (request.method === 'POST') {
            const formData = await request.formData();
            
            const headers: HeadersInit = {
                'X-API-KEY': apiKey,
                // 'Content-Type' header should not be set manually for FormData.
                // The browser or fetch will set it with the correct boundary.
            };

            const response = await fetch(`${apiUrl}/registered-students`, {
                method: 'POST',
                headers,
                body: formData,
            });

            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
    
    return NextResponse.json({ status: 'error', message: 'Method Not Allowed' }, { status: 405 });
}

export async function POST(request: Request) { return handleRequest(request); }

    