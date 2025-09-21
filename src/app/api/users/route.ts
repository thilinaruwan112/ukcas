
import { NextResponse } from 'next/server';

async function handleRequest(request: Request) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) {
        return NextResponse.json({ status: 'error', message: 'API URL or Key is not configured on the server.' }, { status: 500 });
    }

    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const headers: HeadersInit = { 'Content-Type': 'application/json', 'X-API-KEY': apiKey };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (request.method === 'GET') {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');
        const fetchUrl = userId ? `${apiUrl}/users/${userId}` : `${apiUrl}/users`;
        
        const response = await fetch(fetchUrl, { headers });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    }
    
    const body = await request.json();

    if (request.method === 'DELETE') {
        if (!body.id) {
            return NextResponse.json({ status: 'error', message: 'User ID is required for deletion.' }, { status: 400 });
        }
        const response = await fetch(`${apiUrl}/users/${body.id}`, { method: 'DELETE', headers });
        if (response.status === 204 || response.status === 200) {
             return NextResponse.json({ status: 'success', message: 'User deleted successfully' });
        }
        const data = await response.json().catch(() => ({}));
        return NextResponse.json({ status: 'error', message: data.message || 'Failed to delete user' }, { status: response.status });
    }

    if (request.method === 'PATCH') {
         if (!body.id) {
            return NextResponse.json({ status: 'error', message: 'User ID is required for update.' }, { status: 400 });
        }
        // Exclude id from the patch payload
        const { id, ...patchData } = body;
        const response = await fetch(`${apiUrl}/users/${id}`, { method: 'PATCH', headers, body: JSON.stringify(patchData) });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({ status: 'error', message: 'Method Not Allowed' }, { status: 405 });
}


export async function GET(request: Request) {
    try {
        return await handleRequest(request);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        return await handleRequest(request);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        return await handleRequest(request);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}
