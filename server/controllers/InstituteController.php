<?php
require_once './models/Institute.php';

class InstituteController
{
    private $model;
    private const CONTENT_BASE_URL = 'https://content-provider.payshia.com/ukcas';

    public function __construct($pdo)
    {
        $this->model = new Institute($pdo);
    }

    private function generateSlug($name)
    {
        $slug = strtolower(trim((string) $name));
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/\s+/', '-', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        return trim($slug, '-');
    }

    private function generateUniqueCode()
    {
        $prefix = 'UKCAS';
        do {
            $random = mt_rand(1000, 9999);
            $code = $prefix . $random;
            $exists = $this->model->getByCode($code);
        } while ($exists);
        return $code;
    }

    private function handleLogoUpload($code)
    {
        if (!isset($_FILES['logo']) || $_FILES['logo']['error'] === UPLOAD_ERR_NO_FILE) {
            return ['uploaded' => false, 'logo_path' => null];
        }

        $file = $_FILES['logo'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return [
                'uploaded' => false,
                'error' => 'Logo upload failed with PHP upload error code: ' . $file['error'],
            ];
        }

        require_once './controllers/FtpController.php';
        $ftpController = new FtpController($GLOBALS['pdo']);

        $rawBaseName = pathinfo($file['name'], PATHINFO_FILENAME);
        $safeName = preg_replace('/[^a-zA-Z0-9\s-]/', '', (string) $rawBaseName);
        $safeName = preg_replace('/\s+/', '-', trim($safeName));
        $safeName = strtolower(trim($safeName, '-'));
        if ($safeName === '') {
            $safeName = 'logo-' . time();
        }

        $ext = strtolower((string) pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($ext === '') {
            $ext = 'png';
        }

        // FTP user root already maps to /ukcas on content-provider.payshia.com
        $ftpPath = "/institutes/{$code}/logo/{$safeName}.{$ext}";
        $result = $ftpController->uploadImage($file, $ftpPath);

        if (!isset($result['status']) || $result['status'] !== 'success') {
            return [
                'uploaded' => false,
                'error' => $result['message'] ?? 'Failed to upload institute logo to FTP.',
            ];
        }

        return [
            'uploaded' => true,
            'logo_path' => self::CONTENT_BASE_URL . $ftpPath,
        ];
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
            echo json_encode(['error' => 'Institute not found', 'message' => 'Institute not found']);
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
            echo json_encode(['error' => 'Institute not found', 'message' => 'Institute not found']);
        }
    }

    // Create new institute
    public function createRecord()
    {
        $data = $_POST;
        if (empty($data) || empty($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid input', 'message' => 'Institute name is required.']);
            return;
        }

        $now = date('Y-m-d H:i:s');
        $data['created_at'] = $now;
        $data['updated_at'] = $now;
        $data['slug'] = !empty($data['slug']) ? $this->generateSlug($data['slug']) : $this->generateSlug($data['name']);
        $data['code'] = $this->generateUniqueCode();

        $upload = $this->handleLogoUpload($data['code']);
        if (isset($upload['error'])) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $upload['error']]);
            return;
        }
        $data['logo_path'] = $upload['uploaded'] ? $upload['logo_path'] : '';

        $id = $this->model->create($data);
        http_response_code(201);
        echo json_encode([
            'message' => 'Institute created successfully',
            'id' => $id,
            'data' => $this->model->getById($id),
        ]);
    }

    // Update institute
    public function updateRecord($id)
    {
        $current = $this->model->getById($id);
        if (!$current) {
            http_response_code(404);
            echo json_encode(['error' => 'Institute not found', 'message' => 'Institute not found.']);
            return;
        }

        $data = array_merge($current, $_POST);
        if (empty($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid input', 'message' => 'Institute name is required.']);
            return;
        }

        $data['updated_at'] = date('Y-m-d H:i:s');
        $data['code'] = !empty($current['code']) ? $current['code'] : $this->generateUniqueCode();
        $data['slug'] = !empty($_POST['slug'])
            ? $this->generateSlug($_POST['slug'])
            : $this->generateSlug($data['name']);

        $upload = $this->handleLogoUpload($data['code']);
        if (isset($upload['error'])) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $upload['error']]);
            return;
        }
        $data['logo_path'] = $upload['uploaded']
            ? $upload['logo_path']
            : ($current['logo_path'] ?? '');

        $this->model->update($id, $data);
        echo json_encode([
            'message' => 'Institute updated successfully',
            'data' => $this->model->getById($id),
        ]);
    }

    // Delete institute
    public function deleteRecord($id)
    {
        $this->model->delete($id);
        echo json_encode(['message' => 'Institute deleted successfully']);
    }
}
