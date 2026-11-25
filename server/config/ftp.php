<?php
// config/ftp.php
require_once __DIR__ . '/env.php';

return [
    'ftp_server'   => envValue('FTP_SERVER'),
    'ftp_username' => envValue('FTP_USERNAME'),
    'ftp_password' => envValue('FTP_PASSWORD'),
    'ftp_port'     => (int) envValue('FTP_PORT', 21),
];
