@echo off
set url=ws://localhost:8080
set /p url=What is the url of the MSX server? [ws://localhost:8080]
echo { "url": "%url%"} > connectionDetails.json
