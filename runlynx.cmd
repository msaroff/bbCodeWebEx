@echo off
@rem this is simply a way to call lynx in a simplified manner
@rem set to dump output to file in UTF-8 and width prevents clipping
"%userprofile%\Documents\github\bbcodewebex\Lynx\lynx.exe" -dump -width 300 -cfg="%userprofile%\Documents\github\bbcodewebex\lynx\lynx.cfg" %1 
