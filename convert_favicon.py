#!/usr/bin/env python3
"""
Convert SVG favicon to PNG and ICO formats with transparent backgrounds
"""
import os
from PIL import Image
try:
    import cairosvg
    HAS_CAIRO = True
except ImportError:
    HAS_CAIRO = False
    print("Warning: cairosvg not found. Attempting to install...")
    os.system("pip install cairosvg")
    import cairosvg

# Define paths
base_path = r'c:\Users\User\Desktop\carvo.co.il\public'
svg_path = os.path.join(base_path, 'carvo-symbol.svg')
favicon_192_path = os.path.join(base_path, 'favicon.png')
favicon_32_path = os.path.join(base_path, 'favicon-32x32.png')
favicon_16_path = os.path.join(base_path, 'favicon-16x16.png')
favicon_ico_path = os.path.join(base_path, 'favicon.ico')

# Sizes to generate
sizes = [
    (192, favicon_192_path),
    (32, favicon_32_path),
    (16, favicon_16_path)
]

print("Converting SVG to PNG files...")

# Convert SVG to PNG for each size
for size, output_path in sizes:
    print(f"  Creating {size}x{size} PNG...")

    # Create PNG from SVG with transparent background
    cairosvg.svg2png(
        url=svg_path,
        write_to=output_path,
        output_width=size,
        output_height=size
    )

    print(f"    Saved: {output_path}")

# Create favicon.ico from the PNG files
print("\nCreating favicon.ico...")
image_192 = Image.open(favicon_192_path)
image_32 = Image.open(favicon_32_path)
image_16 = Image.open(favicon_16_path)

# Create ICO file with multiple resolutions
image_192.save(
    favicon_ico_path,
    format='ICO',
    sizes=[(192, 192), (32, 32), (16, 16)],
    append_images=[image_32, image_16]
)
print(f"  Saved: {favicon_ico_path}")

print("\nDone! Generated files:")
print(f"  - {favicon_192_path}")
print(f"  - {favicon_32_path}")
print(f"  - {favicon_16_path}")
print(f"  - {favicon_ico_path}")
