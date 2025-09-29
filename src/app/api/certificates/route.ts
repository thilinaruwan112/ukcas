
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

async function getStudentDetails(studentId: string, apiKey: string, apiUrl: string, token: string) {
    try {
        // Assuming an endpoint exists to get student by ID. This needs to be confirmed.
        // For now, let's assume a generic students endpoint that can be filtered.
        const response = await fetch(`${apiUrl}/registered-students/${studentId}`, { // This endpoint might need to be adjusted
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
                const [course, student] = await Promise.all([
                    getCourseDetails(cert.course_id, apiKey, apiUrl, token),
                    getStudentDetails(cert.student_id, apiKey, apiUrl, token) 
                ]);

                return {
                    id: cert.certificate_id,
                    studentName: student?.name || 'Unknown Student',
                    courseName: course?.course_name || 'Unknown Course',
                    issueDate: cert.created_at,
                    instituteId: cert.institute_id,
                    status: cert.is_active === '1' ? 'Approved' : 'Pending',
                };
            })
        );
        
        return NextResponse.json({ status: 'success', data: detailedCertificates });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}
