<?php
$login    = '10264154u';
$password = 'Mikolaj1324';

$cookie_file = sys_get_temp_dir() . '/librus_cookies.txt';
if (file_exists($cookie_file)) unlink($cookie_file);

function req(string $cookie_file, string $url, ?string $post = null, array $headers = []): array {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_COOKIEJAR      => $cookie_file,
        CURLOPT_COOKIEFILE     => $cookie_file,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:150.0) Gecko/20100101 Firefox/150.0',
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_ENCODING       => '',
        CURLOPT_HEADER         => true,
    ]);
    if ($post !== null) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
    }
    if ($headers) curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $raw = curl_exec($ch);
    $hs  = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    return [
        'code'    => curl_getinfo($ch, CURLINFO_HTTP_CODE),
        'headers' => substr($raw, 0, $hs),
        'body'    => substr($raw, $hs),
    ];
}

function location(array $res, string $base = ''): ?string {
    if (preg_match('/^Location:\s*(.+)$/im', $res['headers'], $m)) {
        $loc = trim($m[1]);
        return str_starts_with($loc, 'http') ? $loc : $base . $loc;
    }
    return null;
}

// Pobierz token Bearer przez API Librusa (client_id=46 to aplikacja mobilna Synergia)
// Używamy grant_type=password który nie wymaga OAuth redirect
$r = req($cookie_file,
    'https://api.librus.pl/OAuth/Token',
    http_build_query([
        'grant_type' => 'password',
        'username'   => $login,
        'password'   => $password,
        'client_id'  => 46,
    ]),
    [
        'Content-Type: application/x-www-form-urlencoded',
        'Authorization: Basic MzU6NjM2YWI0MThjY2JlODgyYjE5YTMzZjU3N2U5NGNhNTE=',
    ]
);

echo "<pre style='background:#111;color:#0f0;padding:10px;font-size:12px'>";
echo "Token HTTP: {$r['code']}\nBody: " . htmlspecialchars($r['body']) . "\n";
echo "</pre>";

$token_data = json_decode($r['body'], true);

if (isset($token_data['access_token'])) {
    $token = $token_data['access_token'];
    
    // Pobierz oceny przez API
    $grades_r = req($cookie_file,
        'https://api.librus.pl/2.0/Grades',
        null,
        ['Authorization: Bearer ' . $token]
    );
    
    $grades = json_decode($grades_r['body'], true);
    
    // Pobierz przedmioty
    $subjects_r = req($cookie_file,
        'https://api.librus.pl/2.0/Subjects',
        null,
        ['Authorization: Bearer ' . $token]
    );
    $subjects_data = json_decode($subjects_r['body'], true);
    $subjects = [];
    foreach (($subjects_data['Subjects'] ?? []) as $s) {
        $subjects[$s['Id']] = $s['Name'];
    }

    // Wyświetl
    echo "<!DOCTYPE html><html lang='pl'><head><meta charset='UTF-8'>";
    echo "<title>Oceny - Librus</title>";
    echo "<style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        h1 { color: #2c3e50; }
        table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 1px 4px rgba(0,0,0,.1); }
        th { background: #2c3e50; color: white; padding: 12px; text-align: left; }
        td { padding: 10px 12px; border-bottom: 1px solid #eee; }
        tr:hover td { background: #f9f9f9; }
        .grade { display:inline-block; background:#3498db; color:white; border-radius:4px; padding:2px 8px; margin:2px; font-weight:bold; }
        .grade-1,.grade-2 { background:#e74c3c; }
        .grade-3 { background:#e67e22; }
        .grade-4 { background:#27ae60; }
        .grade-5,.grade-6 { background:#2ecc71; }
    </style></head><body>";
    echo "<h1>📚 Oceny bieżące</h1>";
    echo "<table><thead><tr><th>Przedmiot</th><th>Oceny</th></tr></thead><tbody>";
    
    // Grupuj oceny po przedmiocie
    $by_subject = [];
    foreach (($grades['Grades'] ?? []) as $g) {
        $sid = $g['Subject']['Id'];
        $by_subject[$sid][] = $g['Grade'];
    }
    
    foreach ($by_subject as $sid => $gs) {
        $subject_name = $subjects[$sid] ?? "Przedmiot $sid";
        echo "<tr><td><b>" . htmlspecialchars($subject_name) . "</b></td><td>";
        foreach ($gs as $g) {
            $n = (int)$g;
            echo "<span class='grade grade-$n'>" . htmlspecialchars($g) . "</span>";
        }
        echo "</td></tr>";
    }
    
    echo "</tbody></table></body></html>";

} else {
    echo "<p style='color:red'>Nie udało się pobrać tokena. Odpowiedź serwera powyżej.</p>";
}