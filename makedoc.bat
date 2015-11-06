rem echo off
set SPRINTDIR=%~dp0
set ASCIIDOCDIR=.\tools\asciidoc-8.6.9\
set PLANTUMLDIR=.\tools\
set SRCDOCDIR=./srcdoc/

@echo ///////////////////////////////////////////////////////
@echo // COMPILATION des documentations
@echo ///////////////////////////////////////////////////////
java -jar %PLANTUMLDIR%plantuml.jar -Tpng -o %SRCDOCDIR%images %SRCDOCDIR%diag0.puml

c:\Python27\python.exe %ASCIIDOCDIR%asciidoc.py -a iconsdir=../%ASCIIDOCDIR%/images/icons --backend slidy presentationFinale.asc


PAUSE