
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
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
        const paymentUrl = `${apiUrl}/institute-payments/`;

        const response = await fetch(paymentUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey,
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to process the payment.');
        }

        return NextResponse.json({ status: 'success', data: result });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}

export async function GET(request: Request) {
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
        const { searchParams } = new URL(request.url);
        const instituteId = searchParams.get('institute_id');
        
        const balanceUrl = `${apiUrl}/institute-payments/balance/${instituteId}`;

        const response = await fetch(balanceUrl, {
            headers: {
                'X-API-KEY': apiKey,
                'Authorization': `Bearer ${token}`
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch balance.');
        }

        return NextResponse.json(result);

    } catch (error) {
         const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}

    