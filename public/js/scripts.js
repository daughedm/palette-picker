window.onload = () => {
  
}

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

$(document).ready(function () {
  var toggle = 0;
  $("div .color").click(function () {
    if (toggle == 0) {
      $(".lock").attr("src", "assets/unlocked.svg");
      toggle = 1;
    }
    else if (toggle == 1) {
      $(".lock").attr("src", "assets/locked.svg");
      toggle = 0;
    }
  });
});

$('.generate-btn').on('click', updatePalette);
$()
