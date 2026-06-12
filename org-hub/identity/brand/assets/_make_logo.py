"""Generate Breakout logo assets (triangle-A wordmark + mixed-case wordmark).
Brand: primary cobalt #214FDD, electric accent #2430FF, ink #0A0A0A.
Font: EquitanSans (commercial) -> Poppins fallback (documented). Rendered with Poppins.
"""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = os.path.dirname(os.path.abspath(__file__))
FONTDIR = os.path.join(os.environ["LOCALAPPDATA"], "Microsoft", "Windows", "Fonts")
FONT = os.path.join(FONTDIR, "Poppins-SemiBold.ttf")
COBALT = (33, 79, 221)      # #214FDD
ELECTRIC = (36, 48, 255)    # #2430FF
INK = (10, 10, 10)          # #0A0A0A
WHITE = (255, 255, 255)

S = 600  # font px (hi-res)
PAD = int(S * 0.34)

def measure(font, txt):
    bb = font.getbbox(txt)
    return bb[2] - bb[0]

def render_triangle_wordmark(fg, bg, name):
    font = ImageFont.truetype(FONT, S)
    pre, post = "BRE", "KOUT"
    # advance width of 'A' in context
    aw = measure(font, "BREA") - measure(font, pre)
    w_pre = measure(font, pre)
    w_post = measure(font, post)
    # cap height from a flat-top letter
    cb = font.getbbox("E")
    capH = cb[3] - cb[1]
    cap_top_off = cb[1]  # top offset of caps from text origin

    canvas_w = w_pre + aw + w_post + 2 * PAD
    canvas_h = capH + 2 * PAD
    img = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    baseline_y = PAD - cap_top_off  # so caps top sits at y=PAD
    x = PAD
    d.text((x, baseline_y), pre, font=font, fill=fg, anchor="la")
    # triangle in the A slot
    tri_slot_x = x + w_pre
    triW = aw * 0.92
    cx = tri_slot_x + aw / 2.0
    top_y = PAD
    bot_y = PAD + capH
    d.polygon([(cx - triW / 2, bot_y), (cx + triW / 2, bot_y), (cx, top_y)], fill=fg)
    d.text((tri_slot_x + aw, baseline_y), post, font=font, fill=fg, anchor="la")

    # crop to content then re-pad uniformly
    bbox = img.getbbox()
    img = img.crop(bbox)
    pad2 = int(S * 0.28)
    if bg is None:
        final = Image.new("RGBA", (img.width + 2 * pad2, img.height + 2 * pad2), (0, 0, 0, 0))
        final.alpha_composite(img, (pad2, pad2))
    else:
        final = Image.new("RGBA", (img.width + 2 * pad2, img.height + 2 * pad2), bg + (255,))
        final.alpha_composite(img, (pad2, pad2))
    final.save(os.path.join(OUT, name))
    print("wrote", name, final.size)

def render_mixedcase(fg, bg, name, font_file="Poppins-Bold.ttf"):
    font = ImageFont.truetype(os.path.join(FONTDIR, font_file), S)
    txt = "Breakout"
    bb = font.getbbox(txt)
    w = bb[2] - bb[0]
    h = bb[3] - bb[1]
    pad2 = int(S * 0.28)
    img = Image.new("RGBA", (w + 2 * pad2, h + 2 * pad2), (bg + (255,)) if bg else (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.text((pad2 - bb[0], pad2 - bb[1]), txt, font=font, fill=fg, anchor="la")
    img.save(os.path.join(OUT, name))
    print("wrote", name, img.size)

def write_svg(name):
    """Portable, recolorable master. fill=currentColor -> set via CSS `color`."""
    font = ImageFont.truetype(FONT, S)
    pre, post = "BRE", "KOUT"
    aw = measure(font, "BREA") - measure(font, pre)
    w_pre = measure(font, pre)
    w_post = measure(font, post)
    cb = font.getbbox("E"); capH = cb[3] - cb[1]
    triW = aw * 0.92
    tri_x0 = w_pre
    cx = tri_x0 + aw / 2.0
    total_w = w_pre + aw + w_post
    fs = capH / 0.70  # Poppins cap height ~0.70em
    baseline = capH
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_w:.0f} {capH:.0f}" role="img" aria-label="Breakout">
  <title>Breakout</title>
  <g fill="currentColor" style="color:#214FDD">
    <text x="0" y="{baseline:.0f}" font-family="EquitanSans, Poppins, Montserrat, Arial, sans-serif" font-weight="600" font-size="{fs:.0f}">BRE</text>
    <polygon points="{cx - triW/2:.0f},{baseline:.0f} {cx + triW/2:.0f},{baseline:.0f} {cx:.0f},0"/>
    <text x="{w_pre + aw:.0f}" y="{baseline:.0f}" font-family="EquitanSans, Poppins, Montserrat, Arial, sans-serif" font-weight="600" font-size="{fs:.0f}">KOUT</text>
  </g>
</svg>
'''
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(svg)
    print("wrote", name)

write_svg("logo-breakout-triangle.svg")

# Triangle-A wordmark variants
render_triangle_wordmark(WHITE, COBALT,  "logo-breakout-white-on-cobalt.png")
render_triangle_wordmark(COBALT, WHITE,  "logo-breakout-cobalt-on-white.png")
render_triangle_wordmark(WHITE, None,    "logo-breakout-white.png")
render_triangle_wordmark(INK,   None,    "logo-breakout-black.png")
render_triangle_wordmark(COBALT, None,   "logo-breakout-cobalt.png")
# Mixed-case wordmark (deck-corner lockup)
render_mixedcase(WHITE, COBALT, "wordmark-breakout-white-on-cobalt.png")
render_mixedcase(INK, None,     "wordmark-breakout-black.png")
print("done")
