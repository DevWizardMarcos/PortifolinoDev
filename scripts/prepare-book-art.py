#!/usr/bin/env python3
"""Prepara a arte do livro aberto (Biblioteca dos Aprendizes e Relíquias).

Entrada:  assets/img/legados/livro-aberto-indice.png  (arte oficial, com os 9 espaços do índice na página direita)
Saídas:   assets/img/legados/livro-aberto-indice.webp (a arte, para a página de índice)
          assets/img/legados/livro-aberto.webp        (os 9 espaços preenchidos com pergaminho, para páginas de texto)

A limpeza reconstrói o pergaminho a partir do miolo dos próprios espaços (cor em baixa frequência) mais um grão fino
com a intensidade medida no papel original; molduras, fitas e sombras das molduras somem.

Uso (na raiz do projeto):  python scripts/prepare-book-art.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
FOLDER = ROOT / 'assets' / 'img' / 'legados'
SOURCE = FOLDER / 'livro-aberto-indice.png'

# Região a limpar (x0, y0, x1, y1) em pixels da arte 1759x894: cobre os 9 espaços e suas molduras.
SLOTS_BOX = (944, 92, 1588, 814)
# Espaços do índice: (topo, base) de cada moldura dourada; o miolo é o pergaminho da própria página.
SLOT_ROWS = [(110, 180), (188, 258), (267, 336), (345, 415), (423, 494), (500, 572), (580, 650), (659, 729), (737, 806)]
INNER_X = (996, 1560)   # miolo horizontal dos espaços (depois da fita vinho e da moldura)
INNER_PAD = 15          # margem interna em relação à moldura, em linhas


def gaussian(a, sigma):
    r = int(sigma * 3)
    k = np.exp(-(np.arange(-r, r + 1) ** 2) / (2 * sigma ** 2))
    k /= k.sum()
    a = np.apply_along_axis(lambda v: np.convolve(np.pad(v, r, mode='edge'), k, mode='valid'), 0, a)
    return np.apply_along_axis(lambda v: np.convolve(np.pad(v, r, mode='edge'), k, mode='valid'), 1, a)


def main():
    if not SOURCE.exists():
        raise SystemExit(f'Arte não encontrada: {SOURCE}')
    im = Image.open(SOURCE).convert('RGB')
    a = np.array(im).astype(float)
    H, W = a.shape[:2]
    x0, y0, x1, y1 = SLOTS_BOX
    ix0, ix1 = INNER_X

    # miolo limpo dos espaços (sem fitas, molduras nem as sombras internas das molduras)
    known = np.zeros((H, W))
    for top, bottom in SLOT_ROWS:
        known[top + INNER_PAD:bottom - INNER_PAD + 1, ix0:ix1 + 1] = 1.0

    # cor de baixa frequência: convolução normalizada só com o miolo (mantém as manchas e o vinheta do papel)
    den = gaussian(known, 26) + 1e-6
    low = np.stack([gaussian(a[..., c] * known, 26) / den for c in range(3)], axis=-1)

    # grão fino com a mesma intensidade do papel original (medida no miolo)
    hp = a - np.stack([gaussian(a[..., c], 2.5) for c in range(3)], axis=-1)
    sigma = np.sqrt((hp[known > 0] ** 2).mean())
    rng = np.random.default_rng(7)
    grain = np.stack([gaussian(rng.normal(0, 1, (H, W)), 0.9) for _ in range(1)], axis=-1)
    grain = grain / grain.std() * sigma * 0.9
    fill = low + grain  # o mesmo grão nos três canais mantém o matiz do papel

    mask = np.zeros((H, W))
    mask[y0:y1, x0:x1] = 1.0
    mask = np.clip(gaussian(mask, 5), 0, 1)
    full = a * (1 - mask[..., None]) + fill * mask[..., None]

    FOLDER.mkdir(parents=True, exist_ok=True)
    im.save(FOLDER / 'livro-aberto-indice.webp', 'WEBP', quality=90, method=6)
    Image.fromarray(np.clip(full, 0, 255).astype(np.uint8)).save(FOLDER / 'livro-aberto.webp', 'WEBP', quality=90, method=6)
    print('livro-aberto-indice.webp', (FOLDER / 'livro-aberto-indice.webp').stat().st_size // 1024, 'KB')
    print('livro-aberto.webp', (FOLDER / 'livro-aberto.webp').stat().st_size // 1024, 'KB')


if __name__ == '__main__':
    main()
