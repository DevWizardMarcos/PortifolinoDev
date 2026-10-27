#!/usr/bin/env python3
"""Prepara os sprites do Guardião Leão (O Estandarte Vivo) a partir das quatro artes oficiais.

Uso (na raiz do projeto):
    python -m pip install -r scripts/requirements.txt
    python scripts/prepare-lion-assets.py            # gera assets/img/guardiao/ e assets/js/data/lionManifest.js
    python scripts/prepare-lion-assets.py --preview  # também grava pré-visualizações em scripts/.lion-preview/

Os originais em assets/img/Portais/ nunca são alterados.

O que o script faz
  1. Valida as artes (tamanho, canal alpha real, cantos transparentes).
  2. Normaliza as quatro artes para o mesmo canvas (1024x1024) e a mesma escala.
  3. Alinha o rugido 3/4 ao repouso 3/4 pelos olhos/sobrancelhas (o focinho se move de verdade: a cabeça se
     joga para trás, por isso a troca é um corte sob impacto, nunca um crossfade longo).
  4. Alinha o rugido frontal ao repouso frontal pela distância e posição dos olhos (os rostos são diferentes:
     o rugido frontal tem pele dourada — tambem so entra por corte sob impacto).
  5. Separa a juba do repouso 3/4 em quatro camadas (esquerda, direita, topo, base) com máscara suave que
     protege rosto e orelhas.
  6. Cria as camadas dos olhos do repouso 3/4: soquete escuro, iris recortada, máscara amendoada da pálpebra e
     pálpebra de pelo (recortada da própria arte, acima do olho) para a piscada.
  7. Exporta WebP com alpha e o manifesto (coordenadas em % do canvas) em assets/js/data/lionManifest.js.
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets' / 'img' / 'Portais'
OUT = ROOT / 'assets' / 'img' / 'guardiao'
MANIFEST = ROOT / 'assets' / 'js' / 'data' / 'lionManifest.js'
PREVIEW = ROOT / 'scripts' / '.lion-preview'

FILES = {
    'closed34': 'guardiao vozes.png',
    'roar34': 'guardiao vozes rugindo.png',
    'closedFront': 'guardiao vozes frente.png',
    'roarFront': 'guardiao vozes frente rugindo.png',
}
CANVAS = 1024
QUALITY = 90

# Coordenadas medidas nas artes originais (pixels do canvas 1254x1254 do repouso 3/4).
# Rodar com --preview e conferir as imagens se alguma arte for substituída.
EYES_34 = {
    'l': {'center': (694, 458), 'iris_r': 30, 'almond': {'center': (690, 461), 'a': 56, 'b': 25, 'angle': 27}},
    'r': {'center': (916, 507), 'iris_r': 18, 'almond': {'center': (927, 511), 'a': 38, 'b': 17, 'angle': -29}},
}
FACE_ELLIPSES_34 = [  # (cx, cy, rx, ry) — rosto + orelhas ficam fora das camadas de juba
    (720, 600, 300, 385), (480, 315, 105, 95), (1045, 405, 80, 80),
]
MANE_CENTER_34 = (700, 610)
ROAR34_SHIFT = (-2, 4)  # estimado por correlação nos olhos/sobrancelhas (ver docstring)


def load(name):
    path = SRC / FILES[name]
    if not path.exists():
        sys.exit(f'Arte oficial não encontrada: {path}')
    return Image.open(path).convert('RGBA')


def validate(images):
    for name, im in images.items():
        a = np.array(im)[..., 3]
        corners = [a[0, 0], a[0, -1], a[-1, 0], a[-1, -1]]
        if max(corners) > 8:
            sys.exit(f'{name}: os cantos não são transparentes — o fundo é opaco; recorte antes de continuar.')
        print(f'  {name:12s} {im.size[0]}x{im.size[1]}  alpha real  transparente {round((a < 10).mean() * 100, 1)}%')


def place(im, scale, offset=(0, 0)):
    """Redimensiona e posiciona no canvas final, centrando a arte original."""
    w, h = round(im.width * scale), round(im.height * scale)
    scaled = im.resize((w, h), Image.LANCZOS)
    canvas = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    canvas.alpha_composite(scaled, ((CANVAS - w) // 2 + offset[0], (CANVAS - h) // 2 + offset[1]))
    return canvas


def centroid(im, box, mask_fn):
    x0, x1, y0, y1 = box
    c = np.array(im)[y0:y1, x0:x1, :3].astype(int)
    ys, xs = np.where(mask_fn(c[..., 0], c[..., 1], c[..., 2]))
    if not len(xs):
        sys.exit(f'Olho não detectado em {box}')
    return xs.mean() + x0, ys.mean() + y0


def ellipse_mask(size, cx, cy, rx, ry, angle=0.0, blur=0.0):
    m = Image.new('L', size, 0)
    d = ImageDraw.Draw(m)
    t = np.linspace(0, 2 * np.pi, 120)
    ca, sa = np.cos(np.radians(angle)), np.sin(np.radians(angle))
    pts = [(cx + rx * np.cos(a) * ca - ry * np.sin(a) * sa, cy + rx * np.cos(a) * sa + ry * np.sin(a) * ca) for a in t]
    d.polygon(pts, fill=255)
    return m.filter(ImageFilter.GaussianBlur(blur)) if blur else m


def gaussian(a, sigma):
    """Gaussiana separável em numpy (normalized convolution para preencher a pálpebra)."""
    radius = int(sigma * 3)
    kernel = np.exp(-(np.arange(-radius, radius + 1) ** 2) / (2 * sigma ** 2))
    kernel /= kernel.sum()
    out = np.apply_along_axis(lambda v: np.convolve(v, kernel, mode='same'), 0, a)
    return np.apply_along_axis(lambda v: np.convolve(v, kernel, mode='same'), 1, out)


def smoothstep(edge0, edge1, x):
    t = np.clip((x - edge0) / (edge1 - edge0), 0, 1)
    return t * t * (3 - 2 * t)


def save(im, name, manifest_files):
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / name
    im.save(path, 'WEBP', quality=QUALITY, method=6, alpha_quality=95)
    manifest_files[name] = path.stat().st_size
    return path


def pct(value):
    return round(value / CANVAS * 100, 3)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--preview', action='store_true')
    args = parser.parse_args()

    print('Validando as artes oficiais…')
    originals = {name: load(name) for name in FILES}
    validate(originals)

    S = CANVAS / 1254
    sizes = {}
    files = {}

    # --- Pose 3/4: repouso e rugido alinhado ---
    closed34 = place(originals['closed34'], S)
    roar34 = place(originals['roar34'], S, (round(ROAR34_SHIFT[0] * S), round(ROAR34_SHIFT[1] * S)))
    save(closed34, 'closed-34.webp', files)
    save(roar34, 'roar-34.webp', files)

    # --- Pose frontal: alinhamento por olhos (distância e ponto médio) ---
    cf = originals['closedFront']
    rf = originals['roarFront']
    cl = centroid(cf, (440, 570, 450, 545), lambda r, g, b: (b > 200) & (r > 150) & (g > 70))
    cr = centroid(cf, (690, 810, 450, 545), lambda r, g, b: (b > 200) & (r > 150) & (g > 70))
    rl = centroid(rf, (460, 580, 410, 495), lambda r, g, b: (r > 215) & (g > 140) & (b < 130))
    rr = centroid(rf, (730, 850, 410, 495), lambda r, g, b: (r > 215) & (g > 140) & (b < 130))
    iod_c, iod_r = cr[0] - cl[0], rr[0] - rl[0]
    k = S * iod_c / iod_r
    mid_c = ((cl[0] + cr[0]) / 2, (cl[1] + cr[1]) / 2)
    mid_r = ((rl[0] + rr[0]) / 2, (rl[1] + rr[1]) / 2)
    closed_front = place(cf, S)
    MARGIN = 28

    def place_roar_front(scale):
        w, h = round(rf.width * scale), round(rf.height * scale)
        left, top = round(mid_c[0] * S - mid_r[0] * scale), round(mid_c[1] * S - mid_r[1] * scale)
        canvas = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
        canvas.paste(rf.resize((w, h), Image.LANCZOS), (left, top))
        return canvas

    roar_front = place_roar_front(k)
    x0, y0, x1, y1 = roar_front.getchannel('A').getbbox()
    fit = min(1.0, (CANVAS - 2 * MARGIN) / (x1 - x0), (CANVAS - 2 * MARGIN) / (y1 - y0))
    if fit < 1.0 or min(x0, y0, CANVAS - x1, CANVAS - y1) < MARGIN:
        # prioriza a juba inteira dentro do canvas; o alinhamento dos olhos cede poucos pixels
        roar_front = place_roar_front(k * fit)
        x0, y0, x1, y1 = roar_front.getchannel('A').getbbox()
        dx = (CANVAS - (x0 + x1)) // 2
        dy = max(MARGIN - y0, min(CANVAS - MARGIN - y1, 0))
        shifted = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
        shifted.paste(roar_front, (dx, dy))
        roar_front = shifted
    bbox = roar_front.getchannel('A').getbbox()
    print(f'  rugido frontal: escala {k * fit / S:.3f}x, bbox {bbox}')
    save(closed_front, 'closed-front.webp', files)
    save(roar_front, 'roar-front.webp', files)

    # --- Juba do repouso 3/4 em quatro camadas ---
    src = np.array(originals['closed34'])
    H, W = src.shape[:2]
    face = Image.new('L', (W, H), 0)
    for cx, cy, rx, ry in FACE_ELLIPSES_34:
        face = Image.fromarray(np.maximum(np.array(face), np.array(ellipse_mask((W, H), cx, cy, rx, ry))))
    face = face.filter(ImageFilter.GaussianBlur(48))
    mane = 1.0 - np.array(face).astype(float) / 255
    yy, xx = np.mgrid[0:H, 0:W]
    cx, cy = MANE_CENTER_34
    sectors = {
        'l': smoothstep(-160, 140, cx - xx), 'r': smoothstep(-160, 140, xx - cx),
        't': smoothstep(-160, 140, cy - yy), 'b': smoothstep(-160, 140, yy - cy),
    }
    for key, weight in sectors.items():
        layer = src.copy()
        alpha = src[..., 3].astype(float) / 255
        layer[..., 3] = (255 * alpha * alpha * mane * weight).astype(np.uint8)
        save(place(Image.fromarray(layer), S), f'mane-{key}.webp', files)

    # --- Olhos do repouso 3/4 ---
    eyes_manifest = {}
    for side, eye in EYES_34.items():
        icx, icy = eye['center']
        r = eye['iris_r']
        al = eye['almond']
        pad = int(max(al['a'], al['b']) * 1.35) + 14
        box = tuple(int(round(v)) for v in (al['center'][0] - pad, al['center'][1] - pad, al['center'][0] + pad, al['center'][1] + pad))
        size = (box[2] - box[0], box[3] - box[1])
        crop = originals['closed34'].crop(box)
        ox, oy = al['center'][0] - box[0], al['center'][1] - box[1]

        almond = ellipse_mask(size, ox, oy, al['a'], al['b'], al['angle'], blur=1.4)
        lid_mask = ellipse_mask(size, ox, oy, al['a'] + 6, al['b'] + 6, al['angle'], blur=2.0)

        # soquete escuro: cor média dos pixels escuros dentro da abertura (o que há atrás da iris)
        arr = np.array(crop).astype(float)
        pick = (arr[..., :3].sum(2) < 160) & (np.array(almond) > 128)
        socket_rgb = tuple(int(v) for v in (arr[pick][:, :3].mean(0) if pick.sum() > 20 else (28, 12, 64)))
        socket = Image.new('RGBA', size, socket_rgb + (255,))
        socket.putalpha(ellipse_mask(size, icx - box[0], icy - box[1], r - 1, r - 1, 0, blur=1.2))

        iris = crop.copy()
        iris.putalpha(ellipse_mask(size, icx - box[0], icy - box[1], r + 2, r + 2, 0, blur=1.4))

        # pálpebra: preenchida por difusão a partir do pelo ao redor (anel fora do contorno escuro do olho)
        outer = np.array(ellipse_mask(size, ox, oy, al['a'] + 22, al['b'] + 22, al['angle'])) > 128
        inner = np.array(ellipse_mask(size, ox, oy, al['a'] + 11, al['b'] + 11, al['angle'])) > 128
        known = (outer & ~inner).astype(float)
        fill = np.zeros((size[1], size[0], 3))
        den = gaussian(known, 9) + 1e-6
        for c in range(3):
            fill[..., c] = gaussian(arr[..., c] * known, 9) / den
        lid_arr = fill
        rim = np.array(lid_mask).astype(float) - np.array(lid_mask.filter(ImageFilter.MinFilter(7))).astype(float)
        rim = np.array(Image.fromarray(np.clip(rim, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.8))).astype(float) / 255
        lid_arr = lid_arr * (1 - 0.55 * rim[..., None])
        lid = Image.fromarray(np.clip(lid_arr, 0, 255).astype(np.uint8)).convert('RGBA')

        def alpha_mask(mask):
            return Image.merge('RGBA', (Image.new('L', size, 255),) * 3 + (mask,))
        for tag, im in (('socket', socket), ('iris', iris), ('lid', lid)):
            save(im, f'eye-{side}-{tag}.webp', files)
        save(alpha_mask(almond), f'eye-{side}-mask.webp', files)
        save(alpha_mask(lid_mask), f'eye-{side}-lidmask.webp', files)

        eyes_manifest[side] = {
            'box': [pct(box[0] * S), pct(box[1] * S), pct(size[0] * S), pct(size[1] * S)],
            'irisRadiusPct': round(r * S / CANVAS * 100, 3),
            'sizePx': [round(size[0] * S), round(size[1] * S)],
        }
        if args.preview:
            PREVIEW.mkdir(exist_ok=True)
            frames = []
            for dx, dy, closed in ((0, 0, 0), (6, -2, 0), (-6, 3, 0), (0, 0, 1)):
                composed = originals['closed34'].crop(box)
                eye_layer = Image.new('RGBA', size, (0, 0, 0, 0))
                eye_layer.alpha_composite(socket)
                moved = Image.new('RGBA', size, (0, 0, 0, 0))
                moved.alpha_composite(iris, (dx, dy))
                eye_layer.alpha_composite(moved)
                cut = np.array(eye_layer)
                cut[..., 3] = (cut[..., 3].astype(float) * np.array(almond) / 255).astype(np.uint8)
                composed.alpha_composite(Image.fromarray(cut))
                if closed:
                    lid_cut = np.array(lid)
                    lid_cut[..., 3] = np.array(lid_mask)
                    composed.alpha_composite(Image.fromarray(lid_cut))
                frames.append(composed.resize((size[0] * 3, size[1] * 3), Image.LANCZOS))
            sheet = Image.new('RGB', (sum(fr.width for fr in frames) + 30, frames[0].height), (0, 0, 0))
            x = 0
            for fr in frames:
                sheet.paste(fr.convert('RGB'), (x, 0)); x += fr.width + 10
            sheet.save(PREVIEW / f'eye-{side}.png')

    if args.preview:
        PREVIEW.mkdir(exist_ok=True)
        # juba: máscara de rosto e soma das camadas em repouso devem reproduzir a arte
        stack = Image.open(OUT / 'closed-34.webp').convert('RGBA')
        for key in sectors:
            stack.alpha_composite(Image.open(OUT / f'mane-{key}.webp').convert('RGBA'))
        bg = Image.new('RGBA', (CANVAS, CANVAS), (20, 10, 30, 255))
        a_img, b_img = bg.copy(), bg.copy()
        a_img.alpha_composite(stack); b_img.alpha_composite(closed34)
        diff = np.abs(np.array(a_img).astype(int) - np.array(b_img).astype(int))[..., :3].max()
        print(f'  preview: diferença máxima juba empilhada x original = {diff}')
        Image.fromarray((np.array(face)).astype(np.uint8)).resize((512, 512)).save(PREVIEW / 'face-mask.png')

    manifest = {
        'canvas': CANVAS,
        'poses': {
            'threeQuarter': {'closed': 'closed-34.webp', 'roar': 'roar-34.webp'},
            'front': {'closed': 'closed-front.webp', 'roar': 'roar-front.webp'},
        },
        'mane': {key: f'mane-{key}.webp' for key in sectors},
        'eyes': {side: dict(data, socket=f'eye-{side}-socket.webp', iris=f'eye-{side}-iris.webp', lid=f'eye-{side}-lid.webp', mask=f'eye-{side}-mask.webp', lidMask=f'eye-{side}-lidmask.webp') for side, data in eyes_manifest.items()},
        'pivot': {'x': pct(MANE_CENTER_34[0] * S), 'y': pct(MANE_CENTER_34[1] * S)},
        'bytes': files,
    }
    MANIFEST.write_text('// Gerado por scripts/prepare-lion-assets.py — não editar à mão.\nwindow.lionManifest = ' + json.dumps(manifest, indent=2) + ';\n', encoding='utf-8')
    total = sum(files.values()) / 1024
    print(f'Pronto: {len(files)} sprites em {OUT.relative_to(ROOT)} ({total:.0f} KB) e {MANIFEST.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
