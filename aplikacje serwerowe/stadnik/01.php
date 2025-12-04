<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php 
        $arr = [];
        $frequencies = [];
        for ($i = 0; $i < 31; $i++){
            $random = rand(-20, 30);
            array_push($arr, $random);
            if(isset($frequencies[$random])){
                $frequencies[$random] += 1;
            }else{
                $frequencies[$random] = 1;
            }
        }

        foreach ($arr as $num){
            if ($frequencies[$num] > 1){
                echo "<b>" . $num . "</b>". "<br>";
            }else{
                echo $num . "<br>";
            }
        }
        
    ?>
</body>
</html>