
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) {
        return NextResponse.json({ status: 'error', message: 'API URL or Key is not configured on the server.' }, { status: 500 });
    }
    
    const { searchParams } = new URL(request.url);
    const instituteId = searchParams.get('id');
    
    const fetchUrl = instituteId ? `${apiUrl}/institutes/${instituteId}` : `${apiUrl}/institutes`;

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
        
        // The external API returns the array directly, so we just pass it on
        return NextResponse.json(data);

    } catch (error) {
        let errorMessage = 'An unknown error occurred.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}
