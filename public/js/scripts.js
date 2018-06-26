

const updatePalette = () => {
  const palette = [$('.color-one'), $('.color-two'), $('.color-three'), $('.color-four'), $('.color-five')];
  
  palette.forEach(swatch => {
    const swatchColor = colorGenerator();
    swatch.css('background-color', swatchColor)
    swatch.children('h3').text(swatchColor)
  })
}


const colorGenerator = () => {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).toUpperCase();
}

$('.generate-btn').on('click', updatePalette);