<?php
include("passwd.php");

$cookie_file_path = __DIR__ . "/cookie.txt";



$ch = curl_init();
curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie_file_path);
curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie_file_path);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0");
curl_setopt($ch, CURLOPT_ENCODING, "");


//1 https://api.librus.pl/OAuth/Authorization?client_id=46
//2 https://api.librus.pl/OAuth/Authorization/2FA?client_id=46
//3 https://synergia.librus.pl/loguj/portalRodzina?code=4vhhXUyRZIXPNwG431CxaYeebkOk3U/xND6MuAj5HxtoRZ/D/maX/OtKCjz5m0CPwv4TWC757PR2+GbesNdl+6HmUlx/nv+UqUfPDyfcHESqnCXBgdOi/ZwWagrt8p4JPXn37wPk=#o+9er1Se3X0=&state=cbe90a23051a03b9a08b401a1c17dd3362e03a828038329f3589f572dac21979


$arr = array(
    'login' => $user,
    'pass' => $passwd
);


function sendGET($url, $headers = null)
{
    global $ch;
    curl_setopt($ch, CURLOPT_POST, 0);
    curl_setopt($ch, CURLOPT_HTTPGET, 1);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    if ($headers) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
    return curl_exec($ch);
}

function sendPOST($url, $fields, $headers = null)
{
    global $ch;
    $postFields = http_build_query($fields);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    if ($headers) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
    return curl_exec($ch);
}
