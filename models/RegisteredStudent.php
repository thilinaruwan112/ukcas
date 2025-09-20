<?php
// models/RegisteredStudent.php
class RegisteredStudent
{
    private $pdo;
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }
    public function getAll()
    {
        $stmt = $this->pdo->query("SELECT id, name, date_of_birth, email_address, country, phone_number, address, id_card_front, id_card_back, ol_certificate, al_certificate, student_photo, created_at, created_by, active_status FROM registered_students");
        return $stmt->fetchAll();
    }
    public function getById($id)
    {
        $stmt = $this->pdo->prepare("SELECT id, name, date_of_birth, email_address, country, phone_number, address, id_card_front, id_card_back, ol_certificate, al_certificate, student_photo, created_at, created_by, active_status FROM registered_students WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    public function create($data)
    {
        $stmt = $this->pdo->prepare("INSERT INTO registered_students (name, date_of_birth, email_address, country, phone_number, address, id_card_front, id_card_back, ol_certificate, al_certificate, student_photo, created_at, created_by, active_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)");
        $stmt->execute([
            $data['name'],
            $data['date_of_birth'],
            $data['email_address'],
            $data['country'],
            $data['phone_number'],
            $data['address'],
            $data['id_card_front'],
            $data['id_card_back'],
            $data['ol_certificate'],
            $data['al_certificate'],
            $data['student_photo'],
            $data['created_by'],
            $data['active_status']
        ]);
        return $this->getById($this->pdo->lastInsertId());
    }
    public function update($id, $data)
    {
        $stmt = $this->pdo->prepare("UPDATE registered_students SET name = ?, date_of_birth = ?, email_address = ?, country = ?, phone_number = ?, address = ?, id_card_front = ?, id_card_back = ?, ol_certificate = ?, al_certificate = ?, student_photo = ?, created_by = ?, active_status = ? WHERE id = ?");
        $stmt->execute([
            $data['name'],
            $data['date_of_birth'],
            $data['email_address'],
            $data['country'],
            $data['phone_number'],
            $data['address'],
            $data['id_card_front'],
            $data['id_card_back'],
            $data['ol_certificate'],
            $data['al_certificate'],
            $data['student_photo'],
            $data['created_by'],
            $data['active_status'],
            $id
        ]);
        return $this->getById($id);
    }
    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM registered_students WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }
}
