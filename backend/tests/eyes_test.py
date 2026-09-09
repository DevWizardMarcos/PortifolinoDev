"""Teste visual do "olhar" da arte de Minha Origem (assets/js/about-author.js).

Verifica, no navegador real:
  1. amplitude: íris até ±3.5px na horizontal e ±1.6px na vertical; arte até 3/2px
     (os olhos reagem mais que a arte);
  2. retorno suave ao olhar original ao sair da arte (< 1s, sem salto);
  3. respiração das fênix ativa (opacidade varia no tempo);
  4. isolamento: forçando só --eye-x/--eye-y, apenas os pixels dentro das
     elipses dos olhos mudam (nenhum vazamento em pálpebra/sobrancelha);
  5. reduced-motion: olhos e partículas ocultos, sem animação, JS inerte;
  6. sem erros de JavaScript no console.

Gera em backend/output/: eyes-positions.png (olho ampliado por posição do
cursor) e eyes-isolated.png (deslocamento puro da íris). Sai com código 1 se
algo falhar.

    python backend/tests/eyes_test.py [-w 1400]
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from harness import OUTPUT, page  # noqa: E402

ZOOM = 5
EYE_MAX = {"x": 3.5, "y": 1.6}
ART_MAX = {"x": 3.0, "y": 2.0}
failures: list[str] = []


def check(condition: bool, message: str) -> None:
    print(("  ok  " if condition else "  FALHA ") + message)
    if not condition:
        failures.append(message)


def read_vars(pg) -> dict:
    return pg.evaluate(
        """() => {
          const px = name => parseFloat(document.querySelector('.author-art-motion').style.getPropertyValue(name)) || 0;
          const eye = name => parseFloat(document.querySelector('.author-art-life').style.getPropertyValue(name)) || 0;
          return { ax: px('--parallax-x'), ay: px('--parallax-y'), ex: eye('--eye-x'), ey: eye('--eye-y') };
        }"""
    )


def sheet(paths: list[Path], target: Path, columns: int) -> None:
    tiles = [Image.open(p) for p in paths]
    w, h = tiles[0].size
    rows = -(-len(tiles) // columns)
    out = Image.new("RGB", (w * ZOOM * columns, (h * ZOOM + 4) * rows), "black")
    for i, tile in enumerate(tiles):
        out.paste(tile.resize((w * ZOOM, h * ZOOM), Image.NEAREST), ((i % columns) * w * ZOOM, (i // columns) * (h * ZOOM + 4)))
    out.save(target)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("-w", "--width", type=int, default=1400)
    args = parser.parse_args()
    tmp = OUTPUT / "eyes-tmp"
    tmp.mkdir(parents=True, exist_ok=True)

    with page(width=args.width) as (pg, errors):
        art = pg.locator(".author-art-blend")
        art.scroll_into_view_if_needed()
        pg.wait_for_timeout(1200)
        r = art.bounding_box()
        img = pg.locator(".author-art-motion > img").bounding_box()
        # recorte do olho direito (do observador), em px de página
        clip = {"x": img["x"] + img["width"] * .36, "y": img["y"] + img["height"] * .29,
                "width": img["width"] * .13, "height": img["height"] * .065}

        print("1. amplitude por posição do cursor")
        positions = {
            "neutral": None,
            "esquerda": (r["x"] + 10, r["y"] + r["height"] * .32),
            "direita": (r["x"] + r["width"] - 10, r["y"] + r["height"] * .32),
            "topo": (r["x"] + r["width"] * .45, r["y"] + 5),
            "base": (r["x"] + r["width"] * .45, r["y"] + r["height"] - 5),
            "rosto": (r["x"] + r["width"] * .443, r["y"] + r["height"] * .322),
        }
        shots: list[Path] = []
        readings: dict[str, dict] = {}
        for name, point in positions.items():
            if point:
                pg.mouse.move(*point, steps=8)
                pg.wait_for_timeout(1000)
            path = tmp / f"pos-{name}.png"
            pg.screenshot(path=str(path), clip=clip)
            shots.append(path)
            readings[name] = read_vars(pg)
            print(f"     {name:9s} arte=({readings[name]['ax']:+.2f}, {readings[name]['ay']:+.2f})px  íris=({readings[name]['ex']:+.2f}, {readings[name]['ey']:+.2f})px")
        sheet(shots, OUTPUT / "eyes-positions.png", columns=2)
        for name, v in readings.items():
            check(abs(v["ex"]) <= EYE_MAX["x"] + .05 and abs(v["ey"]) <= EYE_MAX["y"] + .05, f"{name}: íris dentro do limite")
            check(abs(v["ax"]) <= ART_MAX["x"] + .05 and abs(v["ay"]) <= ART_MAX["y"] + .05, f"{name}: arte dentro do limite")
        check(readings["direita"]["ex"] > 0 and readings["esquerda"]["ex"] < 0, "íris segue o cursor na horizontal")
        check(readings["topo"]["ey"] < 0 and readings["base"]["ey"] > 0, "íris segue o cursor na vertical")
        check(abs(readings["direita"]["ex"]) > abs(readings["direita"]["ax"]), "olhos reagem mais que a arte")
        check(abs(readings["rosto"]["ex"]) < .3 and abs(readings["rosto"]["ey"]) < .3, "cursor no rosto = olhar original")

        print("2. retorno ao neutro")
        pg.mouse.move(r["x"] + r["width"] - 10, r["y"] + r["height"] * .32, steps=4)
        pg.wait_for_timeout(1000)
        pg.mouse.move(r["x"] + r["width"] + 200, r["y"] + 50, steps=3)
        samples = {}
        elapsed = 0
        for t in (0, 150, 300, 500, 800, 1200):
            pg.wait_for_timeout(t - elapsed)
            elapsed = t
            samples[t] = read_vars(pg)["ex"]
            print(f"     +{t:4d}ms  íris x = {samples[t]:+.2f}px")
        check(samples[150] < samples[0] < EYE_MAX["x"] + .05, "retorno começa suave (sem snap)")
        check(abs(samples[800]) < .15, "praticamente no lugar em 800ms")
        check(abs(samples[1200]) < .05, "assentado em 1.2s")

        print("3. respiração das fênix")
        opacities = []
        for _ in range(4):
            opacities.append(float(pg.evaluate("() => getComputedStyle(document.querySelector('.author-glow--blue')).opacity")))
            pg.wait_for_timeout(700)
        print("     opacidade fênix azul:", [f"{o:.3f}" for o in opacities])
        check(max(opacities) - min(opacities) > .005, "brilho da fênix varia no tempo")

        print("4. isolamento do deslocamento da íris")
        pg.mouse.move(r["x"] + r["width"] + 200, r["y"] + 50)
        pg.wait_for_timeout(1500)
        eyes = [e.bounding_box() for e in pg.locator(".author-eye").all()]
        base_path = tmp / "iso-neutral.png"
        pg.screenshot(path=str(base_path), clip=clip)
        base = np.asarray(Image.open(base_path).convert("RGB")).astype(int)
        # máscara do recorte: True onde há caixa de olho (com 1px de folga)
        allowed = np.zeros(base.shape[:2], dtype=bool)
        for b in eyes:
            x0 = max(0, int(b["x"] - clip["x"]) - 1)
            y0 = max(0, int(b["y"] - clip["y"]) - 1)
            x1 = int(b["x"] + b["width"] - clip["x"]) + 2
            y1 = int(b["y"] + b["height"] - clip["y"]) + 2
            allowed[y0:y1, x0:x1] = True
        iso_paths = [base_path]
        for name, ex, ey in (("dir", EYE_MAX["x"], 0), ("esq", -EYE_MAX["x"], 0), ("baixo", 0, EYE_MAX["y"]), ("cima", 0, -EYE_MAX["y"])):
            pg.evaluate(f"() => {{ const l = document.querySelector('.author-art-life'); l.style.setProperty('--eye-x', '{ex}px'); l.style.setProperty('--eye-y', '{ey}px'); }}")
            pg.wait_for_timeout(150)
            path = tmp / f"iso-{name}.png"
            pg.screenshot(path=str(path), clip=clip)
            iso_paths.append(path)
            diff = np.abs(np.asarray(Image.open(path).convert("RGB")).astype(int) - base).sum(axis=2)
            changed = diff > 24
            if not changed.any():
                check(False, f"{name}: a íris se moveu")
                continue
            leaked = int((changed & ~allowed).sum())
            print(f"     {name:5s} pixels alterados={int(changed.sum()):4d}  fora das caixas dos olhos={leaked}")
            check(leaked == 0, f"{name}: mudança confinada às caixas dos olhos")
        sheet(iso_paths, OUTPUT / "eyes-isolated.png", columns=1)

        print("6. console")
        js_errors = [e for e in errors if "404" not in e]
        check(not js_errors, "sem erros de JavaScript" + (f" ({js_errors})" if js_errors else ""))

    print("5. reduced-motion")
    with page(width=args.width, reduced_motion=True) as (pg, _):
        pg.locator("#sobre-mim").scroll_into_view_if_needed()
        pg.wait_for_timeout(600)
        hidden = pg.evaluate("() => [...document.querySelectorAll('.author-eye,.author-mote')].every(e => getComputedStyle(e).display === 'none')")
        animation = pg.evaluate("() => getComputedStyle(document.querySelector('.author-glow--blue')).animationName")
        r = pg.locator(".author-art-blend").bounding_box()
        pg.mouse.move(r["x"] + r["width"] - 10, r["y"] + 200, steps=5)
        pg.wait_for_timeout(800)
        v = read_vars(pg)
        check(hidden, "olhos e partículas ocultos")
        check(animation == "none", "fênix sem animação")
        check(v["ex"] == 0 and v["ax"] == 0, "JS não move nada")

    for p in tmp.iterdir():
        p.unlink()
    tmp.rmdir()
    print(f"\n{'TUDO OK' if not failures else str(len(failures)) + ' falha(s)'} — capturas em {OUTPUT.relative_to(OUTPUT.parents[1])}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
