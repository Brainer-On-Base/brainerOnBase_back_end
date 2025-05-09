# deploy-backend.ps1

# Definir ruta local y destino remoto
$localBase = "C:\Users\feden\Desktop\BrainerOnBase\brainerOnBase_backend"
$remoteUser = "root"
$remoteHost = "145.223.96.84"
$remotePath = "/var/www/brainer-backend"

# Comando SCP
scp -r `
  "$localBase\config" `
  "$localBase\controllers" `
  "$localBase\middleware" `
  "$localBase\models" `
  "$localBase\routes" `
  "$localBase\scripts" `
  "$localBase\CONSTANTS.js" `
  "$localBase\package.json" `
  "$localBase\package-lock.json" `
  "$localBase\server.js" `
  "$localBase\variables.env" `
  "${remoteUser}@${remoteHost}:${remotePath}"  # <--- pegado acá

# Reiniciar la app en el servidor usando SSH y PM2
ssh "${remoteUser}@${remoteHost}" "pm2 restart brainer-api && echo '✅ PM2 app restarted'"


Write-Host "`n✅ Deploy terminado. Revisá el servidor para reiniciar el backend si hace falta." -ForegroundColor Green
