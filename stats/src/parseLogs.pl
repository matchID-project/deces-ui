#!/usr/bin/perl

use Date::Parse;

while(<>){
    if (/(\S+) - - \[([^\]]*)\] "(GET|POST|\S+) (\S+) (HTTP\S+)" (\S+) (\S+) "([^"]*)" "([^"]*)" "(\S+)" (\S+) (\S+) \./){
        ($ip,$date,$method,$url,$http,$status,$size,$from,$nav,$ipfrom,$duration,$remote_duration)=($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);
        ($ss,$mm,$hh,$day,$month,$year,$zone) = strptime($date);
        print "$ip $date $ss $mm $hh $day $month $year $zone  $method $url $http $status $size $from $nav $ipfrom $duration $remote_duration\n";
    }
}