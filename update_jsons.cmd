@rem Runs a customized configureation of the lynx browser in order to  
@rem convert html exported from Excel into a UTF-8 Json File.  Calls 
@rem Runlynx to deal with long directory names to call Browser
@rem it then takes the files and dumps them to the appropriate add-on
@rem directory.
@ rem %userprofile%\Documents\github\bbcodewebex\Lynx\lynx.exe -cfg=%userprofile%\Documents\github\bbcodewebex\lynx\lynx.cfg -dump -width 300 .\DefMenu.htm > DefMenu.json
call runlynx C:\Moo\bbCodeWebex_Temp\en-US.htm > C:\Moo\bbCodeWebex_Temp\utf8\en-US.json
call runlynx C:\Moo\bbCodeWebex_Temp\de.htm > C:\Moo\bbCodeWebex_Temp\utf8\de.json
call runlynx C:\Moo\bbCodeWebex_Temp\es-ES.htm > C:\Moo\bbCodeWebex_Temp\utf8\es-ES.json
call runlynx C:\Moo\bbCodeWebex_Temp\fi.htm > C:\Moo\bbCodeWebex_Temp\utf8\fi.json
call runlynx C:\Moo\bbCodeWebex_Temp\fr.htm > C:\Moo\bbCodeWebex_Temp\utf8\fr.json
call runlynx C:\Moo\bbCodeWebex_Temp\he.htm > C:\Moo\bbCodeWebex_Temp\utf8\he.json
call runlynx C:\Moo\bbCodeWebex_Temp\it.htm > C:\Moo\bbCodeWebex_Temp\utf8\it.json
call runlynx C:\Moo\bbCodeWebex_Temp\ja.htm > C:\Moo\bbCodeWebex_Temp\utf8\ja.json
call runlynx C:\Moo\bbCodeWebex_Temp\ko.htm > C:\Moo\bbCodeWebex_Temp\utf8\ko.json
call runlynx C:\Moo\bbCodeWebex_Temp\pl.htm > C:\Moo\bbCodeWebex_Temp\utf8\pl.json
call runlynx C:\Moo\bbCodeWebex_Temp\pt-BR.htm > C:\Moo\bbCodeWebex_Temp\utf8\pt-BR.json
call runlynx C:\Moo\bbCodeWebex_Temp\pt-PT.htm > C:\Moo\bbCodeWebex_Temp\utf8\pt-PT.json
call runlynx C:\Moo\bbCodeWebex_Temp\ru.htm > C:\Moo\bbCodeWebex_Temp\utf8\ru.json
call runlynx C:\Moo\bbCodeWebex_Temp\sk.htm > C:\Moo\bbCodeWebex_Temp\utf8\sk.json
call runlynx C:\Moo\bbCodeWebex_Temp\sr.htm > C:\Moo\bbCodeWebex_Temp\utf8\sr.json
call runlynx C:\Moo\bbCodeWebex_Temp\th.htm > C:\Moo\bbCodeWebex_Temp\utf8\th.json
call runlynx C:\Moo\bbCodeWebex_Temp\zh-TW.htm > C:\Moo\bbCodeWebex_Temp\utf8\zh-TW.json
call runlynx C:\Moo\bbCodeWebex_Temp\DefMenu.htm > C:\Moo\bbCodeWebex_Temp\utf8\DefMenu.json
pause

