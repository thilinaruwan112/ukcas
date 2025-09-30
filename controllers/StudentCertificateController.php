<?php
// controllers/StudentCertificateController.php
require_once './models/StudentCertificate.php';
require_once './controllers/InstitutePaymentController.php';

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
            echo json_encode([
                'status' => 'success',
                'message' => 'Approved status updated.'
            ]);
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
}
