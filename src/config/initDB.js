const { exec } = require('child_process');
const path = require('path');

const dumpPath = path.join(__dirname, '../backup/code_solutions');

exec(`mongorestore --db code_solutions --drop "${dumpPath}/code_solutions"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al restaurar la base: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Error en la restauración: ${stderr}`);
    return;
  }
  console.log('Base de datos importada correctamente.');
});
