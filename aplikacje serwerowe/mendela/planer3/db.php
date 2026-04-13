<?php
$dsn = 'mysql:host=localhost;dbname=planer;charset=utf8mb4';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    die('Błąd połączenia z bazą: ' . $e->getMessage());
}

$pdo->exec('SET NAMES utf8mb4');

?>