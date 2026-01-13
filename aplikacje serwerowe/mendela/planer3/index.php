<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';
$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'siwieckimiki@gmail.com';                     //SMTP username
    $mail->Password   = '';                               //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;           //Enable implicit TLS encryption
    $mail->Port       = 587;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom('siwieckimiki@gmail.com', 'Mailer');
    $mail->addAddress('siwieckimiki@gmail.com');     //Add a recipient

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Here is the subject';
    $mail->Body    = 'This is the HTML message body <b>in bold!</b>';

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

date_default_timezone_set('Europe/Warsaw');

$lang = $_GET['lang'] ?? $_COOKIE['lang'] ?? 'pl_PL';
if (!in_array($lang, ['pl_PL', 'en_GB', 'de_DE', 'es_ES'])) $lang = 'pl_PL';
setcookie('lang', $lang, time() + 86400 * 30, '/');

putenv("LC_ALL=$lang");
setlocale(LC_ALL, $lang);
bindtextdomain('sport', './locale');
bind_textdomain_codeset('sport', 'UTF-8');
textdomain('sport');


$dsn  = 'mysql:host=localhost;dbname=planer;charset=utf8';
$user = 'root';
$pass = '';

try {
		$pdo = new PDO($dsn, $user, $pass, [
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
				PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		]);
} catch (PDOException $e) {
		die('Błąd połączenia: ' . $e->getMessage());
}

$pdo->exec(
		'CREATE TABLE IF NOT EXISTS tasks3 (
				id INT AUTO_INCREMENT PRIMARY KEY,
				title VARCHAR(255) NOT NULL,
				description TEXT NULL,
				deadline DATETIME NULL,
				is_done TINYINT(1) NOT NULL DEFAULT 0,
				created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
);

function dt_to_sql(string $date, string $time): string
{
		
		$dt = new DateTime();
		[$y, $m, $d] = array_map('intval', explode('-', $date));
		[$h, $i] = array_map('intval', explode(':', $time));
		$dt->setDate($y, $m, $d);
		$dt->setTime($h, $i, 0);
		return $dt->format('Y-m-d H:i:s');
}

function format_pl(?string $datetime): string
{
		if (!$datetime) return 'brak';
		$df = new IntlDateFormatter(
				'pl_PL',
				IntlDateFormatter::LONG,
				IntlDateFormatter::SHORT,
				date_default_timezone_get(),
				null,
				'd MMMM yyyy, HH:mm'
		);
		return $df->format(new DateTime($datetime));
}

function plus_minutes(string $datetime, int $minutes): string
{
		$dt = new DateTime($datetime);
		$ts = $dt->getTimestamp();
		$dt->setTimestamp($ts + $minutes * 60);
		return $dt->format('Y-m-d H:i:s');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add') {
		$title = trim($_POST['title'] ?? '');
		$desc  = trim($_POST['description'] ?? '');
		$date  = $_POST['date'] ?? '';
		$time  = $_POST['time'] ?? '';

		$deadline = null;
		if ($date && $time) {
				$deadline = dt_to_sql($date, $time);
		}

		$stmt = $pdo->prepare('INSERT INTO tasks3(title, description, deadline) VALUES(?,?,?)');
		$stmt->execute([$title, $desc, $deadline]);

		if ($date) {
			$ry = (int)substr($date,0,4);
			$rm = (int)substr($date,5,2);
			header('Location: ?y=' . $ry . '&m=' . $rm);
		} else {
			header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
		}
		exit;
}

if (($_GET['action'] ?? '') === 'complete' && isset($_GET['id'])) {
		$id = (int) $_GET['id'];
		$stmt = $pdo->prepare('UPDATE tasks3 SET is_done = 1 WHERE id = ?');
		$stmt->execute([$id]);
		header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
		exit;
}

if (($_GET['action'] ?? '') === 'delete' && isset($_GET['id'])) {
		$id = (int) $_GET['id'];
		$stmt = $pdo->prepare('DELETE FROM tasks3 WHERE id = ?');
		$stmt->execute([$id]);
		header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
		exit;
}

$tasks = $pdo->query('SELECT * FROM tasks3 ORDER BY COALESCE(deadline, "9999-12-31 23:59:59"), id DESC')->fetchAll();


$pdo->exec('SET NAMES utf8mb4');

$today = new DateTime();
$curY = (int)$today->format('Y');
$curM = (int)$today->format('n');
$curD = (int)$today->format('j');

$y = isset($_GET['y']) ? (int)$_GET['y'] : $curY;
if ($y < $curY) $y = $curY; if ($y > $curY + 1) $y = $curY + 1;
$m = isset($_GET['m']) ? (int)$_GET['m'] : $curM; if ($m < 1) $m = 1; if ($m > 12) $m = 12;
$d = isset($_GET['d']) ? (int)$_GET['d'] : (($y===$curY && $m===$curM) ? $curD : 1);

function month_name_pl(int $year, int $month): string {
		if (class_exists('IntlDateFormatter')) {
				$fmt = new IntlDateFormatter('pl_PL', IntlDateFormatter::NONE, IntlDateFormatter::NONE, 'Europe/Warsaw', null, 'LLLL');
				return $fmt->format(new DateTime(sprintf('%04d-%02d-01', $year, $month)));
		}
		$arr = ['styczeń','luty','marzec','kwiecień','maj','czerwiec','lipiec','sierpień','wrzesień','październik','listopad','grudzień'];
		return $arr[$month-1] ?? '';
}

$first = new DateTime(sprintf('%04d-%02d-01', $y, $m));
$daysInMonth = (int)$first->format('t');
$startDow = (int)$first->format('N'); 
$lastDow  = (int)(new DateTime(sprintf('%04d-%02d-%02d', $y, $m, $daysInMonth)))->format('N');

$selectedDateSql = sprintf('%04d-%02d-%02d', $y, $m, min(max($d,1), $daysInMonth));
$showForm = isset($_GET['d']);


$q = $pdo->prepare('SELECT id,title,description,deadline,is_done FROM tasks3 WHERE DATE(deadline)=? ORDER BY deadline');
$q->execute([$selectedDateSql]);
$plans = $q->fetchAll();
?>
<!doctype html>
<html lang="pl">
<head>
	<meta charset="utf-8">
	<title>Kalendarz – Planer (PHP + PDO)</title>
	<style>
		body{font-family:Arial, Helvetica, sans-serif; width:600px; margin:28px auto; color:#111}
		form.calbar{display:flex; gap:8px; align-items:center; margin-bottom:14px}
		select,button{font-size:16px; padding:4px 8px}
		table.cal{border-collapse:collapse; width:600px}
		table.cal th, table.cal td{border:1px solid #999; width: calc(600px/7); height:46px; text-align:center; vertical-align:middle}
		table.cal th{background:#f5f5f5; font-weight:bold}
		.empty{background:#fafafa}
		.weekend a{color:#c00}
		.today{background:#fff3c4}
		a.daylink{color:#111; text-decoration:none}
		a.daylink:hover
		{text-decoration:underline}
		h3{margin-top:28px}
		.plan{margin:6px 0; padding:6px 8px; border-left:4px solid #3b82f6; background:#f0f7ff}
		
		form.add{border:1px solid #999; padding:12px; width:600px; background:#fafafa}
		label{display:block; margin:8px 0 4px; font-weight:bold}
		input[type=text], textarea, input[type=time]{width:100%; padding:6px 8px; font-size:14px;}
		.actions{margin-top:12px; display:flex; gap:8px}
		button.primary{background:#3b82f6; color:#fff; border:0; padding:6px 10px; cursor:pointer}
		button.secondary{background:#e5e7eb; border:1px solid #999; padding:6px 10px; cursor:pointer}
		a.link{color:#111; text-decoration:none}
	</style>
</head>
<body>
	<div style="text-align:right; margin-bottom:10px;">
		<a href="?lang=pl_PL"><?=_('polski')?></a> | <a href="?lang=en_GB"><?=_('angielski')?></a> | <a href="?lang=de_DE"><?=_('niemiecki')?></a> | <a href="?lang=es_ES"><?=_('hiszpański')?></a>
	</div>

	<?php if (!$showForm): ?>
		<form class="calbar" method="get">
			<select name="m">
				<?php for($mm=1;$mm<=12;$mm++): ?>
					<option value="<?=$mm?>" <?=($mm===$m?'selected':'')?>><?=month_name_pl($y,$mm)?></option>
				<?php endfor; ?>
			</select>
			<select name="y">
				<?php for($yy=$curY;$yy<=$curY+1;$yy++): ?>
					<option value="<?=$yy?>" <?=($yy===$y?'selected':'')?>><?=$yy?></option>
				<?php endfor; ?>
			</select>
			<button type="submit">ok</button>
		</form>

		<table class="cal">
			<tr>
				<th>P</th><th>W</th><th>Ś</th><th>C</th><th>P</th><th>S</th><th>N</th>
			</tr>
			<tr>
				<?php
				for ($i=1; $i<$startDow; $i++) echo '<td class="empty"></td>';
				$day=1; $dow=$startDow;
				while ($day <= $daysInMonth) {
					$isWeekend = ($dow>=6);
					$isToday   = ($y==$curY && $m==$curM && $day==$curD);
					$cls = ($isToday?'today ':'') . ($isWeekend?'weekend':'');
					echo '<td class="'.$cls.'"><a class="daylink" href="?y='.$y.'&m='.$m.'&d='.$day.'">'.$day.'</a></td>';
					if ($dow==7) { echo "</tr>"; if ($day<$daysInMonth) echo "<tr>"; $dow=1; } else { $dow++; }
					$day++;
				}
				if ($lastDow!=7) { for ($i=$lastDow+1;$i<=7;$i++) echo '<td class="empty"></td>'; echo '</tr>'; }
				?>
		</table>
	<?php else: ?>
		<form class="add" method="post">
			<h3><?=_('Dodaj plan')?> — <?=$selectedDateSql?></h3>
			<input type="hidden" name="action" value="add">
			<input type="hidden" name="date" value="<?=$selectedDateSql?>">
			<label for="title"><?=_('Tytuł')?></label>
			<input id="title" type="text" name="title" required>
			<label for="description"><?=_('Opis')?></label>
			<textarea id="description" name="description" rows="4"></textarea>
			<label for="time"><?=_('Godzina')?></label>
			<input id="time" type="time" name="time" value="<?=htmlspecialchars((new DateTime())->format('H:i'))?>" required>
			<div class="actions">
				<button class="primary" type="submit"><?=_('Dodaj')?></button>
				<a class="link" href="?y=<?=$y?>&m=<?=$m?>"><?=_('Anuluj i wróć do kalendarza')?></a>
			</div>
		</form>
	<?php endif; ?>

	<h3><?=_('Plany na dzień')?>: <?=$selectedDateSql?></h3>
	<?php if (!$plans): ?>
		<p class="muted"><?= ($selectedDateSql === $today->format('Y-m-d')) ? _('Nie masz planów na dziś') : _('Brak planów na ten dzień') ?></p>
	<?php else: foreach ($plans as $p): ?>
		<div class="plan">
			<strong><?=htmlspecialchars($p['title'])?></strong><br>
			<small><?=format_pl($p['deadline'])?></small><br>
			<?php if($p['description']): ?>
				<span><?=nl2br(htmlspecialchars($p['description']))?></span>
			<?php endif; ?>
		</div>
	<?php endforeach; endif; ?>

</body>
</html>

