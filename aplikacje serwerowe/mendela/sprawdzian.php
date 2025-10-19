<?php 
    $host = "localhost";
    $dbname = "todo_app";
    $username = "root";
    $password = "";

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);

    if (isset($_GET['done'])){
        $stmt = $pdo->prepare("UPDATE zadania SET status ='zrobione' WHERE id = ? ");
        $stmt->execute([$_GET['done']]);
    }
    if (isset($_GET['delete'])){
        $stmt = $pdo->prepare("DELETE FROM zadania WHERE id = ?");
        $stmt->execute([$_GET['delete']]);
    }

    $where = "";
    $params = [];
    if (isset($_POST['select']) AND $_POST['select'] != "wszystkie"){
        $where = "WHERE priorytet = ?";
        $params[] = $_POST['select'];
    }

    $stmt = $pdo->prepare("SELECT * FROM zadania $where ORDER BY data_dodania ASC");
    $stmt->execute($params);
    $zadania = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>

        body{
            display:flex;
            justify-content: center;
            align-items:center;
            flex-direction: column;
        }

        table{
            border-collapse:collapse;
            border:1px solid black;
        }

        td{
            border:1px solid black;
        }
        tr{
            border:1px solid black;
        }

        .nowe{
            color:red;
        }

        .zrobione{
            color:green;
        }
    </style>
</head>
<body>
    <form method='post'>
        <select name="select" >
            <option value="wszystkie">Wszystkie</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button type="submit">Filtruj</button>
    </form>
    <table> 
    <tr>
        <td>id</td>
        <td>nazwa</td>
        <td>data dodania</td>
        <td>dni od dodania</td>
        <td>priorytet</td>
        <td>status</td>
    </tr>
    <?php foreach ($zadania as $z):?>
        <?php 
            $dataDodania = new DateTime($z['data_dodania']);
            $dzisiaj = new DateTime();
            $róznica = $dzisiaj->diff($dataDodania)->days;
            
            ?>
        <tr class="<?= $z['status'] ?>">
            <td><?= $z["id"]?></td>
            <td><?= $z["nazwa"]?></td>
            <td><?= $z["data_dodania"]?></td>
            <td><?= $róznica ?></td>
            <td><?= $z["priorytet"]?></td>
            <td><?= $z["status"]?></td>
            <?php if ($z['status'] === "nowe"): ?>
                <td><a href="?done=<?= $z['id'] ?>">Zrób</a></td>
            <?php else: ?>
                <td><a href="?delete=<?= $z['id']?>">Usuń</a></td>
            <?php endif ?>
        </tr>
    <?php endforeach?>

    </table>
</body>
</html>
