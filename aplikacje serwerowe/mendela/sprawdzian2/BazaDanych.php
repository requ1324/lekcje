<?php
    $dbname = 'spr';
    $host = "localhost";
    $user = "root";
    $passwd = "";

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $passwd);

    
    
    if (isset($_GET['delete'])){
        $stmt = $pdo->prepare("DELETE FROM dane where id = ?");
        $stmt->execute([$_GET['delete']]);
    }


    if (isset($_GET['imie'])){
        $stmt = $pdo->prepare("INSERT INTO dane (id, Imie, Nazwisko, City) values (?,?, ?, ?)");
        $stmt->execute([$_GET['id'],$_GET['imie'], $_GET['naz'], $_GET['city']]);
    }
    $dane = $pdo->query("SELECT * FROM dane");

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="" method="get">
        <input type="number" name="id" placeholder="id">
        <input type="text" name="imie" placeholder="imie">
        <input type="text" name="naz" placeholder="nazwisko">
        <input type="text" name="city" placeholder="city">
        <button type="submit">Wyślij</button>
    </form>
    <table>
    <?php foreach ($dane as $d):?>
        <tr>
            <td><?= $d['id'] ?></td>
            <td><?= $d['Imie'] ?></td>
            <td><?= $d['Nazwisko'] ?></td>
            <td><?= $d['City'] ?></td>
            <td><a href="?delete=<?= $d['id'] ?>">X</a></td>
        </tr>
    <?php endforeach?>
    </table>
</body>
</html>