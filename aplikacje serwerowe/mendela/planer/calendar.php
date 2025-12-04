<?php
require "db.php";
require "date-utils.php";

// Jeśli nie podano — bierzemy aktualny miesiąc
$year  = $_GET['year']  ?? date('Y');
$month = $_GET['month'] ?? date('m');

$date = new DateTime("$year-$month-01");
$firstDay = $date->format('N');               // 1–7 (pon-nd)
$daysInMonth = $date->format('t');            // ile dni w miesiącu

// Poprzedni i następny miesiąc
$prev = (new DateTime("$year-$month-01"))->modify("-1 month");
$next = (new DateTime("$year-$month-01"))->modify("+1 month");
?>

<!doctype html>
<html><head>
<meta charset="utf-8">
<title>Kalendarz</title>
<style>
body{font-family:Arial;width:800px;margin:auto;text-align:center;}
table{width:100%;border-collapse:collapse;margin-top:20px;font-size:18px;}
td{border:1px solid #ccc;height:100px;vertical-align:top;padding:5px;}
td:hover{background:#f1f1f1;cursor:pointer;}
.day-number{font-weight:bold;font-size:20px;}
.header{background:#222;color:white;padding:10px;font-size:22px;margin-bottom:15px;}
.today{background:#ffeaaa;}
.done{text-decoration:line-through;color:gray;}
</style>
</head><body>

<div class="header">
    <a href="calendar.php?year=<?=$prev->format('Y')?>&month=<?=$prev->format('m')?>">⬅</a>
    <?=$date->format("F Y")?>  <!-- np. January 2025 -->
    <a href="calendar.php?year=<?=$next->format('Y')?>&month=<?=$next->format('m')?>">➡</a>
</div>

<table>
<tr>
    <th>Pon</th><th>Wt</th><th>Śr</th><th>Czw</th><th>Pt</th><th>Sob</th><th>Nd</th>
</tr><tr>

<?php
// Puste pola przed pierwszym dniem
for($i=1;$i<$firstDay;$i++) echo "<td></td>";

for($day=1;$day<=$daysInMonth;$day++){
    
    $current = date('Y-m-d'); // dzisiaj
    $d = sprintf("%04d-%02d-%02d", $year, $month, $day);

    echo "<td class='".($d==$current?'today':'')."'
            onclick=\"location.href='calendar.php?year=$year&month=$month&date=$d'\">
            <div class='day-number'>$day</div>";

    // liczba zadań dla dnia
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM tasks WHERE DATE(deadline)=?");
    $stmt->execute([$d]);
    $count = $stmt->fetchColumn();

    if($count>0) echo "<span>📌 $count zadań</span>";

    echo "</td>";

    // koniec tygodnia – nowy wiersz
    if(($day+$firstDay-1)%7==0) echo "</tr><tr>";
}
?>
</tr></table>

<?php
if (isset($_GET['date'])) {
    $date = $_GET['date'];
    $dt = new DateTime($date);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $time = $_POST['time'];
        $deadline = toDateTime($date, $time);
        $stmt = $pdo->prepare("INSERT INTO tasks(title,description,deadline) VALUES(?,?,?)");
        $stmt->execute([$_POST['title'], $_POST['description'], $deadline]);
    }
?>

<hr>
<h2>Zadania na <?=$dt->format("d.m.Y")?></h2>

<form action="?year=<?=$year?>&month=<?=$month?>&date=<?=$date?>" method="POST">
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
<a href="complete.php?id=<?=$t['id']?>&date=<?=$date?>&year=<?=$year?>&month=<?=$month?>">✔ wykonaj</a> |
<a href="delete.php?id=<?=$t['id']?>&date=<?=$date?>&year=<?=$year?>&month=<?=$month?>">🗑 usuń</a>
</p><hr>

<?php endforeach; ?>

<?php
}
?>

</body></html>
