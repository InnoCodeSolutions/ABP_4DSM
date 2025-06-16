$outputFile = "pastas e arquivos do projeto.txt"
$rootPath = Get-Location | Select-Object -ExpandProperty Path
$extensions = @(".ts", ".tsx", ".js", ".jsx", ".json")
$ignoreDirs = @("node_modules", ".git", "dist", "build", "out", "coverage", ".next")

# Verificar se o diretório existe
if (-not (Test-Path $rootPath)) {
    Write-Error "O diretório '$rootPath' não existe. Verifique o caminho e tente novamente."
    exit
}

# Escrever o cabeçalho com codificação UTF-8
"Esqueleto Simplificado do Projeto: $rootPath" | Out-File $outputFile -Encoding UTF8
"--------------------------------------------------" | Out-File $outputFile -Append -Encoding UTF8

function List-CodeFiles($path) {
    try {
        $items = Get-ChildItem $path -ErrorAction Stop -Force | Sort-Object Name
        foreach ($item in $items) {
            if ($item.PSIsContainer) {
                if ($ignoreDirs -notcontains $item.Name) {
                    List-CodeFiles $item.FullName
                }
            } elseif ($extensions -contains $item.Extension) {
                "$($item.FullName.Substring($rootPath.Length + 1))" | Out-File $outputFile -Append -Encoding UTF8
            }
        }
    } catch {
        Write-Warning "Erro ao acessar '$path': $($_.Exception.Message)"
    }
}

List-CodeFiles $rootPath
Write-Host "Esqueleto simplificado gerado com sucesso em: $outputFile"
