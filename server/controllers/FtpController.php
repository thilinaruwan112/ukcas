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

    private function ensureDirectoryExists($ftp_conn, $dir)
    {
        $parts = explode('/', trim($dir, '/'));
        $path = '';
        foreach ($parts as $part) {
            if ($part === '') {
                continue;
            }
            $path .= '/' . $part;
            if (!@ftp_chdir($ftp_conn, $path)) {
                if (!@ftp_mkdir($ftp_conn, $path)) {
                    throw new Exception("Could not create directory: $path on FTP server.");
                }
            }
        }
        @ftp_chdir($ftp_conn, '/');
    }

    private function uploadToFTP($localFile, $ftpFilePath)
    {
        ini_set('memory_limit', '256M');

        $ftp_server   = $this->ftpConfig['ftp_server'] ?? '';
        $ftp_username = $this->ftpConfig['ftp_username'] ?? '';
        $ftp_password = $this->ftpConfig['ftp_password'] ?? '';
        $ftp_port     = (int) ($this->ftpConfig['ftp_port'] ?? 21);

        if ($ftp_server === '' || $ftp_username === '' || $ftp_password === '') {
            return ['status' => 'error', 'message' => 'FTP credentials are not configured in server/.env.'];
        }

        $ftp_conn = @ftp_connect($ftp_server, $ftp_port, 15);
        if (!$ftp_conn) {
            error_log("FTP connection failed: $ftp_server");
            return ['status' => 'error', 'message' => 'FTP connection failed'];
        }

        if (!@ftp_login($ftp_conn, $ftp_username, $ftp_password)) {
            @ftp_close($ftp_conn);
            error_log("FTP login failed for user: $ftp_username");
            return ['status' => 'error', 'message' => 'FTP login failed'];
        }

        ftp_pasv($ftp_conn, true);

        try {
            $this->ensureDirectoryExists($ftp_conn, dirname($ftpFilePath));
        } catch (Exception $e) {
            error_log("Directory creation failed: " . $e->getMessage());
            @ftp_close($ftp_conn);
            return ['status' => 'error', 'message' => $e->getMessage()];
        }

        if (!@ftp_put($ftp_conn, $ftpFilePath, $localFile, FTP_BINARY)) {
            @ftp_close($ftp_conn);
            error_log("Failed to upload: $localFile to $ftpFilePath");
            return ['status' => 'error', 'message' => "Failed to upload file to $ftpFilePath"];
        }

        @ftp_close($ftp_conn);
        return true;
    }

    private function validateImage($file)
    {
        $allowedTypes = ['image/jpg', 'image/jpeg', 'image/pjpeg', 'image/png', 'image/x-png', 'image/gif', 'image/webp'];
        $maxSize = 10 * 1024 * 1024; // 10MB

        $mimeType = strtolower((string) ($file['type'] ?? ''));
        if (function_exists('finfo_open') && !empty($file['tmp_name']) && is_file($file['tmp_name'])) {
            $finfo = @finfo_open(FILEINFO_MIME_TYPE);
            if ($finfo) {
                $detected = @finfo_file($finfo, $file['tmp_name']);
                @finfo_close($finfo);
                if (is_string($detected) && $detected !== '') {
                    $mimeType = strtolower($detected);
                }
            }
        }

        if (!in_array($mimeType, $allowedTypes, true)) {
            return 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.';
        }

        if (($file['size'] ?? 0) > $maxSize) {
            return 'File size too large. Maximum 10MB allowed.';
        }

        return null;
    }

    public function uploadImage($file, $ftpPath)
    {
        $error = $this->validateImage($file);
        if ($error) {
            return ['status' => 'error', 'message' => $error];
        }
        $result = $this->uploadToFTP($file['tmp_name'], $ftpPath);
        if ($result === true) {
            return ['status' => 'success', 'ftp_path' => $ftpPath];
        }

        $msg = is_array($result) && isset($result['message']) ? $result['message'] : 'Unknown FTP error';
        return ['status' => 'error', 'message' => 'FTP upload failed: ' . $msg];
    }
}
