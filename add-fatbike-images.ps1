
# Script: add-fatbike-images.ps1
# Voegt Image Src toe aan OUXI, ENGWE, V20/QMWheel, Windgoo, EB en A-SPADZ producten

$csvPath = 'shopify-import.csv'
$csv = Import-Csv $csvPath

# ============================================================
# HARDCODED MAP: OUXI producten
# ============================================================
$ouxiMap = @{
    'ouxi-c80-mini-zwart'             = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/3.png?v=1752631322'
    'ouxi-v8-ultra-mini-lichtgrijs'   = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/OUXIV8ULTRAMiniBlackEbike-FrontView.webp?v=1770119542'
    'ouxi-v8-50-c80-2026'             = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/ouxiv8ebikes.webp?v=1772712642'
    'ouxi-v8-c80-max-dubbele-accu'    = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/ouxiv8maxebikes.webp?v=1772712789'
    'ouxi-v8-ultra-zwart'             = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/V8-Ultra-Right-side-view.webp?v=1769606584'
    'ouxi-v8-pro-zwart-20'            = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/OUXIV8Ebike-Rightsideview.webp?v=1769741080'
    'ouxi-v8-pro-max-20-dubbele-accu' = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/OUXIV8Produal-batteryebikesideview.webp?v=1770101218'
    'ouxi-v8-pro-24'                  = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/OUXIV8Ebike-Rightsideview.webp?v=1769741080'
    'ouxi-v8-pro-max-24-dubbele-accu' = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/OUXIV8Produal-batteryebikesideview.webp?v=1770101218'
    'ouxi-gt2000-oranje'              = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/OUXI_GT2000_c7df2ff8-160d-4ec8-8ba0-39264ad95db3.webp?v=1778138960'
    'ouxi-gt20-grijs'                 = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/GT20Broun_a64f6fbf-8da4-4ba8-8dbd-49aa9696eb78.webp?v=1769606794'
    'ouxi-q8-zwart'                   = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/OUXIQ8BlackCommuterE-bike_rightsideview.webp?v=1769695261'
    'ouxi-h9-plus'                    = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/OUXIH9BlackE-bike-Rightsideview.webp?v=1769595185'
    'ouxi-v8-family'                  = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/OUXIV8Ebike-Rightsideview.webp?v=1769741080'
    'ouxi-x8-vouwfiets'               = 'https://cdn.shopify.com/s/files/1/0647/1355/6045/files/OUXIV8ULTRAMiniBlackEbike-FrontView.webp?v=1770119542'
}

# ============================================================
# HARDCODED MAP: ENGWE producten
# ============================================================
$engweMap = @{
    'engwe-e26-zwart'         = 'https://cdn.shopify.com/s/files/1/0735/2146/3517/files/10_3dd0aa09-72fe-4155-9083-ff3e8e0176f2.jpg?v=1774920096'
    'engwe-e26-st-zwart'      = 'https://cdn.shopify.com/s/files/1/0735/2146/3517/files/10_3dd0aa09-72fe-4155-9083-ff3e8e0176f2.jpg?v=1774920096'
    'engwe-l20-boost-wijnrood'= 'https://cdn.shopify.com/s/files/1/0735/2146/3517/files/1_7c381b42-4173-4ef5-8804-556937677fd0.jpg?v=1761098273'
    'engwe-l20-roze'          = 'https://cdn.shopify.com/s/files/1/0735/2146/3517/files/11_a8f9524a-bf18-4dd1-98fd-b80e9728187c.jpg?v=1756110574'
    'engwe-ep2-pro-oranje'    = 'https://cdn.shopify.com/s/files/1/0735/2146/3517/files/PRO_2.0.png?v=1767080409'
    'engwe-le20-grijs'        = 'https://cdn.shopify.com/s/files/1/0735/2146/3517/files/1_3df9c595-9593-4a7b-b00d-9ddea073d4e7.jpg?v=1767080436'
    'engwe-m20-zwart'         = 'https://cdn.shopify.com/s/files/1/0735/2146/3517/files/20_2c2115a8-a5b0-40d9-a94f-00482df99c86.png?v=1735984038'
}

# ============================================================
# DYNAMISCH: Probeer V20/QMWheel, Windgoo, EB, A-SPADZ via API
# ============================================================
$extraMap = @{}

$apiSources = @(
    @{ Brand = 'QMWheel/V20'; Urls = @('https://qmwheel.com', 'https://v20fatbike.com', 'https://www.qmwheelbike.com', 'https://v20fatbike.nl') },
    @{ Brand = 'Windgoo';     Urls = @('https://windgoo-official.com', 'https://windgoo.eu', 'https://windgoobike.eu') },
    @{ Brand = 'EB';          Urls = @('https://ebbikes.eu', 'https://eb-fatbike.com', 'https://eb-bikes.eu', 'https://ebfatbike.nl') },
    @{ Brand = 'A-SPADZ';     Urls = @('https://aspadz.eu', 'https://aspadz.com', 'https://a-spadz.eu') }
)

foreach ($source in $apiSources) {
    $found = $false
    foreach ($baseUrl in $source.Urls) {
        try {
            $data = Invoke-RestMethod "$baseUrl/products.json?limit=250" -TimeoutSec 6 -ErrorAction Stop
            if ($data.products.Count -gt 0) {
                Write-Host "$($source.Brand) API gevonden: $baseUrl ($($data.products.Count) producten)"
                foreach ($p in $data.products) {
                    if ($p.images.Count -gt 0) {
                        $extraMap[$p.handle] = $p.images[0].src
                    }
                }
                $found = $true
                break
            }
        } catch { }
    }
    if (-not $found) {
        Write-Host "$($source.Brand): geen API gevonden (V20/Windgoo/EB/A-SPADZ beelden ontbreken nog)"
    }
}

# ============================================================
# Fuzzy matching helper voor extraMap
# Strips Dutch color suffixes from handle to get base model
# ============================================================
function Get-BaseHandle($handle) {
    $colors = @('-zwart','-grijs','-wit','-rood','-blauw','-groen','-oranje','-roze','-wijnrood','-geel','-lichtgrijs','-nardo-grijs','-beige','-bruin','-paars','-zilver','-champagne')
    $base = $handle
    foreach ($c in $colors) {
        if ($base.EndsWith($c)) {
            $base = $base.Substring(0, $base.Length - $c.Length)
            break
        }
    }
    return $base
}

# Build base handle index for extraMap
$extraBaseMap = @{}
foreach ($apiHandle in $extraMap.Keys) {
    $base = Get-BaseHandle $apiHandle
    if (-not $extraBaseMap.ContainsKey($base)) {
        $extraBaseMap[$base] = $extraMap[$apiHandle]
    }
}

# ============================================================
# Merge alle maps
# ============================================================
$allMap = @{}
foreach ($k in $ouxiMap.Keys)  { $allMap[$k] = $ouxiMap[$k] }
foreach ($k in $engweMap.Keys) { $allMap[$k] = $engweMap[$k] }
foreach ($k in $extraMap.Keys) { if (-not $allMap.ContainsKey($k)) { $allMap[$k] = $extraMap[$k] } }

# ============================================================
# Update CSV
# ============================================================
$matched = 0
$stillMissing = @()

foreach ($row in $csv) {
    if ($row.Title -ne '' -and $row.'Image Src' -eq '') {
        $handle = $row.Handle
        if ($allMap.ContainsKey($handle)) {
            $row.'Image Src' = $allMap[$handle]
            $matched++
        } else {
            # Probeer fuzzy match via base handle (voor extra-map merken)
            $base = Get-BaseHandle $handle
            if ($extraBaseMap.ContainsKey($base)) {
                $row.'Image Src' = $extraBaseMap[$base]
                $matched++
            } elseif ($stillMissing -notcontains $handle) {
                $stillMissing += $handle
            }
        }
    }
}

# ============================================================
# Sla op met LF regeleindes
# ============================================================
$tempPath = [System.IO.Path]::GetTempFileName()
$csv | Export-Csv -Path $tempPath -NoTypeInformation -Encoding UTF8
$content = [System.IO.File]::ReadAllText($tempPath)
$content = $content.Replace("`r`n", "`n")
[System.IO.File]::WriteAllText((Resolve-Path $csvPath).Path, $content, [System.Text.Encoding]::UTF8)
Remove-Item $tempPath

# ============================================================
# Rapport
# ============================================================
$totalRows = $csv.Count
Write-Host ""
Write-Host "=== RESULTAAT ==="
Write-Host "Image Src toegevoegd: $matched producten gematched"

if ($stillMissing.Count -gt 0) {
    Write-Host ""
    Write-Host "Nog ZONDER afbeelding ($($stillMissing.Count) unieke handles):"
    $stillMissing | ForEach-Object { Write-Host "  - $_" }
} else {
    Write-Host "Alle producten hebben nu een afbeelding!"
}

Write-Host ""
Write-Host "Totaal CSV regels: $totalRows"
