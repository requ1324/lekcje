<?php
header('Content-Type: application/json; charset=utf-8');

include("hidden.php");

function krajZPlikuFlagi(string $sciezkaFlagi): string
{
	$nazwaPliku = pathinfo($sciezkaFlagi, PATHINFO_FILENAME);
	$nazwaPliku = preg_replace('/^\._/', '', $nazwaPliku);
	$nazwaPliku = str_replace(['_', '-'], ' ', $nazwaPliku);
	return trim($nazwaPliku);
}

function sendResponse(array $payload): void
{
	echo json_encode($payload, JSON_UNESCAPED_UNICODE);
	exit;
}

try {
	$mysqli = new mysqli($host, $user, $passwd, $dbname);
	$mysqli->set_charset('utf8mb4');

	$acc = $_POST['acc'] ?? '';

	if ($acc === 'getMeta') {
		$flagi = $mysqli->query("SELECT id, srcFlagi FROM flagi ORDER BY srcFlagi")->fetch_all(MYSQLI_ASSOC);
		$stopy = $mysqli->query("SELECT id, stop FROM materialy ORDER BY stop")->fetch_all(MYSQLI_ASSOC);

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
				'id' => (int)$flaga['id'],
				'kraj' => $kraj,
				'srcFlagi' => $flaga['srcFlagi']
			];
		}

		sendResponse([
			'ok' => true,
			'kraje' => $kraje,
			'stopy' => $stopy
		]);
	}

	if ($acc === 'get') {
		$sql = "
			SELECT
				d.id,
				d.kraj,
				d.flaga_id,
				d.rok,
				d.nr_kat,
				d.nominal,
				d.stop_id,
				f.srcFlagi AS flaga_sciezka,
				m.stop AS stop_nazwa
			FROM dane d
			LEFT JOIN flagi f ON d.flaga_id = f.id
			LEFT JOIN materialy m ON d.stop_id = m.id
			ORDER BY d.id DESC
		";

		$rows = $mysqli->query($sql)->fetch_all(MYSQLI_ASSOC);
		sendResponse([
			'ok' => true,
			'rows' => $rows
		]);
	}

	if ($acc === 'add') {
		$flagaId = (int)($_POST['flaga_id'] ?? 0);
		$rok = (int)($_POST['rok'] ?? 0);
		$nrKat = trim(rawurldecode($_POST['nr_kat'] ?? ''));
		$nominal = trim(rawurldecode($_POST['nominal'] ?? ''));
		$stopId = (int)($_POST['stop_id'] ?? 0);

		if ($flagaId <= 0 || $rok <= 0 || $nrKat === '' || $stopId <= 0) {
			sendResponse(['ok' => false, 'message' => 'Uzupełnij wymagane pola.']);
		}

		$stmtFlaga = $mysqli->prepare("SELECT srcFlagi FROM flagi WHERE id = ?");
		$stmtFlaga->bind_param("i", $flagaId);
		$stmtFlaga->execute();
		$flaga = $stmtFlaga->get_result()->fetch_assoc();

		if (!$flaga) {
			sendResponse(['ok' => false, 'message' => 'Nieprawidłowa flaga.']);
		}

		$kraj = krajZPlikuFlagi($flaga['srcFlagi']);
		if ($kraj === '') {
			sendResponse(['ok' => false, 'message' => 'Nie można ustalić kraju z flagi.']);
		}

		$stmtInsert = $mysqli->prepare(
			"INSERT INTO dane (kraj, flaga_id, rok, nr_kat, nominal, stop_id) VALUES (?, ?, ?, ?, ?, ?)"
		);
		$stmtInsert->bind_param("siissi", $kraj, $flagaId, $rok, $nrKat, $nominal, $stopId);
		$stmtInsert->execute();

		sendResponse(['ok' => true]);
	}

	if ($acc === 'update') {
		$id = (int)($_POST['id'] ?? 0);
		$flagaId = (int)($_POST['flaga_id'] ?? 0);
		$rok = (int)($_POST['rok'] ?? 0);
		$nrKat = trim(rawurldecode($_POST['nr_kat'] ?? ''));
		$nominal = trim(rawurldecode($_POST['nominal'] ?? ''));
		$stopId = (int)($_POST['stop_id'] ?? 0);

		if ($id <= 0 || $flagaId <= 0 || $rok <= 0 || $nrKat === '' || $stopId <= 0) {
			sendResponse(['ok' => false, 'message' => 'Nieprawidłowe dane do edycji.']);
		}

		$stmtFlaga = $mysqli->prepare("SELECT srcFlagi FROM flagi WHERE id = ?");
		$stmtFlaga->bind_param("i", $flagaId);
		$stmtFlaga->execute();
		$flaga = $stmtFlaga->get_result()->fetch_assoc();

		if (!$flaga) {
			sendResponse(['ok' => false, 'message' => 'Nieprawidłowa flaga.']);
		}

		$kraj = krajZPlikuFlagi($flaga['srcFlagi']);

		$stmtUpdate = $mysqli->prepare(
			"UPDATE dane SET kraj = ?, flaga_id = ?, rok = ?, nr_kat = ?, nominal = ?, stop_id = ? WHERE id = ?"
		);
		$stmtUpdate->bind_param("siissii", $kraj, $flagaId, $rok, $nrKat, $nominal, $stopId, $id);
		$stmtUpdate->execute();

		sendResponse(['ok' => true]);
	}

	if ($acc === 'delete') {
		$id = (int)($_POST['id'] ?? 0);

		if ($id <= 0) {
			sendResponse(['ok' => false, 'message' => 'Nieprawidłowe ID.']);
		}

		$stmtDelete = $mysqli->prepare("DELETE FROM dane WHERE id = ?");
		$stmtDelete->bind_param("i", $id);
		$stmtDelete->execute();

		sendResponse(['ok' => true]);
	}

	sendResponse(['ok' => false, 'message' => 'Nieznana akcja.']);
} catch (Exception $e) {
	sendResponse(['ok' => false, 'message' => 'Błąd serwera: ' . $e->getMessage()]);
}
?>