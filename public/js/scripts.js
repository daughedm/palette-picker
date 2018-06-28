window.onload = () => {
  populateProjectDropdown();
}

const updatePalette = () => {
  const palette = [$('.color-one'), $('.color-two'), $('.color-three'), $('.color-four'), $('.color-five')];
  
  palette.forEach(swatch => {
    if (!swatch.hasClass('locked')) {
      const swatchColor = colorGenerator();
      swatch.css('background-color', swatchColor)
      swatch.children('h3').text(swatchColor)
    }
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
      $(this).parent().addClass('locked');
      toggle = 1;
    }
    else if (toggle == 1) {
      $(this).attr("src", "assets/unlocked.svg");
      $(this).parent().removeClass('locked');
      toggle = 0;
    }
  }); 
});

async function populateProjectDropdown() {
  const projectsData = await fetch('/api/v1/projects');
  const projects = await projectsData.json();
  
  projects.forEach(project => {
    const name = project.name

    $('#project-dropdown').append(`<option value=${name}>${name}</option>`)
  })
}

async function populateProjectsPalettes() {
  const projectsData = await fetch('/api/v1/projects');
  const projects = await projectsData.json();


}



$('.generate-btn').on('click', updatePalette);
// $('.palette-btn').on('click', savePalette)
