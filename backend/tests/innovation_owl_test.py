"""Validação funcional e visual de O Despertar da Coruja Mecânica."""
from __future__ import annotations

import sys
import re
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from harness import OUTPUT, page  # noqa: E402
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError  # noqa: E402


def open_scene(pg) -> None:
    pg.locator('[data-journey-gate][href="#capitulo-2025"]').click()
    skip_story = pg.get_by_role("button", name="Pular história")
    try:
        skip_story.wait_for(state="visible", timeout=1500)
        skip_story.click()
    except PlaywrightTimeoutError:
        pass
    pg.get_by_role("button", name="Explorar o Mapa").click()
    pg.locator('.atlas-region').nth(3).click()
    pg.locator('.atlas-gallery--region').wait_for(state="visible")
    pg.locator('.atlas-chronicle-list button').nth(1).click()
    pg.locator(".innovation-owl").wait_for(state="visible")


def main() -> None:
    failures: list[str] = []
    with page(width=1440, height=900) as (pg, errors):
        open_scene(pg)
        scene = pg.locator(".innovation-owl")
        scene.screenshot(path=str(OUTPUT / "innovation-owl-start.png"))

        pg.wait_for_timeout(5000)
        flying_opacity = float(pg.locator(".innovation-owl__flying").evaluate("el => getComputedStyle(el).opacity"))
        if flying_opacity <= 0:
            failures.append("A coruja não ficou visível durante o voo.")
        scene.screenshot(path=str(OUTPUT / "innovation-owl-flight.png"))

        pg.get_by_role("button", name="Pular animação").click()
        pg.get_by_role("button", name="Coruja mecânica pousada").wait_for(state="visible")
        perched_opacity = float(pg.locator(".innovation-owl__perched").evaluate("el => getComputedStyle(el).opacity"))
        if perched_opacity < .99:
            failures.append("A coruja não terminou visível no ombro.")
        scene.screenshot(path=str(OUTPUT / "innovation-owl-final.png"))

        pg.get_by_role("button", name="Assistir novamente").click()
        if not pg.get_by_role("button", name="Pausar").is_visible():
            failures.append("O replay não reiniciou a timeline.")
        pg.get_by_role("button", name="Pausar").click()
        if not pg.get_by_role("button", name="Continuar").is_visible():
            failures.append("O controle de pausa não mudou para continuar.")
        pg.get_by_role("button", name="Continuar").click()

        pg.get_by_role("button", name="← Região").click()
        if not pg.get_by_role("heading", name="Torre da Inovação").is_visible():
            failures.append("O retorno da crônica para a região falhou.")
        if errors:
            failures.extend(f"Console: {error}" for error in errors)

    with page(width=900, height=600, mobile=True) as (pg, errors):
        open_scene(pg)
        box = pg.locator(".innovation-owl").bounding_box()
        if not box or box["width"] > 900:
            failures.append("A cena ultrapassou o viewport móvel horizontal.")
        if errors:
            failures.extend(f"Mobile console: {error}" for error in errors)

    with page(width=1200, height=760, reduced_motion=True) as (pg, errors):
        open_scene(pg)
        if not pg.locator(".innovation-owl").evaluate("el => el.classList.contains('is-complete')"):
            failures.append("Reduced motion não abriu diretamente no estado final.")
        if errors:
            failures.extend(f"Reduced motion console: {error}" for error in errors)

    if failures:
        raise AssertionError("\n".join(failures))
    print("OK: voo, pouso, controles, navegação, mobile e reduced-motion validados.")


if __name__ == "__main__":
    main()
