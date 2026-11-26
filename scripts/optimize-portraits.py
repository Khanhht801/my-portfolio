"""Rebuild responsive portraits from the existing originals (requires Pillow)."""
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "image" / "optimized"
OUTPUT.mkdir(exist_ok=True)


def variants(source, name, widths):
    with Image.open(ROOT / "image" / source) as original:
        image = ImageOps.exif_transpose(original)
        for width in widths:
            assert width <= image.width, "Do not upscale source portraits"
            height = round(image.height * width / image.width)
            resized = image.resize((width, height), Image.Resampling.LANCZOS)
            target = OUTPUT / f"{name}-{width}.webp"
            resized.save(target, "WEBP", quality=88, method=6)
            print(f"{target.relative_to(ROOT)}: {width}x{height}, {target.stat().st_size} bytes")


variants("chandung2remove.png", "hero", [420, 840, 1086])
for number in range(1, 6):
    variants(f"about/a{number}.jpg", f"about-a{number}", [480, 768, 1024])
