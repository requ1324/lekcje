<?php 

$obraz = [];
$maxCiag = 0;

for ($i = 0; $i < 100; $i++){
    $obraz[$i] = rand(0, 1);
}

for ($i = 0; $i < 100; $i++){
    echo $obraz[$i] . "";

    if(($i + 1) % 10 == 0){
        echo "\n";
    }
}

for ($row = 0; $row < 10; $row++){
    $wiersz = array_slice($obraz, $row * 10, 10);
    $aktualny = 0;

    foreach ($wiersz as $piksel){
        if ($piksel == 1){
            $aktualny++;
            $maxCiag = max($maxCiag, $aktualny);
        } else {
            $aktualny = 0;
        }
    }
}

echo "\n Najdłuższy ciąg czarnych pikseli: $maxCiag";
?>