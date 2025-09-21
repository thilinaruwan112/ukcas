
import { NextResponse } from 'next/server';

async function handleRequest(request: Request) {
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
        if (request.method === 'GET') {
            const { searchParams } = new URL(request.url);
            const userId = searchParams.get('userId');
            if (!userId) {
                return NextResponse.json({ status: 'error', message: 'User ID is required.' }, { status: 400 });
            }
            const fetchUrl = `${apiUrl}/user-institutes/${userId}`;
            const response = await fetch(fetchUrl, { headers });
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        }


        const body = await request.json();
        const fetchUrl = `${apiUrl}/user-institutes`;

        if (request.method === 'POST') {
            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        }
        
        if (request.method === 'DELETE') {
            const { user_account, institute_id } = body;
            if (!user_account || !institute_id) {
                return NextResponse.json({ status: 'error', message: 'User account and institute ID are required.' }, { status: 400 });
            }
            const deleteUrl = `${fetchUrl}?user_account=${user_account}&institute_id=${institute_id}`;

            const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers,
            });

            if (response.status === 204 || response.status === 200) {
                return NextResponse.json({ status: 'success', message: 'Unassignment successful' }, { status: 200 });
            }

            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        }


    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }

    return NextResponse.json({ status: 'error', message: 'Method Not Allowed' }, { status: 405 });
}


export async function POST(request: Request) {
    return handleRequest(request);
}

export async function DELETE(request: Request) {
    return handleRequest(request);
}

export async function GET(request: Request) {
    return handleRequest(request);
}
