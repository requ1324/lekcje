<?php 
    
    require './index.php';
    echo "Formularz" . $_SESSION['counter'];
    if (empty($_POST['imie']) || empty($_POST['data']) || empty($_POST['email'])){
        header("Location: index.php?error=empty");
        exit();
    }else{
        echo "<pre>" . $_POST['imie'] . " " . $_POST['data'] . " " .  $_POST['email'] . "</pre>";
    }

    $formatter = new IntlDateFormatter(
        "pl_PL",
        IntlDateFormatter::FULL,
        
    );

    echo "data" . $formatter->format(new DateTime($_POST['data']));
    $imieReg = "/^[a-zA-Z]{2,}$/";
    $dataReg = "/^[0-9]{4}-(0[0-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/";
    $emailReg = "/^[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-z]{2,}$/";

    if (preg_match($imieReg, $_POST['imie'])) {
    echo "Imie poprawny format";
} else {
    echo "Zly format imie";
}
    if (preg_match($dataReg, $_POST['data'])) {
    echo "Data poprawny format";
} else {
    echo "Zly format data";
}

// ===== XML + XPath =====
$xml = simplexml_load_file(__DIR__ . '/info.xml');

if ($xml === false) {
    echo "Blad wczytywania pliku XML";
} else {
    $nazwa = $xml->xpath('/wydarzenie/nazwa')[0];
    $miejsce = $xml->xpath('/wydarzenie/miejsce')[0];
    $limit = $xml->xpath('/wydarzenie/@limit')[0];

    echo "<h3>Dane z XML:</h3>";
    echo "Nazwa wydarzenia: " . $nazwa . "<br>";
    echo "Miejsce: " . $miejsce . "<br>";
    echo "Limit: " . $limit . "<br>";
}
?> 