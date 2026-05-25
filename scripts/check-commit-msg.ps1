# Validates the first line of a commit message (Conventional Commits subset for SignalDesk).
# Usage:
#   .\scripts\check-commit-msg.ps1 -Message "docs: add workflow guide"
#   .\scripts\check-commit-msg.ps1 -MessageFile .git\COMMIT_EDITMSG

param(
    [string]$Message,
    [string]$MessageFile
)

$ErrorActionPreference = "Stop"

if ($MessageFile) {
    if (-not (Test-Path $MessageFile)) {
        Write-Error "Message file not found: $MessageFile"
        exit 1
    }
    $lines = Get-Content $MessageFile
    $Message = ($lines | Where-Object { $_ -and $_ -notmatch '^\s*#' } | Select-Object -First 1)
}

if (-not $Message) {
    Write-Error "No commit subject. Use -Message or -MessageFile."
    exit 1
}

$subject = $Message.Trim()
$failed = $false

function Fail([string]$text) {
    Write-Host "commit-msg: $text" -ForegroundColor Red
    $script:failed = $true
}

# Conventional: type(scope?): summary
$pattern = '^(feat|fix|docs|refactor|test|chore)(\((backend|frontend|docs|mock)\))?: [a-z].+'
if ($subject -notmatch $pattern) {
    Fail "Subject must match: <type>(<scope>): <summary>"
    Fail "  Types: feat|fix|docs|refactor|test|chore"
    Fail "  Scopes: backend|frontend|docs|mock (optional for repo-wide chore)"
    Fail "  Example: fix(backend): return 409 on follow-up while processing"
}

if ($subject.Length -gt 72) {
    Fail "Subject is $($subject.Length) chars; keep first line <= 72."
}

$weak = @(
    '^\s*(fix|fixed|fixes)\s*$',
    '^\s*(update|updates|updated)\s*$',
    '^\s*(final|latest|misc|wip)\b',
    '\bfinal(ize|izing)?\b',
    '\blatest\b',
    '\bfixed stuff\b',
    '\bimprove authenticity\b',
    '\bstrengthen narrative\b',
    '\bcomplete submission\b',
    '\bfinalize deliverables\b'
)
foreach ($rx in $weak) {
    if ($subject -match $rx) {
        Fail "Subject looks vague or non-descriptive: $subject"
        break
    }
}

if ($failed) {
    Write-Host ""
    Write-Host "See CONTRIBUTING.md and docs/development-workflow.md" -ForegroundColor Yellow
    exit 1
}

Write-Host "commit-msg: OK - $subject" -ForegroundColor Green
exit 0
