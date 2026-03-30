<?php
require_once 'db.php';

if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $pass1 = $_POST['password'] ?? '';
    $pass2 = $_POST['password_confirm'] ?? '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Nieprawidłowy adres email.';
    } elseif ($pass1 !== $pass2) {
        $error = 'Hasła nie pasują do siebie.';
    } elseif (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/', $pass1)) {
        $error = 'Hasło musi mieć min. 8 znaków, w tym małą i dużą literę oraz cyfrę.';
    } else {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $error = 'Ten email jest już zajęty.';
        } else {
            $hash = password_hash($pass1, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare('INSERT INTO users(email, password) VALUES(?, ?)');
            if ($stmt->execute([$email, $hash])) {
                $success = 'Konto zostało założone. Możesz się zalogować.';
            } else {
                $error = 'Wystąpił błąd podczas zakładania konta.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rejestracja</title>
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
        .info { font-size: 0.8rem; color: #333; margin: 5px 0; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Rejestracja</h1>
        <?php if ($error): ?>
            <div class="error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>
        <?php if ($success): ?>
            <div class="success"><?= htmlspecialchars($success) ?></div>
        <?php endif; ?>
        <form action="" method="POST">
            <input type="email" name="email" placeholder="Email" required value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
            <div class="info">Min. 8 znaków, 1 mała i duża litera, 1 cyfra</div>
            <input type="password" name="password" placeholder="Hasło" required>
            <input type="password" name="password_confirm" placeholder="Powtórz hasło" required>
            <button type="submit">Zarejestruj się</button>
        </form>
        <div class="links">
            <a href="login.php">Masz już konto? Zaloguj się</a>
        </div>
    </div>
</body>
</html>