<?php
// models/StudentCertificate.php
class StudentCertificate
{
    private $pdo;
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    // Check if certificate_id exists
    public function getByCertificateId($certificate_id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM students_certificates WHERE certificate_id = ?");
        $stmt->execute([$certificate_id]);
        return $stmt->fetch();
    }
    public function getAll()
    {
        $stmt = $this->pdo->query("SELECT sc.id, sc.institute_id, sc.course_id, sc.certificate_id, sc.student_id, sc.from_date, sc.to_date, sc.created_at, sc.created_by, sc.is_active, sc.approved_status, rs.name AS student_name FROM students_certificates sc LEFT JOIN registered_students rs ON sc.student_id = rs.id");
        return $stmt->fetchAll();
    }
    public function getById($id)
    {
        $stmt = $this->pdo->prepare("SELECT sc.id, sc.institute_id, sc.course_id, sc.certificate_id, sc.student_id, sc.from_date, sc.to_date, sc.created_at, sc.created_by, sc.is_active, sc.approved_status, rs.name AS student_name FROM students_certificates sc LEFT JOIN registered_students rs ON sc.student_id = rs.id WHERE sc.id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    public function create($data)
    {
        $stmt = $this->pdo->prepare("INSERT INTO students_certificates (institute_id, course_id, certificate_id, student_id, from_date, to_date, created_at, created_by, is_active, approved_status) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)");
        $stmt->execute([
            $data['institute_id'],
            $data['course_id'],
            $data['certificate_id'],
            $data['student_id'],
            $data['from_date'],
            $data['to_date'],
            $data['created_by'],
            $data['is_active'],
            'Pending'
        ]);
        return $this->getById($this->pdo->lastInsertId());
    }
    public function update($id, $data)
    {
        $stmt = $this->pdo->prepare("UPDATE students_certificates SET institute_id = ?, course_id = ?, certificate_id = ?, student_id = ?, from_date = ?, to_date = ?, created_by = ?, is_active = ?, approved_status = ? WHERE id = ?");
        $stmt->execute([
            $data['institute_id'],
            $data['course_id'],
            $data['certificate_id'],
            $data['student_id'],
            $data['from_date'],
            $data['to_date'],
            $data['created_by'],
            $data['is_active'],
            'Pending',
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
        $stmt = $this->pdo->prepare("SELECT sc.id, sc.institute_id, sc.course_id, sc.certificate_id, sc.student_id, sc.from_date, sc.to_date, sc.created_at, sc.created_by, sc.is_active, sc.approved_status, rs.name AS student_name FROM students_certificates sc LEFT JOIN registered_students rs ON sc.student_id = rs.id WHERE sc.institute_id = ?");
        $stmt->execute([$institute_id]);
        return $stmt->fetchAll();
    }
}
