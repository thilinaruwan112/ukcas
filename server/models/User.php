<?php
// models/User.php
class User
{
    private $pdo;
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }
    public function getAll()
    {
        $stmt = $this->pdo->query("SELECT id, email, user_name, pass, first_name, last_name, sex, addressl1, addressl2, city, PNumber, WPNumber, created_at, user_status, acc_type, img_path, update_by, civil_status, nic_number FROM users");
        return $stmt->fetchAll();
    }
    public function getById($id)
    {
        $stmt = $this->pdo->prepare("SELECT id, email, user_name, pass, first_name, last_name, sex, addressl1, addressl2, city, PNumber, WPNumber, created_at, user_status, acc_type, img_path, update_by, civil_status, nic_number FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    public function getByEmail($email)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }
    public function create($data)
    {
        $stmt = $this->pdo->prepare("INSERT INTO users (email, user_name, pass, first_name, last_name, sex, addressl1, addressl2, city, PNumber, WPNumber, created_at, user_status, acc_type, img_path, update_by, civil_status, nic_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['email'],
            $data['user_name'],
            password_hash($data['pass'], PASSWORD_DEFAULT),
            $data['first_name'],
            $data['last_name'],
            $data['sex'],
            $data['addressl1'],
            $data['addressl2'],
            $data['city'],
            $data['PNumber'],
            $data['WPNumber'],
            $data['user_status'],
            $data['acc_type'],
            $data['img_path'],
            $data['update_by'],
            $data['civil_status'],
            $data['nic_number']
        ]);
        return $this->getById($this->pdo->lastInsertId());
    }
    public function update($id, $data)
    {
        $stmt = $this->pdo->prepare("UPDATE users SET email = ?, user_name = ?, first_name = ?, last_name = ?, sex = ?, addressl1 = ?, addressl2 = ?, city = ?, PNumber = ?, WPNumber = ?, user_status = ?, acc_type = ?, img_path = ?, update_by = ?, civil_status = ?, nic_number = ? WHERE id = ?");
        $stmt->execute([
            $data['email'],
            $data['user_name'],
            $data['first_name'],
            $data['last_name'],
            $data['sex'],
            $data['addressl1'],
            $data['addressl2'],
            $data['city'],
            $data['PNumber'],
            $data['WPNumber'],
            $data['user_status'],
            $data['acc_type'],
            $data['img_path'],
            $data['update_by'],
            $data['civil_status'],
            $data['nic_number'],
            $id
        ]);
        return $this->getById($id);
    }
    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }
}
