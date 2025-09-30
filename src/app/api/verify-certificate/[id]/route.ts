
import { NextResponse } from 'next/server';

async function fetchFromApi(url: string, apiKey: string) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey,
        },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) {
        return NextResponse.json({ status: 'error', message: 'API URL or Key is not configured.' }, { status: 500 });
    }

    try {
        // 1. Fetch the certificate details
        const certificateUrl = `${apiUrl}/students-certificates/certificate/${id}`;
        const certificateResult = await fetchFromApi(certificateUrl, apiKey);

        if (certificateResult.status !== 'success' || !certificateResult.data) {
            return NextResponse.json({ status: 'error', message: 'Certificate not found or invalid.' }, { status: 404 });
        }
        
        const certificateData = certificateResult.data;

        // 2. Fetch the institute details
        const instituteUrl = `${apiUrl}/institutes/${certificateData.institute_id}`;
        const instituteResult = await fetchFromApi(instituteUrl, apiKey);
        const instituteData = instituteResult; // The institute API returns the object directly

        // 3. Fetch the course details
        const courseUrl = `${apiUrl}/institute-courses/${certificateData.course_id}`;
        const courseResult = await fetchFromApi(courseUrl, apiKey);
        const courseData = courseResult.data;


        // 4. Combine all data and send back to the client
        const combinedData = {
            certificate: certificateData,
            institute: instituteData,
            course: courseData,
        };

        return NextResponse.json({ status: 'success', data: combinedData });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        // If certificate not found, the external API might return a 404 which gets caught here.
        if (errorMessage.includes('404')) {
             return NextResponse.json({ status: 'error', message: `Certificate with ID "${id}" not found.` }, { status: 404 });
        }
        return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
    }
}
