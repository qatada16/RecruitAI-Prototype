$ErrorActionPreference = 'Stop'

$root = 'c:\Qatads\SEM-6\SE\RecruitAi-Prototype\src\app'

# Each entry: pattern -> replacement. Order matters for rgba (more-specific spacing first).
$replacements = @(
    # Page bg
    @("'#0F1117'",                                "'var(--bg-base)'"),
    @('"#0F1117"',                                '"var(--bg-base)"'),
    # Surface
    @("'#171921'",                                "'var(--bg-surface)'"),
    @('"#171921"',                                '"var(--bg-surface)"'),
    # Elevated
    @("'#1D202A'",                                "'var(--bg-elevated)'"),
    @('"#1D202A"',                                '"var(--bg-elevated)"'),
    @("'#232738'",                                "'var(--bg-elevated)'"),
    @('"#232738"',                                '"var(--bg-elevated)"'),
    # Sidebar
    @("'#0B0D13'",                                "'var(--bg-sidebar)'"),
    @('"#0B0D13"',                                '"var(--bg-sidebar)"'),
    # Header / input
    @("'#13151D'",                                "'var(--bg-header)'"),
    @('"#13151D"',                                '"var(--bg-header)"'),
    # Primary text
    @("'#E2E4EB'",                                "'var(--text-primary)'"),
    @('"#E2E4EB"',                                '"var(--text-primary)"'),
    # Secondary text
    @("'#7E8494'",                                "'var(--text-secondary)'"),
    @('"#7E8494"',                                '"var(--text-secondary)"'),
    # Disabled text
    @("'#565B6B'",                                "'var(--text-disabled)'"),
    @('"#565B6B"',                                '"var(--text-disabled)"'),
    # Accent
    @("'#7C6AEF'",                                "'var(--accent)'"),
    @('"#7C6AEF"',                                '"var(--accent)"'),
    @("'#9585F5'",                                "'var(--accent-hover)'"),
    @('"#9585F5"',                                '"var(--accent-hover)"'),
    # Semantic
    @("'#3ECF8E'",                                "'var(--success)'"),
    @('"#3ECF8E"',                                '"var(--success)"'),
    @("'#E5A93B'",                                "'var(--warning)'"),
    @('"#E5A93B"',                                '"var(--warning)"'),
    @("'#EF6B6B'",                                "'var(--error)'"),
    @('"#EF6B6B"',                                '"var(--error)"'),
    # Editor surfaces
    @("'#0D1017'",                                "'var(--editor-bg)'"),
    @('"#0D1017"',                                '"var(--editor-bg)"'),
    @("'#1A1D27'",                                "'var(--editor-border)'"),
    @('"#1A1D27"',                                '"var(--editor-border)"'),
    @("'#0A0D14'",                                "'var(--editor-line-bg)'"),
    @('"#0A0D14"',                                '"var(--editor-line-bg)"'),
    @("'#3D4250'",                                "'var(--editor-line-num)'"),
    @('"#3D4250"',                                '"var(--editor-line-num)"'),
    @("'#D4D8E4'",                                "'var(--editor-text)'"),
    @('"#D4D8E4"',                                '"var(--editor-text)"'),
    @("'#080A10'",                                "'var(--console-bg)'"),
    @('"#080A10"',                                '"var(--console-bg)"'),
    @("'#8A8F9E'",                                "'var(--console-text)'"),
    @('"#8A8F9E"',                                '"var(--console-text)"'),
    # Accent rgba subtle / active (with and without spaces)
    @("'rgba(124,106,239,0.1)'",                  "'var(--accent-subtle)'"),
    @("'rgba(124, 106, 239, 0.1)'",               "'var(--accent-subtle)'"),
    @("'rgba(124,106,239,0.08)'",                 "'var(--accent-subtle)'"),
    @("'rgba(124, 106, 239, 0.08)'",              "'var(--accent-subtle)'"),
    @("'rgba(124,106,239,0.12)'",                 "'var(--accent-subtle)'"),
    @("'rgba(124, 106, 239, 0.12)'",              "'var(--accent-subtle)'"),
    @("'rgba(124,106,239,0.15)'",                 "'var(--accent-active)'"),
    @("'rgba(124, 106, 239, 0.15)'",              "'var(--accent-active)'"),
    @("'rgba(124,106,239,0.18)'",                 "'var(--accent-active)'"),
    @("'rgba(124, 106, 239, 0.18)'",              "'var(--accent-active)'"),
    @("'rgba(124,106,239,0.2)'",                  "'var(--accent-active)'"),
    @("'rgba(124, 106, 239, 0.2)'",               "'var(--accent-active)'"),
    @("'rgba(124,106,239,0.25)'",                 "'var(--accent-active)'"),
    @("'rgba(124, 106, 239, 0.25)'",              "'var(--accent-active)'"),
    @("'rgba(124,106,239,0.3)'",                  "'var(--accent-active)'"),
    @("'rgba(124, 106, 239, 0.3)'",               "'var(--accent-active)'"),
    # Borders white-translucent
    @("'rgba(255,255,255,0.06)'",                 "'var(--border)'"),
    @("'rgba(255, 255, 255, 0.06)'",              "'var(--border)'"),
    @("'rgba(255,255,255,0.08)'",                 "'var(--border-input)'"),
    @("'rgba(255, 255, 255, 0.08)'",              "'var(--border-input)'"),
    @("'rgba(255,255,255,0.10)'",                 "'var(--border-input)'"),
    @("'rgba(255, 255, 255, 0.10)'",              "'var(--border-input)'"),
    @("'rgba(255,255,255,0.1)'",                  "'var(--border-input)'"),
    @("'rgba(255, 255, 255, 0.1)'",               "'var(--border-input)'"),
    @("'rgba(255,255,255,0.12)'",                 "'var(--border-hover)'"),
    @("'rgba(255, 255, 255, 0.12)'",              "'var(--border-hover)'"),
    @("'rgba(255,255,255,0.15)'",                 "'var(--border-hover)'"),
    @("'rgba(255, 255, 255, 0.15)'",              "'var(--border-hover)'"),
    @("'rgba(255,255,255,0.18)'",                 "'var(--border-hover)'"),
    @("'rgba(255, 255, 255, 0.18)'",              "'var(--border-hover)'"),
    # Semantic backgrounds
    @("'rgba(62,207,142,0.08)'",                  "'var(--success-bg)'"),
    @("'rgba(62, 207, 142, 0.08)'",               "'var(--success-bg)'"),
    @("'rgba(62,207,142,0.1)'",                   "'var(--success-bg)'"),
    @("'rgba(62, 207, 142, 0.1)'",                "'var(--success-bg)'"),
    @("'rgba(62,207,142,0.12)'",                  "'var(--success-bg)'"),
    @("'rgba(62, 207, 142, 0.12)'",               "'var(--success-bg)'"),
    @("'rgba(229,169,59,0.08)'",                  "'var(--warning-bg)'"),
    @("'rgba(229, 169, 59, 0.08)'",               "'var(--warning-bg)'"),
    @("'rgba(229,169,59,0.1)'",                   "'var(--warning-bg)'"),
    @("'rgba(229, 169, 59, 0.1)'",                "'var(--warning-bg)'"),
    @("'rgba(229,169,59,0.12)'",                  "'var(--warning-bg)'"),
    @("'rgba(229, 169, 59, 0.12)'",               "'var(--warning-bg)'"),
    @("'rgba(239,107,107,0.08)'",                 "'var(--error-bg)'"),
    @("'rgba(239, 107, 107, 0.08)'",              "'var(--error-bg)'"),
    @("'rgba(239,107,107,0.1)'",                  "'var(--error-bg)'"),
    @("'rgba(239, 107, 107, 0.1)'",               "'var(--error-bg)'"),
    @("'rgba(239,107,107,0.12)'",                 "'var(--error-bg)'"),
    @("'rgba(239, 107, 107, 0.12)'",              "'var(--error-bg)'"),
    @("'rgba(239,107,107,0.2)'",                  "'var(--error-border)'"),
    @("'rgba(239, 107, 107, 0.2)'",               "'var(--error-border)'"),
    @("'rgba(239,107,107,0.25)'",                 "'var(--error-border)'"),
    @("'rgba(239, 107, 107, 0.25)'",              "'var(--error-border)'"),
    # Backdrops
    @("'rgba(0,0,0,0.6)'",                        "'var(--backdrop)'"),
    @("'rgba(0, 0, 0, 0.6)'",                     "'var(--backdrop)'"),
    @("'rgba(0,0,0,0.5)'",                        "'var(--backdrop)'"),
    @("'rgba(0, 0, 0, 0.5)'",                     "'var(--backdrop)'")
)

$files = Get-ChildItem -Path $root -Recurse -Include *.tsx, *.ts | Where-Object { $_.FullName -notmatch '\\components\\ui\\' }
$count = 0
foreach ($f in $files) {
    $orig = Get-Content -Raw -LiteralPath $f.FullName
    $new = $orig
    foreach ($pair in $replacements) {
        $new = $new.Replace($pair[0], $pair[1])
    }
    if ($new -ne $orig) {
        Set-Content -LiteralPath $f.FullName -Value $new -NoNewline -Encoding utf8
        $count++
    }
}
Write-Output "Modified $count files"
