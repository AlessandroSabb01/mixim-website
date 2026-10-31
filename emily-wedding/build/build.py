# Assembles index.html from src.html: copy dictionary, the hand-drawn map and its legend.
import json, os
B = os.path.dirname(os.path.abspath(__file__))
h = open(f'{B}/src.html').read()
m = json.load(open(f'{B}/map.json'))
for k, v in [('/*I18N*/', open(f'{B}/copy.js').read()), ('<!--MAP-->', m['svg']), ('<!--LEGEND-->', m['legend'])]:
    assert k in h, k
    h = h.replace(k, v)
open(f'{B}/../index.html', 'w').write(h)
print('ok', len(h))
