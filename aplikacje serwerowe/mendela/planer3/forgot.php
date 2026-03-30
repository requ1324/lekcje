<?php
require_once 'db.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Nieprawidłowy adres email.';
    } else {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            $token = bin2hex(random_bytes(32));
            $expires = date('Y-m-d H:i:s', time() + 3600); 

            $stmt = $pdo->prepare('UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?');
            $stmt->execute([$token, $expires, $email]);

            $reset_link = 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/reset.php?token=' . $token;
            
            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'siwieckimiki@gmail.com'; 
                $mail->Password   = 'ivulctulskbrdgqq';
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;

                $mail->setFrom('siwieckimiki@gmail.com', 'Planer3 - Reset hasła');
                $mail->addAddress($email);

                $mail->isHTML(true);
                $mail->Subject = 'Resetowanie hasła w serwisie Planer3';
                $mail->Body    = "Kliknij w <a href=\"$reset_link\">ten link</a> aby zresetować hasło. Link jest ważny przez godzinę.";

                $mail->send();
                $success = 'Na podany adres została wysłana wiadomość z instrukcjami resetu hasła.';
            } catch (Exception $e) {
                $error = 'Wystąpił błąd przy wysyłaniu maila: ' . $mail->ErrorInfo;
            }
        } else {
            // Ze względów bezpieczeństwa nie sugerujemy czy dany mail jest w systemie
            // Można potraktować to tak jak poprawne wysłanie
            $success = 'Na podany adres została wysłana wiadomość z instrukcjami resetu hasła.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Przypomnienie hasła</title>
    <style>
        body{
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
            overflow:hidden;
            font-family: Arial, sans-serif;
            background: #f0f7ff;
        }

        .container{
            background:darkgrey;
            border-radius:10px;
            padding:40px;
            display:flex;
            justify-content:space-between;
            align-items:center;
            flex-direction:column;
            width: 350px;
        }

        input{
            margin:10px 0;
            border-radius:0px;
            border:none;
            outline:none;
            padding:10px;
            font-size:1rem;
            width: 100%;
            box-sizing: border-box;
        }

        button{
            text-decoration:none;
            color:black;
            background:white;
            padding:10px 20px;
            border-radius:10px;
            font-size:1.2rem;
            transition:.2s;
            cursor:pointer;
            border:none;
            outline:none;
            margin-top: 15px;
            width: 100%;
        }

        button:hover{
            transition:.2s;
            background:lightgrey;
        }
        form{
            display:flex;
            justify-content:space-between;
            align-items:center;
            flex-direction:column;
            width: 100%;
        }
        .error { color: #800; font-weight: bold; margin-bottom: 10px; text-align: center; }
        .success { color: #060; font-weight: bold; margin-bottom: 10px; text-align: center; background: #cfc; padding: 10px; border-radius: 5px; width:100%; box-sizing:border-box;}
        .links { margin-top: 15px; text-align: center; font-size: 0.9rem; }
        .links a { color: #fff; text-decoration: none; display: block; margin: 5px 0; }
        .links a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Odzyskaj hasło</h1>
        <?php if ($error): ?>
            <div class="error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>
        <?php if ($success): ?>
            <div class="success"><?= htmlspecialchars($success) ?></div>
        <?php endif; ?>
        <?php if (!$success): ?>
        <form action="" method="POST">
            <input type="email" name="email" placeholder="Podaj email" required>
            <button type="submit">Zresetuj</button>
        </form>
        <?php endif; ?>
        <div class="links">
            <a href="login.php">Wróć do logowania</a>
        </div>
    </div>
</body>
</html>