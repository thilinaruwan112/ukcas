
import { NextResponse } from 'next/server';

async function handleRequest(request: Request) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) {
        return NextResponse.json({ status: 'error', message: 'API URL or Key is not configured on the server.' }, { status: 500 });
    }
    
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    try {
        if (request.method === 'GET') {
             if (!token) {
                return NextResponse.json({ status: 'error', message: 'Authentication is required.' }, { status: 401 });
            }
            const { searchParams } = new URL(request.url);
            const instituteId = searchParams.get('institute_id');
            const courseId = searchParams.get('id');

            let fetchUrl = `${apiUrl}/institute-courses`;
            if (courseId) {
                fetchUrl = `${apiUrl}/institute-courses/${courseId}`;
            } else if (instituteId) {
                fetchUrl = `${apiUrl}/institute-courses?institute_id=${instituteId}`;
            }
            
            const response = await fetch(fetchUrl, { headers: { 'X-API-KEY': apiKey, 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        }

        if (!token) {
            return NextResponse.json({ status: 'error', message: 'Authentication is required for this action.' }, { status: 401 });
        }
        
        const headers: HeadersInit = { 'Content-Type': 'application/json', 'X-API-KEY': apiKey, 'Authorization': `Bearer ${token}` };
        const body = await request.json();

        if (request.method === 'POST') {
            const response = await fetch(`${apiUrl}/institute-courses`, { method: 'POST', headers, body: JSON.stringify(body) });
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        }
        
        if (request.method === 'PATCH') {
            if (!body.id) {
                return NextResponse.json({ status: 'error', message: 'Course ID is required for update.' }, { status: 400 });
            }
            const { id, ...patchData } = body;
            const response = await fetch(`${apiUrl}/institute-courses/${id}`, { method: 'PATCH', headers, body: JSON.stringify(patchData) });
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        }

        if (request.method === 'DELETE') {
            if (!body.id) {
                return NextResponse.json({ status: 'error', message: 'Course ID is required for deletion.' }, { status: 400 });
            }
            const response = await fetch(`${apiUrl}/institute-courses/${body.id}`, { method: 'DELETE', headers });
            if (response.status === 204 || response.status === 200) {
                return NextResponse.json({ status: 'success', message: 'Course deleted successfully' });
            }
            const data = await response.json().catch(() => ({}));
            return NextResponse.json({ status: 'error', message: data.message || 'Failed to delete course' }, { status: response.status });
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
    
    return NextResponse.json({ status: 'error', message: 'Method Not Allowed' }, { status: 405 });
}

export async function GET(request: Request) { return handleRequest(request); }
export async function POST(request: Request) { return handleRequest(request); }
export async function PATCH(request: Request) { return handleRequest(request); }
export async function DELETE(request: Request) { return handleRequest(request); }
