#!/usr/bin/env python3
"""Prepara as artes do Conselho dos Oito (Mestre da Guilda e Coruja Arquivista).

Entradas (originais, nunca alterados):
    assets/img/Portais/avatares/Mago Neon em Trono Arcano.png
    assets/img/Portais/avatares/Coruja arcana sob luz neon.png
    assets/img/Portais/Câmara Gótica do Conselho Arcano.png

Saídas em assets/img/conselho/:
    mestre-cena.webp / coruja-cena.webp     só o personagem (sem trono nem objetos de mesa), para a cadeira do cenário
    mestre-arte.webp  / coruja-arte.webp    arte oficial inteira, otimizada, para o modal individual
    mestre-retrato.webp / coruja-retrato.webp  retrato quadrado, para a faixa de personagens e o cabeçalho
    camara-conselho.webp                     o cenário otimizado

As duas artes já têm alpha real, mas trazem o trono e os objetos de mesa junto do personagem. Como o cenário já tem
cadeiras e mesa, o recorte "cena" usa um polígono desenhado sobre a silhueta (cabelo, capuz, robe, braços, livro) — não
apaga partes escuras das roupas e preserva a arte original pixel a pixel dentro do polígono. Para adicionar outro
conselheiro, inclua a arte aqui (ART), desenhe o polígono e rode o script.

Uso (raiz do projeto):  python scripts/prepare-council-avatars.py [--preview]
"""
import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets' / 'img' / 'Portais'
OUT = ROOT / 'assets' / 'img' / 'conselho'
PREVIEW = ROOT / 'scripts' / '.council-preview'
SCENE = SRC / 'Câmara Gótica do Conselho Arcano.png'

# polígono = silhueta do personagem nas coordenadas da arte original (None = só arte e retrato, sem sprite de cena);
# portrait = caixa quadrada do retrato (x0, y0, x1, y1)
AV = SRC / 'avatares'
ART = {
    'mestre': {
        'file': AV / 'Mago Neon em Trono Arcano.png',
        # a arte atual do Mestre é opaca (cenário inteiro atrás): o polígono segue capuz, cabelo, ombros, braços e mãos
        'polygon': [
            (296, 640), (318, 560), (335, 490), (320, 410), (318, 350), (332, 300), (370, 262), (430, 238), (500, 230),
            (575, 238), (632, 278), (652, 330), (656, 385), (690, 398), (740, 425), (795, 480), (850, 540), (882, 610),
            (900, 690), (892, 770), (872, 830), (830, 860), (770, 895), (740, 930), (690, 945), (600, 975), (560, 990),
            (480, 992), (430, 990), (385, 945), (352, 885), (340, 830), (318, 760),
        ],
        'portrait': (300, 220, 740, 660),
    },
    'coruja': {
        'file': AV / 'Coruja arcana sob luz neon.png',
        'polygon': [
            (210, 760), (300, 650), (335, 590), (400, 510), (470, 470), (490, 440), (505, 330), (525, 255), (560, 285),
            (620, 330), (700, 340), (780, 360), (850, 395), (930, 385), (975, 352), (955, 410), (920, 450), (905, 490),
            (930, 540), (990, 580), (1030, 630), (1045, 690), (1055, 720), (1100, 740), (1135, 800), (1145, 940),
            (1085, 990), (1000, 1030), (930, 1090), (800, 1095), (700, 1100), (640, 1085), (560, 1095), (500, 1100),
            (480, 1075), (400, 1040), (330, 1025), (280, 985), (245, 915), (215, 840),
        ],
        'portrait': (440, 220, 1010, 790),
    },
    # artes 384x512 (alpha real; trono e objetos de mesa junto do personagem)
    'gnomo': {
        'file': AV / 'gnomo_engenheiro_conselho.png',
        'polygon': [
            (100, 404), (95, 330), (108, 285), (130, 240), (112, 212), (145, 195), (165, 160), (215, 150), (260, 170),
            (290, 215), (300, 255), (330, 262), (365, 285), (384, 310), (384, 385), (340, 402), (180, 408),
        ],
        'portrait': (100, 140, 320, 360),
    },
    'draconata': {
        'file': AV / 'draconata_estrategista_conselho.png',
        'polygon': [
            (0, 392), (10, 360), (40, 300), (80, 270), (110, 240), (125, 200), (122, 160), (150, 125), (170, 105),
            (200, 110), (235, 120), (270, 150), (275, 130), (285, 185), (300, 230), (330, 250), (360, 280), (384, 320),
            (384, 392),
        ],
        'portrait': (100, 90, 320, 310),
    },
    'goblin': {
        'file': AV / 'goblin_inventor_conselho.png',
        'polygon': [
            (40, 332), (45, 285), (75, 255), (100, 240), (68, 168), (135, 175), (165, 140), (200, 125), (235, 135),
            (260, 150), (290, 225), (335, 235), (300, 250), (340, 280), (384, 300), (384, 335), (300, 338), (230, 345),
            (150, 340),
        ],
        'portrait': (60, 110, 300, 350),
    },
    'lobo': {
        'file': AV / 'lobo_guardiao_conselho.png',
        'polygon': [
            (0, 392), (0, 305), (20, 255), (60, 228), (110, 208), (150, 180), (165, 120), (175, 70), (195, 60),
            (215, 72), (240, 75), (262, 70), (272, 110), (285, 150), (300, 190), (330, 215), (384, 230), (384, 392),
        ],
        'portrait': (120, 40, 320, 240),
    },
    # sem cadeira de frente no cenário: só arte (modal) e retrato (faixa de personagens)
    'raposa': {'file': AV / 'raposa_emissaria_conselho.png', 'polygon': None, 'portrait': (90, 20, 300, 230)},
    'ent': {'file': AV / 'ent_explorador_conselho.png', 'polygon': None, 'portrait': (80, 60, 320, 300)},
}

# só para a prévia (a posição de verdade fica em assets/js/data/councilMembers.js): âncora = centro da base do recorte,
# em % do cenário; width = largura do recorte em % da largura do cenário
PREVIEW_PLACEMENT = {
    'mestre': {'x': 19.6, 'y': 65.2, 'width': 13.4},
    'coruja': {'x': 82.0, 'y': 68.6, 'width': 18.5},
    'gnomo': {'x': 19.4, 'y': 43.4, 'width': 12.0},
    'draconata': {'x': 37.6, 'y': 36.2, 'width': 11.0},
    'goblin': {'x': 64.0, 'y': 35.4, 'width': 10.8},
    'lobo': {'x': 80.4, 'y': 44.4, 'width': 12.4},
}
# primeiro plano (braço acolchoado da cadeira / quina da mesa), em pixels do cenário 1536x1024: reaparece por cima
PREVIEW_OCCLUSION = {
    'mestre': [(298, 650), (318, 626), (395, 620), (432, 634), (442, 662), (442, 705), (298, 705)],
    'coruja': [(1095, 690), (1105, 655), (1140, 648), (1200, 650), (1228, 668), (1234, 705), (1095, 708)],
    'gnomo': [(240, 442), (255, 415), (300, 405), (325, 418), (335, 445), (335, 485), (245, 485)],
    'draconata': [(500, 352), (560, 345), (620, 340), (660, 350), (660, 400), (500, 400)],
    'goblin': [(890, 346), (960, 340), (1040, 344), (1060, 352), (1060, 400), (890, 400)],
    'lobo': [(1198, 458), (1215, 440), (1280, 438), (1295, 452), (1290, 500), (1200, 500)],
}


def save(im, name, quality=88):
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / name
    im.save(path, 'WEBP', quality=quality, method=6, alpha_quality=96)
    print(f'  {name:26s} {im.size[0]}x{im.size[1]}  {path.stat().st_size // 1024} KB')
    return im


def cutout(art, polygon):
    """Aplica o polígono (com 1,6 px de suavização) sobre o alpha original e recorta na caixa do personagem."""
    mask = Image.new('L', art.size, 0)
    ImageDraw.Draw(mask).polygon(polygon, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(1.6))
    alpha = np.minimum(np.array(art.getchannel('A')).astype(int), np.array(mask).astype(int)).astype(np.uint8)
    out = art.copy()
    out.putalpha(Image.fromarray(alpha))
    return out.crop(out.getchannel('A').getbbox())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--preview', action='store_true')
    args = parser.parse_args()

    for path in [SCENE] + [item['file'] for item in ART.values()]:
        if not path.exists():
            raise SystemExit(f'Arte não encontrada: {path}')

    print('Cenário…')
    scene = Image.open(SCENE).convert('RGB')
    save(scene.resize((1536, 1024), Image.LANCZOS) if scene.size != (1536, 1024) else scene, 'camara-conselho.webp', 86)

    sprites = {}
    for key, item in ART.items():
        print(f'{key}…')
        art = Image.open(item['file']).convert('RGBA')
        a = np.array(art.getchannel('A'))
        print(f'  original {art.width}x{art.height}, alpha real (transparente {round((a < 10).mean() * 100, 1)}%)')
        scale = 900 / art.width if art.width > 900 else 1
        save(art.resize((round(art.width * scale), round(art.height * scale)), Image.LANCZOS) if scale < 1 else art, f'{key}-arte.webp', 86)
        x0, y0, x1, y1 = item['portrait']
        save(art.crop((x0, y0, x1, y1)).resize((320, 320), Image.LANCZOS), f'{key}-retrato.webp', 88)
        if item['polygon']:
            sprite = cutout(art, item['polygon'])
            if sprite.width > 700:  # artes grandes: reduz; as de 384 px ficam no tamanho original (sem ampliar)
                sprite = sprite.resize((round(sprite.width * 0.7), round(sprite.height * 0.7)), Image.LANCZOS)
            sprites[key] = save(sprite, f'{key}-cena.webp', 90)

    if args.preview:
        PREVIEW.mkdir(exist_ok=True)
        base = scene.convert('RGBA')
        # do mais distante ao mais próximo da câmera: cada personagem entra com o próprio primeiro plano logo acima dele
        for key in ('draconata', 'goblin', 'gnomo', 'lobo', 'mestre', 'coruja'):
            placement = PREVIEW_PLACEMENT[key]
            sprite = sprites[key]
            w = round(base.width * placement['width'] / 100)
            h = round(sprite.height * w / sprite.width)
            resized = sprite.resize((w, h), Image.LANCZOS)
            left = round(base.width * placement['x'] / 100 - w / 2)
            top = round(base.height * placement['y'] / 100 - h)
            base.alpha_composite(resized, (left, top))
            mask = Image.new('L', base.size, 0)
            ImageDraw.Draw(mask).polygon(PREVIEW_OCCLUSION[key], fill=255)
            base.paste(scene.convert('RGBA'), (0, 0), mask.filter(ImageFilter.GaussianBlur(1.2)))
        base.convert('RGB').save(PREVIEW / 'cena.png')
        final = base.convert('RGB')
        for name, box in {'mestre': (100, 380, 480, 760), 'gnomo': (150, 200, 470, 520), 'draconata': (460, 170, 720, 400), 'goblin': (860, 170, 1120, 400), 'lobo': (1100, 240, 1400, 560)}.items():
            crop = final.crop(box)
            crop.resize((crop.width * 2, crop.height * 2), Image.LANCZOS).save(PREVIEW / f'zoom-{name}.png')
        base.convert('RGB').crop((1060, 440, 1440, 800)).resize((760, 720), Image.LANCZOS).save(PREVIEW / 'zoom-coruja.png')
        # recorte do que foi mantido, sobre fundo cinza, para conferir a silhueta
        for key, sprite in sprites.items():
            bg = Image.new('RGBA', sprite.size, (70, 70, 70, 255))
            bg.alpha_composite(sprite)
            bg.convert('RGB').save(PREVIEW / f'{key}-recorte.png')
        print('prévias em', PREVIEW.relative_to(ROOT))


if __name__ == '__main__':
    main()
