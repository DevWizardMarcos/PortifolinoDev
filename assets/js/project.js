

// Array onde vou armazenar os projetos 
const projects = [
    {
        title: 'Amigo Fiel',
        image: 'assets/img/projetos/amigoFiel.png',
        descrition: 'ste projeto é uma aplicação web desenvolvida para clínicas veterinárias e pet shops, focada na gestão eficiente de animais, donos, agendamentos de banho e tosa, além do controle de produtos e serviços.',
        tecnlogies: ['HMTL', 'CSS'],
        github: "https://github.com/DevWizardMarcos/Amigo-Fiel",
        liveDemo: "https://devwizardmarcos.github.io/Amigo-Fiel/"

    }
]


let currentProject = 0 // varivavel acumuladora para os projetos


// Criando funçao do carrosel


function renderProjects() {
    // Pegar os dois cards do projeto
    const cards = document.querySelectorAll('.project-Card')
    // pegando o Projeto (esquerda)
    const project1 = projects[currentProject]
    if (project1) {
        // pegando o primeiro projeto pela class type(texto)
        cards[0].querySelector('.project-Title').textContent = project1.title
        // pegando type(img)
        cards[0].querySelector('.project-Image').src = project1.image

        cards[0].querySelector('.project-Description').textContent = project1.descrition
        // pegando type(link)
        cards[0].querySelector('.project-Github').href = project1.github

        cards[0].querySelector('.project-LiveDemo').href = project1.liveDemo


        // renderizar as Tecnologias
        const techDiv1 = cards[0].querySelector('.project-technologies')
        //colocando o html das tecnologias
        techDiv1.innerHTML = ''
        // pecorrendo com for
        project1.tecnlogies.forEach(tech => {
            const span = document.createElement('span') // criando um tag span
            span.textContent = tech  //recebendo valor do for para pecorrer 
            span.style.backgroundColor = '#e81037'
            span.style.padding = '0.25rem 0.5rem'
            span.style.borderRadius = '4px'
            techDiv1.appendChild(span)
        });

    }

// fazendo a estrutura do projeto (direita)

const project2Index = currentProject + 1 
const project2 = projects[project2Index]

if(project) {
      // pegando o primeiro projeto pela class type(texto)
        cards[0].querySelector('.project-Title').textContent = project1.title
        // pegando type(img)
        cards[0].querySelector('.project-Image').src = project1.image

        cards[0].querySelector('.project-Description').textContent = project1.descrition
        // pegando type(link)
        cards[0].querySelector('.project-Github').href = project1.github

        cards[0].querySelector('.project-LiveDemo').href = project1.liveDemo
}


}


// fazendo a funçao de avançar projeto
function nextProject() {
    if (currentProject + 2 < projects.length) {
        currentProject += 2
        renderProjects() // chamando a funçao para passar para o proximo
    }

}







// fazendo a funçao de voltar Projeto 

function previousProject() {
    if (currentProject > 0) {
        currentProject -= 2
        renderProjects()
    }
}

// Exucutar quando a pagina iniciar
document.addEventListener('DOMContentLoaded', renderProjects)