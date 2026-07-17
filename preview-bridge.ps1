$ErrorActionPreference = 'Stop'
$port = if ($env:PORT) { $env:PORT } else { '8091' }
$root = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$env:PORT = $port
$existing = Test-NetConnection -ComputerName 127.0.0.1 -Port ([int]$port) -InformationLevel Quiet -WarningAction SilentlyContinue
if (-not $existing) {
    Start-Process -FilePath 'node.exe' -ArgumentList 'server.js' -WorkingDirectory $root -WindowStyle Hidden
    Start-Sleep -Seconds 2
}
$addresses = @(ipconfig | ForEach-Object { if ($_ -match 'IPv4[^:]*:\s*([0-9.]+)$') { $matches[1] } } |
    Where-Object { $_ -notlike '127.*' -and $_ -notlike '169.254.*' } | Select-Object -Unique)
Write-Host "CoSAFE bridge activo en esta computadora: http://127.0.0.1:$port" -ForegroundColor Green
foreach ($address in $addresses) { Write-Host "Comparte con dispositivos en la misma red: http://${address}:$port" -ForegroundColor Cyan }
Write-Host 'El dispositivo cliente debe estar conectado a la misma red Wi-Fi o LAN.' -ForegroundColor Yellow
