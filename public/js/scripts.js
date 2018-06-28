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
  $(".lock").click(function () {
    if (toggle == 0) {
      $(this).attr("src", "assets/locked.svg");
      toggle = 1;
    }
    else if (toggle == 1) {
      $(this).attr("src", "assets/unlocked.svg");
      toggle = 0;
    }
  });
});

// async function savePalette() {
//   const projectName = $(this).parent('div').find(':selected').text()
//   const rawProjects = await fetch('/api/v1/projects')
//   const projects = await rawProjects.json()

//   const name = $(this).parent('div').children('input').val()
//   const colors = colorStore.map(color => color.randomColor)
//   const project_id = projects.find(project => project.name === projectName).id

//   fetch('/api/v1/palettes', {
//     method: 'POST',
//     body: JSON.stringify({
//       name,
//       colors,
//       project_id
//     }),
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   })
// }


$('.generate-btn').on('click', updatePalette);
$('.palette-btn').on('click', savePalette)
