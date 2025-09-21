<?php
// models/UserInstitute.php
class UserInstitute
{

    private $pdo;
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }
    public function getAll()
    {
        $stmt = $this->pdo->query("SELECT id, institute_id, user_account, role, created_at, created_by, is_active FROM user_institutes");
        return $stmt->fetchAll();
    }
    public function getById($id)
    {
        $stmt = $this->pdo->prepare("SELECT id, institute_id, user_account, role, created_at, created_by, is_active FROM user_institutes WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    public function create($data)
    {
        $stmt = $this->pdo->prepare("INSERT INTO user_institutes (institute_id, user_account, role, created_at, created_by, is_active) VALUES (?, ?, ?, NOW(), ?, ?)");
        $stmt->execute([
            $data['institute_id'],
            $data['user_account'],
            $data['role'],
            $data['created_by'],
            $data['is_active']
        ]);
        return $this->getById($this->pdo->lastInsertId());
    }
    public function update($id, $data)
    {
        $stmt = $this->pdo->prepare("UPDATE user_institutes SET institute_id = ?, user_account = ?, role = ?, created_by = ?, is_active = ? WHERE id = ?");
        $stmt->execute([
            $data['institute_id'],
            $data['user_account'],
            $data['role'],
            $data['created_by'],
            $data['is_active'],
            $id
        ]);
        return $this->getById($id);
    }
    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM user_institutes WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    // Duplicate property and constructor removed
    public function getByUserAccount($user_account)
    {
        $stmt = $this->pdo->prepare("SELECT id, institute_id, user_account, role, created_at, created_by, is_active FROM user_institutes WHERE user_account = ?");
        $stmt->execute([$user_account]);
        return $stmt->fetchAll();
    }
}
