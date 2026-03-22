<?php
include("passwd.php");
$cookie_file_path = "";
$ch = curl_init();
curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie_file_path);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
$res = sendGET("https://synergia.librus.pl/loguj/portalSzkoly?v=1773653212");
//echo $res;
$arr = array(
    "action" => "login",
    "login" => $user,
    "pass" => $passwd
);
$res = sendPOST("https://api.librus.pl/OAuth/Authorization?client_id=47", $arr);
//echo $res;

$arr = array(
    "command" => "open_synergia_window",
    "commandPayload" => array(
        "url" => "https:\/\/synergia.librus.pl\/interfejs_lekcyjny"
    )
);
sendPOST("https://api.librus.pl/OAuth/Authorization/2FA?client_id=47", $arr);
$res = sendGET("https://synergia.librus.pl/oceny/wybierz_klase");
$res = str_replace('href="', 'href="https://synergia.librus.pl', $res);
$res = str_replace('src="', 'src="https://synergia.librus.pl', $res);

echo $res;

echo "<script>console.log(document.getElementsByTagName('div'));</script>";

// XPath + RegExp - HARD
// EASY - JS

function sendGET($url)
{
    global $ch;
    curl_setopt($ch, CURLOPT_URL, $url);
    $res = curl_exec($ch);
    return $res;
}

function sendPOST($url, $fields)
{
    global $ch;
    $POSTFIELDS = http_build_query($fields);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $POSTFIELDS);
    curl_setopt($ch, CURLOPT_URL, $url);
    $res = curl_exec($ch);
    return $res;
}
