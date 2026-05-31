const { execSync } = require('child_process');
const msg = process.argv[2] || `Update ${new Date().toLocaleString('nl-NL')}`;
try {
  execSync('git add -A', { stdio: 'inherit' });
  execSync(`git commit -m "${msg}"`, { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
} catch (e) {
  process.exit(1);
}
