<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <style>
        body{
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
            overflow:hidden;
        }

        .container{
            background:darkgrey;
            border-radius:10px;
            padding:40px;
            display:flex;
            justif-content:space-between;
            align-items:center;
            flex-direction:column;
        }

        input{
            margin:20px;
            border-radius:0px;
            border:none;
            outline:none;
            padding:10px;
            font-size:1.2rem;
        }

        button{
            text-decoration:none;
            color:black;
            background:white;
            padding:10px 20px;
            border-radius:10px;
            font-size:1.3rem;
            transition:.2s;
            cursor:pointer;
            border:none;
            outline:none;
        }

        button:hover{
            transition:.2s;
            background:lightgrey;
        }
        form{
            display:flex;
            justify-content:space-between;
            align-items:center;
            flex-direction:column;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Login</h1>
        <form action="/index.php">
            <input type="email" placeholder="email" required>
            <input type="password" placeholder="password" required>
            <button type="submit">Login</button>
        </form>
    </div>
    <?php 
        function valid_password($password){
            return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/', $password);
        }
    ?>
</body>
</html>