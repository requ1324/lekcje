<?php
require "db.php"; require "date-utils.php";

$date = $_POST['date'];
$time = $_POST['time'];
$deadline = toDateTime($date,$time);

$stmt = $pdo->prepare("INSERT INTO tasks(title,description,deadline) VALUES(?,?,?)");
$stmt->execute([$_POST['title'], $_POST['description'], $deadline]);

header("Location: day.php?date=$date");
