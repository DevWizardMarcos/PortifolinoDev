"""Captura uma seção (ou a página) do site em um viewport escolhido.

Exemplos:
    python backend/tools/screenshot.py                                # #sobre-mim em 1400px
    python backend/tools/screenshot.py -s "#arsenal-skills" -w 800    # biblioteca em tablet
    python backend/tools/screenshot.py -s "#arsenal-skills" --open full-stack
    python backend/tools/screenshot.py -s "#sobre-mim" -w 420 --mobile
    python backend/tools/screenshot.py -s "#sobre-mim" --reduced-motion

As imagens vão para backend/output/.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from harness import OUTPUT, box, open_book, page  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("-s", "--selector", default="#sobre-mim", help="seletor CSS do que capturar (padrão: #sobre-mim)")
    parser.add_argument("-w", "--width", type=int, default=1400, help="largura do viewport em px")
    parser.add_argument("-o", "--out", help="nome do arquivo (padrão: <seletor>-<largura>.png)")
    parser.add_argument("--open", metavar="LIVRO", help="abre um volume da biblioteca antes de capturar")
    parser.add_argument("--mobile", action="store_true", help="emula toque/mobile")
    parser.add_argument("--reduced-motion", action="store_true", help="emula prefers-reduced-motion: reduce")
    parser.add_argument("--full-page", action="store_true", help="captura a página inteira em vez do seletor")
    args = parser.parse_args()

    name = args.out or f"{args.selector.strip('#.').replace(' ', '_')}-{args.width}.png"
    target = OUTPUT / name

    with page(width=args.width, mobile=args.mobile, reduced_motion=args.reduced_motion) as (pg, errors):
        if args.open:
            open_book(pg, args.open)
        if args.full_page:
            pg.screenshot(path=str(target), full_page=True)
        else:
            element = pg.locator(args.selector).first
            element.scroll_into_view_if_needed()
            pg.wait_for_timeout(800)
            element.screenshot(path=str(target))
            print("caixa:", box(pg, args.selector))
        print("salvo em:", target.relative_to(target.parents[2]))
        if errors:
            print("erros de console:", *errors, sep="\n  ")


if __name__ == "__main__":
    main()
