# Run the site locally

From PowerShell, run:

```powershell
.\
un.ps1
```

Behavior:
- If `npx` (Node) is available, the script starts `http-server` on port 8000 and opens the browser.
- If `python` is available, it starts `python -m http.server 8000` and opens the browser.
- Otherwise it opens `index.html` directly.

If you want an always-available HTTP server, install Node and run `npm install --save-dev http-server`, then run `npx http-server -p 8000` or `npm start` (if you add the package.json script).
