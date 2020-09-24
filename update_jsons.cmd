rem copy the JSONs from the temp directory to the appropriate bbCodeWebEx directory
rem get-content .\en-US.json|out-file -encoding utf8 .\meep
rem powershell "get-content C:\Moo\bbCodeWebex_Temp\ko.csv | out-file -encoding utf8 C:\Moo\bbCodeWebex_Temp\utf8\ko.csv"
rem generic documents directory  %userprofile%\Documents 
copy C:\Moo\bbCodeWebex_Temp\en-US.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\en-US\messages.json"
copy C:\Moo\bbCodeWebex_Temp\de.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\de\messages.json"
copy C:\Moo\bbCodeWebex_Temp\es-ES.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\es-ES\messages.json"
copy C:\Moo\bbCodeWebex_Temp\fi.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\fi\messages.json"
copy C:\Moo\bbCodeWebex_Temp\fr.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\fr\messages.json"
copy C:\Moo\bbCodeWebex_Temp\he.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\he\messages.json"
copy C:\Moo\bbCodeWebex_Temp\it.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\it\messages.json"
copy C:\Moo\bbCodeWebex_Temp\ja.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\ja\messages.json"
copy C:\Moo\bbCodeWebex_Temp\ko.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\ko\messages.json"
copy C:\Moo\bbCodeWebex_Temp\pl.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\pl\messages.json"
copy C:\Moo\bbCodeWebex_Temp\pt-BR.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\pt-BR\messages.json"
copy C:\Moo\bbCodeWebex_Temp\pt-PT.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\pt-PT\messages.json"
copy C:\Moo\bbCodeWebex_Temp\ru.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\ru\messages.json"
copy C:\Moo\bbCodeWebex_Temp\sk.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\sk\messages.json"
copy C:\Moo\bbCodeWebex_Temp\sr.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\sr\messages.json"
copy C:\Moo\bbCodeWebex_Temp\th.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\th\messages.json"
copy C:\Moo\bbCodeWebex_Temp\zh-TW.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\_locales\zh-TW\messages.json"
copy C:\Moo\bbCodeWebex_Temp\DefMenu.json "C:\Users\Matthew G. Saroff\Documents\GitHub\bbCodeWebEx\data\DefMenu.json"
pause

