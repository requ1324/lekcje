<?php
require "db.php";

$id   = $_GET['id'] ?? null;
$date = $_GET['date'] ?? null; // przekazujemy dzień aby wrócić do właściwej daty

if($id){
    $stmt = $pdo->prepare("UPDATE tasks SET is_done = 1 WHERE id = ?");
    $stmt->execute([$id]);
}

header("Location: calendar.php?year={$_GET['year']}&month={$_GET['month']}&date=$date");
exit;
