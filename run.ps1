param()

# PowerShell runner for the project.
# Tries: 1) `npx http-server`, 2) `python -m http.server`, 3) open local index.html

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Try-Set-Foreground {
    param($proc)
    try {
        Add-Type -Name Win32 -Namespace PInvoke -MemberDefinition @'
            [DllImport("user32.dll")]
            public static extern bool SetForegroundWindow(IntPtr hWnd);
'@ -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 500
        if ($proc -and $proc.MainWindowHandle -ne 0) {
            [PInvoke.Win32]::SetForegroundWindow($proc.MainWindowHandle) | Out-Null
        }
    } catch { }
}

Write-Output "Project root: $root"

# Helper: test if a URL responds
function Test-Url {
    param($url)
    try {
        $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Helper: wait for url up to $timeoutSec seconds
function Wait-For-Url {
    param($url, $timeoutSec=5)
    $start = [DateTime]::UtcNow
    while (([DateTime]::UtcNow - $start).TotalSeconds -lt $timeoutSec) {
        if (Test-Url $url) { return $true }
        Start-Sleep -Milliseconds 300
    }
    return $false
}

# Try npx/http-server (use cmd.exe to invoke npx for better reliability)
if (Get-Command npx -ErrorAction SilentlyContinue) {
    Write-Output "Starting http-server via npx on http://localhost:8000"
    try {
        $args = "/c", "npx http-server -p 8000 -c-1"
        $serverProc = Start-Process -FilePath cmd.exe -ArgumentList $args -WorkingDirectory $root -WindowStyle Hidden -PassThru
        if (Wait-For-Url 'http://localhost:8000' 6) {
            $browserProc = Start-Process 'http://localhost:8000' -PassThru
            Try-Set-Foreground $browserProc
            exit
        } else {
            Write-Warning "http://localhost:8000 did not become available; falling back to local file"
            # allow serverProc to continue running in background, but open local file
        }
    } catch {
        Write-Warning "Failed to start npx via cmd.exe: $_"
    }
}

# Try python
if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Output "Starting Python http.server on http://localhost:8000"
    try {
        $serverProc = Start-Process -FilePath python -ArgumentList '-m','http.server','8000' -WorkingDirectory $root -PassThru
        if (Wait-For-Url 'http://localhost:8000' 6) {
            $browserProc = Start-Process 'http://localhost:8000' -PassThru
            Try-Set-Foreground $browserProc
            exit
        } else {
            Write-Warning "http://localhost:8000 did not become available; falling back to local file"
        }
    } catch {
        Write-Warning "Failed to start python http.server: $_"
    }
}

# Fallback: open index.html directly
$indexPath = Join-Path $root 'index.html'
if (Test-Path $indexPath) {
    Write-Output "Opening local file: $indexPath"
    # Open the workspace file explicitly so it's the one shown in browser
    $fullFile = (Resolve-Path $indexPath).Path
    $p = Start-Process -FilePath $fullFile -WorkingDirectory $root -PassThru
    Try-Set-Foreground $p
} else {
    Write-Error "index.html not found in $root"
}
