@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.2.0
@REM
@REM Optional ENV vars
@REM   JAVA_HOME - location of a JDK home dir, if not set "java" must be in the PATH
@REM   MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM                e.g. to debug Maven itself, use
@REM                  set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM   MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@echo off
@setlocal

set "ERROR_CODE=0"

@REM To isolate internal variables from possible pre-existing ones, reset them now.
set "MAVEN_HOME="
set "MAVEN_PROJECTBASEDIR="
set "MAVEN_ARG_LINE="

@REM ==== START VALIDATION ====
if not "%JAVA_HOME%" == "" goto OkJava

set "JAVA_EXE=java.exe"
%JAVA_EXE% -version >NUL 2>&1
if "%ERROR_CODE%" == "0" goto OkJava

echo.
echo Error: JAVA_HOME is not defined correctly.
echo   We cannot execute %JAVA_EXE%
echo.
goto error

:OkJava
if not "%JAVA_HOME%" == "" set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"

@REM ==== END VALIDATION ====

@REM Find the project base dir, i.e. the directory that contains the folder ".mvn".
@REM Fallback to current working directory if not found.

set "MAVEN_PROJECTBASEDIR=%CD%"
:findBaseDir
if exist "%MAVEN_PROJECTBASEDIR%\.mvn" goto baseDirFound
set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR%\.."
if not "%MAVEN_PROJECTBASEDIR%" == "..\.." goto findBaseDir

set "MAVEN_PROJECTBASEDIR=%CD%"

:baseDirFound

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"
set "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

@REM Download the wrapper jar if it doesn't exist
if exist "%WRAPPER_JAR%" goto run

set "DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

echo Downloading %DOWNLOAD_URL%
powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $webclient = New-Object System.Net.WebClient; $webclient.DownloadFile('%DOWNLOAD_URL%', '%WRAPPER_JAR%') }"
if not "%ERROR_CODE%" == "0" goto error

:run
set "MAVEN_ARG_LINE=%*"

"%JAVA_EXE%" %MAVEN_OPTS% -classpath "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %WRAPPER_LAUNCHER% %MAVEN_ARG_LINE%
if %ERRORLEVEL% NEQ 0 goto error
goto end

:error
set "ERROR_CODE=1"

:end
@endlocal & set "ERROR_CODE=%ERROR_CODE%"
exit /B %ERROR_CODE%
