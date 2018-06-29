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
    const id = project.id

    $('#project-dropdown').append(`<option value=${id}>${name}</option>`)
  })
}

const populateProjectsPalettes = async () => {
  const projectsData = await fetch('/api/v1/projects');
  const allProjects = await projectsData.json();
  
  allProjects.forEach(async project => {
    const { name, id } = project;
    const paletteData = await fetch(`/api/v1/projects/${id}/palettes`);
    const allPalettes = await paletteData.json();

    const projectPalettes = allPalettes.map(palette => {
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
    const projectContainer = 
      `<div class="project-container" id=${id}>
        <h3>${name}</h3>
        ${projectPalettes}
      </div>`;

    $('#saved-projects').append(projectContainer);
  });
}

const saveProject = () => {
  const projectName = $('.project-name').val();
  fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({
      "project": {"name": projectName}
    }),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  window.location.reload()
};

const savePalette = () => {
  const hexOne = $('.one').text();
  const hexTwo = $('.two').text();
  const hexThree = $('.three').text();
  const hexFour = $('.four').text();
  const hexFive = $('.five').text();
  const paletteName = $('.palette-name').val();
  const projectId = $('.palette-dropdown option:selected').val();

  fetch('/api/v1/palettes', {
    method: 'POST',
    body: JSON.stringify({
      "colorOne": hexOne,
      "colorTwo": hexTwo,
      "colorThree": hexThree,
      "colorFour": hexFour,
      "colorFive": hexFive,
      "name": paletteName,
      "project_id": projectId
    }),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });
  window.location.reload()
};

const deletePalette = async (event) => {
  const id = event.target.closest('.projects-wrapper').id;
  debugger;
  if (event.target.className === 'delete') {
    event.target.closest('.projects-wrapper').remove();

    fetch(`/api/v1/palettes/${id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }
}

$('.generate-btn').on('click', updatePalette);
$('.project-btn').on('click', saveProject);
$('.palette-btn').on('click', savePalette);
$(document).on('click', 'img.delete', deletePalette);
