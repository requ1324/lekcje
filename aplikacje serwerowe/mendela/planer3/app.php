<?php
require_once __DIR__ . '/db.php';

date_default_timezone_set('Europe/Warsaw');

$today = new DateTime();
$currentYear = (int)$today->format('Y');
$currentMonth = (int)$today->format('n');
$currentDay = (int)$today->format('j');

$year = isset($_GET['y']) ? (int)$_GET['y'] : $currentYear;
if ($year < $currentYear) {
    $year = $currentYear;
}
if ($year > $currentYear + 1) {
    $year = $currentYear + 1;
}

$month = isset($_GET['m']) ? (int)$_GET['m'] : $currentMonth;
if ($month < 1) {
    $month = 1;
}
if ($month > 12) {
    $month = 12;
}

$firstDay = new DateTime(sprintf('%04d-%02d-01', $year, $month));
$daysInMonth = (int)$firstDay->format('t');
$firstWeekday = (int)$firstDay->format('N');

$day = isset($_GET['d']) ? (int)$_GET['d'] : (($year === $currentYear && $month === $currentMonth) ? $currentDay : 1);
if ($day < 1) {
    $day = 1;
}
if ($day > $daysInMonth) {
    $day = $daysInMonth;
}

$selectedDate = sprintf('%04d-%02d-%02d', $year, $month, $day);
$formatter = new IntlDateFormatter(
    'pl_PL',
    IntlDateFormatter::NONE,
    IntlDateFormatter::NONE,
    'Europe/Warsaw',
    IntlDateFormatter::GREGORIAN,
    'd MMMM yyyy'
);
$selectedDateLabel = $formatter->format(new DateTime($selectedDate));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];

    if ($action === 'add') {
        $content = trim($_POST['content'] ?? '');
        $date = $_POST['date'] ?? '';

        if ($content !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            $insert = $pdo->prepare('INSERT INTO tasks3 (content, task_date) VALUES (:content, :task_date)');
            $insert->bindValue(':content', $content, PDO::PARAM_STR);
            $insert->bindValue(':task_date', $date, PDO::PARAM_STR);
            $insert->execute();
        }

        header('Location: ?y=' . $year . '&m=' . $month . '&d=' . $day);
        exit;
    }

    if ($action === 'delete' && isset($_POST['id'])) {
        $id = (int)$_POST['id'];
        $delete = $pdo->prepare('DELETE FROM tasks3 WHERE id = :id');
        $delete->bindValue(':id', $id, PDO::PARAM_INT);
        $delete->execute();

        header('Location: ?y=' . $year . '&m=' . $month . '&d=' . $day);
        exit;
    }
}

$tasksQuery = $pdo->prepare('SELECT id, content FROM tasks3 WHERE task_date = :task_date ORDER BY id');
$tasksQuery->bindValue(':task_date', $selectedDate, PDO::PARAM_STR);
$tasksQuery->execute();
$tasks = $tasksQuery->fetchAll();
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Planer</title>
    <style>
        .today {
            background:yellow;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Planer</h1>

    <form method="get">
        <label>
            Miesiąc
            <select name="m">
                <?php for ($m = 1; $m <= 12; $m++): ?>
                    <option value="<?= $m ?>" <?= $m === $month ? 'selected' : '' ?>><?= $m ?></option>
                <?php endfor; ?>
            </select>
        </label>

        <label>
            Rok
            <select name="y">
                <?php for ($y = $currentYear; $y <= $currentYear + 1; $y++): ?>
                    <option value="<?= $y ?>" <?= $y === $year ? 'selected' : '' ?>><?= $y ?></option>
                <?php endfor; ?>
            </select>
        </label>

        <input type="hidden" name="d" value="<?= $day ?>">
        <button type="submit">Pokaż</button>
    </form>

    <table border="1" cellspacing="0" cellpadding="6">
        <tr>
            <th>Pn</th>
            <th>Wt</th>
            <th>Śr</th>
            <th>Cz</th>
            <th>Pt</th>
            <th>So</th>
            <th>Nd</th>
        </tr>
        <tr>
            <?php
            for ($i = 1; $i < $firstWeekday; $i++) {
                echo '<td></td>';
            }

            $weekdayCursor = $firstWeekday;
            for ($d = 1; $d <= $daysInMonth; $d++) {
                $isToday = ($year === $currentYear && $month === $currentMonth && $d === $currentDay);
                $cellClass = $isToday ? ' class="today"' : '';
                echo '<td' . $cellClass . '><a href="?y=' . $year . '&m=' . $month . '&d=' . $d . '">' . $d . '</a></td>';

                if ($weekdayCursor === 7 && $d !== $daysInMonth) {
                    echo '</tr><tr>';
                    $weekdayCursor = 1;
                } else {
                    $weekdayCursor++;
                }
            }

            if ($weekdayCursor !== 1) {
                for ($i = $weekdayCursor; $i <= 7; $i++) {
                    echo '<td></td>';
                }
            }
            ?>
        </tr>
    </table>

    <h2>Dodaj zadanie: <?= htmlspecialchars($selectedDateLabel) ?></h2>
    <form method="post">
        <input type="hidden" name="action" value="add">
        <input type="hidden" name="date" value="<?= htmlspecialchars($selectedDate) ?>">
        <textarea name="content" rows="4" cols="60" required></textarea><br>
        <button type="submit">Dodaj</button>
    </form>

    <h2>Zadania</h2>
    <?php if (!$tasks): ?>
        <p>Brak zadań.</p>
    <?php else: ?>
        <?php foreach ($tasks as $task): ?>
            <div>
                <?= nl2br(htmlspecialchars($task['content'])) ?>
                <form method="post" style="display:inline;">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="id" value="<?= (int)$task['id'] ?>">
                    <button type="submit">Usuń</button>
                </form>
            </div>
        <?php endforeach; ?>
    <?php endif; ?>
</body>
</html>
