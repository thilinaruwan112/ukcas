
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const apiUrl = 'https://ukcas-server.payshia.com';
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || 'your_default_api_key';


    if (!apiUrl || !apiKey) {
        return NextResponse.json({ status: 'error', message: 'API URL or Key is not configured.' }, { status: 500 });
    }
    
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return NextResponse.json({ status: 'error', message: 'Authentication is required.' }, { status: 401 });
    }

    try {
        const balanceUrl = `${apiUrl}/institute-payments/balance/${id}`;
        const response = await fetch(balanceUrl, {
            headers: {
                'X-API-KEY': apiKey,
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to fetch balance and could not parse error.' }));
            throw new Error(errorData.message || 'Failed to fetch balance.');
        }
        
        const result = await response.json();

        return NextResponse.json(result);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}
