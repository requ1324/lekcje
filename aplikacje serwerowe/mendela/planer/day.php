<?php require "db.php"; require "date-utils.php";

$date = $_GET['date'] ?? date('Y-m-d');
$dt = new DateTime($date);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $time = $_POST['time'];
    $deadline = toDateTime($date, $time);
    $stmt = $pdo->prepare("INSERT INTO tasks(title,description,deadline) VALUES(?,?,?)");
    $stmt->execute([$_POST['title'], $_POST['description'], $deadline]);
}
?>

<!doctype html>
<html><head>
<meta charset="utf-8">
<title>Zadania <?=$date?></title>
<style>
body{font-family:Arial;width:600px;margin:auto;}
.done{text-decoration:line-through;color:gray;}
</style>
</head><body>

<h2>📅 <?=$dt->format("d.m.Y (l)")?></h2>
<a href="calendar.php">🔙 powrót</a>
<hr>

<form action="" method="POST">
    <input type="hidden" name="date" value="<?=$date?>">
    <input type="time" name="time" value="<?=date('H:i')?>"><br><br>
    <input type="text" name="title" placeholder="Tytuł" required><br><br>
    <textarea name="description" placeholder="Opis"></textarea><br><br>
    <button>➕ Dodaj zadanie</button>
</form>
<hr>

<h3>Zadania na <?=$dt->format("d.m.Y")?>:</h3>

<?php
$stmt=$pdo->prepare("SELECT * FROM tasks WHERE DATE(deadline)=? ORDER BY deadline");
$stmt->execute([$date]);

foreach($stmt as $t):
?>

<p class="<?=$t['is_done']?'done':''?>">
<b><?=$t['title']?></b><br>
<?=$t['description']?><br>
<?=formatDatePL($t['deadline'])?><br>

<a href="complete.php?id=<?=$t['id']?>&date=<?=$date?>">✔ wykonaj</a> |
<a href="delete.php?id=<?=$t['id']?>&date=<?=$date?>">🗑 usuń</a>
</p><hr>
<?php endforeach; ?>

</body></html>
