# ============================================================
# add-images.ps1 — Voeg Image Src toe aan shopify-import.csv
# ============================================================

Set-Location "C:\Users\gonul\OneDrive\Documenten\GitHub\bikexpert1"

# ---- 1. Vogue afbeeldingen (hardcoded) ---------------------
$imageMap = @{
    'vogue-artemis'        = 'https://voguebike.com/wp-content/uploads/2026/02/VOGUE-ARTEMIS-MATT-BLACK.jpg'
    'vogue-avalanche'      = 'https://voguebike.com/wp-content/uploads/2026/02/VOGUE-AVALANCHE-MATT-COOL-GREY.jpg'
    'vogue-basic-3'        = 'https://voguebike.com/wp-content/uploads/2023/08/Vogue-Basic-Matt-Black-Black.jpg'
    'vogue-elite-3'        = 'https://voguebike.com/wp-content/uploads/2023/08/Vogue-Elite-Matt-Black.png'
    'vogue-elite-7'        = 'https://voguebike.com/wp-content/uploads/2023/08/Vogue-Elite-Matt-Black.png'
    'vogue-mestengo-mid'   = 'https://voguebike.com/wp-content/uploads/2023/08/Vogue-Mestengo-MID-Matt-Black.jpg'
    'vogue-milo'           = 'https://voguebike.com/wp-content/uploads/2026/05/VOGUE-MILO-FASHION-GREY-Winnaar.jpg'
    'vogue-milo-man'       = 'https://voguebike.com/wp-content/uploads/2026/01/VOGUE-MILO-MAN-SHINY-BLACK.jpg'
    'vogue-mini'           = 'https://voguebike.com/wp-content/uploads/2023/09/VOGUE-MINI-MATT-BLACK.png'
    'vogue-motion'         = 'https://voguebike.com/wp-content/uploads/2026/01/VOGUE-MOTION-MATT-BLACK.jpg'
    'vogue-motion-man'     = 'https://voguebike.com/wp-content/uploads/2026/01/VOGUE-MOTION-MAN-MATT-BLACK.jpg'
    'vogue-pantheon'       = 'https://voguebike.com/wp-content/uploads/2026/02/VOGUE-PANTHEON-MATT-BLACK.jpg'
    'vogue-premium'        = 'https://voguebike.com/wp-content/uploads/2023/09/Vogue-Premium-Matt-Black.jpg'
    'vogue-premium-man'    = 'https://voguebike.com/wp-content/uploads/2023/09/Vogue-Premium-Man-Matt-Black.jpg'
    'vogue-prestige'       = 'https://voguebike.com/wp-content/uploads/2025/04/VOGUE-PRESTIGE-MATT-BLACK.jpg'
    'vogue-prestige-man'   = 'https://voguebike.com/wp-content/uploads/2025/04/VOGUE-PRESTIGE-MAN-MATT-BLACK.jpg'
    'vogue-suv'            = 'https://voguebike.com/wp-content/uploads/2026/01/VOGUE-SUV-MATT-BLACK.jpg'
    'vogue-wonder'         = 'https://voguebike.com/wp-content/uploads/2026/01/VOGUE-WONDER-FASHION-GREY.jpg'
    'vogue-avenger'        = 'https://voguebike.com/wp-content/uploads/2023/09/VOGUE-AVENGER-MATT-BLACK-BROWN.jpg'
    'vogue-caddy'          = 'https://voguebike.com/wp-content/uploads/2026/02/VOGUE-CADDY-MATT-BLACK-GREY.jpg'
    'vogue-carry-2'        = 'https://voguebike.com/wp-content/uploads/2024/06/Vogue-Carry-2-Matt-Black-Black-Ananda.jpg'
    'vogue-carry-3'        = 'https://voguebike.com/wp-content/uploads/2023/09/Vogue-Carry-3-Matt-Black-Brown.png'
    'vogue-journey-plus'   = 'https://voguebike.com/wp-content/uploads/2026/02/VOGUE-JOURNEY-PLUS-MATT-BLACK-BROWN.jpg'
    'vogue-journey-s'      = 'https://voguebike.com/wp-content/uploads/2026/02/VOGUE-JOURNEY-S-MATT-BLACK-BLACK.jpg'
    'vogue-superior-deluxe'= 'https://voguebike.com/wp-content/uploads/2023/09/Vogue-Superior-Deluxe-Matt-Black-Brown-1.jpg'
}

# ---- 2. Volare afbeeldingen via API ------------------------
Write-Host "Volare API ophalen..." -ForegroundColor Cyan
for ($p = 1; $p -le 3; $p++) {
    Write-Host "  Pagina $p..." -NoNewline
    $r = Invoke-RestMethod "https://www.volare-kinderfietsen.nl/products.json?limit=250&page=$p"
    foreach ($prod in $r.products) {
        if ($prod.images.Count -gt 0) {
            $imageMap[$prod.handle] = $prod.images[0].src
        }
    }
    Write-Host " $($r.products.Count) producten" -ForegroundColor Green
}
Write-Host "Totaal in imageMap: $($imageMap.Count)" -ForegroundColor Yellow

# ---- 3. CSV inlezen en Image Src kolom toevoegen -----------
Write-Host "CSV inlezen..." -ForegroundColor Cyan
$csv = Import-Csv 'shopify-import.csv'
$matched = 0; $total = 0

$updated = $csv | ForEach-Object {
    $row = $_
    $imgSrc = ''
    if ($row.Title -ne '') {
        $total++
        if ($imageMap.ContainsKey($row.Handle)) {
            $imgSrc = $imageMap[$row.Handle]
            $matched++
        }
    }
    $row | Select-Object *,@{Name='Image Src';Expression={$imgSrc}}
}

# ---- 4. CSV terugschrijven ---------------------------------
$updated | Export-Csv 'shopify-import.csv' -NoTypeInformation -Encoding UTF8
Write-Host "Image Src toegevoegd: $matched/$total producten gematch" -ForegroundColor Yellow

# ---- 5. LF regeleindes herstellen -------------------------
$content = [System.IO.File]::ReadAllText('shopify-import.csv')
$fixed = $content -replace "`r`n", "`n"
[System.IO.File]::WriteAllText('shopify-import.csv', $fixed, [System.Text.Encoding]::UTF8)
Write-Host "Regeleindes omgezet naar LF" -ForegroundColor Green
Write-Host "Totaal regels: $((Get-Content 'shopify-import.csv').Count)" -ForegroundColor Green
