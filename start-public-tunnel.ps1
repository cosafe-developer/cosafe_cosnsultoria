$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$port = if ($env:PORT) { $env:PORT } else { '8091' }
$binary = Join-Path $root 'tools\cloudflared.exe'
if (-not (Test-Path -LiteralPath $binary)) { throw 'Falta tools\cloudflared.exe. Descárgalo desde la versión oficial de Cloudflare.' }
$env:PORT = $port
$serverReady = Test-NetConnection -ComputerName 127.0.0.1 -Port ([int]$port) -InformationLevel Quiet -WarningAction SilentlyContinue
if (-not $serverReady) {
    Start-Process -FilePath 'node.exe' -ArgumentList 'server.js' -WorkingDirectory $root -WindowStyle Hidden
    Start-Sleep -Seconds 2
}
$log = Join-Path $env:TEMP 'cosafe-cloudflared-restart.log'
if (Test-Path -LiteralPath $log) { Remove-Item -LiteralPath $log -Force }
Start-Process -FilePath $binary -ArgumentList @('tunnel','--url',"http://127.0.0.1:$port",'--no-autoupdate') -WorkingDirectory $root -WindowStyle Hidden -RedirectStandardError $log
Start-Sleep -Seconds 8
$match = Select-String -LiteralPath $log -Pattern 'https://[a-z0-9-]+\.trycloudflare\.com' | Select-Object -First 1
if ($match) { Write-Host "Comparte este enlace temporal: $($match.Matches[0].Value)" -ForegroundColor Green }
else { Write-Host 'El túnel inició, pero aún no publicó la URL. Revisa:' $log -ForegroundColor Yellow }
