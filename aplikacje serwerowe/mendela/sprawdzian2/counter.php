<?php 
session_start();

if (!isset($_SESSION['counter'])){
    $_SESSION['counter'] = 0;
}

if (isset($_POST['submit'])){
    $_SESSION['counter']++;
}


?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form method='post'>
        <button type='submit' name='submit'>submit</button>
    </form>
    <p>Formularz wysłany: <?= $_SESSION['counter']?></p>
</body>
</html>