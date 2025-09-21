<?php
// models/InstituteCourse.php
class InstituteCourse
{
    private $pdo;
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }
    public function getAll($institute_id)
    {
        $stmt = $this->pdo->prepare("SELECT id, institute_id, course_code, course_name, created_at, created_by, active_status FROM institute_courses WHERE institute_id = ?");
        $stmt->execute([$institute_id]);
        return $stmt->fetchAll();
    }
    public function getById($id)
    {
        $stmt = $this->pdo->prepare("SELECT id, institute_id, course_code, course_name, created_at, created_by, active_status FROM institute_courses WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    public function create($data)
    {
        $stmt = $this->pdo->prepare("INSERT INTO institute_courses (institute_id, course_code, course_name, created_at, created_by, active_status) VALUES (?, ?, ?, NOW(), ?, ?)");
        $stmt->execute([
            $data['institute_id'],
            $data['course_code'],
            $data['course_name'],
            $data['created_by'],
            $data['active_status']
        ]);
        return $this->getById($this->pdo->lastInsertId());
    }
    public function update($id, $data)
    {
        $stmt = $this->pdo->prepare("UPDATE institute_courses SET institute_id = ?, course_code = ?, course_name = ?, created_by = ?, active_status = ? WHERE id = ?");
        $stmt->execute([
            $data['institute_id'],
            $data['course_code'],
            $data['course_name'],
            $data['created_by'],
            $data['active_status'],
            $id
        ]);
        return $this->getById($id);
    }
    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM institute_courses WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }
}
