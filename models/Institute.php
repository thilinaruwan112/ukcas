<?php

class Institute
{
    private $pdo;
    private $table = "institutes";

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    // Get all institutes
    public function getAll()
    {
        $stmt = $this->pdo->prepare("SELECT * FROM {$this->table}");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get institute by ID
    public function getById($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create new institute
    public function create($data)
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO {$this->table}
            (name, code, type, accreditation_status, accreditation_valid_until, email, phone, website,
             address_line1, address_line2, city, state, country, postal_code, created_at, updated_at, created_by, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['name'],
            $data['code'],
            $data['type'],
            $data['accreditation_status'],
            $data['accreditation_valid_until'],
            $data['email'],
            $data['phone'],
            $data['website'],
            $data['address_line1'],
            $data['address_line2'],
            $data['city'],
            $data['state'],
            $data['country'],
            $data['postal_code'],
            $data['created_at'],
            $data['updated_at'],
            $data['created_by'],
            $data['status']
        ]);

        return $this->pdo->lastInsertId();
    }

    // Update institute
    public function update($id, $data)
    {
        $stmt = $this->pdo->prepare("
            UPDATE {$this->table} SET
                name = ?,
                code = ?,
                type = ?,
                accreditation_status = ?,
                accreditation_valid_until = ?,
                email = ?,
                phone = ?,
                website = ?,
                address_line1 = ?,
                address_line2 = ?,
                city = ?,
                state = ?,
                country = ?,
                postal_code = ?,
                created_at = ?,
                updated_at = ?,
                created_by = ?,
                status = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $data['name'],
            $data['code'],
            $data['type'],
            $data['accreditation_status'],
            $data['accreditation_valid_until'],
            $data['email'],
            $data['phone'],
            $data['website'],
            $data['address_line1'],
            $data['address_line2'],
            $data['city'],
            $data['state'],
            $data['country'],
            $data['postal_code'],
            $data['created_at'],
            $data['updated_at'],
            $data['created_by'],
            $data['status'],
            $id
        ]);
    }

    // Delete institute
    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
    }
}
