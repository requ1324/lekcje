<?php

header("Content-Type: image/png");

$szer = 600;
$wys = 400;

$img = imagecreatetruecolor($szer, $wys);

// kolory
$bialy = imagecolorallocate($img, 255, 255, 255);
$czarny = imagecolorallocate($img, 0, 0, 0);

imagefill($img, 0, 0, $bialy);

// osie
imageline($img, 40, 20, 40, $wys - 30, $czarny); // Y
imageline($img, 40, $wys - 30, $szer - 20, $wys - 30, $czarny); // X

$ilosc = 10;
$barWidth = 40;
$gap = 15;

for ($i = 0; $i < $ilosc; $i++) {

    $value = rand(50, 300);

    $color = imagecolorallocate(
        $img,
        rand(0,255),
        rand(0,255),
        rand(0,255)
    );

    $x1 = 50 + $i * ($barWidth + $gap);
    $y1 = ($wys - 30) - $value;

    $x2 = $x1 + $barWidth;
    $y2 = $wys - 30;

    // słupek
    imagefilledrectangle($img, $x1, $y1, $x2, $y2, $color);

    // wartość nad słupkiem
    imagestring(
        $img,
        2,
        $x1 + 5,
        $y1 - 15,
        $value,
        $czarny
    );

    // podpis 1–10 pod słupkiem
    imagestring(
        $img,
        3,
        $x1 + 12,
        $wys - 25,
        $i + 1,
        $czarny
    );
}

// ===== METRYKA Y =====
for ($i = 0; $i <= 300; $i += 50) {

    $y = ($wys - 30) - $i;

    // kreska
    imageline($img, 35, $y, 40, $y, $czarny);

    // liczba
    imagestring($img, 2, 5, $y - 7, $i, $czarny);
}

imagepng($img);
imagedestroy($img);
?>