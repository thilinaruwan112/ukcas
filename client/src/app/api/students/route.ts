

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
            const studentId = searchParams.get('id');

            if (studentId) {
                const fetchUrl = `${apiUrl}/registered-students/${studentId}`;
                const response = await fetch(fetchUrl, { headers });
                const data = await response.json();
                
                // Ensure all path properties are present, even if null
                if (data.status === 'success' && data.data) {
                    const studentData = data.data;
                    const fileFields = [
                        'student_photo',
                        'id_card_front',
                        'id_card_back',
                        'ol_certificate',
                        'al_certificate'
                    ];
                    
                    const contentBaseUrl = 'https://content-provider.payshia.com/ukcas/';

                    fileFields.forEach(field => {
                        if (studentData[field]) {
                            // Only add prefix if it's not already a full URL
                             if (!studentData[field].startsWith('http')) {
                                studentData[field] = `${contentBaseUrl}${studentData[field]}`;
                            }
                        } else {
                            studentData[field] = null;
                        }
                    });
                }

                return NextResponse.json(data, { status: response.status });
            }

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
            const studentId = formData.get('id') as string;
            
            const postHeaders: HeadersInit = {
                'X-API-KEY': apiKey,
                'Authorization': `Bearer ${token}`
                // 'Content-Type' header is set automatically for FormData
            };
            
            let fetchUrl = `${apiUrl}/registered-students`;
            if (studentId) {
                 // The backend uses POST for updates, identified by the presence of an ID.
                 // The actual endpoint might be different, e.g. /registered-students/{id}
                 // but based on docs, it might be the same endpoint with POST.
                fetchUrl = `${apiUrl}/registered-students/${studentId}`;
            }

            const response = await fetch(fetchUrl, {
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

    