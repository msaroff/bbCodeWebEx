rem excel does not export as UTF 8.  This run in powershell does
get-content .\locale_bbcode.csv | out-file -encoding utf8 locale.csv
