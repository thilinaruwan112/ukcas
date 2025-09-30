
import { NextResponse } from 'next/server';

export const config = {
    api: {
        bodyParser: false,
    },
};

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
    
    const headers: HeadersInit = { 'X-API-KEY': apiKey, 'Authorization': `Bearer ${token}` };


    try {
        if (request.method === 'GET') {
            const { searchParams } = new URL(request.url);
            const instituteId = searchParams.get('instituteId');

            if (!instituteId) {
                return NextResponse.json({ status: 'error', message: 'Institute ID is required.' }, { status: 400 });
            }
            
            const fetchUrl = `${apiUrl}/registered-students/institute/${instituteId}`;
            const response = await fetch(fetchUrl, { headers });
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        }


        if (request.method === 'POST') {
            const formData = await request.formData();
            
            const postHeaders: HeadersInit = {
                'X-API-KEY': apiKey,
                'Authorization': `Bearer ${token}`
                // 'Content-Type' header should not be set manually for FormData.
                // The browser or fetch will set it with the correct boundary.
            };

            const response = await fetch(`${apiUrl}/registered-students`, {
                method: 'POST',
                headers: postHeaders,
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

export async function GET(request: Request) { return handleRequest(request); }
export async function POST(request: Request) { return handleRequest(request); }

