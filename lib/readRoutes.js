import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const routesDirectory= path.join(__dirname,"../src/routes");


// function to read all files present inside routes directory
const useRoutes = async function readFilesRecursively(routesDirectory,app) {
  const files=fs.readdirSync(routesDirectory);

  for(const file of files) {
    const filePath =path.join(routesDirectory, file);
    const stats =fs.statSync(filePath);
    
    if (stats.isFile()) {
      try {
        const module = await import(filePath);
        app.use(module.router); // added router imported from filePath
      } catch (error) {
        console.error("Error importing module:", error);
      }
    }
    else if (stats.isDirectory()) {
      await readFilesRecursively(filePath,app); // async calling recursive function
    }
  };
  return app;
};

export { useRoutes };