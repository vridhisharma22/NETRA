// Simple local server for NETRA Guardian. Requires Node.js 18+.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 5500);

// Load .env without an extra dependency. Existing process environment wins.
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[1].startsWith('#') || process.env[match[1]]) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
}

const MIME = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.csv':'text/csv; charset=utf-8', '.json':'application/json; charset=utf-8', '.ico':'image/x-icon' };
function send(res, status, body, type='application/json; charset=utf-8') { res.writeHead(status, { 'Content-Type': type, 'X-Content-Type-Options':'nosniff', 'Cache-Control':'no-store' }); res.end(typeof body === 'string' ? body : JSON.stringify(body)); }
const server = http.createServer(async (req,res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { return send(res,400,'Bad URL','text/plain; charset=utf-8'); }
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.resolve(ROOT, '.' + pathname);
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) return send(res,403,'Forbidden','text/plain; charset=utf-8');
  fs.stat(filePath,(err,stat)=>{
    if (err || !stat.isFile()) return send(res,404,'Not found','text/plain; charset=utf-8');
    res.writeHead(200,{'Content-Type':MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream','X-Content-Type-Options':'nosniff'});
    fs.createReadStream(filePath).pipe(res);
  });
});
server.listen(PORT,'127.0.0.1',()=>console.log(`NETRA Guardian is running locally at http://127.0.0.1:${PORT}`));
