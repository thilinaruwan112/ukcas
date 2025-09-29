
import { NextResponse } from 'next/server';

// This is a simplified representation. In a real app, these would be more robust.
async function getCourseDetails(courseId: string, apiKey: string, apiUrl: string, token: string) {
    try {
        const response = await fetch(`${apiUrl}/institute-courses/${courseId}`, {
             headers: { 'X-API-KEY': apiKey, 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.status === 'success' ? data.data : null;
    } catch {
        return null;
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

    const { searchParams } = new URL(request.url);
    const instituteId = searchParams.get('instituteId');

    if (!instituteId) {
        return NextResponse.json({ status: 'error', message: 'Institute ID is required.' }, { status: 400 });
    }

    try {
        // 1. Fetch the raw certificate data
        const certificatesResponse = await fetch(`${apiUrl}/students-certificates/institute/${instituteId}`, {
            headers: { 'X-API-KEY': apiKey, 'Authorization': `Bearer ${token}` }
        });
        
        if (!certificatesResponse.ok) {
            const errorData = await certificatesResponse.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch certificates from the primary source.');
        }

        const certificatesData = await certificatesResponse.json();
        if (certificatesData.status !== 'success' || !Array.isArray(certificatesData.data)) {
            return NextResponse.json({ status: 'success', data: [] });
        }

        // 2. Fetch details for each certificate
        const detailedCertificates = await Promise.all(
            certificatesData.data.map(async (cert: any) => {
                const course = await getCourseDetails(cert.course_id, apiKey, apiUrl, token);

                return {
                    id: cert.certificate_id,
                    studentName: cert.student_name || 'Unknown Student',
                    courseName: course?.course_name || 'Unknown Course',
                    issueDate: cert.created_at,
                    instituteId: cert.institute_id,
                    status: cert.approved_status || (cert.is_active === '1' ? 'Approved' : 'Pending'),
                    student_name: cert.student_name
                };
            })
        );
        
        return NextResponse.json({ status: 'success', data: detailedCertificates });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}

async function handlePost(request: Request) {
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
        const { institute, ...certificateData } = body;
        const CERTIFICATE_COST = 10;
        
        // 1. Verify balance
        if (!institute || typeof institute.balance === 'undefined') {
            return NextResponse.json({ status: 'error', message: 'Could not verify institute balance.' }, { status: 400 });
        }
        
        const currentBalance = Number(institute.balance) || 0;
        if (currentBalance < CERTIFICATE_COST) {
            return NextResponse.json({ status: 'error', message: `Insufficient balance. You need at least $${CERTIFICATE_COST.toFixed(2)}.` }, { status: 402 });
        }

        // 2. Create the certificate
        const createResponse = await fetch(`${apiUrl}/students-certificates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey,
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(certificateData),
        });

        const createResult = await createResponse.json();

        if (!createResponse.ok || createResult.status !== 'success') {
            throw new Error(createResult.message || 'Failed to create the certificate.');
        }

        // 3. Deduct balance (mocking this part, should be a separate API call in a real app)
        const newBalance = currentBalance - CERTIFICATE_COST;
        const updatedInstitute = { ...institute, balance: newBalance };

        // In a real app, you would make another API call here to update the user's balance.
        // For now, we return the updated institute data for the client to update session storage.
        
        return NextResponse.json({ status: 'success', data: createResult.data, updatedInstitute });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}

export async function POST(request: Request) {
    return handlePost(request);
}
