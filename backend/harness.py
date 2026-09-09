"""Infra compartilhada das ferramentas: sobe o site estático local e abre um
navegador headless (Playwright). Nada aqui roda em produção — o site continua
100% estático; esta pasta é só bastidor (testes visuais e medições).

Uso típico:

    from harness import page, box

    with page(width=1400) as (pg, errors):
        pg.locator("#sobre-mim").scroll_into_view_if_needed()
        print(box(pg, ".author-art-blend"))
"""
from __future__ import annotations

import contextlib
import functools
import http.server
import sys
import threading
from pathlib import Path

# Acentos legíveis no console do Windows (cp1252) sem exigir configuração do terminal.
for stream in (sys.stdout, sys.stderr):
    if hasattr(stream, "reconfigure"):
        stream.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[1]          # raiz do repositório (onde está o index.html)
OUTPUT = Path(__file__).resolve().parent / "output"  # capturas e relatórios (ignorado pelo git)


class _QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):  # silencia o log de cada GET
        pass


@contextlib.contextmanager
def serve(port: int = 8899):
    """Serve a raiz do repositório em uma thread. Se a porta estiver ocupada, usa uma livre."""
    handler = functools.partial(_QuietHandler, directory=str(ROOT))
    try:
        server = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    except OSError:
        server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    port = server.server_address[1]
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        yield f"http://127.0.0.1:{port}/index.html"
    finally:
        server.shutdown()
        server.server_close()


@contextlib.contextmanager
def page(width: int = 1400, height: int = 1000, *, mobile: bool = False, reduced_motion: bool = False):
    """Abre o index.html em um Chromium headless e entrega (page, erros_de_console)."""
    from playwright.sync_api import sync_playwright

    OUTPUT.mkdir(exist_ok=True)
    context_options = {"viewport": {"width": width, "height": height}}
    if mobile:
        context_options.update(has_touch=True, is_mobile=True)
    if reduced_motion:
        context_options["reduced_motion"] = "reduce"

    with serve() as url, sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        context = browser.new_context(**context_options)
        pg = context.new_page()
        errors: list[str] = []
        pg.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
        pg.on("pageerror", lambda error: errors.append(str(error)))
        pg.goto(url)
        pg.wait_for_timeout(1200)
        try:
            yield pg, errors
        finally:
            browser.close()


def box(pg, selector: str) -> dict | None:
    """Retângulo (x, y, w, h) inteiro do primeiro elemento que casa com o seletor."""
    rect = pg.locator(selector).first.bounding_box()
    if not rect:
        return None
    return {"x": round(rect["x"]), "y": round(rect["y"]), "w": round(rect["width"]), "h": round(rect["height"])}


def open_book(pg, book: str):
    """Abre um volume da Biblioteca de Feitiços (front-end, back-end, full-stack, data, tools)."""
    pg.locator("#arsenal-skills").scroll_into_view_if_needed()
    pg.wait_for_timeout(300)
    pg.locator(f'[data-spell-book="{book}"]').click()
    pg.wait_for_timeout(1800)
