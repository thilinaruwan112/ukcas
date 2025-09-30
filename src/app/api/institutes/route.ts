
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) {
        return NextResponse.json({ status: 'error', message: 'API URL or Key is not configured on the server.' }, { status: 500 });
    }
    
    const { searchParams } = new URL(request.url);
    const instituteId = searchParams.get('id');
    const searchTerm = searchParams.get('search');
    const slug = searchParams.get('slug');
    
    let fetchUrl = `${apiUrl}/institutes`;

    if (instituteId) {
        fetchUrl = `${apiUrl}/institutes/${instituteId}`;
    } else if (searchTerm) {
        fetchUrl = `${apiUrl}/institutes?search=${searchTerm}`;
    } else if (slug) {
        fetchUrl = `${apiUrl}/institutes/slug/${slug}`;
    }


    try {
        const response = await fetch(fetchUrl, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey,
            },
        });
        
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ status: 'error', message: data.message || 'An error occurred while fetching institutes from the external API.' }, { status: response.status });
        }
        
        return NextResponse.json(data);

    } catch (error) {
        let errorMessage = 'An unknown error occurred.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) {
        return NextResponse.json({ status: 'error', message: 'API URL or Key is not configured.' }, { status: 500 });
    }

    try {
        const formData = await request.formData();
        const instituteId = formData.get('id') as string | null;

        let fetchUrl = `${apiUrl}/institutes`;
        if (instituteId) {
            // If an ID is present, this is an update.
            fetchUrl = `${apiUrl}/institutes/${instituteId}`;
        }
        
        const headers: HeadersInit = { 'X-API-KEY': apiKey };
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(fetchUrl, {
            method: 'POST',
            headers,
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            // Forward the exact error message and status code from the backend
            return NextResponse.json({ message: result.message || 'An error occurred with the external API.' }, { status: response.status });
        }

        return NextResponse.json(result, { status: response.status });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}


export async function PATCH(request: Request) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) {
        return NextResponse.json({ status: 'error', message: 'API URL or Key is not configured.' }, { status: 500 });
    }

    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return NextResponse.json({ status: 'error', message: 'Authentication is required.' }, { status: 401 });
    }

    try {
        const body = await request.json();
        if (!body.id) {
            return NextResponse.json({ status: 'error', message: 'Institute ID is required for update.' }, { status: 400 });
        }
        
        const { id, ...patchData } = body;

        const response = await fetch(`${apiUrl}/institutes/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey,
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(patchData),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to update institute.');
        }

        return NextResponse.json({ status: 'success', data: result });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}
