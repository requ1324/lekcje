<?php 
    function formatDatePl($date){
        $df = new IntlDateFormatter(
            'pl_PL',
            IntlDateFormatter::LONG,
            IntlDateFormatter::SHORT,
            'Europe/Warsaw',
            null,
            'd MMMM yyyy, HH:mm'
        );
        return $df->format(new DateTime($date));
    }

    function toDateTime($date, $time){
        $dt = new DateTime();
        list($y,$m,$d) = explode("-",$date);
        list($h,$i)    = explode(":",$time);

        $dt->setDate($y,$m,$d);
        $dt->setTime($h,$i,0);
    return $dt->format("Y-m-d H:i:s");
}
    function getNowTimestamp(){
        return time();
    }

    function timestampToDate($ts){
        return date("Y-m-d H:i:s", $ts);
    }
?>
