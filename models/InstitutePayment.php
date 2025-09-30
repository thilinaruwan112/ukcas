<?php
// models/InstitutePayment.php
class InstitutePayment

{
    private $pdo;
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }
    public function getAll()
    {
        $stmt = $this->pdo->query("SELECT id, institute_id, type, amount, created_at, created_by, active_status, remark FROM institute_payments");
        return $stmt->fetchAll();
    }
    public function getById($id)
    {
        $stmt = $this->pdo->prepare("SELECT id, institute_id, type, amount, created_at, created_by, active_status, remark FROM institute_payments WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    public function create($data)
    {
        $stmt = $this->pdo->prepare("INSERT INTO institute_payments (institute_id, type, amount, created_at, created_by, active_status, remark) VALUES (?, ?, ?, NOW(), ?, ?, ?)");
        $stmt->execute([
            $data['institute_id'],
            $data['type'],
            $data['amount'],
            $data['created_by'],
            $data['active_status'],
            $data['remark'] ?? null
        ]);
        return $this->getById($this->pdo->lastInsertId());
    }
    public function update($id, $data)
    {
        $stmt = $this->pdo->prepare("UPDATE institute_payments SET institute_id = ?, type = ?, amount = ?, created_by = ?, active_status = ?, remark = ? WHERE id = ?");
        $stmt->execute([
            $data['institute_id'],
            $data['type'],
            $data['amount'],
            $data['created_by'],
            $data['active_status'],
            $data['remark'] ?? null,
            $id
        ]);
        return $this->getById($id);
    }
    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM institute_payments WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    // Get institute balance: sum of credits minus sum of debits
    public function getInstituteBalance($institute_id)
    {
        $stmt = $this->pdo->prepare("SELECT 
            COALESCE(SUM(CASE WHEN type = 'DEBIT' THEN amount ELSE 0 END), 0) - 
            COALESCE(SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE 0 END), 0) AS balance
            FROM institute_payments WHERE institute_id = ? AND active_status = 1");
        $stmt->execute([$institute_id]);
        $row = $stmt->fetch();
        return $row ? $row['balance'] : 0;
    }
}
