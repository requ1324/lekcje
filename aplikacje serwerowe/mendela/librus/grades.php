<?php 
public function getGrades() {
    $result = $this->request('GET', 'https://synergia.librus.pl/przegladaj_oceny/uczen');
    echo $result['body'];
    die();
}
?>