Add-Type -AssemblyName System.Drawing

$src = "d:\my portfolio\logo.jpg"
$outDir = "d:\my portfolio"

# Load original image
$img = [System.Drawing.Image]::FromFile((Resolve-Path $src))
$srcW = $img.Width
$srcH = $img.Height
Write-Host "Source: $srcW x $srcH"

function New-CircleFavicon($size, $outPath) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = 'HighQualityBicubic'
    $g.SmoothingMode = 'AntiAlias'
    $g.PixelOffsetMode = 'HighQuality'
    $g.CompositingQuality = 'HighQuality'

    # Transparent background
    $g.Clear([System.Drawing.Color]::Transparent)

    # Use texture brush to draw circle-cropped image
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse(0, 0, $size, $size)
    $g.SetClip($path)

    # Draw image scaled to fill square
    $g.DrawImage($img, 0, 0, $size, $size)
    $g.ResetClip()

    # Save as PNG
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Saved $outPath ($size x $size)"
}

# Generate favicon sizes (modern browsers prefer PNG)
New-CircleFavicon 32  (Join-Path $outDir "favicon-32.png")
New-CircleFavicon 64  (Join-Path $outDir "favicon-64.png")
New-CircleFavicon 180 (Join-Path $outDir "apple-touch-icon.png")
New-CircleFavicon 192 (Join-Path $outDir "android-chrome-192.png")
New-CircleFavicon 512 (Join-Path $outDir "android-chrome-512.png")

# Generate multi-size .ico (for legacy browsers / tab)
$sizes = 16, 32, 48, 64
$bmpList = @()
foreach ($s in $sizes) {
    $b = New-Object System.Drawing.Bitmap $s, $s
    $gg = [System.Drawing.Graphics]::FromImage($b)
    $gg.InterpolationMode = 'HighQualityBicubic'
    $gg.SmoothingMode = 'AntiAlias'
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $p.AddEllipse(0, 0, $s, $s)
    $gg.SetClip($p)
    $gg.DrawImage($img, 0, 0, $s, $s)
    $gg.Dispose()
    $bmpList += ,$b
}

# Save multi-image .ico manually (ICO container)
$icoPath = Join-Path $outDir "favicon.ico"
$fs = [System.IO.File]::Create($icoPath)

# ICONDIR header (6 bytes)
$bw = New-Object System.IO.BinaryWriter $fs
$bw.Write([UInt16]0)            # Reserved
$bw.Write([UInt16]1)            # Type: 1 = icon
$bw.Write([UInt16]$sizes.Count) # Number of images

$headerSize = 6 + (16 * $sizes.Count)
$offset = $headerSize

$pngBytes = @()
foreach ($b in $bmpList) {
    $ms = New-Object System.IO.MemoryStream
    $b.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngBytes += ,($ms.ToArray())
    $ms.Dispose()
}

# ICONDIRENTRY array (16 bytes each)
for ($i = 0; $i -lt $sizes.Count; $i++) {
    $s = $sizes[$i]
    $size = if ($s -ge 256) { 0 } else { [byte]$s }
    $bw.Write([byte]$size)        # Width
    $bw.Write([byte]$size)        # Height
    $bw.Write([byte]0)            # Color palette count
    $bw.Write([byte]0)            # Reserved
    $bw.Write([UInt16]1)          # Color planes
    $bw.Write([UInt16]32)         # Bits per pixel
    $bw.Write([UInt32]$pngBytes[$i].Length) # Size
    $bw.Write([UInt32]$offset)    # Offset
    $offset += $pngBytes[$i].Length
}

# Image data
for ($i = 0; $i -lt $sizes.Count; $i++) {
    $bw.Write($pngBytes[$i])
}

$bw.Flush()
$fs.Close()
foreach ($b in $bmpList) { $b.Dispose() }

Write-Host "Saved $icoPath (multi-size ICO)"
Write-Host "Done!"
