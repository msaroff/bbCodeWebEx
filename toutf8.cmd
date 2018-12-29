rem excel does not export as UTF 8.  This run in powershell does
rem this takes a file and outputs it as utf-8 in the utf8 subdirectory
powershell "get-content C:\Moo\bbCodeWebex_Temp\de.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\de.csv"
pause
dir /p
pause

