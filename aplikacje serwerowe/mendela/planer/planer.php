<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Planer</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; max-width: 600px; margin: 20px auto; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
        th { background-color: #f2f2f2; }
        .today { background-color: yellow; }
        .has-task { background-color: gray; }
        .task-form { margin-top: 20px; text-align: center; }
        textarea { width: 80%; height: 100px; }
        button { margin: 5px; }
    </style>
</head>
<body>
    <h1>Planer</h1>
    <form method="post">
        <label for="month">Miesiąc:</label>
        <select name="month" id="month">
            <?php for($i=1; $i<=12; $i++) echo "<option value='$i' ".($i==date('n')?'selected':'').">$i</option>"; ?>
        </select>
        <label for="year">Rok:</label>
        <input type="number" name="year" id="year" value="<?php echo date('Y'); ?>" min="1900" max="2100">
        <button type="submit" name="show">Pokaż</button>
    </form>

    <?php
    $host = "localhost";
    $dbname = "planer";
    $username = "root";
    $password = "ServBay.dev";

    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

    $db->exec("CREATE TABLE IF NOT EXISTS tasks (id INT AUTO_INCREMENT PRIMARY KEY, date DATE UNIQUE, task TEXT)");

    $month = isset($_POST['month']) ? (int)$_POST['month'] : date('n');
    $year = isset($_POST['year']) ? (int)$_POST['year'] : date('Y');
    $today = date('Y-m-d');
    $selected_date = isset($_POST['date']) ? $_POST['date'] : '';

    if(isset($_POST['save_task'])) {
        $date = $_POST['date'];
        $task = $_POST['task'];
        $stmt = $db->prepare("INSERT INTO tasks (date, task) VALUES (?, ?) ON DUPLICATE KEY UPDATE task = VALUES(task)");
        $stmt->execute([$date, $task]);
        $selected_date = $date;
    }

    $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
    $firstDay = date('N', strtotime("$year-$month-01")) - 1;

    echo "<h2>$month/$year</h2>";
    echo "<table>";
    echo "<tr><th>Pn</th><th>Wt</th><th>Śr</th><th>Cz</th><th>Pt</th><th>So</th><th>Nd</th></tr>";
    echo "<tr>";
    for($i=0; $i<$firstDay; $i++) echo "<td></td>";
    for($day=1; $day<=$daysInMonth; $day++) {
        $date = sprintf('%04d-%02d-%02d', $year, $month, $day);
        $stmt = $db->prepare("SELECT task FROM tasks WHERE date = ?");
        $stmt->execute([$date]);
        $task = $stmt->fetchColumn();
        $has_task = !empty($task);
        $class = '';
        if($date == $today) $class = 'today';
        elseif($has_task) $class = 'has-task';
        echo "<td class='$class'><form method='post' style='display:inline;'><input type='hidden' name='month' value='$month'><input type='hidden' name='year' value='$year'><button type='submit' name='date' value='$date' style='border:none;background:none;cursor:pointer;'>$day</button></form></td>";
        if(($firstDay + $day) % 7 == 0) echo "</tr><tr>";
    }
    echo "</tr></table>";

    if($selected_date) {
        $stmt = $db->prepare("SELECT task FROM tasks WHERE date = ?");
        $stmt->execute([$selected_date]);
        $current_task = $stmt->fetchColumn() ?: '';
        echo "<div class='task-form'>";
        echo "<h3>Zadania dla $selected_date</h3>";
        echo "<form method='post'>";
        echo "<input type='hidden' name='month' value='$month'>";
        echo "<input type='hidden' name='year' value='$year'>";
        echo "<input type='hidden' name='date' value='$selected_date'>";
        echo "<textarea name='task'>$current_task</textarea><br>";
        echo "<button type='submit' name='save_task'>Zapisz</button>";
        echo "<button type='submit' name='show'>Anuluj</button>";
        echo "</form>";
        echo "</div>";
    }
    ?>
</body>
</html>
