<?php
// models/StudentCertificate.php
class StudentCertificate
{
    private $pdo;
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }
    public function getAll()
    {
        $stmt = $this->pdo->query("SELECT id, institute_id, course_id, certificate_id, created_at, created_by, is_active FROM students_certificates");
        return $stmt->fetchAll();
    }
    public function getById($id)
    {
        $stmt = $this->pdo->prepare("SELECT id, institute_id, course_id, certificate_id, created_at, created_by, is_active FROM students_certificates WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    public function create($data)
    {
        $stmt = $this->pdo->prepare("INSERT INTO students_certificates (institute_id, course_id, certificate_id, created_at, created_by, is_active) VALUES (?, ?, ?, NOW(), ?, ?)");
        $stmt->execute([
            $data['institute_id'],
            $data['course_id'],
            $data['certificate_id'],
            $data['created_by'],
            $data['is_active']
        ]);
        return $this->getById($this->pdo->lastInsertId());
    }
    public function update($id, $data)
    {
        $stmt = $this->pdo->prepare("UPDATE students_certificates SET institute_id = ?, course_id = ?, certificate_id = ?, created_by = ?, is_active = ? WHERE id = ?");
        $stmt->execute([
            $data['institute_id'],
            $data['course_id'],
            $data['certificate_id'],
            $data['created_by'],
            $data['is_active'],
            $id
        ]);
        return $this->getById($id);
    }
    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM students_certificates WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    // Get students by institute_id
    public function getByInstituteId($institute_id)
    {
        $stmt = $this->pdo->prepare("SELECT id, institute_id, course_id, certificate_id, created_at, created_by, is_active FROM students_certificates WHERE institute_id = ?");
        $stmt->execute([$institute_id]);
        return $stmt->fetchAll();
    }
}
