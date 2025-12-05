<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form method="post">
        <div>
            <label>Podaj pierwszy wyraz: </label>
            <input type="text" name="text1">
        </div>
        <div>
            <label>Podaj drugi wyraz: </label>
            <input type="text" name="text2">
        </div>
        <button type="submit">Sprawdź</button>
    </form>

    <?php

        if (isset($_POST['text1']) && isset($_POST['text2'])){
            $text1 = $_POST['text1'];
            $text2 = $_POST['text2'];
            $text1Letters = [];
            $text2Letters = [];

            for ($i = 0; $i < strlen($text1); $i++){
                array_push($text1Letters, $text1[$i]);
            }
            for ($i = 0; $i < strlen($text2); $i++){
                array_push($text2Letters, $text2[$i]);
            }

            sort($text1Letters);
            sort($text2Letters);

            if ($text1Letters === $text2Letters) {
                echo "Wyrazy są anagramami.";
            } else {
                echo "Wyrazy nie są anagramami.";
            }

        }
    ?>
</body>
</html>