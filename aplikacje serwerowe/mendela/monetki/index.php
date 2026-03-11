<?php 
include("hidden.php"); 


try {
    $mysqli = new mysqli($host, $user, $passwd, $dbname);
    $result = $mysqli->query("
        SELECT 
            d.*,
            f.srcFlagi as flaga_sciezka,
            s.stop as stop_nazwa
        FROM dane d
        LEFT JOIN flagi f ON d.flaga_id = f.id
        LEFT JOIN materialy s ON d.stop_id = s.id
    ")->fetch_all(MYSQLI_ASSOC);

    if(isset($_GET['delete'])) {
        $id = $_GET['delete'];
        $mysqli->query("DELETE FROM dane WHERE id = $id");
        header("Location: index.php");
    }

}catch (Exception $e) {
    echo "Nie można połączyć się z bazą danych" . $e->getMessage();
    die();
}




?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        table{
            border: 1px solid black;
            border-collapse: collapse;
        }
        td{
            border:1px solid black;
            text-align:center;
            padding:5px;
        }
    </style>
</head>
<body>
    <table>
        <tr>
            
            <td>Flaga</td>
            <td>Kraj</td>
            <td>Rok</td>
            <td>Kategoria</td>
            <td>Nominał</td>
            <td>Stop</td>
        </tr>
       <?php foreach($result as $row): ?>
        <tr>
            
            <td><img src="./gfx/<?= $row['flaga_sciezka'] ?>" alt="<?= $row['kraj'] ?>" width="50"></td>
            <td><?= $row['kraj'] ?></td>
            <td><?= $row['rok'] ?></td>
            <td><?= $row['nr_kat'] ?></td>
            <td><?= $row['nominal'] ?></td>
            <td><?= $row['stop_nazwa'] ?></td>
            <td><a href="?delete=<?= $row['id'] ?>"><img src="./gfx/u.gif" alt="Usuń"></a></td>
        </tr>
        <?php endforeach;?>
    </table>
    <form action="" method="post">

    </form>1
</body>
</html>