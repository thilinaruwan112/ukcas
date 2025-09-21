
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) {
        return NextResponse.json({ status: 'error', message: 'API URL or Key is not configured on the server.' }, { status: 500 });
    }

    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return NextResponse.json({ status: 'error', message: 'Authentication token is required.' }, { status: 401 });
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
        'Authorization': `Bearer ${token}`
    };
    
    try {
        const body = await request.json();
        const fetchUrl = `${apiUrl}/user-institutes`;

        const response = await fetch(fetchUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ status: 'error', message: data.message || 'An error occurred while assigning the institute.' }, { status: response.status });
        }
        
        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}
