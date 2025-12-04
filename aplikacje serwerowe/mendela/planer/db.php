<?php 
$dsn = "mysql:host=localhost;dbname=planer;charset=utf8";
    $user = "root";
    $pass = "";

    try{
        $pdo = new PDO($dsn, $user, $pass, 
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);   
    }catch(PDOException $e){
        die("Błąd połączenia: " . $e->getMessage());
    }?>