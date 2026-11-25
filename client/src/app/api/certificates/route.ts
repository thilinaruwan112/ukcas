

import { NextResponse } from 'next/server';

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
    const certificateId = searchParams.get('id');
    const check = searchParams.get('check');

    if (certificateId) {
         try {
            const fetchUrl = `${apiUrl}/students-certificates/certificate/${certificateId}`;
            const response = await fetch(fetchUrl, {
                headers: { 'X-API-KEY': apiKey, 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
            return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
        }
    }

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

        // 2. Format certificate data without fetching course details
        const detailedCertificates = certificatesData.data.map((cert: any) => {
            return {
                id: cert.certificate_id,
                studentName: cert.student_name || 'Unknown Student',
                courseName: cert.course_name || 'Unknown Course',
                issueDate: cert.issue_date || cert.created_at,
                instituteId: cert.institute_id,
                studentId: cert.student_id,
                courseId: cert.course_id,
                status: cert.approved_status || (cert.is_active === '1' ? 'Approved' : 'Pending'),
                student_name: cert.student_name,
                institute_name: cert.institute_name, // Pass through institute name if available
            };
        });
        
        return NextResponse.json({ status: 'success', data: detailedCertificates });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}


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
    
    const body = await request.json();

    // Differentiate between creation, full update, and status update
    if (body.isUpdate) {
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
            
            const result = await updateResponse.json();
            return NextResponse.json({ status: 'success', message: result.message || 'Status updated successfully.' });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
            return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
        }
    }


    try {
        let url = `${apiUrl}/students-certificates`;
        let method = 'POST';

        // If an ID is present in the body, it's a full update
        if (body.id) {
            url = `${apiUrl}/students-certificates/${body.id}`;
            // Backend might still use POST for updates, if it uses PUT, this should be changed.
            // Assuming POST for updates as seen in other API routes.
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey,
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body),
        });

        const result = await response.json();

        if (!response.ok || result.status !== 'success') {
            throw new Error(result.message || 'Failed to create or update the certificate.');
        }

        return NextResponse.json({ status: 'success', data: result.data, message: result.message });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}
    
