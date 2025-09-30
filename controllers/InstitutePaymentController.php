<?php
// controllers/InstitutePaymentController.php
require_once './models/InstitutePayment.php';

class InstitutePaymentController

{
    private $model;
    public function __construct($pdo)
    {
        $this->model = new InstitutePayment($pdo);
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
        $payment = $this->model->create($data);
        echo json_encode([
            'status' => 'success',
            'message' => 'Payment created successfully.',
            'data' => $payment
        ]);
    }
    public function update($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $payment = $this->model->update($id, $data);
        echo json_encode([
            'status' => 'success',
            'message' => 'Payment updated successfully.',
            'data' => $payment
        ]);
    }
    public function delete($id)
    {
        $deleted = $this->model->delete($id);
        echo json_encode([
            'status' => $deleted ? 'success' : 'error',
            'message' => $deleted ? 'Payment deleted successfully.' : 'Payment not found.'
        ]);
    }

    // Get institute balance
    public function getInstituteBalance($institute_id)
    {
        $balance = $this->model->getInstituteBalance($institute_id);
        echo json_encode([
            'status' => 'success',
            'institute_id' => $institute_id,
            'balance' => $balance
        ]);
    }
}
