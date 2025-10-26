const { exec } = require('child_process');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Lee el nombre de la BBDD desde las variables de entorno
const dbName = process.env.DB_NAME;

if (!dbName) {
  console.error('Error: La variable DB_NAME no está definida en el archivo .env');
  process.exit(1);
}

// Ruta a la carpeta específica del dump 
const dumpPath = path.join(__dirname, `../backup/${dbName}`);

// Comando para restaurar la base de datos, eliminando la existente 
const command = `mongorestore --db ${dbName} --drop "${dumpPath}"`;

console.log(`[INITDB] Ejecutando restauración...`);
console.log(`[INITDB] Comando: ${command}`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`[INITDB] Error al restaurar la base: ${error.message}`);
    return;
  }
  if (stderr) {
    // mostrar mensajes de progreso o errores
    console.error(`[INITDB] Salida de error/estado: ${stderr}`);
  }
  
  console.log(`[INITDB] Salida estándar: ${stdout}`);
  console.log(`[INITDB] Base de datos '${dbName}' importada correctamente desde ${dumpPath}.`);
});