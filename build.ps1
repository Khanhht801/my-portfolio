# Build/validate script: kiem tra cau truc sections va asset cua portfolio
# Vi index.html la skeleton (chi tham chieu cac section),
# khong can build-time concat nua. Section se duoc section-loader.js
# fetch runtime khi user truy cap trang.

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$sectionsDir = Join-Path $root "sections"
$indexPath = Join-Path $root "index.html"

if (-not (Test-Path $sectionsDir)) {
    Write-Error "Khong tim thay thu muc '$sectionsDir'"
}
if (-not (Test-Path $indexPath)) {
    Write-Error "Khong tim thay file '$indexPath'"
}

# Kiem tra moi section deu co file tuong ung
$expectedSections = @(
    "00-scroll-progress.html"
    "01-navbar.html"
    "02-hero.html"
    "03-work.html"
    "04-about.html"
    "05-experience.html"
    "06-capabilities.html"
    "07-contact.html"
    "08-footer.html"
)

$missing = @()
foreach ($name in $expectedSections) {
    if (-not (Test-Path (Join-Path $sectionsDir $name))) {
        $missing += $name
    }
}
if ($missing.Count -gt 0) {
    Write-Warning "Thieu section file: $($missing -join ', ')"
}

# Kiem tra index.html co tham chieu tat ca section dong can thiet.
# 00-scroll-progress duoc dat tinh trong index.html, khong qua section-loader.
$missingRefs = @()
foreach ($name in ($expectedSections | Where-Object { $_ -ne "00-scroll-progress.html" })) {
    $sectionKey = [IO.Path]::GetFileNameWithoutExtension($name)
    $dataSectionAttr = 'data-section="' + $sectionKey + '"'
    $matches = Select-String -Path $indexPath -Pattern ([regex]::Escape($dataSectionAttr))
    if ($null -eq $matches -or $matches.Count -eq 0) {
        $missingRefs += $name
    }
}
if ($missingRefs.Count -gt 0) {
    Write-Warning "Thieu data-section trong index.html: $($missingRefs -join ', ')"
}

# Kiem tra file asset bat buoc co ton tai
$requiredAssets = @(
    "image/remove.png"
    "image/logo.jpg"
    "style.css"
    "script.js"
    "section-loader.js"
)
$missingAssets = @()
foreach ($asset in $requiredAssets) {
    if (-not (Test-Path (Join-Path $root $asset))) {
        $missingAssets += $asset
    }
}
if ($missingAssets.Count -gt 0) {
    Write-Warning "Thieu asset: $($missingAssets -join ', ')"
}

# Canh bao neu auto-reload.js (dev-only) van dang duoc include trong index.html
$indexRaw = Get-Content -Path $indexPath -Raw -Encoding UTF8
if ($indexRaw -match 'auto-reload\.js') {
    Write-Warning 'Phat hien <script src="auto-reload.js"> trong index.html — chi danh cho DEV. Hay XOA truoc khi deploy production!'
}

# Kiem tra hero co tham chieu anh chinh (src) ton tai
$heroPath = Join-Path $sectionsDir "02-hero.html"
if (Test-Path $heroPath) {
    $heroContent = Get-Content -Path $heroPath -Raw -Encoding UTF8
    # Chi lay thuoc tinh src dau tien (khong phai onerror)
    if ($heroContent -match '<img[^>]*\ssrc="(image/[^"]+)"') {
        $heroImg = $matches[1]
        if (-not (Test-Path (Join-Path $root $heroImg))) {
            Write-Warning "Hero tham chieu anh '$heroImg' nhung file khong ton tai!"
        } else {
            Write-Host "Hero image OK: $heroImg" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "=== KET QUA KIEM TRA ===" -ForegroundColor Cyan
Write-Host "Sections: $($expectedSections.Count) file mong doi" -ForegroundColor Cyan
Write-Host "Kich thuoc index.html: $([math]::Round((Get-Item $indexPath).Length / 1KB, 1)) KB" -ForegroundColor Cyan
Write-Host ""

if ($missing.Count -gt 0 -or $missingRefs.Count -gt 0 -or $missingAssets.Count -gt 0) {
    Write-Host "CAN BO SUNG cac thieu sot tren truoc khi deploy!" -ForegroundColor Red
    exit 1
}

Write-Host "OK: Cau truc du an hop le. San sang deploy." -ForegroundColor Green
exit 0
