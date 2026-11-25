<?php
// controllers/StudentCertificateController.php
require_once './models/StudentCertificate.php';
require_once './models/Institute.php';
require_once './models/InstituteCourse.php';
require_once './controllers/InstitutePaymentController.php';
require_once './utils/MailHelper.php';

class StudentCertificateController

{
    private $model;
    public function __construct($pdo)
    {
        $this->model = new StudentCertificate($pdo);
    }

    // Update approved_status of a certificate
    public function updateApprovedStatus($certificate_id, $status)
    {
        $validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
        if (!in_array($status, $validStatuses)) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid approved status value.'
            ]);
            return;
        }
        $updated = $this->model->updateApprovedStatus($certificate_id, $status);
        // If approved, create payment entry
        if ($updated && strtolower($status) === 'approved') {
            // if (1 == 1) {
            $paymentController = new InstitutePaymentController($GLOBALS['pdo']);
            // Prepare payment data (customize as needed)
            $certificate = $this->model->getByCertificateId($certificate_id);
            // var_dump($certificate);
            // Check for required fields
            if (
                empty($certificate['institute_id']) ||
                empty($certificate['created_by'])
            ) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Missing required payment data from certificate.',
                    'certificate' => $certificate
                ]);
                return;
            }
            $paymentData = [
                'institute_id' => $certificate['institute_id'] ?? null,
                'type' => 'CREDIT', // or 'DEBIT' based on your business logic
                'amount' => 10 ?? 0,
                'created_by' => $certificate['created_by'] ?? null,
                'active_status' => 1,
                'remark' => 'Certificate approval payment for certificate ID ' . $certificate_id,
                'ref_id' => $certificate_id
            ];

            $paymentController->create($paymentData);
        }
        if ($updated) {
            // echo json_encode([
            //     'status' => 'success',
            //     'message' => 'Approved status updated.'
            // ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Update failed. Certificate not found or status unchanged.',
                'certificate_id' => $certificate_id,
                'requested_status' => $status
            ]);
        }
    }

    public function getAll()
    {
        echo json_encode([
            'status' => 'success',
            'data' => $this->model->getAll()
        ]);
    }
    public function getById($id)
    {
        echo json_encode([
            'status' => 'success',
            'data' => $this->model->getById($id)
        ]);
    }
    public function create()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        // Generate a unique 6-digit certificate_id
        do {
            $data['certificate_id'] = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);
            $exists = $this->model->getByCertificateId($data['certificate_id']);
        } while ($exists);

        $certificate = $this->model->create($data);
        echo json_encode([
            'status' => 'success',
            'message' => 'Certificate created successfully.',
            'data' => $certificate
        ]);
    }
    public function update($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $certificate = $this->model->update($id, $data);
        echo json_encode([
            'status' => 'success',
            'message' => 'Certificate updated successfully.',
            'data' => $certificate
        ]);
    }
    public function delete($id)
    {
        $deleted = $this->model->delete($id);
        echo json_encode([
            'status' => $deleted ? 'success' : 'error',
            'message' => $deleted ? 'Certificate deleted successfully.' : 'Certificate not found.'
        ]);
    }

    // Get students by institute_id
    public function getByInstituteId($institute_id)
    {
        $result = $this->model->getByInstituteId($institute_id);
        echo json_encode([
            'status' => 'success',
            'data' => $result
        ]);
    }

    public function getByCertificateId($certificateId)
    {
        $result = $this->model->getByCertificateId($certificateId);
        echo json_encode([
            'status' => 'success',
            'data' => $result
        ]);
    }

    // Check if certificate exists for student and course
    public function existsForStudentAndCourse($student_id, $course_id, $institute_id)
    {

        $result = $this->model->existsForStudentAndCourse($student_id, $course_id, $institute_id);
        echo json_encode([
            'status' => 'success',
            'data' => $result,
            'debug' => $student_id . '|' . $course_id . '|' . $institute_id
        ]);
    }

    // Generate/send certificate email to the student
    public function sendCertificateEmail()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $certificateId = trim((string) ($input['certificate_id'] ?? ''));

        if ($certificateId === '') {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'certificate_id is required.'
            ]);
            return;
        }

        $certificate = $this->model->getByCertificateId($certificateId);
        if (!$certificate) {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Certificate not found.'
            ]);
            return;
        }

        if (strtolower((string) ($certificate['approved_status'] ?? '')) !== 'approved') {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Only approved certificates can be emailed to students.'
            ]);
            return;
        }

        $toEmail = trim((string) ($input['to_email'] ?? $certificate['email_address'] ?? ''));
        if ($toEmail === '' || !filter_var($toEmail, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'A valid student email address is required.'
            ]);
            return;
        }

        $instituteModel = new Institute($GLOBALS['pdo']);
        $courseModel = new InstituteCourse($GLOBALS['pdo']);
        $institute = !empty($certificate['institute_id']) ? $instituteModel->getById($certificate['institute_id']) : null;
        $course = !empty($certificate['course_id']) ? $courseModel->getById($certificate['course_id']) : null;

        $studentName = (string) ($certificate['name'] ?? 'Student');
        $studentCountry = (string) ($certificate['country'] ?? '');
        $courseName = (string) ($input['course_name'] ?? ($course['course_name'] ?? 'Endorsed Course'));
        $instituteName = (string) ($input['institute_name'] ?? ($institute['name'] ?? 'Accredited Training Partner'));
        $instituteCode = (string) ($institute['code'] ?? '');
        $instituteEmail = (string) ($institute['email'] ?? '');
        $verificationUrl = (string) ($input['verification_url'] ?? ('https://ukcas.co.uk/verify-certificate?id=' . urlencode($certificateId)));

        $attachment = null;
        if (!empty($input['pdf_base64'])) {
            $decodedPdf = base64_decode($input['pdf_base64'], true);
            if ($decodedPdf !== false && $decodedPdf !== '') {
                $safeFilename = preg_replace('/[^A-Za-z0-9._-]/', '_', (string) ($input['pdf_filename'] ?? ('UKCAS-Certificate-' . $certificateId . '.pdf')));
                $attachment = [
                    'content' => $decodedPdf,
                    'filename' => $safeFilename,
                    'mime' => 'application/pdf'
                ];
            }
        }

        $esc = function ($value) {
            return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
        };

        $countryRow = $studentCountry !== ''
            ? '<tr><td style="padding:6px 0;color:#475569;font-weight:600;">Country</td><td style="padding:6px 0;color:#0f172a;">' . $esc($studentCountry) . '</td></tr>'
            : '';

        $lpcRow = $instituteCode !== ''
            ? '<tr><td style="padding:6px 0;color:#475569;font-weight:600;">Provider Code (LPC)</td><td style="padding:6px 0;color:#0f172a;">' . $esc($instituteCode) . '</td></tr>'
            : '';

        $subject = 'Your Official UKCAS Certificate - ' . $courseName . ' (ID: ' . $certificateId . ')';
        $htmlBody = '
            <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#f8fafc;padding:24px;color:#0f172a;">
                <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                    <div style="background:#1A5276;color:#ffffff;padding:20px 24px;">
                        <h1 style="margin:0;font-size:20px;">United Kingdom College of Advanced Studies (UKCAS)</h1>
                        <p style="margin:4px 0 0;font-size:13px;opacity:0.9;">International Student Certificate Notification</p>
                    </div>
                    <div style="padding:24px;">
                        <p style="margin-top:0;">Dear <strong>' . $esc($studentName) . '</strong>,</p>
                        <p>Congratulations! Your UKCAS-endorsed certificate issued through our accredited international training partner <strong>' . $esc($instituteName) . '</strong> is ready.</p>
                        <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
                            <tr><td style="padding:6px 0;color:#475569;font-weight:600;width:180px;">Certificate Number</td><td style="padding:6px 0;color:#0f172a;font-family:monospace;">' . $esc($certificateId) . '</td></tr>
                            <tr><td style="padding:6px 0;color:#475569;font-weight:600;">Course</td><td style="padding:6px 0;color:#0f172a;">' . $esc($courseName) . '</td></tr>
                            <tr><td style="padding:6px 0;color:#475569;font-weight:600;">Training Partner</td><td style="padding:6px 0;color:#0f172a;">' . $esc($instituteName) . '</td></tr>
                            ' . $lpcRow . $countryRow . '
                        </table>
                        ' . ($attachment ? '<p>Your official A4 certificate PDF is attached to this email.</p>' : '') . '
                        <p style="margin:24px 0;">
                            <a href="' . $esc($verificationUrl) . '" style="display:inline-block;background:#2E86AB;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:600;">Verify Certificate Online</a>
                        </p>
                        <p style="font-size:12px;color:#64748b;">Verification link: <a href="' . $esc($verificationUrl) . '" style="color:#2E86AB;">' . $esc($verificationUrl) . '</a></p>
                    </div>
                    <div style="background:#f1f5f9;padding:14px 24px;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;">
                        United Kingdom College of Advanced Studies &bull; 182-184 High Street North, East Ham, London, E6 2JA
                    </div>
                </div>
            </div>';

        $sendResult = MailHelper::sendMail(
            $toEmail,
            $studentName,
            $subject,
            $htmlBody,
            '',
            $attachment,
            $instituteEmail,
            $instituteName
        );

        if (!$sendResult['success']) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => $sendResult['message']
            ]);
            return;
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Certificate email sent to ' . $toEmail . '.'
        ]);
    }
}
