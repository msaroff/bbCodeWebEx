rem excel does not export properly UTF 8 csv for conversion to JSON.  This run in powershell does
rem This takes a file and outputs it as utf-8 in the utf8 subdirectory
Rem we will then convert the file to a CSV and copy it to the correct directory in the Github directory.
rem note that the first and the last line of the localizations are removed so that the additional 
rem open and close brackets are removed
rem import-csv -Delimiter "`t" ".\DefMenu.csv"|ConvertTo-Json -AsArray | % { [System.Text.RegularExpressions.Regex]::Unescape($_) } 
rem that last bit prevents the new lines from being excaped
rem C:\matthews\Lynx\App\Lynx\lynx.exe -cfg=C:\matthews\Lynx\App\DefaultData\LynxSettings\lynx.cfg -dump .\locale_bbcodemoo.htm>moo.txt
powershell "get-content C:\Moo\bbCodeWebex_Temp\en-US.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\en-US.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\de.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\de.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\es-ES.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\es-ES.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\fi.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\fi.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\fr.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\fr.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\he.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\he.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\it.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\it.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\ja.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\ja.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\ko.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\ko.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\pl.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\pl.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\pt-BR.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\pt-BR.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\pt-PT.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\pt-PT.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\ru.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\ru.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\sk.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\sk.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\sr.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\sr.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\th.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\th.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\zh-TW.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\zh-TW.csv"
powershell "get-content C:\Moo\bbCodeWebex_Temp\DefMenu.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\DefMenu.csv"
pause
dir C:\Moo\bbCodeWebex_Temp\utf8 /p
pause

