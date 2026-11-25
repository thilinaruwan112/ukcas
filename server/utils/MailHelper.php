<?php
// utils/MailHelper.php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class MailHelper
{
    private static function env($key, $default = '')
    {
        if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
            return $_ENV[$key];
        }
        $val = getenv($key);
        return ($val !== false && $val !== '') ? $val : $default;
    }

    /**
     * Send an email using PHPMailer and SMTP settings from server/.env.
     *
     * @param string $toEmail
     * @param string $toName
     * @param string $subject
     * @param string $htmlBody
     * @param string $altBody
     * @param array|null $attachment ['content' => string, 'filename' => string, 'mime' => string]
     * @param string|null $replyToEmail
     * @param string|null $replyToName
     * @return array ['success' => bool, 'message' => string]
     */
    public static function sendMail(
        $toEmail,
        $toName,
        $subject,
        $htmlBody,
        $altBody = '',
        $attachment = null,
        $replyToEmail = null,
        $replyToName = null
    ) {
        $host = self::env('MAIL_HOST');
        $port = (int) self::env('MAIL_PORT', 587);
        $username = self::env('MAIL_USERNAME');
        $password = self::env('MAIL_PASSWORD');
        $encryption = strtolower(self::env('MAIL_ENCRYPTION', 'tls'));
        $fromAddress = self::env('MAIL_FROM_ADDRESS', $username ?: 'info@ukcas.co.uk');
        $fromName = self::env('MAIL_FROM_NAME', 'UKCAS Accreditation');

        if (empty($host) || $host === 'smtp.example.com' || empty($username) || empty($password)) {
            return [
                'success' => false,
                'message' => 'SMTP mail settings are not configured in server/.env (MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD).'
            ];
        }

        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = $host;
            $mail->SMTPAuth = true;
            $mail->Username = $username;
            $mail->Password = $password;
            $mail->Port = $port;
            $mail->CharSet = 'UTF-8';

            if ($encryption === 'ssl' || $port === 465) {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            } elseif ($encryption === 'tls' || $encryption === 'starttls') {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            }

            $mail->setFrom($fromAddress, $fromName);
            $mail->addAddress($toEmail, $toName);

            if (!empty($replyToEmail) && filter_var($replyToEmail, FILTER_VALIDATE_EMAIL)) {
                $mail->addReplyTo($replyToEmail, $replyToName ?: $replyToEmail);
            }

            if ($attachment && !empty($attachment['content']) && !empty($attachment['filename'])) {
                $mime = $attachment['mime'] ?? 'application/pdf';
                $mail->addStringAttachment($attachment['content'], $attachment['filename'], PHPMailer::ENCODING_BASE64, $mime);
            }

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $htmlBody;
            $mail->AltBody = $altBody ?: strip_tags($htmlBody);

            $mail->send();
            return [
                'success' => true,
                'message' => 'Email sent successfully.'
            ];
        } catch (Exception $e) {
            error_log('MailHelper error: ' . $mail->ErrorInfo);
            return [
                'success' => false,
                'message' => 'Failed to send email: ' . $mail->ErrorInfo
            ];
        }
    }
}
