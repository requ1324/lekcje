<?php 
    $suma = 0;
    $licznik = 0;
    while ($suma + ($licznik + 1) <= 100){
        $licznik++;
        $suma += $licznik;
    }
    echo "Potrzeba $licznik kolejnych liczb.\n";
    echo "Suma wynosi: $suma \n";
?>