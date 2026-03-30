<?php
include("passwd.php");
$cookie_file_path = "";
$ch = curl_init();
curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie_file_path);
curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie_file_path);
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
$res = sendGET("https://synergia.librus.pl/loguj");
// Librus sprawdza po stronie portalu skąd przychodzimy
curl_setopt($ch, CURLOPT_REFERER, "https://synergia.librus.pl/loguj");

$arr = array(
    "login" => $user,
    "pass" => $passwd
);
$res = sendPOST("https://synergia.librus.pl/loguj", $arr);

// Po poprawnym zalogowaniu, sesja w Synergii jest już najprawdopodobniej uwierzytelniona
// Pobieramy podgląd ocen, by odczytać to, na czym Ci zależało na początku
$res = sendGET("https://synergia.librus.pl/przegladaj_oceny/uczen");
$res = str_replace('href="', 'href="https://synergia.librus.pl/', $res);
$res = str_replace('href="https://synergia.librus.pl//', 'href="https://synergia.librus.pl/', $res); // zapobieganie //
$res = str_replace('src="', 'src="https://synergia.librus.pl/', $res);
$res = str_replace('src="https://synergia.librus.pl//', 'src="https://synergia.librus.pl/', $res);

echo $res;

echo "<script>console.log(document.getElementsByTagName('div'));</script>";

// XPath + RegExp - HARD
// EASY - JS

function sendGET($url)
{
    global $ch;
    curl_setopt($ch, CURLOPT_POST, 0);
    curl_setopt($ch, CURLOPT_HTTPGET, 1);
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
