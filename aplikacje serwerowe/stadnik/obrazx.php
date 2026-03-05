<?php

$conn = new mysqli("localhost", "root", "", "szkola");
if ($conn->connect_error) {
    die("Błąd połączenia: " . $conn->connect_error);
}

$sql = "SELECT ocena, COUNT(*) as ile 
        FROM oceny 
        GROUP BY ocena 
        ORDER BY ocena";

$result = $conn->query($sql);

$oceny = [];
while($row = $result->fetch_assoc()) {
    $oceny[$row['ocena']] = $row['ile'];
}

header("Content-type: image/png");

$szerokosc = 650;
$wysokosc = 450;

$img = imagecreate($szerokosc, $wysokosc);

// Kolory
$bialy = imagecolorallocate($img, 255,255,255);
$niebieski = imagecolorallocate($img, 0,0,255);
$czarny = imagecolorallocate($img, 0,0,0);
$szary = imagecolorallocate($img, 235,235,235);

// =====================
// PARAMETRY
// =====================

$margines_lewy = 150;
$margines_gora = 100;

$wysokosc_slupka = 35;
$odstep = 25;
$skala = 70;

// ile słupków rysujemy
$ilosc_ocen = 5;

// wyliczamy dolną granicę dynamicznie
$margines_dolny = $margines_gora 
    + ($ilosc_ocen * $wysokosc_slupka) 
    + (($ilosc_ocen - 1) * $odstep);

// max wartość
$max = !empty($oceny) ? max($oceny) : 0;

// prawa granica dynamiczna
$margines_prawy = $margines_lewy + ($max * $skala) + 40;


// =====================
// OSIE
// =====================

// pionowa
imageline($img, $margines_lewy, $margines_gora - 40, $margines_lewy, $margines_dolny, $czarny);

// pozioma
imageline($img, $margines_lewy, $margines_dolny, $margines_prawy, $margines_dolny, $czarny);


// =====================
// SKALA X
// =====================

for ($i = 0; $i <= $max; $i++) {

    $x = $margines_lewy + ($i * $skala);

    imageline($img, $x, $margines_dolny, $x, $margines_dolny + 6, $czarny);
    imagestring($img, 3, $x - 5, $margines_dolny + 10, $i, $czarny);

    imageline($img, $x, $margines_gora - 40, $x, $margines_dolny, $szary);
}


// =====================
// SŁUPKI
// =====================

$y = $margines_gora;

for ($ocena = 1; $ocena <= $ilosc_ocen; $ocena++) {

    $ile = isset($oceny[$ocena]) ? $oceny[$ocena] : 0;
    $dlugosc = $ile * $skala;

    imagefilledrectangle(
        $img,
        $margines_lewy,
        $y,
        $margines_lewy + $dlugosc,
        $y + $wysokosc_slupka,
        $niebieski
    );

    // numer oceny
    imagestring($img, 4, $margines_lewy - 40, $y + 8, $ocena, $czarny);

    // wartość
    imagestring($img, 4, $margines_lewy + $dlugosc + 8, $y + 8, $ile, $czarny);

    $y += $wysokosc_slupka + $odstep;
}


// =====================
// TYTUŁ
// =====================

imagestring(
    $img,
    5,
    180,
    40,
    "Liczba ocen w klasie - wykres poziomy",
    $czarny
);

imagejpeg($img);
?>