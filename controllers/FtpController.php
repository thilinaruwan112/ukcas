<?php

// controllers/FtpController.php
class FtpController
{

    public $model;
    public $pdo;
    private $ftpConfig;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
        $this->ftpConfig = include('./config/ftp.php');
    }

    // FTP Helper Methods (from EventController)
    private function ensureDirectoryExists($ftp_conn, $dir)
    {
        $parts = explode('/', $dir);
        $path = '';
        foreach ($parts as $part) {
            if (empty($part)) {
                continue;
            }
            $path .= '/' . $part;
            if (!@ftp_chdir($ftp_conn, $path)) {
                if (!ftp_mkdir($ftp_conn, $path)) {
                    throw new Exception("Could not create directory: $path on FTP server.");
                }
            }
        }
    }

    private function uploadToFTP($localFile, $ftpFilePath)
    {
        ini_set('memory_limit', '256M'); // Increase memory limit for image processing

        // FTP credentials from config
        $ftp_server   = $this->ftpConfig['ftp_server'];
        $ftp_username = $this->ftpConfig['ftp_username'];
        $ftp_password = $this->ftpConfig['ftp_password'];

        // Connect to FTP server
        $ftp_conn = ftp_connect($ftp_server);
        if (!$ftp_conn) {
            error_log("FTP connection failed: $ftp_server");
            return ['status' => 'error', 'message' => 'FTP connection failed'];
        }

        // Login to FTP
        if (!ftp_login($ftp_conn, $ftp_username, $ftp_password)) {
            ftp_close($ftp_conn);
            error_log("FTP login failed for user: $ftp_username");
            return ['status' => 'error', 'message' => 'FTP login failed'];
        }

        // Enable passive mode
        ftp_pasv($ftp_conn, true);

        // Ensure that the target directory exists
        try {
            $this->ensureDirectoryExists($ftp_conn, dirname($ftpFilePath));
        } catch (Exception $e) {
            error_log("Directory creation failed: " . $e->getMessage());
            ftp_close($ftp_conn);
            return ['status' => 'error', 'message' => 'FTP upload failed'];
        }

        // Upload file
        if (!ftp_put($ftp_conn, $ftpFilePath, $localFile, FTP_BINARY)) {
            ftp_close($ftp_conn);
            error_log("Failed to upload: $localFile to $ftpFilePath");
            return ['status' => 'error', 'message' => "Failed to upload: $localFile to $ftpFilePath"];
        }

        // Close FTP connection
        ftp_close($ftp_conn);
        return true;
    }

    // Validate image file
    private function validateImage($file)
    {
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $maxSize = 5 * 1024 * 1024; // 5MB

        if (!in_array($file['type'], $allowedTypes)) {
            return 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.';
        }

        if ($file['size'] > $maxSize) {
            return 'File size too large. Maximum 5MB allowed.';
        }

        return null; // No errors
    }

    // Create directory-safe name
    private function sanitizeName($name)
    {
        // Remove special characters and spaces, replace with hyphens
        $sanitized = preg_replace('/[^a-zA-Z0-9\s-]/', '', $name);
        $sanitized = preg_replace('/\s+/', '-', trim($sanitized));
        $sanitized = strtolower($sanitized);
        return $sanitized;
    }

    // Common image upload function
    public function uploadImage($file, $ftpPath)
    {
        $error = $this->validateImage($file);
        if ($error) {
            return ['status' => 'error', 'message' => $error];
        }
        $success = $this->uploadToFTP($file['tmp_name'], $ftpPath);
        if ($success) {
            return ['status' => 'success', 'ftp_path' => $ftpPath];
        } else {
            return ['status' => 'error', 'message' => 'FTP upload failed: ' . $success['message']];
        }
    }
}
