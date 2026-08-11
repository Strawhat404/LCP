#!/bin/bash
# Download and convert Unsplash images to WebP

cd "$(dirname "$0")/../public/images" || exit

echo "Downloading images from Unsplash..."

# Hero image - medical professional reviewing documents
curl -L "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1200&q=80&auto=format&fit=crop" -o hero-medical.jpg

# Doctor reviewing medical documents
curl -L "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&auto=format&fit=crop" -o doctor-documents.jpg

# Legal professional and client
curl -L "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80&auto=format&fit=crop" -o legal-consultation.jpg

# Browse by state - search professional
curl -L "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400&q=80&auto=format&fit=crop" -o search-professional.jpg

# Qualified professionals - medical certification
curl -L "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&q=80&auto=format&fit=crop" -o certified-professional.jpg

# Contact directly - professional consultation
curl -L "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80&auto=format&fit=crop" -o professional-consultation.jpg

# Physician life care planners hero
curl -L "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80&auto=format&fit=crop" -o physician-plan-hero.jpg

# Contact page hero - reaching out
curl -L "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80&auto=format&fit=crop" -o contact-hero.jpg

# Contact page team
curl -L "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&auto=format&fit=crop" -o team-assist.jpg

echo "✓ Downloaded all images"

# Check if cwebp is installed
if command -v cwebp &> /dev/null; then
  echo "Converting to WebP..."
  for img in *.jpg; do
    cwebp -q 80 "$img" -o "${img%.jpg}.webp"
    echo "  ✓ Converted $img"
  done
  echo "✓ All images converted to WebP"
else
  echo "⚠ cwebp not found - images downloaded as JPG only"
  echo "  Install webp tools to enable WebP conversion:"
  echo "  - macOS: brew install webp"
  echo "  - Ubuntu/Debian: sudo apt-get install webp"
  echo "  - Then run this script again to convert to WebP"
fi

echo "Done!"
