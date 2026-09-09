"""Mede a posição/tamanho de elementos na página, em px de tela e relativos a uma referência.

Exemplos:
    python backend/tools/measure.py ".spell-library__chamber" ".spell-book" -w 1400
    python backend/tools/measure.py ".spell-library__chamber" ".spell-library__guardians" ".spell-grimoire" --open full-stack
    python backend/tools/measure.py ".author-art-blend" ".author-eye" --style transform

O primeiro seletor é a referência: os demais também são impressos relativos a ele.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from harness import open_book, page  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("selectors", nargs="+", help="seletores CSS; o primeiro é a referência")
    parser.add_argument("-w", "--width", type=int, default=1400)
    parser.add_argument("--open", metavar="LIVRO", help="abre um volume da biblioteca antes de medir")
    parser.add_argument("--style", action="append", default=[], help="propriedade computada a imprimir (repetível)")
    args = parser.parse_args()

    with page(width=args.width) as (pg, _errors):
        if args.open:
            open_book(pg, args.open)
        else:
            pg.locator(args.selectors[0]).first.scroll_into_view_if_needed()
            pg.wait_for_timeout(500)

        rows = pg.evaluate(
            """([selectors, styles]) => selectors.flatMap(selector =>
                 [...document.querySelectorAll(selector)].map((element, index) => {
                   const rect = element.getBoundingClientRect();
                   const computed = getComputedStyle(element);
                   return { selector, index, x: rect.x, y: rect.y, w: rect.width, h: rect.height,
                            styles: Object.fromEntries(styles.map(name => [name, computed.getPropertyValue(name)])) };
                 }))""",
            [args.selectors, args.style],
        )
        if not rows:
            print("nenhum elemento encontrado")
            return
        ref = rows[0]
        print(f"referência: {ref['selector']}  x={ref['x']:.0f} y={ref['y']:.0f} w={ref['w']:.0f} h={ref['h']:.0f}")
        for row in rows[1:]:
            rel = f"rel: x={row['x'] - ref['x']:+.0f} y={row['y'] - ref['y']:+.0f}"
            abs_ = f"abs: x={row['x']:.0f} y={row['y']:.0f} w={row['w']:.0f} h={row['h']:.0f}"
            extra = "  ".join(f"{k}={v}" for k, v in row["styles"].items())
            print(f"{row['selector']}[{row['index']}]  {abs_}  {rel}  {extra}")


if __name__ == "__main__":
    main()
