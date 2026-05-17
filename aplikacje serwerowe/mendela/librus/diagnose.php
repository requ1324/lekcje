<?php
/**
 * Librus – DIAGNOSTYKA LOGOWANIA
 * Uruchom to ZAMIAST głównego skryptu żeby zobaczyć co zwraca serwer
 */

const USERNAME    = '10264154u';
const PASSWORD    = 'Mikolaj1324';
const COOKIE_FILE = __DIR__ . '/librus_diag_cookies.txt';

if (file_exists(COOKIE_FILE)) unlink(COOKIE_FILE);

// ─── cURL BEZ auto-decode (surowe bajty) ──────────────
function rawReq(string $url, string $method = 'GET', ?string $body = null, array $extra = []): array
{
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER         => true,
        CURLOPT_FOLLOWLOCATION => false,
        // CELOWO nie ustawiamy CURLOPT_ENCODING – chcemy surowe bajty
        CURLOPT_COOKIEJAR      => COOKIE_FILE,
        CURLOPT_COOKIEFILE     => COOKIE_FILE,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
        CURLOPT_HTTPHEADER     => array_merge([
            'Accept-Language: pl,en-US;q=0.7,en;q=0.3',
            'Connection: keep-alive',
        ], $extra),
        CURLOPT_TIMEOUT        => 30,
    ]);

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body ?? '');
    }

    $raw  = curl_exec($ch);
    $hSz  = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    $headers = substr($raw, 0, $hSz);
    $rawBody = substr($raw, $hSz);

    // Sprawdź Content-Encoding i zdekoduj ręcznie
    $decoded = $rawBody;
    if (stripos($headers, 'content-encoding: gzip') !== false) {
        $d = @gzdecode($rawBody);
        if ($d !== false) {
            $decoded = $d;
        } else {
            // Spróbuj inflate
            $d = @gzinflate(substr($rawBody, 10, -8));
            $decoded = ($d !== false) ? $d : $rawBody;
        }
    } elseif (stripos($headers, 'content-encoding: br') !== false) {
        // brotli – jeśli nie ma rozszerzenia, zostaw raw
        if (function_exists('brotli_uncompress')) {
            $d = @brotli_uncompress($rawBody);
            $decoded = ($d !== false) ? $d : $rawBody;
        }
    }

    preg_match('/^Location:\s*(.+)$/mi', $headers, $loc);
    preg_match('/^content-type:\s*(.+)$/mi', $headers, $ct);

    return [
        'code'        => $code,
        'headers'     => $headers,
        'rawBody'     => $rawBody,
        'body'        => $decoded,
        'location'    => isset($loc[1]) ? trim($loc[1]) : null,
        'contentType' => isset($ct[1])  ? trim($ct[1])  : '',
    ];
}

function log_msg(string $m): void { echo '[' . date('H:i:s') . '] ' . $m . PHP_EOL; }

function hexDump(string $data, int $bytes = 64): string
{
    $slice = substr($data, 0, $bytes);
    $hex   = implode(' ', str_split(bin2hex($slice), 2));
    $asc   = preg_replace('/[^\x20-\x7E]/', '.', $slice);
    return "HEX: $hex\nASC: $asc";
}

// ══════════════════════════════════════════════════════
//  KROK 1: Strona startowa
// ══════════════════════════════════════════════════════
log_msg('=== DIAGNOSTYKA LOGOWANIA LIBRUS ===');
log_msg('');
log_msg('Krok 1 – portal.librus.pl');
$r = rawReq('https://portal.librus.pl/', 'GET', null, ['Accept: text/html,*/*;q=0.8']);
log_msg("  HTTP {$r['code']} | body bytes raw=" . strlen($r['rawBody']) . " decoded=" . strlen($r['body']));

// ══════════════════════════════════════════════════════
//  KROK 2: OAuth page – WYCIĄGNIJ HIDDEN FIELDS + FORM ACTION
// ══════════════════════════════════════════════════════
log_msg('');
log_msg('Krok 2 – OAuth Authorization page');

$oAuth = rawReq(
    'https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata',
    'GET',
    null,
    ['Accept: text/html,*/*;q=0.8', 'Referer: https://portal.librus.pl/']
);

// Podążaj za redirectem jeśli jest
if (in_array($oAuth['code'], [301,302,303]) && $oAuth['location']) {
    log_msg("  ↳ redirect → {$oAuth['location']}");
    $oAuth = rawReq($oAuth['location'], 'GET', null, [
        'Accept: text/html,*/*;q=0.8',
        'Referer: https://portal.librus.pl/',
    ]);
}

log_msg("  HTTP {$oAuth['code']} | body bytes raw=" . strlen($oAuth['rawBody']) . " decoded=" . strlen($oAuth['body']));
log_msg("  Content-Type: {$oAuth['contentType']}");
log_msg("  Pierwsze 64 bajty body:");
log_msg("  " . str_replace("\n", "\n  ", hexDump($oAuth['body'], 64)));

// Zapisz pełne HTML formularza
file_put_contents(__DIR__ . '/diag_oauth_page.html', $oAuth['body']);
log_msg("  💾 Zapisano diag_oauth_page.html (" . strlen($oAuth['body']) . " bajtów)");

// Wyciągnij action formularza i hidden fields
$dom = new DOMDocument();
libxml_use_internal_errors(true);
$dom->loadHTML($oAuth['body']);
libxml_clear_errors();
$xp = new DOMXPath($dom);

$formAction     = null;
$hiddenFields   = [];

// Szukaj formularza logowania
$forms = $xp->query('//form');
foreach ($forms as $form) {
    $action = $form->getAttribute('action') ?: 'BRAK';
    $inputs = $xp->query('.//input', $form);
    $fieldList = [];
    foreach ($inputs as $inp) {
        $name  = $inp->getAttribute('name');
        $type  = $inp->getAttribute('type');
        $val   = $inp->getAttribute('value');
        $fieldList[] = "name='$name' type='$type' value='$val'";
        if ($type === 'hidden' && $name) {
            $hiddenFields[$name] = $val;
        }
    }
    log_msg("  FORM action='$action' fields: " . implode(', ', $fieldList));
    if (!$formAction) $formAction = $action;
}

log_msg("  Hidden fields znalezione: " . json_encode($hiddenFields));

// ══════════════════════════════════════════════════════
//  KROK 3: Próba logowania z 4 wariantami + hex dump
// ══════════════════════════════════════════════════════
log_msg('');
log_msg('Krok 3 – próba logowania JSON (Wariant A)');

$loginRes = rawReq(
    'https://api.librus.pl/OAuth/Authorization?client_id=46',
    'POST',
    json_encode(['Login' => USERNAME, 'Password' => PASSWORD]),
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

log_msg("  HTTP {$loginRes['code']}");
log_msg("  Content-Type: {$loginRes['contentType']}");
log_msg("  raw body bytes: " . strlen($loginRes['rawBody']));
log_msg("  decoded body bytes: " . strlen($loginRes['body']));
log_msg("  Pierwsze 64 bajty (raw):");
log_msg("  " . str_replace("\n", "\n  ", hexDump($loginRes['rawBody'], 64)));
log_msg("  Pierwsze 64 bajty (decoded):");
log_msg("  " . str_replace("\n", "\n  ", hexDump($loginRes['body'], 64)));
log_msg("  Body (pierwsze 500 znaków): " . mb_substr($loginRes['body'], 0, 500));
file_put_contents(__DIR__ . '/diag_login_response.txt',
    "=== HTTP {$loginRes['code']} ===\n{$loginRes['headers']}\n\n=== BODY (decoded) ===\n{$loginRes['body']}"
);
log_msg("  💾 Zapisano diag_login_response.txt");

// ══════════════════════════════════════════════════════
//  KROK 4: Jeśli form action jest inne niż oczekiwano – próba FORM POST
// ══════════════════════════════════════════════════════
if ($formAction && $formAction !== 'BRAK') {
    log_msg('');
    log_msg("Krok 4 – próba FORM POST na wykryty action='$formAction'");

    $postData = array_merge($hiddenFields, [
        'Login'    => USERNAME,
        'Password' => PASSWORD,
    ]);

    $fullAction = str_starts_with($formAction, 'http')
        ? $formAction
        : 'https://api.librus.pl' . $formAction;

    log_msg("  POST → $fullAction");
    log_msg("  Data: " . json_encode($postData));

    $formRes = rawReq(
        $fullAction,
        'POST',
        http_build_query($postData),
        [
            'Content-Type: application/x-www-form-urlencoded',
            'Accept: application/json, text/html, */*',
            'Origin: https://api.librus.pl',
            'Referer: https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata',
            'X-Requested-With: XMLHttpRequest',
        ]
    );

    log_msg("  HTTP {$formRes['code']}");
    log_msg("  Content-Type: {$formRes['contentType']}");
    log_msg("  Body (500): " . mb_substr($formRes['body'], 0, 500));
    file_put_contents(__DIR__ . '/diag_form_login_response.txt',
        "=== HTTP {$formRes['code']} ===\n{$formRes['headers']}\n\n=== BODY ===\n{$formRes['body']}"
    );
    log_msg("  💾 Zapisano diag_form_login_response.txt");
}

log_msg('');
log_msg('=== DIAGNOSTYKA ZAKOŃCZONA ===');
log_msg('Sprawdź pliki diag_*.html i diag_*.txt w katalogu skryptu');
log_msg('i wklej ich zawartość / output konsoli żeby kontynuować.');