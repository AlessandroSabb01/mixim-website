# Build

`index.html` is generated. Edit `src.html` (page), `copy.js` (EN/FR/IT text) or `map.py` (hand-drawn map of Rome), then run:

```
python3 build/map.py
python3 build/build.py
```

For Hostinger, run `sh build/hostinger/pack.sh`: it wraps the site as a Vite project (Hostinger's web-app upload rejects plain HTML).
