<?php
for ($i = 0; $i < 10; $i++){
    $liczby[$i] = rand() % 10;
}

header("Content-type: image/jpeg");


$szerokosc = 1200;
$wysokosc = 600;

$rysunek = imagecreate($szerokosc, $wysokosc)
    or die("Biblioteka graficzna nie została zainstalowana");

$bialy = imagecolorallocate($rysunek, 255,255,255);
$czarny = imagecolorallocate($rysunek, 0,0,0);

imagefill($rysunek, 0, 0, $bialy);


$wysokoscSlupka = 40;
$odstep = 20;

for($i = 0; $i < 10; $i++){

    $kolor = imagecolorallocate(
        $rysunek,
        25 * $i,
        25 * $i,
        0
    );

    $y1 = $i * ($wysokoscSlupka + $odstep) + 20;
    $y2 = $y1 + $wysokoscSlupka;

    $x1 = 100;
    $x2 = 100 + $liczby[$i] * 80;

    imagefilledrectangle(
        $rysunek,
        $x1,
        $y1,
        $x2,
        $y2,
        $kolor
    );

   
    imagestring(
        $rysunek,
        5,
        20,
        $y1 + 10,
        $i,
        $czarny
    );
}

imagejpeg($rysunek);
?>