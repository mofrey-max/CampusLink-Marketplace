# CampusLink React host

This folder now contains the Python launcher that serves the existing React production build from `../dist`.

## What it does

- Serves only the React app in `dist/`
- Returns built assets such as `assets/*`, `manifest.json`, and `sw.js`
- Falls back to `index.html` for client-side React routes
- Does not render a Flet UI in the browser

## Build and run

From the repository root:

```bash
npm run build
python3 -m venv flet_webapp/.venv
flet_webapp/.venv/bin/python -m ensurepip --upgrade
flet_webapp/.venv/bin/python -m pip install -r flet_webapp/requirements.txt
CAMPUSLINK_PORT=8551 flet_webapp/.venv/bin/python flet_webapp/app.py
```

Then open `http://localhost:8551/`.

## Tests

```bash
flet_webapp/.venv/bin/python -m unittest discover -s flet_webapp -p 'test_*.py' -v
```

## Note

The browser experience is the original React application. This Python entrypoint is only acting as the web host for the built React files.
