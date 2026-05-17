<?php

class LibrusClient {
    private $curl;
    private $cookies = [];

    public function __construct() {
        $this->curl = curl_init();

        curl_setopt_array($this->curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_HEADER         => true,
            CURLOPT_ENCODING       => '',
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:150.0) Gecko/20100101 Firefox/150.0',
        ]);
    }

    private function extractCookies($rawResponse) {
        preg_match_all('/^set-cookie:\s*([^;\r\n]+)/mi', $rawResponse, $matches);
        $cookies = [];
        foreach ($matches[1] as $cookie) {
            [$name, $value] = explode('=', $cookie, 2);
            $cookies[trim($name)] = trim($value);
        }
        return $cookies;
    }

    private function extractBody($rawResponse) {
        $pos = strpos($rawResponse, "\r\n\r\n");
        return $pos !== false ? trim(substr($rawResponse, $pos + 4)) : trim($rawResponse);
    }

    private function extractLocation($rawResponse) {
        preg_match('/^location:\s*(.+)$/mi', $rawResponse, $match);
        return isset($match[1]) ? trim($match[1]) : '';
    }

    private function cookieHeader($cookies) {
        $parts = [];
        foreach ($cookies as $name => $value) {
            $parts[] = $name . '=' . $value;
        }
        return 'Cookie: ' . implode('; ', $parts);
    }

    public function request($method, $url, $data = null, $headers = []) {
        curl_setopt($this->curl, CURLOPT_URL, $url);
        curl_setopt($this->curl, CURLOPT_ENCODING, '');
        curl_setopt($this->curl, CURLOPT_HTTPHEADER, array_merge([
            'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language: pl-PL,pl;q=0.9',
        ], $headers));

        if ($method === 'POST') {
            curl_setopt($this->curl, CURLOPT_POST, true);
            curl_setopt($this->curl, CURLOPT_POSTFIELDS, $data);
        } else {
            curl_setopt($this->curl, CURLOPT_HTTPGET, true);
        }

        $response = curl_exec($this->curl);
        $httpCode = curl_getinfo($this->curl, CURLINFO_HTTP_CODE);
        $headerSize = curl_getinfo($this->curl, CURLINFO_HEADER_SIZE);

        $headersRaw = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);

        return [
            'body'      => $headersRaw . "\r\n\r\n" . $body,
            'http_code' => $httpCode,
        ];
    }

    private function follow($url, $cookies, $method = 'GET', $data = null, $headers = [], $stopAt = null) {
        $maxRedirects = 10;
        $currentUrl = $url;
        $response = null;

        for ($i = 0; $i < $maxRedirects; $i++) {
            $reqHeaders = array_merge([
                'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language: pl-PL,pl;q=0.9',
                $this->cookieHeader($cookies),
            ], $headers);

            if ($method === 'POST' && $data) {
                $response = $this->request('POST', $currentUrl, $data, $reqHeaders);
                $method = 'GET';
                $data = null;
            } else {
                $response = $this->request('GET', $currentUrl, null, $reqHeaders);
            }

            $newCookies = $this->extractCookies($response['body']);
            $cookies = array_merge($cookies, $newCookies);

            $location = $this->extractLocation($response['body']);

            echo "  follow[$i] HTTP: " . $response['http_code'] . " URL: " . $currentUrl . "\n";
            if (!empty($newCookies)) {
                echo "  follow[$i] new cookies: " . implode(', ', array_keys($newCookies)) . "\n";
            }

            if ($stopAt && strpos($currentUrl, $stopAt) !== false) {
                echo "  follow[$i] STOP - znaleziono: $stopAt\n";
                break;
            }

            if (empty($location) || $response['http_code'] === 200) {
                break;
            }

            if (strpos($location, 'http') !== 0) {
                $parsed = parse_url($currentUrl);
                $location = $parsed['scheme'] . '://' . $parsed['host'] . $location;
            }

            $currentUrl = $location;
        }

        return ['body' => $response['body'], 'cookies' => $cookies, 'url' => $currentUrl];
    }

    public function login($username, $password) {
        $cookies = [];

        echo "=== Inicjalizacja OAuth ===\n";
        $r1 = $this->follow('https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata', $cookies);
        $cookies = $r1['cookies'];

        echo "=== POST logowanie ===\n";
        $r2 = $this->follow(
            'https://api.librus.pl/OAuth/Authorization/Grant?client_id=46',
            $cookies,
            'POST',
            http_build_query(['action' => 'login', 'login' => $username, 'pass' => $password]),
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Referer: https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata',
            ]
        );
        $cookies = $r2['cookies'];

        $body2 = $this->extractBody($r2['body']);
        echo "POST body: " . $body2 . "\n";

        $json = json_decode($body2, true);
        if (!$json || ($json['status'] ?? '') !== 'ok') {
            throw new Exception('POST nieudany: ' . $body2);
        }

        echo "=== 2FA flow ===\n";
        $goToUrl = 'https://api.librus.pl' . $json['goTo'];
        $r3 = $this->follow($goToUrl, $cookies, 'GET', null, [
            'Referer: https://api.librus.pl/OAuth/Authorization/Grant?client_id=46',
        ], 'synergia.librus.pl/loguj/portalRodzina');

        // Cookies z follow[3] zawierają już sesję synergia
        $allCookies = $r3['cookies'];
        echo "Final URL: " . $r3['url'] . "\n";

        // Użyj cookies z tego momentu - są już ustawione przez synergia
        $synCookies = [];
        if (isset($allCookies['SDZIENNIKSID'])) $synCookies['SDZIENNIKSID'] = $allCookies['SDZIENNIKSID'];
        if (isset($allCookies['DZIENNIKSID'])) $synCookies['DZIENNIKSID'] = $allCookies['DZIENNIKSID'];

        echo "Synergia cookies: " . implode(', ', array_keys($synCookies)) . "\n";

        $this->cookies = $synCookies;
        return true;
    }

    private function parseGrades($html) {
        $dom = new DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML($html);
        libxml_clear_errors();

        $xpath = new DOMXPath($dom);
        $grades = [];

        $rows = $xpath->query('//table[contains(@class,"decorated")]//tr');

        foreach ($rows as $row) {
            $cells = $xpath->query('.//td', $row);
            if ($cells->length > 0) {
                $rowData = [];
                foreach ($cells as $cell) {
                    $rowData[] = trim($cell->textContent);
                }
                $grades[] = $rowData;
            }
        }

        return $grades;
    }

    public function getGrades() {
        echo "Cookies do grades: " . implode(', ', array_keys($this->cookies)) . "\n";

        $result = $this->request('GET', 'https://synergia.librus.pl/przegladaj_oceny/uczen', null, [
            $this->cookieHeader($this->cookies),
        ]);

        $body = $this->extractBody($result['body']);
        file_put_contents('/Users/mikolaj/Coding/lekcje/aplikacje serwerowe/mendela/librus/grades.html', $body);
        echo "Grades HTTP: " . $result['http_code'] . "\n";
        echo "Grades body length: " . strlen($body) . "\n";
        echo "Pierwsze 500 znaków: " . substr($body, 0, 500) . "\n";

        return $this->parseGrades($body);
    }
}

// Użycie:
ob_start();

try {
    $librus = new LibrusClient();
    $librus->login('10264154u', 'Mikolaj1324');
    echo "Zalogowano!\n";

    $grades = $librus->getGrades();

    echo '<pre>';
    print_r($grades);
    echo '</pre>';

} catch (Exception $e) {
    echo 'Błąd: ' . $e->getMessage();
}

$output = ob_get_clean();
file_put_contents('/Users/mikolaj/Coding/lekcje/aplikacje serwerowe/mendela/librus/debug.txt', $output);
echo $output;