Rem gives skips first and last line of text file
powershell.exe "get-content c:\matthews\linesel.txt|select-object -skip 1 | select-object -skiplast 1"
pause
