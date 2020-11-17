#!/usr/bin/perl

use Date::Calc qw(Day_of_Week Week_of_Year);
use JSON::XS;
use Geo::IP;
use Digest::SHA qw(hmac_sha256_base64);
use Storable;

$gi4 = Geo::IP->open("/usr/share/GeoIP/GeoIP.dat", GEOIP_MEMORY_CACHE);
$gi6 = Geo::IP->open("/usr/share/GeoIP/GeoIPv6.dat", GEOIP_MEMORY_CACHE);

$sttime = time;
$json_coder = JSON::XS->new->utf8(1)->pretty(1);

$reportName = @ARGV[0] || full;

@referrerUrlRegexp = (
        [qr|^(https?://)?(www\.)?|,'""'],
        [qr|/.*$|,'""'],
        [qr|^(https?://)?[a-z].*matchid.io?$|,'"matchid.io"'],
        [qr/^(.*\.)?google(usercontent)?\.(com|fr)(\/.*)?$/, '"google.com"'],
        [qr/^(.*\.)?facebook\.com(\/.*)?$/, '"facebook.com"']
);

@requestRegexp = (
        [qr/\s+\S+\s*$/, '""'],
        [qr/^GET \/.*\.(css|css.map)$/, '"static: css"'],
        [qr/^GET \/.*\.(js|json|js.map)$/, '"static: javascript"'],
        [qr/^GET \/.*(\.(png|svg|woff2)|favicon)$/, '"static: images"'],
        [qr/^(GET|HEAD) (\/\w+)?(\W\S+)?$/, '"page: $2 ($1)"'],
        [qr|^(\S+) /[^/]*/api/v(\d)/((\w+)+(/\w+)?)(/\S+)?$|, '"api: $3 $1 $2"'],
        [qr|^/.*$'|, 'wrong calls']
);

@browserRegexp = (
  [qr/^.*(IEMobile|MSIE|Trident\/7.0).*$/, '"MSIE"'],
  [qr/^.*Edge?.*$/,'"Edge"'],
  [qr/^.*(Opera|OPR|OPiOS|Coast).*$/, '"Opera"'],
  [qr/^.*(AdsBot-Google|AppEngine-Google|DowntimeDetector|Mediapartners-Google|LinkedIn|PHP|(P|p)ython|(r|R)uby|Google|WhatsApp|AppleBot|facebookexternalhit|Twitter).*$/, '"Crawlers"'],
  [qr/^.*(Iceweasel|Focus|Klar|Firefox).*$/, '"Firefox"'],
  [qr/^.*(HeadlessChrome|Chrome|CriOS).*$/, '"Chrome"'],
  [qr/^.*Safari.*$/,'"Safari"'],
  [qr/^.*(botBot).*$/, '"Crawlers"'],
  [qr/^.* .*$/,'"Others"']
);

%reportKey = (
    'browsers' => 'browser',
    'requests' => 'requestCategory',
    'referring_sites' => 'from',
    'visit_time' => 'hh',
    'geolocation' => 'geolocation',
    'day_of_week' => 'dow',
    'hour_of_day_of_week' => 'dowh'
);


sub replaceRegexp {
    ($str, @regexp) = @_;
    if ($dic{$str}) {
        # cache
        return $dic{$str};
    };
    $result=$str;
    foreach $re (@regexp) {
        $result =~ s/@{$re}[0]/@{$re}[1]/ee;
    }
    $dic{$str} = $result;
    return $result;
}

sub addReportItem {
    my %item=();
    $item{'data'} = $dval;
    $item{'hits'}{'count'} = $c{$var}{$val}{'hits'};
    $item{'bytes'}{'count'} = $c{$var}{$val}{'bytes'};
    if ($c{$var}{$val}{'duration'} && $c{$var}{$val}{'hits_duration'}) {
        $item{'duration'}{'mean'} = $c{$var}{$val}{'duration'}/$c{$var}{$val}{'hits_duration'};
    }
    $item{'visitors'}{'count'} = scalar keys(%{$c{$var}{$val}{'visitors'}});
    push(@{$report{$key}{'data'}}, \%item);
}

sub buildKeyReport {
    $report{$key}{'data'}=[];
    foreach $val (sort(keys(%{$c{$var}}))) {
        $dval = $val;
        $dval =~ s/^$c{'current'}{$range}:\s*//;
        if ((!($var =~ /^y(m|w)(d(hm?)?)?$/)) || ($val =~ /^$c{'current'}{$range}/ )) {
            &addReportItem;
            if (!($reportName eq 'day') && (!($var =~ /${range}(d|h)?$/)) || ($range eq 'yw')) {
                # print "delete $var $val\n";
                delete($c{$var}{$val});
            } else {
                # print "not deleted $key $range $c{'current'}{$range} $var $val\n";
            }
        }
    }
}

sub flushResults {
    local $range, $var, $dvar, $key, @data, $item;
    ($range) = @_;

    if ($range eq '') {
        $report{'general'}{'total_requests'} = $c{'general'}{'general'}{'hits'};
        $report{'general'}{'bandwidth'} = $c{'general'}{'general'}{'bytes'};
        $report{'general'}{'failed_requests'} = $c{'general'}{'general'}{'failed'};
        $report{'general'}{'unique_visitors'} = scalar keys(%{$c{'general'}{'general'}{'visitors'}});
    } else {
        $report{'general'}{'total_requests'} = $c{$range}{$c{'current'}{$range}}{'hits'};
        $report{'general'}{'bandwidth'} = $c{$range}{$c{'current'}{$range}}{'bytes'};
        $report{'general'}{'failed_requests'} = $c{$range}{$c{'current'}{$range}}{'failed'};
        $report{'general'}{'unique_visitors'} = scalar keys(%{$c{$range}{$c{'current'}{$range}}{'visitors'}});
    }

    foreach $key (keys(%reportKey)) {
        if ($range eq '') {
            $var = $reportKey{$key};
        } else {
            $var = sprintf("%s_%s",${range},$reportKey{$key});
        }
        &buildKeyReport;
    }

    $key = 'visitors';
    $var = $range;
    $var =~ s/d$/dh/;
    $var =~ s/(m|w)$/$1d/;
    if ($range eq '') {
        if ($reportName eq 'day') {
            $var =~ s/^$/ymdh/;
        } else {
            $var =~ s/^$/ymd/;
        }
    }
    &buildKeyReport;

    open(F, '>', sprintf("$stats_dir/%s.json", $c{'current'}{$range} || $reportName));
    print F $json_coder->encode({%report});
    close(F);
    if (($range ne '') || ($reportName eq 'day')) {
        $key = 'visitors';
        $var = $range;
        $var =~ s/d$/dhm/;
        $var =~ s/y(m|w)$/y$1dh/;
        $var =~ s/^$/ymdhm/;
        &buildKeyReport;

        open(F, '>', sprintf("$stats_dir/%s-detailed.json", $c{'current'}{$range} || $reportName));
        print F $json_coder->encode({%report});
        close(F);
    }

    undef %{$report};

    # print "$var $key - remaining keys after report:\n".join("\n", map($_.": ".join(" ; ",keys(%{$c{$_}})),keys(%c)))."\n\n";
}

@days=qw/lun mar mer jeu ven sam dim/;
%months = (
    'Jan' => 1,
    'Feb' => 2,
    'Mar' => 3,
    'Apr' => 4,
    'May' => 5,
    'Jun' => 6,
    'Jul' => 7,
    'Aug' => 8,
    'Sep' => 9,
    'Oct' => 10,
    'Nov' => 11,
    'Dec' => 12
);
$match = qr/\/(personnes-decedees|deces).matchid.io/;
$parse = qr/^(\S+) - (\S+) \[([^\]]*)\] "([^"]*)" (\d+) (\d+) "([^"]*)" "([^"]*)" "([^"]*)"( ([0-9\.-]+) ([0-9\.-]+|[0-9\.-]+, [0-9\.-]+) \.)?$/;
$parseDate = qr|^(\d{2})/(\S{3})/(\d{4}):(\d{2}):(\d{2})|;
# 07/Feb/2018:22:28:10 +0000

$general = 'general';

$db_dir=$ENV{'LOG_DB_DIR'} || './';
$stats_dir=$ENV{'STATS'} || './';

if ((-e "$db_dir/full.db") && ($reportName eq 'full')) {
    $h = retrieve("$db_dir/full.db");
    die "Unable to retrieve from 'full.db'\n" unless defined $h;
    %c = %{$h};
    print "restored from $c{'save_date'}\n";
    delete($c{'current'})
} else {
    $c{'save_date'} = 0;
}


while(<STDIN>){
    $i++;
    if (/$match/) {
        $m++;
        if (/$parse/) {
            $v++;
            ($ip,$user,$date,$request,$status,$size,$from,$browser,$ipfw,$duration,$remote_duration)=($1,$2,$3,$4,$5,$6,$7,$8,$9,$11,$12);
            if ($date =~ /$parseDate/) {
                ($day,$month,$year,$hh,$mm)=($1,$2,$3,$4,$5);
                $month = $months{$month};
                $tmp = $month;
                $month = sprintf("%02d", $month);
                $ym="$year$month";
                $ymd="$ym$day";
                if ($c{'save_date'} < $ymd) {
                    # print "not skipping $date $c{'restore'} $ymd\n";
                    $dow=@days[Day_of_Week($year,$tmp,$day) - 1];
                    undef $tmp;
                    ($week,$z)=Week_of_Year($year,$month,$day);
                    $week = sprintf("S%02d", $week);
                    $mm = sprintf("%02d",$mm);
                    $hh = sprintf("%02d",$hh);
                    $ymdh="${ymd}-${hh}00";
                    $ymdhm="${ymd}-$hh$mm";
                    $yw="$year$week";
                    $ywd="$yw-$month$day";
                    $ywdh="$ywd-${hh}00";

                    foreach $range (qw/ym ymd yw/) {
                        if ($$range ne $c{'current'}{$range}) {
                            if ($c{'current'}{$range}) {
                                if ($range eq 'ymd') {
                                    $c{'save_date'} = $c{'current'}{'ymd'};
                                    $st=time;
                                    $childPid = fork();
                                    if($childPid == 0) {
                                        store(\%c, "$db_dir/full.db");
                                        exit;
                                    }
                                    $et=time;
                                    if (($et-$st)>1) {
                                        printf("$c{'current'}{$range} storing time %d\n",$et-$st);
                                    }
                                }
                                &flushResults($range);
                            }
                            $c{'current'}{$range} = $$range;
                        }
                    }
                    $hh="${hh}00";
                    $dowh="$dow-$hh";

                    if ("$ipfw" eq "-") {
                        $ipfw = $ip;
                    }

                    $from=replaceRegexp($from, @referrerUrlRegexp);
                    $requestCategory=replaceRegexp($request, @requestRegexp);
                    if ($ipfw =~ /^\d+\.\d+\.\d+\.\d+$/) {
                        $geolocation=$gi4->country_code_by_addr($ipfw);
                    } else {
                        $geolocation=$gi6->country_code_by_addr_v6($ipfw);
                    }
                    $ipfw = substr(hmac_sha256_base64("$ipfw$browser"),0,16);

                    $browser=replaceRegexp($browser, @browserRegexp);

                    $ymd_from="$ymd: $from";
                    $ymd_requestCategory="$ymd: $requestCategory";
                    $ymd_browser="$ymd: $browser";
                    $ymd_geolocation="$ymd: $geolocation";

                    $yw_from="$yw: $from";
                    $yw_requestCategory="$yw: $requestCategory";
                    $yw_browser="$yw: $browser";
                    $yw_geolocation="$yw: $geolocation";

                    $ym_from="$ym: $from";
                    $ym_requestCategory="$ym: $requestCategory";
                    $ym_browser="$ym: $browser";
                    $ym_geolocation="$ym: $geolocation";

                    $ym_dow="$ym: $dow";
                    $ym_dowh="$ym: $dowh";
                    $ym_hh="$ym: $hh";
                    $yw_dow="$yw: $dow";
                    $yw_dowh="$yw: $dowh";
                    $yw_hh="$yw: $hh";

                    foreach $var (qw/general browser ym_browser yw_browser ymd_browser requestCategory ym_requestCategory ymd_requestCategory yw_requestCategory from ym_from ymd_from yw_from geolocation ymd_geolocation yw_geolocation ym_geolocation dow yw_dow ym_dow dowh ym_dowh yw_dowh hh ym_hh yw_hh day yw ywd ywdh ym ymd ymdh ymdhm/) {
                        $c{$var}{$$var}{'hits'}++;
                        $c{$var}{$$var}{'bytes'}+=int($size);
                        if ($duration) {
                            $c{$var}{$$var}{'hits_duration'}++;
                            $c{$var}{$$var}{'duration'}=$c{$var}{$$var}{'duration'}+$duration;
                        }
                        if ($status eq "404") {
                            $c{$var}{$$var}{'not_found'}++;
                        }
                        if ($status =~ /^50./) {
                            $c{$var}{$$var}{'failed'}++;
                        }
                        $c{$var}{$$var}{'visitors'}{$ipfw}++;
                    }
                } else {
                    # print "skipping $date $c{'restore'} $ymd\n";
                }
            } else {
                print "$date $dateParse failed\n";
            }
        }
    }

    if (!($i % 10000)) {
        $delay = time - $sttime;
        print STDERR sprintf("%s %s %s - total:%d matching:%d rate:%.0f/s failed:%d\r",$c{'current'}{'ym'},$c{'current'}{'yw'}, $c{'current'}{'ymd'},$i,$m,$delay && $m/$delay || 0,($m-$v));
        STDERR->flush();
    };
}

flushResults();


