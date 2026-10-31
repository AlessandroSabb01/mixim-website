# Generates the hand-drawn map of central Rome as inline SVG (sepia ink, watercolour washes).
# Positions are projected from real lat/lon so pins sit roughly where the places are.
import math, json
LON0, LON1, LAT0, LAT1 = 12.4505, 12.4995, 41.8775, 41.9095
W = 1000
K = W / ((LON1 - LON0) * math.cos(math.radians(41.894)))
H = round((LAT1 - LAT0) * K)
def P(lat, lon):
    return round((lon - LON0) * math.cos(math.radians(41.894)) * K, 1), round((LAT1 - lat) * K, 1)

tiber = [(41.9125,12.4700),(41.9100,12.4722),(41.9072,12.4743),(41.9050,12.4738),(41.9036,12.4708),(41.9020,12.4672),(41.9002,12.4648),(41.8978,12.4652),(41.8957,12.4677),(41.8935,12.4700),(41.8918,12.4728),(41.8908,12.4760),(41.8898,12.4790),(41.8878,12.4795),(41.8848,12.4768),(41.8818,12.4742),(41.8790,12.4712),(41.8760,12.4690)]
def smooth(pts):
    pts = [P(*p) for p in pts]
    d = f"M{pts[0][0]} {pts[0][1]}"
    for i in range(1, len(pts) - 1):
        mx, my = (pts[i][0] + pts[i+1][0]) / 2, (pts[i][1] + pts[i+1][1]) / 2
        d += f" Q{pts[i][0]} {pts[i][1]} {mx:.1f} {my:.1f}"
    d += f" L{pts[-1][0]} {pts[-1][1]}"
    return d
river = smooth(tiber)

landmarks = [
 ("San Pietro", 41.9022, 12.4539, "dome"), ("Castel S. Angelo", 41.9031, 12.4663, "round"),
 ("Piazza Navona", 41.8992, 12.4731, "oval"), ("Pantheon", 41.8986, 12.4769, "dome"),
 ("Fontana di Trevi", 41.9009, 12.4833, "dot"), ("Piazza di Spagna", 41.9058, 12.4823, "dot"),
 ("Campidoglio", 41.8933, 12.4828, "dot"), ("Colosseo", 41.8902, 12.4922, "colosseum"),
 ("Circo Massimo", 41.8861, 12.4851, "oval"), ("Tempio Maggiore", 41.8918, 12.4778, "dome"),
]
areas = [("Trastevere", 41.8885, 12.4672), ("Gianicolo", 41.8935, 12.4600), ("Monti", 41.8955, 12.4930), ("Aventino", 41.8830, 12.4800)]
restaurants = [
 ("Armando al Pantheon", "Salita de' Crescenzi 31", 41.8990, 12.4763),
 ("Roscioli", "Via dei Giubbonari 21", 41.8938, 12.4735),
 ("Osteria da Fortunata", "Via del Pellegrino 11", 41.8968, 12.4708),
 ("Piperno", "Monte de' Cenci 9", 41.8929, 12.4755),
 ("Nonna Betta", "Via del Portico d'Ottavia 16", 41.8927, 12.4786),
 ("Da Enzo al 29", "Via dei Vascellari 29", 41.8878, 12.4766),
 ("Checco er Carettiere", "Via Benedetta 10", 41.8913, 12.4688),
 ("Da Francesco", "Piazza del Fico 29", 41.8999, 12.4712),
]

def icon(kind, x, y):
    x, y = round(x), round(y)
    if kind == "dome":
        return f'<path d="M{x-9} {y+6} h18 M{x-7} {y+6} v-4 a7 7 0 0 1 14 0 v4 M{x} {y-5} v-4"/>'
    if kind == "round":
        return f'<circle cx="{x}" cy="{y}" r="8"/><circle cx="{x}" cy="{y}" r="4"/>'
    if kind == "oval":
        return f'<ellipse cx="{x}" cy="{y}" rx="11" ry="5"/>'
    if kind == "colosseum":
        return f'<ellipse cx="{x}" cy="{y}" rx="13" ry="10"/><ellipse cx="{x}" cy="{y}" rx="7" ry="5"/>'
    return f'<circle cx="{x}" cy="{y}" r="3"/>'

import random
random.seed(11)
def dist_seg(px, py, ax, ay, bx, by):
    dx, dy = bx - ax, by - ay
    t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy or 1)))
    return math.hypot(px - ax - t * dx, py - ay - t * dy)
RP = [P(*p) for p in tiber]
def near_river(x, y, d):
    return any(dist_seg(x, y, *RP[i], *RP[i + 1]) < d for i in range(len(RP) - 1))
def blob(cx, cy, r, sd):
    pts = []
    for k in range(36):
        a = k / 36 * 2 * math.pi
        rr = r * (1 + .16 * math.sin(3 * a + sd) + .09 * math.sin(7 * a + 2 * sd) + .05 * math.sin(13 * a + sd * 3))
        pts.append((cx + rr * math.cos(a), cy + rr * .82 * math.sin(a)))
    d = f"M{pts[0][0]:.0f} {pts[0][1]:.0f}"
    for i in range(len(pts)):
        p0, p1 = pts[i], pts[(i + 1) % len(pts)]
        d += f" Q{p0[0]:.0f} {p0[1]:.0f} {(p0[0]+p1[0])/2:.0f} {(p0[1]+p1[1])/2:.0f}"
    return d + "Z"
o = [f'<svg class="rmap" viewBox="0 0 {W} {H}" role="img" aria-label="Hand-drawn map of central Rome with our favourite restaurants">']
o.append('<defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a5a3c" stroke-width=".7" opacity=".45"/></pattern></defs>')
# watercolour washes: layered irregular blobs, the way pigment pools
o.append('<g class="washes">')
for (lat, lon, r, c) in [(41.9020,12.4560,105,"#e9c39b"),(41.8932,12.4605,95,"#cfd2a4"),(41.8865,12.4865,110,"#efb9a8"),(41.9045,12.4835,105,"#f3d49b"),(41.8955,12.4745,120,"#f4cfb0"),(41.8975,12.4930,80,"#e8c7c0"),(41.8815,12.4790,80,"#d9cfa2")]:
    x, y = P(lat, lon)
    for k in range(3):
        o.append(f'<path d="{blob(x + random.uniform(-14,14), y + random.uniform(-12,12), r * (1 - k * .18), random.uniform(0, 6))}" fill="{c}" opacity="{.22 + k * .06:.2f}"/>')
o.append('</g>')
# Leonardo-style wind lines radiating from the centre, with the eight wind names around
mx, my = W / 2, H / 2
winds = ["Tramontana", "Grecale", "Levante", "Scirocco", "Ostro", "Libeccio", "Ponente", "Maestrale"]
o.append('<g class="winds" stroke="#8a5a3c" stroke-width=".6" opacity=".55" fill="none">')
for k in range(32):
    a = k / 32 * 2 * math.pi - math.pi / 2
    o.append(f'<line x1="{mx}" y1="{my}" x2="{mx + 900*math.cos(a):.0f}" y2="{my + 900*math.sin(a):.0f}" stroke-dasharray="{"" if k % 4 == 0 else "2 5"}" opacity="{1 if k % 4 == 0 else .55}"/>')
o.append(f'<circle cx="{mx}" cy="{my}" r="{min(W,H)/2 - 26:.0f}" stroke-width="1.1"/><circle cx="{mx}" cy="{my}" r="{min(W,H)/2 - 32:.0f}"/></g>')
windtxt = []
for k, n in enumerate(winds):
    a = k / 8 * 2 * math.pi - math.pi / 2
    rr = min(W, H) / 2 - 12
    x, y = mx + rr * math.cos(a), my + rr * math.sin(a)
    windtxt.append(f'<text class="wind" x="{x:.0f}" y="{y:.0f}" text-anchor="middle" dominant-baseline="middle" transform="rotate({k*45} {x:.0f} {y:.0f})">{n.upper()}</text>')
# the city: hundreds of small hand-drawn blocks, kept off the river and the green hills
o.append('<g class="blocks" fill="none" stroke="#6b4a33" stroke-width=".7" opacity=".42">')
hills = [P(41.8935,12.4598), P(41.9128,12.4852)]
n = 0
while n < 520:
    x, y = random.uniform(40, W - 40), random.uniform(40, H - 40)
    if math.hypot(x - mx, y - my) > min(W, H) / 2 - 50 or near_river(x, y, 34) or any(math.hypot(x - hx, y - hy) < 70 for hx, hy in hills):
        continue
    w, h, a = random.uniform(7, 17), random.uniform(5, 12), random.choice([0, 0, 15, -20, 35, 90])
    o.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" transform="rotate({a} {x:.0f} {y:.0f})"/>')
    n += 1
o.append('</g>')
# hills hatched
o.append('<g>')
for (lat, lon, rx, ry) in [(41.8935,12.4598,70,120),(41.8888,12.4870,60,40),(41.8835,12.4800,70,45)]:
    x, y = P(lat, lon); o.append(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="url(#hatch)"/>')
# the Tiber: a watercolour band, inked banks and current strokes
o.append(f'<path d="{river}" fill="none" stroke="#b9cfdc" stroke-width="40" stroke-linecap="round" opacity=".85"/><path d="{river}" fill="none" stroke="#9fbccf" stroke-width="22" stroke-linecap="round" opacity=".5"/>')
o.append(f'<path d="{river}" fill="none" stroke="#5e3a26" stroke-width="1.3" transform="translate(-14 -5)"/><path d="{river}" fill="none" stroke="#5e3a26" stroke-width="1.3" transform="translate(14 5)"/>')
o.append(f'<path d="{river}" fill="none" stroke="#557a96" stroke-width=".8" stroke-dasharray="6 14" opacity=".6"/>')
ix, iy = P(41.8904, 12.4776); o.append(f'<ellipse cx="{ix}" cy="{iy}" rx="17" ry="7" transform="rotate(-25 {ix} {iy})" fill="#f3e6cf" stroke="#5e3a26" stroke-width="1.1"/>')
o.append('<g fill="#f4e8d3" stroke="#5e3a26" stroke-width="1.3">')
for (nm, lat, lon, k) in landmarks:
    x, y = P(lat, lon); o.append(icon(k, x, y))
o.append('</g>')
for (nm, lat, lon, k) in landmarks:
    x, y = P(lat, lon); o.append(f'<text class="lm" x="{x}" y="{y+25}" text-anchor="middle">{nm}</text>')
for (nm, lat, lon) in areas:
    x, y = P(lat, lon); o.append(f'<text class="area" x="{x}" y="{y}" text-anchor="middle">{nm}</text>')
tx, ty = P(41.9060, 12.4712); o.append(f'<text class="area river" x="{tx}" y="{ty}" transform="rotate(62 {tx} {ty})">Tevere</text>')
cx, cy = mx, my
o.extend(windtxt)
o.append(f'<g class="rose" transform="translate({cx} {cy}) scale(.62)" fill="none" stroke="#5e3a26" stroke-width="1"><circle r="30" fill="#f4e8d3"/><circle r="22" stroke-dasharray="2 3"/><path d="M0 -44 L6 0 L0 44 L-6 0Z M-44 0 L0 5 L44 0 L0 -5Z" fill="#f3e6cf"/><path d="M0 -44 L6 0 L-6 0Z" fill="#9E2F1E" stroke="none"/></g>')
o.append(f'<g transform="translate(60 {H-36})" stroke="#5e3a26" fill="none"><path d="M0 0 h120 M0 -5 v10 M60 -4 v8 M120 -5 v10"/><text class="lm" x="60" y="-10" text-anchor="middle" stroke="none" fill="#5e3a26">500 passi</text></g>')
o.append('</g>')
# pins
o.append('<g class="pins">')
for i, (n, a, lat, lon) in enumerate(restaurants, 1):
    x, y = P(lat, lon)
    q = (n + " " + a + " Roma").replace(" ", "+").replace("'", "%27")
    o.append(f'<a class="pin" href="https://www.google.com/maps/search/?api=1&amp;query={q}" target="_blank" rel="noopener" style="--d:{i*0.12:.2f}s"><g transform="translate({x} {y})"><path class="pin-drop" d="M0 0 C-10 -14 -14 -20 -14 -27 a14 14 0 0 1 28 0 c0 7 -4 13 -14 27Z"/><text class="pin-n" y="-23" text-anchor="middle">{i}</text><g class="pin-tip"><rect x="-4" y="-66" rx="3" height="22"/><text class="pin-l" y="-51" text-anchor="middle">{n}</text></g></g></a>')
o.append('</g></svg>')
svg = "".join(o)
legend = "".join(f'<li><a href="https://www.google.com/maps/search/?api=1&amp;query={(n+" "+a+" Roma").replace(" ","+").replace(chr(39),"%27")}" target="_blank" rel="noopener"><b>{i}</b><span>{n}<small>{a}</small></span></a></li>' for i, (n, a, la, lo) in enumerate(restaurants, 1))
json.dump({"svg": svg, "legend": legend, "w": W, "h": H}, open(__file__.replace("map.py", "map.json"), "w"))
print(W, H, len(svg))
