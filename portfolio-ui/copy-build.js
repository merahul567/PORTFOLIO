const fs = require('fs-extra');
const path = require('path');

// Paths
const buildPath = path.join(__dirname, 'build');
const springBootStaticPath = path.join(__dirname, '..', 'portfolio-services', 'src', 'main', 'resources', 'static');

// Ensure the target directory exists
fs.ensureDirSync(springBootStaticPath);

// Clear the old static files
fs.emptyDirSync(springBootStaticPath);

// Copy the new build files
fs.copySync(buildPath, springBootStaticPath, { overwrite: true });

console.log('Build files copied to Spring Boot static directory successfully.');
