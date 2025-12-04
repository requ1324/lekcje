<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="" method='post'>
        <input type="text" name="sent">
        <button type='submit'>Odwroc</button>
    </form>
    <?php 
        if(isset($_POST['sent'])){
            $sentence = $_POST['sent'];
            $words = [];
            $word = "";
            for ($i = 0; $i < strlen($sentence); $i++){
                
                if ($sentence[$i] == " "){
                    if ($word != ""){ 
                        array_push($words, $word);
                         $word = "";
                        }
                   
                }else{
                    $word = $word . $sentence[$i];
                }
            }
            if ($word != "") {
                    array_push($words, $word);
                }

            $newSent = [];
            for($i = 0; $i < count($words); $i++){
                if (strlen($words[$i]) % 2 == 0){
                    array_push($newSent, strrev($words[$i]));
                } else {
                    array_push($newSent, $words[$i]);
                }
            }

            echo implode(" ", $newSent);
        }
       
    ?>
</body>
</html>