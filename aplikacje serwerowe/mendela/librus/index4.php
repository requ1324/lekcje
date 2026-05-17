<?php
/**
 * Librus Synergia – Pobieracz ocen ucznia v3
 * Rozwiązuje problem: serwer zwraca HTML zamiast JSON przy logowaniu
 */

// ────────────────────────────────────────────────────────
const USERNAME    = '10264154u';
const PASSWORD    = 'Mikolaj1324';
const COOKIE_FILE = __DIR__ . '/librus_session.txt';
const OUTPUT_HTML = __DIR__ . '/oceny.html';

// ────────────────────────────────────────────────────────
//  cURL helper
// ────────────────────────────────────────────────────────
function req(string $url, string $method = 'GET', ?string $body = null, array $extra = []): array
{
    static $base = [
        'Accept-Language: pl,en-US;q=0.7,en;q=0.3',
        'Connection: keep-alive',
    ];

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER         => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_ENCODING       => 'gzip',         // wymuś gzip decode
        CURLOPT_COOKIEJAR      => COOKIE_FILE,
        CURLOPT_COOKIEFILE     => COOKIE_FILE,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
        CURLOPT_HTTPHEADER     => array_merge($base, $extra),
        CURLOPT_TIMEOUT        => 30,
    ]);

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body ?? '');
    }

    $raw  = curl_exec($ch);
    $hSz  = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    $rawH = substr($raw, 0, $hSz);
    $bdy  = substr($raw, $hSz);

    // Wyciągnij Content-Type i Location
    preg_match('/^Location:\s*(.+)$/mi', $rawH, $loc);
    preg_match('/^content-type:\s*(.+)$/mi', $rawH, $ct);

    return [
        'code'        => $code,
        'body'        => $bdy,
        'rawH'        => $rawH,
        'location'    => isset($loc[1]) ? trim($loc[1]) : null,
        'contentType' => isset($ct[1])  ? trim($ct[1])  : '',
    ];
}

function followRedirects(array $res, string $base, array $extra = [], int $max = 15): array
{
    while (in_array($res['code'], [301,302,303,307,308], true) && $res['location'] && $max-- > 0) {
        $loc = $res['location'];
        if (!str_starts_with($loc, 'http')) {
            $p   = parse_url($base);
            $loc = $p['scheme'] . '://' . $p['host'] . '/' . ltrim($loc, '/');
        }
        log_msg("  ↳ [{$res['code']}] → $loc");
        $base = preg_replace('#(https?://[^/]+).*#', '$1', $loc);
        $res  = req($loc, 'GET', null, $extra);
    }
    return $res;
}

function log_msg(string $m): void { echo '[' . date('H:i:s') . '] ' . $m . PHP_EOL; }
function dump(string $n, string $c): void { file_put_contents(__DIR__ . "/$n", $c); log_msg("  💾 debug → $n"); }

// ────────────────────────────────────────────────────────
//  START – wyczyść sesję
// ────────────────────────────────────────────────────────
if (file_exists(COOKIE_FILE)) unlink(COOKIE_FILE);

// ── Krok 1: Strona startowa ──────────────────────────────
log_msg('Krok 1 – strona startowa (portal.librus.pl)');
req('https://portal.librus.pl/', 'GET', null, [
    'Accept: text/html,application/xhtml+xml,*/*;q=0.8',
]);

// ── Krok 2: Pobierz stronę OAuth (dostaje CSRF cookies) ──
log_msg('Krok 2 – OAuth page (client_id=46)');
$oauthBase = 'https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata';
$oRes = req($oauthBase, 'GET', null, [
    'Accept: text/html,application/xhtml+xml,*/*;q=0.8',
    'Referer: https://portal.librus.pl/',
]);
$oRes = followRedirects($oRes, 'https://api.librus.pl', ['Referer: https://portal.librus.pl/']);
dump('debug_01_oauth_page.html', $oRes['body']);
log_msg("  OAuth page → HTTP {$oRes['code']}, type: {$oRes['contentType']}");

// ── Krok 3: Próba logowania (próbujemy kilku wariantów) ──
log_msg('Krok 3 – logowanie (próba kilku wariantów)');

$credentials = ['Login' => USERNAME, 'Password' => PASSWORD];
$loginResult = null;

// Wariant A: JSON POST na ?client_id=46 (bez scope)
log_msg('  Wariant A: JSON POST → /Authorization?client_id=46');
$tryA = req(
    'https://api.librus.pl/OAuth/Authorization?client_id=46',
    'POST',
    json_encode($credentials),
    [
        'Content-Type: application/json',
        'Accept: application/json, */*',
        'Origin: https://portal.librus.pl',
        'Referer: https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata',
        'X-Requested-With: XMLHttpRequest',
        'X-Librus-Client-Id: 46',
        'Sec-Fetch-Site: same-origin',
        'Sec-Fetch-Mode: cors',
        'Sec-Fetch-Dest: empty',
    ]
);
dump('debug_02a_loginA.txt', "HTTP {$tryA['code']}\nContent-Type: {$tryA['contentType']}\n\n{$tryA['body']}");
log_msg("    HTTP {$tryA['code']}, type: {$tryA['contentType']}");
log_msg("    body[0..200]: " . mb_substr(trim($tryA['body']), 0, 200));

if (str_contains($tryA['contentType'], 'json')) {
    $loginResult = $tryA;
    log_msg("    ✓ Wariant A zwrócił JSON!");
}

// Wariant B: JSON POST na ?client_id=46&response_type=code&scope=mydata
if (!$loginResult) {
    log_msg('  Wariant B: JSON POST → /Authorization?client_id=46&response_type=code&scope=mydata');
    $tryB = req(
        'https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata',
        'POST',
        json_encode($credentials),
        [
            'Content-Type: application/json',
            'Accept: application/json, */*',
            'Origin: https://portal.librus.pl',
            'Referer: https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata',
            'X-Requested-With: XMLHttpRequest',
            'X-Librus-Client-Id: 46',
            'Sec-Fetch-Site: same-origin',
            'Sec-Fetch-Mode: cors',
        ]
    );
    dump('debug_02b_loginB.txt', "HTTP {$tryB['code']}\nContent-Type: {$tryB['contentType']}\n\n{$tryB['body']}");
    log_msg("    HTTP {$tryB['code']}, type: {$tryB['contentType']}");
    log_msg("    body[0..200]: " . mb_substr(trim($tryB['body']), 0, 200));

    if (str_contains($tryB['contentType'], 'json')) {
        $loginResult = $tryB;
        log_msg("    ✓ Wariant B zwrócił JSON!");
    }
}

// Wariant C: FORM POST (application/x-www-form-urlencoded)
if (!$loginResult) {
    log_msg('  Wariant C: FORM POST → /OAuth/Authorization?client_id=46');
    $tryC = req(
        'https://api.librus.pl/OAuth/Authorization?client_id=46',
        'POST',
        http_build_query($credentials),
        [
            'Content-Type: application/x-www-form-urlencoded',
            'Accept: application/json, text/html, */*',
            'Origin: https://portal.librus.pl',
            'Referer: https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata',
            'X-Requested-With: XMLHttpRequest',
        ]
    );
    dump('debug_02c_loginC.txt', "HTTP {$tryC['code']}\nContent-Type: {$tryC['contentType']}\n\n{$tryC['body']}");
    log_msg("    HTTP {$tryC['code']}, type: {$tryC['contentType']}");
    log_msg("    body[0..200]: " . mb_substr(trim($tryC['body']), 0, 200));

    if (str_contains($tryC['contentType'], 'json')) {
        $loginResult = $tryC;
        log_msg("    ✓ Wariant C zwrócił JSON!");
    }
}

// Wariant D: PerformLogin endpoint (widziany w network trace)
if (!$loginResult) {
    log_msg('  Wariant D: JSON POST → /OAuth/Authorization/PerformLogin?client_id=46');
    $tryD = req(
        'https://api.librus.pl/OAuth/Authorization/PerformLogin?client_id=46',
        'POST',
        json_encode($credentials),
        [
            'Content-Type: application/json',
            'Accept: application/json, */*',
            'Origin: https://portal.librus.pl',
            'Referer: https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata',
            'X-Requested-With: XMLHttpRequest',
            'X-Librus-Client-Id: 46',
        ]
    );
    dump('debug_02d_loginD.txt', "HTTP {$tryD['code']}\nContent-Type: {$tryD['contentType']}\n\n{$tryD['body']}");
    log_msg("    HTTP {$tryD['code']}, type: {$tryD['contentType']}");
    log_msg("    body[0..200]: " . mb_substr(trim($tryD['body']), 0, 200));

    if (str_contains($tryD['contentType'], 'json')) {
        $loginResult = $tryD;
        log_msg("    ✓ Wariant D zwrócił JSON!");
    }
}

if (!$loginResult) {
    log_msg('');
    log_msg('❌ Żaden wariant logowania nie zwrócił JSON.');
    log_msg('');
    log_msg('📋 DIAGNOZA: Sprawdź pliki debug_02*.txt w katalogu skryptu.');
    log_msg('   Zawierają pełne odpowiedzi serwera z każdego wariantu.');
    log_msg('');
    log_msg('   Możliwe przyczyny:');
    log_msg('   1. Niepoprawny login lub hasło (sprawdź stałe USERNAME/PASSWORD)');
    log_msg('   2. Konto wymaga CAPTCHA lub 2FA przez SMS');
    log_msg('   3. Endpoint API Librus zmienił się – sprawdź body w debug_02*.txt');
    log_msg('   4. IP zablokowane po zbyt wielu próbach');
    die();
}

// ── Krok 4: Parsuj goTo ──────────────────────────────────
$json = json_decode($loginResult['body'], true);
log_msg('Krok 4 – parsowanie goTo');

if (!empty($json['errors'])) {
    log_msg("❌ Błąd logowania: " . implode(', ', (array)$json['errors']));
    die();
}
if (empty($json['goTo'])) {
    log_msg("❌ Brak 'goTo' w JSON: " . json_encode($json));
    die();
}

$goToUrl = 'https://api.librus.pl' . $json['goTo'];
log_msg("  ✓ goTo = $goToUrl");

// ── Krok 5: 2FA + chain redirectów ──────────────────────
log_msg('Krok 5 – 2FA Authorization + redirecty');
$res = req($goToUrl, 'GET', null, [
    'Accept: text/html,application/xhtml+xml,*/*;q=0.8',
    'Referer: https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata',
]);
$res = followRedirects($res, 'https://api.librus.pl', ['Referer: https://api.librus.pl/']);
dump('debug_03_after2fa.html', $res['body']);

// Wyciągnij URL synergia z JS postMessage
$body   = $res['body'];
$synUrl = null;

foreach ([
    '/"url"\s*:\s*"(https:\\\\\/\\\\\/synergia\\.librus\\.pl[^"]+)"/',
    '/"url"\s*:\s*"(https:\/\/synergia\.librus\.pl[^"]+)"/',
    '#(https://synergia\.librus\.pl/uczen[^\s"\'<>]+)#',
] as $pat) {
    if (preg_match($pat, $body, $m)) {
        $synUrl = str_replace('\/', '/', $m[1]);
        break;
    }
}

if (!$synUrl && $res['location'] && str_contains($res['location'], 'synergia.librus.pl')) {
    $synUrl = $res['location'];
}

if (!$synUrl) {
    log_msg("❌ Nie znaleziono URL synergia. Sprawdź debug_03_after2fa.html");
    die();
}

log_msg("  ✓ Synergia URL: $synUrl");

// ── Krok 6: Ustanowienie sesji synergia ─────────────────
log_msg('Krok 6 – ustanawianie sesji synergia (KLUCZOWY krok)');
$res = req($synUrl, 'GET', null, [
    'Accept: text/html,application/xhtml+xml,*/*;q=0.8',
    'Referer: https://api.librus.pl/',
    'Sec-Fetch-Site: cross-site',
    'Sec-Fetch-Mode: navigate',
    'Sec-Fetch-Dest: document',
]);
$res = followRedirects($res, 'https://synergia.librus.pl', [
    'Referer: https://api.librus.pl/',
    'Sec-Fetch-Site: same-origin',
    'Sec-Fetch-Mode: navigate',
]);
log_msg("  Sesja HTTP: {$res['code']}");

// ── Krok 7: Oceny ───────────────────────────────────────
log_msg('Krok 7 – pobieranie ocen');
$gr = req('https://synergia.librus.pl/przegladaj_oceny/uczen', 'GET', null, [
    'Accept: text/html,application/xhtml+xml,*/*;q=0.8',
    'Referer: https://synergia.librus.pl/uczen/index',
    'Sec-Fetch-Site: same-origin',
    'Sec-Fetch-Mode: navigate',
]);

if ($gr['code'] >= 300 && $gr['location'] &&
    (str_contains($gr['location'], 'portal.librus.pl') || str_contains($gr['location'], 'api.librus.pl'))) {
    log_msg("❌ Redirect z powrotem na portal – sesja nieaktywna!");
    die();
}

if ($gr['code'] !== 200) {
    log_msg("❌ HTTP {$gr['code']}");
    dump('debug_grades.html', $gr['body']);
    die();
}

log_msg('✅ Pobrano oceny!');
parseAndSave($gr['body']);

// ────────────────────────────────────────────────────────
//  PARSOWANIE + ZAPIS HTML
// ────────────────────────────────────────────────────────
function parseAndSave(string $html): void
{
    $dom = new DOMDocument();
    libxml_use_internal_errors(true);
    $dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
    libxml_clear_errors();
    $xp = new DOMXPath($dom);

    $tables = $xp->query('//table[contains(@class,"decorated")]');
    if (!$tables->length) {
        log_msg("⚠️ Brak tabeli – zapisuję raw HTML → oceny_raw.html");
        file_put_contents(__DIR__ . '/oceny_raw.html', $html);
        return;
    }

    $headers = [];
    $rows    = [];

    foreach ($xp->query('.//tr', $tables->item(0)) as $i => $row) {
        $cells   = $xp->query('.//th|.//td', $row);
        $rowData = [];
        foreach ($cells as $cell) {
            $spans = $xp->query('.//span', $cell);
            if ($spans->length > 0) {
                $gs = [];
                foreach ($spans as $s) {
                    $g = trim($s->textContent);
                    if ($g !== '') $gs[] = $g;
                }
                $rowData[] = implode(' ', $gs);
            } else {
                $rowData[] = trim(preg_replace('/\s+/', ' ', $cell->textContent));
            }
        }
        if ($i === 0) {
            $headers = $rowData;
        } elseif (!empty(array_filter($rowData))) {
            $rows[] = (count($headers) === count($rowData))
                ? array_combine($headers, $rowData)
                : $rowData;
        }
    }

    if (empty($rows)) { log_msg("⚠️ Tabela pusta."); return; }

    // Konsola
    $cols   = array_keys($rows[0]);
    $widths = array_fill_keys($cols, 0);
    foreach ($rows as $r) {
        foreach ($cols as $c) {
            $widths[$c] = max($widths[$c], mb_strlen((string)($r[$c]??'')), mb_strlen($c));
        }
    }
    $sep = '+' . implode('+', array_map(fn($w) => str_repeat('-', $w+2), $widths)) . '+';
    echo "\n$sep\n";
    echo '|' . implode('|', array_map(fn($c,$w)=>' '.mb_str_pad($c,$w).' ', $cols, $widths)) . "|\n";
    echo "$sep\n";
    foreach ($rows as $r) {
        echo '|' . implode('|', array_map(fn($c,$w)=>' '.mb_str_pad((string)($r[$c]??''),$w).' ', $cols, $widths)) . "|\n";
    }
    echo "$sep\n✅ Łącznie: " . count($rows) . " przedmiotów\n";

    // HTML
    $hH  = implode('', array_map(fn($h) => '<th>'.htmlspecialchars($h).'</th>', $headers));
    $rH  = implode("\n", array_map(fn($r) =>
        '<tr>' . implode('', array_map(fn($h) => '<td>'.htmlspecialchars((string)($r[$h]??'')).'</td>', $headers)) . '</tr>',
    $rows));
    $now = date('d.m.Y H:i:s');
    $cnt = count($rows);

    file_put_contents(OUTPUT_HTML, <<<HTML
<!DOCTYPE html><html lang="pl"><head>
<meta charset="UTF-8"><title>Oceny – Librus</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',sans-serif;background:#f0f4f8;padding:24px}
.hdr{background:linear-gradient(135deg,#1a4a7a,#2d7dd2);color:#fff;border-radius:12px;padding:20px 28px;margin-bottom:24px;box-shadow:0 4px 15px rgba(29,78,137,.25)}
.hdr h1{font-size:1.5rem}.hdr small{opacity:.8;font-size:.85rem}
.wrap{background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.08);overflow-x:auto}
table{border-collapse:collapse;width:100%;min-width:600px}
thead th{background:#1a4a7a;color:#fff;padding:12px 16px;text-align:left;font-size:.85rem;white-space:nowrap}
tbody tr:hover td{background:#eef5ff}
tbody tr:nth-child(even) td{background:#f7faff}
td{padding:10px 16px;border-bottom:1px solid #e4eaf2;font-size:.9rem;vertical-align:top}
td:first-child{font-weight:600;white-space:nowrap}
.foot{margin-top:12px;text-align:right;color:#999;font-size:.8rem}
</style></head><body>
<div class="hdr"><h1>📚 Oceny ucznia – Librus Synergia</h1><small>Pobrano: $now</small></div>
<div class="wrap"><table><thead><tr>$hH</tr></thead><tbody>$rH</tbody></table></div>
<div class="foot">Łącznie przedmiotów: $cnt</div>
</body></html>
HTML);
    log_msg('💾 Zapisano: ' . OUTPUT_HTML);
}