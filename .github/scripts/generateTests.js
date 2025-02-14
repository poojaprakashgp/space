const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../src');
const testDir = path.join(__dirname, '../../tests');

const createTestFile = (filePath) => {
  const relativePath = path.relative(srcDir, filePath);
  const testFilePath = path.join(testDir, relativePath.replace(/\.jsx?$/, '.test.js'));
  const testDirPath = path.dirname(testFilePath);

  if (!fs.existsSync(testDirPath)) {
    fs.mkdirSync(testDirPath, { recursive: true });
  }

  const content = `// Auto-generated test file for ${relativePath}
import ${path.basename(relativePath, path.extname(relativePath))} from '../../${relativePath.replace(/\\/g, '/').replace(/\.jsx?$/, '')}';

test('renders ${path.basename(relativePath, path.extname(relativePath))} component', () => {
  // Add your test code here
});
`;

  fs.writeFileSync(testFilePath, content, 'utf8');
};

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, callback);
    } else {
      callback(filePath);
    }
  });
};

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    createTestFile(filePath);
  }
});
