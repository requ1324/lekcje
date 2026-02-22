<?php
session_start();

    date_default_timezone_set("Europe/Warsaw");
echo "The current date and time is " . date("Y-m-d H:i:s");

    if (!isset($_SESSION['counter'])){
        $_SESSION['counter'] = 0;
    }

    

 if (isset($_POST['submit'])){
   
    $_SESSION['counter']++;
 }
 echo "Formularz zostal wyslany " . $_SESSION['counter'] . "razy";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="add.php" method='post'>
        <input type="text" placeholder='imie' name='imie'>
        <input type="text" placeholder='email' name='email'>
        <input type="text" placeholder='data' name='data'>
        <button type='submit' name='submit'>wyslij</button>
    </form>
</body>
</html>