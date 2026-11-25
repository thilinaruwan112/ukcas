    <?php
    // routes/InstitutePaymentRoutes.php
    require_once './controllers/InstitutePaymentController.php';

    $pdo = $GLOBALS['pdo'];
    $controller = new InstitutePaymentController($pdo);

    return [
        'GET /institute-payments/' => function () use ($controller) {
            $controller->getAll();
        },
        'GET /institute-payments/{id}' => function ($id) use ($controller) {
            $controller->getById($id);
        },
        'POST /institute-payments/' => function () use ($controller) {

            $data = json_decode(file_get_contents("php://input"), true);
            $controller->create($data);
        },
        'PUT /institute-payments/{id}' => function ($id) use ($controller) {

            $data = json_decode(file_get_contents("php://input"), true);
            $controller->update($id, $data);
        },
        'DELETE /institute-payments/{id}' => function ($id) use ($controller) {
            $controller->delete($id);
        },
        'GET /institute-payments/balance/{institute_id}' => function ($institute_id) use ($controller) {
            $controller->getInstituteBalance($institute_id);
        },
    ];
