
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) {
        return NextResponse.json({ status: 'error', message: 'API URL or Key is not configured on the server.' }, { status: 500 });
    }

    try {
        const response = await fetch(`${apiUrl}/users`, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey,
            },
        });
        
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ status: 'error', message: data.message || 'An error occurred while fetching users from the external API.' }, { status: response.status });
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
