window.onload = () => {
  populateProjectDropdown();
  populateProjectsPalettes();
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

const populateProjectsPalettes = async () => {
  const projectsData = await fetch('/api/v1/projects');
  const allProjects = await projectsData.json();
console.log('***', allProjects)
  
  allProjects.forEach(async project => {
    const { name, id } = project;
    const paletteData = await fetch(`/api/v1/projects/${id}/palettes`);
    const allPalettes = await paletteData.json();

    const projectsAndPalettes = allPalettes.map(palette => {
      const { id, colorOne, colorTwo, colorThree, colorFour, colorFive, name } = palette;
      return `
        <div class="${id} projects-wrapper">
          <h4>${name}</h4>
          <div class="small-box" style="background-color: ${colorOne}"></div>
          <div class="small-box" style="background-color: ${colorTwo}"></div>
          <div class="small-box" style="background-color: ${colorThree}"></div>
          <div class="small-box" style="background-color: ${colorFour}"></div>
          <div class="small-box" style="background-color: ${colorFive}"></div>
          <img class="delete" src="../assets/delete.svg" alt="delete">
        </div>`;
    });

    $('#saved-projects').append(projectsAndPalettes);
  });
}



$('.generate-btn').on('click', updatePalette);
// $('.palette-btn').on('click', savePalette)
