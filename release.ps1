param(
    [string]$Tag = "latest"
)

$Image = "harbor.sohneg.ch/sohneg.ch/web"

Write-Host "Running type check..." -ForegroundColor Cyan
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Host "TypeScript check failed. Fix errors before building." -ForegroundColor Red
    exit 1
}
Write-Host "Type check passed." -ForegroundColor Green

Write-Host "Building image $Image`:$Tag ..." -ForegroundColor Cyan
docker build -t "$Image`:$Tag" .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed." -ForegroundColor Red
    exit 1
}
Write-Host "Build complete." -ForegroundColor Green

Write-Host "Pushing $Image`:$Tag ..." -ForegroundColor Cyan
docker push "$Image`:$Tag"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker push failed. Are you logged in? (docker login harbor.sohneg.ch)" -ForegroundColor Red
    exit 1
}

Write-Host "Released $Image`:$Tag" -ForegroundColor Green
Write-Host "On the server: docker compose pull; docker compose up -d" -ForegroundColor DarkGray
