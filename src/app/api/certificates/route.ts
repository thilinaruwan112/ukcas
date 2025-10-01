
import { NextResponse } from 'next/server';

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
    const all = searchParams.get('all');
    const check = searchParams.get('check');

    if (check) {
        const studentId = searchParams.get('studentId');
        const courseId = searchParams.get('courseId');
        const checkInstituteId = searchParams.get('instituteId');
        if (!studentId || !courseId || !checkInstituteId) {
             return NextResponse.json({ status: 'error', message: 'Student ID, Course ID, and Institute ID are required for checking.' }, { status: 400 });
        }
         try {
            const checkUrl = `${apiUrl}/students-certificates/institute/check-certificate?student_id=${studentId}&course_id=${courseId}&institute_id=${checkInstituteId}`;
            const response = await fetch(checkUrl, {
                 headers: { 'X-API-KEY': apiKey, 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
            return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
        }
    }


    try {
        let fetchUrl = `${apiUrl}/students-certificates`;
        if (instituteId) {
            fetchUrl = `${apiUrl}/students-certificates/institute/${instituteId}`;
        }
        
        // 1. Fetch the raw certificate data
        const certificatesResponse = await fetch(fetchUrl, {
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
                    studentId: cert.student_id,
                    courseId: cert.course_id,
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
        const certificateData = await request.json();
        
        // Create the certificate
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

        return NextResponse.json({ status: 'success', data: createResult.data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}

export async function POST(request: Request) {
    return handlePost(request);
}

async function handlePatch(request: Request, body: any) {
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
        const { id, status } = body;

        if (!id || !status || !['Approved', 'Rejected'].includes(status)) {
            return NextResponse.json({ status: 'error', message: 'Certificate ID and a valid status are required.' }, { status: 400 });
        }

        const updateUrl = `${apiUrl}/students-certificates/approved-status`;
        const payload = {
            certificate_id: id,
            status: status.toLowerCase()
        };

        const updateResponse = await fetch(updateUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey,
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        
        if (!updateResponse.ok) {
             const errorData = await updateResponse.json().catch(() => ({ message: 'Failed to update and could not parse error' }));
             throw new Error(errorData.message || 'Failed to update certificate status.');
        }

        const textResponse = await updateResponse.text();

        // Check if the response contains multiple JSON objects
        if (textResponse.startsWith('{') && textResponse.endsWith('}')) {
             try {
                // It looks like a single JSON object
                const singleResult = JSON.parse(textResponse);
                return NextResponse.json({ status: 'success', message: singleResult.message || 'Status updated successfully.' });
            } catch (e) {
                 // It might be the multi-part response
                try {
                    const jsonParts = textResponse.replace(/}\s*{/g, '}|{').split('|');
                    const firstPart = JSON.parse(jsonParts[0]);
                    const secondPart = JSON.parse(jsonParts[1]);
                    const combinedMessage = `${firstPart.message} ${secondPart.message}`;
                    return NextResponse.json({ status: 'success', message: combinedMessage });
                } catch (multiE) {
                     return NextResponse.json({ status: 'success', message: 'Status updated, but response was not in the expected format.' });
                }
            }
        }
        
        return NextResponse.json({ status: 'success', message: 'Status updated successfully.' });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const body = await request.json();
    return handlePatch(request, body);
}

    
