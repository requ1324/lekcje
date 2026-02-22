<?php

if (isset($_POST['date'])){
    $date =  new DateTime($_POST['date']);
    echo "Data zwykła: " . $date->format("Y-m-d");

    $formatter = new IntlDateFormatter(
        'pl_PL',
        IntlDateFormatter::LONG,
        IntlDateFormatter::NONE,
    );
    echo "Intl data: " . $formatter->format($date);
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
    <form action="" method='post'>
        <input type="date" name='date'>
        <button type='submit'>wyslij</button>
    </form>
  
</body>
</html>