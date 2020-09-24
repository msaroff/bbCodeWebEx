@rem Runs a customized configureation of the lynx browser in order to  
@rem convert html exported from Excel into a UTF-8 Json File.  Calls 
@rem Runlynx to deal with long directory names to call Browser
@rem it then takes the files and dumps them to the appropriate add-on
@rem directory.
@ rem %userprofile%\Documents\github\bbcodewebex\Lynx\lynx.exe -cfg=%userprofile%\Documents\github\bbcodewebex\lynx\lynx.cfg -dump -width 300 .\DefMenu.htm > DefMenu.json
call runlynx C:\Moo\bbCodeWebex_Temp\en-US.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\en-US\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\de.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\de\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\es-ES.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\es-ES\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\fi.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\fi\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\fr.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\fr\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\he.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\he\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\it.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\it\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\ja.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\ja\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\ko.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\ko\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\pl.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\pl\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\pt-BR.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\pt-BR\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\pt-PT.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\pt-PT\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\ru.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\ru\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\sk.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\sk\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\sr.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\sr\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\th.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\th\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\zh-TW.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\_locales\zh-TW\messages.json"
call runlynx C:\Moo\bbCodeWebex_Temp\DefMenu.htm > "%userprofile%\Documents\GitHub\bbCodeWebEx\data\DefMenu.json"
pause

