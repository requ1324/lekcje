<?php
include("hidden.php");

$formError = '';

function krajZPlikuFlagi(string $sciezkaFlagi): string
{
    $nazwaPliku = pathinfo($sciezkaFlagi, PATHINFO_FILENAME);
    $nazwaPliku = preg_replace('/^\._/', '', $nazwaPliku);
    $nazwaPliku = str_replace(['_', '-'], ' ', $nazwaPliku);
    return trim($nazwaPliku);
}

try {
    $mysqli = new mysqli($host, $user, $passwd, $dbname);
    $mysqli->set_charset('utf8mb4');

    if (isset($_GET['delete'])) {
        $id = (int)$_GET['delete'];
        $stmtDelete = $mysqli->prepare("DELETE FROM dane WHERE id = ?");
        $stmtDelete->bind_param("i", $id);
        $stmtDelete->execute();
        header("Location: index.php?deleted=1");
        exit;
    }
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $flagaId = (int)($_POST['flaga_id'] ?? 0);
        $nrKat = trim($_POST['nr_kat'] ?? '');
        $nominal = trim($_POST['nominal'] ?? '');
        $rok = (int)($_POST['rok'] ?? 0);
        $stopId = (int)($_POST['stop_id'] ?? 0);

        $kraj = '';

        if ($flagaId > 0) {
            $stmtFlaga = $mysqli->prepare("SELECT srcFlagi FROM flagi WHERE id = ?");
            $stmtFlaga->bind_param("i", $flagaId);
            $stmtFlaga->execute();
            $flagaResult = $stmtFlaga->get_result()->fetch_assoc();

            if ($flagaResult && isset($flagaResult['srcFlagi'])) {
                $kraj = krajZPlikuFlagi($flagaResult['srcFlagi']);
            }
        }

        if ($kraj !== '' && $flagaId > 0 && $nrKat !== '' && $rok > 0 && $stopId > 0) {
            $stmtInsert = $mysqli->prepare(
                "INSERT INTO dane (kraj, flaga_id, rok, nr_kat, nominal, stop_id) VALUES (?, ?, ?, ?, ?, ?)"
            );
            $stmtInsert->bind_param("siissi", $kraj, $flagaId, $rok, $nrKat, $nominal, $stopId);
            $stmtInsert->execute();
            header("Location: index.php?added=1");
            exit;
        }

        $formError = 'Uzupełnij poprawnie wymagane pola.';
    }

    $flagi = $mysqli->query(
        "SELECT id, srcFlagi FROM flagi ORDER BY srcFlagi"
    )->fetch_all(MYSQLI_ASSOC);

    $kraje = [];
    $uzyteKraje = [];
    foreach ($flagi as $flaga) {
        $kraj = krajZPlikuFlagi($flaga['srcFlagi']);

        if ($kraj === '') {
            continue;
        }

        $kluczKraju = mb_strtolower($kraj);
        if (isset($uzyteKraje[$kluczKraju])) {
            continue;
        }

        $uzyteKraje[$kluczKraju] = true;

        $kraje[] = [
            'flaga_id' => (int)$flaga['id'],
            'kraj' => $kraj,
        ];
    }

    $stopy = $mysqli->query(
        "SELECT id, stop FROM materialy ORDER BY stop"
    )->fetch_all(MYSQLI_ASSOC);

    $result = $mysqli->query(
        "
        SELECT
            d.*,
            f.srcFlagi as flaga_sciezka,
            s.stop as stop_nazwa
        FROM dane d
        LEFT JOIN flagi f ON d.flaga_id = f.id
        LEFT JOIN materialy s ON d.stop_id = s.id
    "
    )->fetch_all(MYSQLI_ASSOC);
} catch (Exception $e) {
    echo "Nie można połączyć się z bazą danych " . $e->getMessage();
    die();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        table{
            border: 1px solid black;
            border-collapse: collapse;
        }
        td{
            border:1px solid black;
            text-align:center;
            padding:5px;
        }
        .add-form {
            margin-top: 14px;
            display: flex;
            gap: 8px;
            align-items: center;
            flex-wrap: wrap;
        }
        .add-form input,
        .add-form select,
        .add-form button {
            height: 32px;
            padding: 4px 8px;
        }
        .msg {
            margin-top: 10px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <?php if (isset($_GET['added'])): ?>
        <div class="msg">Dodano rekord.</div>
    <?php endif; ?>

    <?php if (isset($_GET['deleted'])): ?>
        <div class="msg">Usunięto rekord.</div>
    <?php endif; ?>

    <?php if ($formError !== ''): ?>
        <div class="msg"><?= htmlspecialchars($formError) ?></div>
    <?php endif; ?>

    <table>
        <tr>
            
            <td>Flaga</td>
            <td>Kraj</td>
            <td>Rok</td>
            <td>Kategoria</td>
            <td>Nominał</td>
            <td>Stop</td>
        </tr>
       <?php foreach($result as $row): ?>
        <tr>
            
            <td><img src="./gfx/<?= htmlspecialchars($row['flaga_sciezka']) ?>" alt="<?= htmlspecialchars($row['kraj']) ?>" width="50"></td>
            <td><?= htmlspecialchars($row['kraj']) ?></td>
            <td><?= (int)$row['rok'] ?></td>
            <td><?= htmlspecialchars($row['nr_kat']) ?></td>
            <td><?= htmlspecialchars((string)$row['nominal']) ?></td>
            <td><?= htmlspecialchars((string)$row['stop_nazwa']) ?></td>
            <td><a href="?delete=<?= $row['id'] ?>"><img src="./gfx/u.gif" alt="Usuń"></a></td>
        </tr>
        <?php endforeach;?>
    </table>
    <form action="" method="post" class="add-form">
        <select name="flaga_id" required>
            <option value="">Kraj</option>
            <?php foreach ($kraje as $k): ?>
                <option value="<?= (int)$k['flaga_id'] ?>">
                    <?= htmlspecialchars($k['kraj']) ?>
                </option>
            <?php endforeach; ?>
        </select>

        <input type="text" name="nr_kat" placeholder="Nr kat / waluta" required>
        <input type="text" name="nominal" placeholder="Nominał">

        <select name="stop_id" required>
            <option value="">Materiał</option>
            <?php foreach ($stopy as $stop): ?>
                <option value="<?= (int)$stop['id'] ?>"><?= htmlspecialchars($stop['stop']) ?></option>
            <?php endforeach; ?>
        </select>

        <input type="number" name="rok" min="1" placeholder="Rok" required>
        <button type="submit">Dodaj</button>
    </form>
</body>
</html>