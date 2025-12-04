<?php 
    $dsn = "mysql:host=localhost;dbname=planer;charset=utf8";
    $user = "root";
    $pass = "";

    try{
        $pdo = new PDO($dsn, $user, $pass, 
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);   
    }catch(PDOException $e){
        die("Błąd połączenia: " . $e->getMessage());
    }

    function formatDatePl($date){
        $df = new IntlDateFormatter(
            'pl_PL',
            IntlDateFormatter::LONG,
            IntlDateFormatter::SHORT,
            'Europe/Warsaw',
            null,
            'd MMMM yyyy, HH:mm'
        );
        return $df->format(new DateTime($date));
    }

    function toDateTime($date, $time){
        $dt = new DateTime();
        list($y,$m,$d) = explode("-",$date);
        list($h,$i)    = explode(":",$time);

        $dt->setDate($y,$m,$d);
        $dt->setTime($h,$i,0);
    return $dt->format("Y-m-d H:i:s");
}
    function getNowTimestamp(){
        return time();
    }

    function timestampToDate($ts){
        return date("Y-m-d H:i:s", $ts);
    }
?>

<!doctype html>
<html><head>
<meta charset="utf-8"><title>Planer</title>
<style>
body{font-family:Arial;width:600px;margin:auto;}
.done{color:gray;text-decoration:line-through;}
</style>
</head><body>

<h2>📅 Planner PDO + DateTime</h2>

<form action="add.php" method="POST">
    <input type="text" name="title" placeholder="Tytuł" required><br><br>
    <textarea name="description" placeholder="Opis"></textarea><br><br>

    Data: <input type="date" name="date" required><br>
    Godzina: <input type="time" name="time" value="<?=date('H:i')?>"><br><br>

    <button>Dodaj</button>
</form>
<hr>

<h3>Lista zadań</h3>

<?php
$stmt = $pdo->query("SELECT * FROM tasks ORDER BY deadline");
foreach($stmt as $row):
    $class = $row['is_done'] ? "done" : "";
    $deadline = $row['deadline'] ? formatDatePL($row['deadline']) : "brak";
?>

<p class="<?=$class?>">
    <b><?=$row['title']?></b> (<?=$deadline?>)<br>
    <?=$row['description']?><br>

    <a href="complete.php?id=<?=$row['id']?>">✔ Zakończ</a> |
    <a href="edit.php?id=<?=$row['id']?>">✏ Edytuj</a> |
    <a href="delete.php?id=<?=$row['id']?>">🗑 Usuń</a>
</p><hr>

<?php endforeach; ?>

</body></html>


<?php 
$title = $_POST['title'];
$desc  = $_POST['description'];
$dt    = toDateTime($_POST['date'], $_POST['time']); // DateTime -> SQL

$stmt = $pdo->prepare("INSERT INTO tasks(title,description,deadline) VALUES(?,?,?)");
$stmt->execute([$title, $desc, $dt]);

header("Location: index.php");
?>