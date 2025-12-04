<?php
require "db.php";

$id   = $_GET['id'] ?? null;
$date = $_GET['date'] ?? null;

if($id){
    $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->execute([$id]);
}

header("Location: calendar.php?year={$_GET['year']}&month={$_GET['month']}&date=$date");
exit;
