const fs = require('fs');
const path = require('path');

// Paths
const buildPath = path.join(__dirname, 'build');
const springBootStaticPath = path.join(__dirname, '..', 'portfolio-services', 'src', 'main', 'resources', 'static');

// Ensure the target directory exists
fs.mkdirSync(springBootStaticPath, { recursive: true });

// Clear the old static files
for (const entry of fs.readdirSync(springBootStaticPath)) {
	fs.rmSync(path.join(springBootStaticPath, entry), { recursive: true, force: true });
}

// Copy the new build files
fs.cpSync(buildPath, springBootStaticPath, { recursive: true, force: true });

console.log('Build files copied to Spring Boot static directory successfully.');
