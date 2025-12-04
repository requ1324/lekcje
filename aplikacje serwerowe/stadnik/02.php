<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        table, tr, td{
            border: 1px solid black;
            border-collapse: collapse;
            text-align: center;
        }
    </style>
</head>
<body>
    <?php 
        $rows = [1, 2, 3,4, 5];
        $cols = [1, 2, 3,4, 5, 6 , 7, 8];
        echo "<table>";
        for ($i = 0; $i < count($rows); $i++){
            echo "<tr>";
                for ($j = 0; $j < count($cols); $j++){
                    echo "<td>" . $rows[$i] * $cols[$j] . "</td>";
                }
            echo "</tr>";
        }
        echo "</table>"
    ?>
</body>
</html>