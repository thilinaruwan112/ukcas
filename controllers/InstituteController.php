<?php
require_once './models/Institute.php';
class InstituteController
{
    private $model;

    public function __construct($pdo)
    {
        $this->model = new Institute($pdo);
    }

    // Get all institutes
    public function getAllRecords()
    {
        $records = $this->model->getAll();
        echo json_encode($records);
    }

    // Get institute by ID
    public function getRecordById($id)
    {
        $record = $this->model->getById($id);
        if ($record) {
            echo json_encode($record);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Institute not found']);
        }
    }

    // Get institute by slug
    public function getRecordBySlug($slug)
    {
        $record = $this->model->getBySlug($slug);
        if ($record) {
            echo json_encode($record);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Institute not found']);
        }
    }

    // Create new institute
    public function createRecord()
    {
        $data = $_POST;
        require_once './controllers/FtpController.php';
        $ftpController = new FtpController($GLOBALS['pdo']);

        // Handle logo upload
        if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['logo'];
            $safeName = preg_replace('/[^a-zA-Z0-9\s-]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
            $safeName = preg_replace('/\s+/', '-', trim($safeName));
            $safeName = strtolower($safeName);
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            // Use code or fallback to random for folder
            $prefix = 'UKCAS';
            do {
                $random = mt_rand(1000, 9999);
                $data['code'] = $prefix . $random;
                $exists = $this->model->getByCode($data['code']);
            } while ($exists);
            $logoPath = "/ukcas/institutes/{$data['code']}/logo/{$safeName}.{$ext}";
            $result = $ftpController->uploadImage($file, $logoPath);
            if (isset($result['status']) && $result['status'] === 'success') {
                $data['logo_path'] = 'https://content-provider.payshia.com' . $logoPath;
            } else {
                $data['logo_path'] = '';
            }
        } else {
            $data['logo_path'] = '';
            // Generate code if not already set
            $prefix = 'UKCAS';
            do {
                $random = mt_rand(1000, 9999);
                $data['code'] = $prefix . $random;
                $exists = $this->model->getByCode($data['code']);
            } while ($exists);
        }

        if ($data && isset($data['name'])) {
            $id = $this->model->create($data);
            http_response_code(201);
            echo json_encode([
                'message' => 'Institute created successfully',
                'id' => $id,
                'data' => $this->model->getById($id)
            ]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid input']);
        }
    }

    // Update institute
    public function updateRecord($id)
    {
        $data = $_POST;
        require_once './controllers/FtpController.php';
        $ftpController = new FtpController($GLOBALS['pdo']);
        $current = $this->model->getById($id);
        // Handle logo upload
        if (isset($_FILES['logo_path']) && $_FILES['logo_path']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['logo_path'];
            $safeName = preg_replace('/[^a-zA-Z0-9\s-]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
            $safeName = preg_replace('/\s+/', '-', trim($safeName));
            $safeName = strtolower($safeName);
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $code = isset($data['code']) ? $data['code'] : (isset($current['code']) ? $current['code'] : 'UKCAS' . mt_rand(1000, 9999));
            $logoPath = "/ukcas/institutes/{$code}/logo/{$safeName}.{$ext}";
            $result = $ftpController->uploadImage($file, $logoPath);
            if (isset($result['status']) && $result['status'] === 'success') {
                $data['logo_path'] = 'https://content-provider.payshia.com' . $logoPath;
            } else {
                $data['logo_path'] = isset($current['logo_path']) ? $current['logo_path'] : '';
            }
        } else {
            $data['logo_path'] = isset($current['logo_path']) ? $current['logo_path'] : '';
        }

        if ($data && isset($data['name'])) {
            $this->model->update($id, $data);
            echo json_encode([
                'message' => 'Institute updated successfully',
                'data' => $this->model->getById($id)
            ]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid input']);
        }
    }

    // Delete institute
    public function deleteRecord($id)
    {
        $this->model->delete($id);
        echo json_encode(['message' => 'Institute deleted successfully']);
    }
}
