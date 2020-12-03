#!/usr/bin/perl
# $debug = 1;
# use Devel::Size qw(size total_size);

use Date::Calc qw(Day_of_Week Week_of_Year);
use JSON::XS;
use Geo::IP;
use Digest::SHA qw(hmac_sha256_base64);
use Storable;


$gi4 = Geo::IP->open("/usr/share/GeoIP/GeoIP.dat", GEOIP_MEMORY_CACHE);
$gi6 = Geo::IP->open("/usr/share/GeoIP/GeoIPv6.dat", GEOIP_MEMORY_CACHE);

$json_coder = JSON::XS->new->utf8(1)->pretty(1);

$reportName = @ARGV[0] || full;

@referrerUrlRegexp = (
        [qr|^(https?://)?(www\.)?|,'""'],
        [qr|/.*$|,'""'],
        [qr|\d+.\d+.\d+.\d+(:\d+)?$|,'"internal"'],
        [qr|^(https?://)?[a-z].*matchid.io?$|,'"matchid.io"'],
        [qr/^(.*\.)?google(usercontent)?\.(com|fr)(\/.*)?$/, '"google.com"'],
        [qr/^(.*\.)?facebook\.com(\/.*)?$/, '"facebook.com"']
);

@requestRegexp = (
        [qr/\s+\S+\s*$/, '""'],
        [qr/^(GET|POST) \/.*php.*$/i, '"hacking"'],
        [qr/^(GET|OPTIONS) \/.*\.(css|css.map)$/, '"static: css"'],
        [qr/^(GET|OPTIONS) \/.*\.(js|json|js.map)$/, '"static: javascript"'],
        [qr/^(GET|OPTIONS)\s*\/.*(png|svg|woff2|favicon)$/, '"static: images"'],
        [qr|^(\S+) /matchID.*/api/v(\d)/((\w+)+(/\w+)?)(/\S+)?$|, '"api: matchID"'],
        [qr|^(\S+) /[^/]*/api/v(\d)/((\w+)+(/\w+)?)(/\S+)?$|, '"api: $3 $1 $2"'],
        [qr/^(GET|OPTIONS|HEAD|CONNECT) \/(\?.*)?$/, '"page: /search ($1)"'],
        [qr/^(GET|HEAD|OPTIONS|POST|CONNECT)\s*\/(atom|feed|.*edit.*|rss|login|cgi|authorize|clientaccesspolicy|browserconfig|solr|weaver|view|secure|servlet|manager).*$/, '"hacking"'],
        [qr/^(GET|HEAD|OPTIONS|POST|CONNECT) (\/\w+)?(\W\S+)?$/, '"page: $2 ($1)"'],
        [qr/^(GET|HEAD|OPTIONS|POST|CONNECT) .*$/i, '"hacking"'],
        [qr/^\S+$/i, '"hacking"'],
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
    # 'visit_time' => 'hh',
    'geolocation' => 'geolocation',
    # 'day_of_week' => 'dow',
    'hour_of_day_of_week' => 'dowh'
);


sub replaceRegexp {
    ($str, $cachename, @regexp) = @_;
    if ($cache{$cachename}{$str}) {
        # cache
        return $cache{$cachename}{$str};
    };
    $result=$str;
    foreach $re (@regexp) {
        $result =~ s/@{$re}[0]/@{$re}[1]/ee;
    }
    $cache{$cachename}{$str} = $result;
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
    if (($var eq 'ymd') && (($range eq 'ym') || ($range eq '')) && ($val ne $c{'current'}{'ymd'})) {
        # memory spare hack for past ymd
        $item{'visitors'}{'count'} = $c{$var}{$val}{'visitors'};
    } else {
        if ($c{$var}{$val}{'visitors'}{'prune_count'}) {
            # memory spare for low counts
            $item{'visitors'}{'count'} = scalar keys(%{$c{$var}{$val}{'visitors'}}) - 1 + $c{$var}{$val}{'visitors'}{'prune_count'};
        } else {
            $item{'visitors'}{'count'} = scalar keys(%{$c{$var}{$val}{'visitors'}});
        }
    }
    push(@{$report{$key}{'data'}}, \%item);
}

sub buildKeyReport {
    $report{$key}{'data'}=[];
    foreach $val (sort(keys(%{$c{$var}}))) {
        $dval = $val;
        $dval =~ s/^$c{'current'}{$range}:\s*//;
        if ((!($var =~ /^y(m|w)(d(hm?)?)?$/)) || ($val =~ /^$c{'current'}{$range}/ )) {
            &addReportItem;
            if (!($reportName eq 'day') && (!($var =~ /${range}d?$/)) || ($range eq 'yw')) {
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
        if ($c{'general'}{'general'}{'visitors'}{'prune_count'}) {
            $report{'general'}{'unique_visitors'} = (scalar keys(%{$c{'general'}{'general'}{'visitors'}})) - 1 + $c{'general'}{'general'}{'visitors'}{'prune_count'}
        } else {
            $report{'general'}{'unique_visitors'} = scalar keys(%{$c{'general'}{'general'}{'visitors'}});
        }
    } else {
        $report{'general'}{'total_requests'} = $c{$range}{$c{'current'}{$range}}{'hits'};
        $report{'general'}{'bandwidth'} = $c{$range}{$c{'current'}{$range}}{'bytes'};
        $report{'general'}{'failed_requests'} = $c{$range}{$c{'current'}{$range}}{'failed'};
        if ($c{$range}{$c{'current'}{$range}}{'visitors'}{'prune_count'}) {
            $report{'general'}{'unique_visitors'} = (scalar keys(%{$c{$range}{$c{'current'}{$range}}{'visitors'}})) - 1 + $c{$range}{$c{'current'}{$range}}{'visitors'}{'prune_count'};
        } else {
            $report{'general'}{'unique_visitors'} = scalar keys(%{$c{$range}{$c{'current'}{$range}}{'visitors'}});
        }
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

    undef(%report);

    # memory spare hacks
    undef(%cache);
    if ($range eq 'ymd') {
        # uniq visitors for past days do not need to be fully kept
        $c{'ymd'}{$c{'current'}{'ymd'}}{'visitors'} = scalar keys(%{$c{'ymd'}{$c{'current'}{'ymd'}}{'visitors'}});
    }
    if ($range eq 'yw') {
        $c{'yw'}{$c{'current'}{'yw'}}{'visitors'} = scalar keys(%{$c{'yw'}{$c{'current'}{'yw'}}{'visitors'}});
    }
    if ($range eq 'ym') {
        $c{'ym'}{$c{'current'}{'ym'}}{'visitors'} = scalar keys(%{$c{'ym'}{$c{'current'}{'ym'}}{'visitors'}});
        # monthly aggregate lowcounts of previous month in general counts, not keeping all uniq ipfw
        foreach $var (qw/general browser requestCategory dowh geolocation from/) {
            foreach $val (keys(%{$c{$var}})) {
                foreach $ipfw (keys(%{$c{$var}{$val}{'visitors'}})) {
                    if ($ipfw ne 'prune_count') {
                        if ($c{$var}{$val}{'visitors'}{$ipfw} < 1000) {
                            # keep only regular visitors
                            $c{$var}{$val}{'visitors'}{'prune_count'}++;
                            delete($c{$var}{$val}{'visitors'}{$ipfw});
                        }
                    }
                }
            }
        }
    }
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
$match = qr/\[..\/...\/202[0-9]:/;
$parse = qr/^(\S+) - (\S+) \[([^\]]*)\] "([^"]*)" (\d+) (\d+) "([^"]*)" "([^"]*)" "([^"]*)"( ([0-9\.-]+) ([0-9\.-]+|[0-9\.-]+, [0-9\.-]+) \.)?$/;
$parseDate = qr|^(\d{2})/(\S{3})/(\d{4}):(\d{2}):(\d{2})|;
$ip4 = qr/^\d+\./;
# 07/Feb/2018:22:28:10 +0000

$general = 'general';

$db_dir=$ENV{'LOG_DB_DIR'} || './';
$stats_dir=$ENV{'STATS'} || './';

if ((-e "$db_dir/full.db") && ($reportName eq 'full')) {
    $h = retrieve("$db_dir/full.db");
    die "Unable to retrieve from 'full.db'\n" unless defined $h;
    %c = %{$h};
    print "restored from $c{'save_date'}\n";
    delete($c{'current'});
} else {
    $c{'save_date'} = 0;
}


while(<STDIN>){
    $i++;
    if (/$match/) {
        if (not defined($sttime)) {
            $sttime = time;
            $reporttime = $sttime;
        }
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

                    foreach $range (qw/ymd ym yw/) {
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

                    $from=replaceRegexp($from,'referrer', @referrerUrlRegexp);
                    $requestCategory=replaceRegexp($request, 'request', @requestRegexp);
                    if ($ipfw =~ /$ip4/) {
                        $geolocation=$gi4->country_code_by_addr($ipfw);
                    } else {
                        $geolocation=$gi6->country_code_by_addr_v6($ipfw);
                    }
                    $ipfw = substr(hmac_sha256_base64("$ipfw$browser"),0,8);

                    $browser=replaceRegexp($browser, 'browser', @browserRegexp);

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

                    # $ym_dow="$ym: $dow";
                    $ym_dowh="$ym: $dowh";
                    # $ym_hh="$ym: $hh";
                    # $yw_dow="$yw: $dow";
                    $yw_dowh="$yw: $dowh";
                    # $yw_hh="$yw: $hh";

                    foreach $var (qw/general browser ym_browser yw_browser ymd_browser requestCategory ym_requestCategory ymd_requestCategory yw_requestCategory from ym_from ymd_from yw_from geolocation ymd_geolocation yw_geolocation ym_geolocation dowh ym_dowh yw_dowh yw ywd ywdh ym ymd ymdh ymdhm/) {
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

    if (!($i % 1000) && ((time - $reporttime)>1)) {
        $reporttime = time;
        $delay = time - $sttime;
        if ($debug) {
            $status="\033[2J";
            $status.="\033[0;0H";
        } else {
            $status="\r";
        }
        $mem = `ps -q $$ -o drs `;
        $mem =~ s/.*//;
        $status.=sprintf("%s %s %s - total:%d matching:%d rate:%.0f/s mem: %d failed:%d",$c{'current'}{'ym'},$c{'current'}{'yw'}, $c{'current'}{'ymd'},$i,$m,$delay && $m/$delay || 0,$mem, ($m-$v));
        if ($debug) {
            $status.=sprintf("hash: %d, cache: %d %d %d\n", total_size($report), total_size($cache{'browser'}), total_size($cache{'request'}), total_size($cache{'referrer'}));
            foreach $scope (qw/yw ym ymd dowh|requestCategory|browser|general|geolocation|from/) {
                $scopemem = 0;
                $scopekeys = 0;
                if ($scope =~ /general/) {
                    $scopename = 'general';
                } else {
                    $scopename = $scope;
                }
                foreach $key (grep(/^($scope)(_|(hm?|dh?)?$)/, keys(%c))) {
                    $vv = 0;
                    $mem = 0;
                    foreach $v (keys(%{$c{$key}})) {
                        $vv+=scalar keys(%{$c{$key}{$v}{'visitors'}});
                        $mem += total_size($c{$key}{$v});
                    }
                    $stats{$scopename}{$key}{'mem'}=$mem + total_size($c{$key});
                    $stats{$scopename}{$key}{'keys'}=$vv;
                    $scopekeys += $vv;
                    $scopemem += $mem + total_size($c{$key});
                }
                $stats{$scopename}{'mem'}=$scopemem;
                $stats{$scopename}{'keys'}=$scopekeys;
            }
            foreach $scope (keys(%stats)) {
                $status.=sprintf("%s %dM %dk :\t",$scope,$stats{$scope}{'mem'}/1000000,$stats{$scope}{'keys'}/1000);
                foreach $key (keys(%{$stats{$scope}})) {
                    $p = 100 * $stats{$scope}{$key}{'mem'}/(1+$stats{$scope}{'mem'});
                    if ($p > 10) {
                        $status.=sprintf("%s %.0f%\t", $key, $p);
                    }
                }
                $status.="\n";
            }

            # foreach $r (keys(%{$c{'requestCategory'}})) {
            #     $status.=$r."\n";
            # }
            $status.="\n";
        }
        $stats={};
        print STDERR $status;
        STDERR->flush();
    };
}

flushResults();


