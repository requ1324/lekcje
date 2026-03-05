<?php
include("hidden.php"); 
$mysqli = new mysqli($host, $user, $passwd, $dbname);
$mysqli->query("set names utf8");
?>