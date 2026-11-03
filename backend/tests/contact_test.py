"""Visual contact demo: real PNGs, no API mocks or external submissions."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from harness import page, OUTPUT

with page() as (pg, errors):
    section = pg.locator('#contato')
    section.scroll_into_view_if_needed()
    requests = []
    pg.on('request', lambda request: requests.append(request.url) if '/api/contact' in request.url else None)
    assert pg.locator('#contact-content').is_hidden()
    assert pg.locator('.contact-closed-art img').evaluate('(e) => e.complete && e.naturalWidth > 0')
    assert pg.locator('.contact-closed-art').evaluate('(e) => getComputedStyle(e).animationName') == 'contact-scroll-breathe'
    section.screenshot(path=str(OUTPUT / 'contact-closed.png'))
    pg.locator('.contact-open').focus()
    pg.keyboard.press('Enter')
    pg.wait_for_function("document.querySelector('#contato').dataset.contactState === 'open'")
    pg.wait_for_function("Array.from(document.querySelectorAll('#contato img')).every(i => i.complete && i.naturalWidth > 0)")
    assert pg.locator('.contact-owl img.is-active').get_attribute('src').endswith('owl-idle.png')
    section.screenshot(path=str(OUTPUT / 'contact-desktop.png'))
    pg.locator('#contact-name').focus()
    assert pg.locator('.contact-owl img.is-active').get_attribute('src').endswith('owl-watching.png')
    assert pg.locator('.contact-feather').get_attribute('data-phase') == 'approach'
    pg.wait_for_timeout(380)
    assert pg.locator('.contact-inkpot img.is-active').get_attribute('src').endswith('tinteiroAberto.png')
    section.screenshot(path=str(OUTPUT / 'contact-dip.png'))
    pg.wait_for_timeout(550)
    assert pg.locator('.contact-feather img.is-active').get_attribute('src').endswith('penaTinta.png')
    assert pg.locator('.contact-feather').get_attribute('data-phase') == 'field'
    first = pg.locator('.contact-feather').get_attribute('style')
    pg.locator('#contact-email').focus()
    assert first != pg.locator('.contact-feather').get_attribute('style')
    pg.locator('#contact-name').fill('Marcos')
    pg.locator('#contact-email').fill('marcos@example.com')
    pg.locator('#contact-message').fill('Uma carta para demonstrar a experiência.')
    pg.locator('.contact-close').click()
    pg.wait_for_function("document.querySelector('#contato').dataset.contactState === 'closed'")
    assert pg.locator('#contact-content').is_hidden()
    pg.keyboard.press('Space')
    pg.wait_for_function("document.querySelector('#contato').dataset.contactState === 'open'")
    assert pg.locator('#contact-message').input_value() == 'Uma carta para demonstrar a experiência.'
    assert pg.locator('.contact-owl img.is-active').get_attribute('src').endswith('owl-idle.png')
    pg.locator('.contact-submit button').click()
    assert pg.locator('.contact-submit button').is_disabled()
    assert pg.locator('.contact-owl img.is-active').get_attribute('src').endswith('owl-sending.png')
    section.screenshot(path=str(OUTPUT / 'contact-sending.png'))
    pg.wait_for_function("document.querySelector('#contato').dataset.status === 'success'")
    assert pg.locator('.contact-owl img.is-active').get_attribute('src').endswith('owl-success.png')
    assert 'Mensagem preparada com sucesso.' in pg.locator('.contact-feedback').inner_text()
    section.screenshot(path=str(OUTPUT / 'contact-success.png'))
    assert not requests, requests
    assert not [e for e in errors if 'Failed to load resource' not in e and 'ERR_' not in e], errors
    print('PASS real assets, closed animation, keyboard, ink sequence, owl variants, demo without API, preserved text')

for width in (320, 390, 768, 1400):
    with page(width=width, mobile=width < 680, reduced_motion=True) as (pg, errors):
        pg.locator('#contato').scroll_into_view_if_needed()
        pg.locator('.contact-open').click()
        pg.wait_for_function("Array.from(document.querySelectorAll('#contato img')).every(i => i.complete && i.naturalWidth > 0)")
        section = pg.locator('#contato')
        assert section.get_attribute('data-contact-state') == 'open'
        assert section.evaluate('(e) => e.scrollWidth <= e.clientWidth'), width
        assert pg.locator('.contact-owl').is_visible()
        assert pg.locator('.contact-inkpot').is_visible()
        assert pg.locator('.contact-feather').is_visible()
        pg.locator('.contact-submit button').click()
        assert pg.locator('#contact-name-error').inner_text()
        pg.locator('#contact-name').fill('Teste')
        pg.locator('#contact-email').fill('invalido')
        pg.locator('#contact-message').fill('Uma carta de teste.')
        pg.locator('.contact-submit button').click()
        assert pg.locator('#contact-email-error').inner_text()
        assert pg.locator('.contact-closed-art').evaluate('(e) => getComputedStyle(e).animationName') == 'none'
        section.screenshot(path=str(OUTPUT / ('contact-' + str(width) + '.png')))
        print('PASS responsive, visible characters, validation, reduced motion', width)

