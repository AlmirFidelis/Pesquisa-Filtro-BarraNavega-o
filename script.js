// ================================================
// UTILITÁRIO — detecta em qual página estamos
// ================================================

const estaNoIndex = document.getElementById('searchInput') !== null
const estaNoCalogo = document.getElementById('painelFiltros') !== null


// ================================================
// NAVBAR — funciona nas duas páginas
// ================================================

const navToggle = document.getElementById('navToggle')
const navMenu = document.getElementById('navMenu')

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active')
    navToggle.classList.toggle('active')
})

const navLinks = navMenu.querySelectorAll('a')

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active')
        navToggle.classList.remove('active')
    })
})

document.addEventListener('click', (evento) => {
    const navbar = document.querySelector('.navbar')
    const cliqueDentroNavbar = navbar.contains(evento.target)

    if (!cliqueDentroNavbar) {
        navMenu.classList.remove('active')
        navToggle.classList.remove('active')
    }
})


// ================================================
// BUSCA — apenas no index.html
// ================================================

if (estaNoIndex) {

    const searchInput = document.getElementById('searchInput')
    const clearSearch = document.getElementById('clearSearch')
    const searchFeedback = document.getElementById('searchFeedback')
    const seriesGrid = document.getElementById('seriesGrid')

    function filtrarSeries() {
        const termoBusca = searchInput.value.trim().toLowerCase()
        const cards = seriesGrid.querySelectorAll('.card')
        let visiveis = 0

        cards.forEach(card => {
            const titulo = card.dataset.title
            const encontrado = titulo.includes(termoBusca)

            if (encontrado) {
                card.classList.remove('oculto')
                visiveis++
            } else {
                card.classList.add('oculto')
            }
        })

        atualizarFeedbackBusca(termoBusca, visiveis, cards.length)
    }

    function atualizarFeedbackBusca(termo, visiveis, total) {
        if (termo === '') {
            searchFeedback.textContent = ''
            return
        }

        if (visiveis === 0) {
            searchFeedback.textContent = `Nenhuma série encontrada para "${termo}"`
            searchFeedback.style.color = '#e50914'
        } else if (visiveis === total) {
            searchFeedback.textContent = `Mostrando todas as ${total} séries`
            searchFeedback.style.color = '#aaaaaa'
        } else {
            const resultado = visiveis === 1 ? 'série encontrada' : 'séries encontradas'
            searchFeedback.textContent = `${visiveis} ${resultado} para "${termo}"`
            searchFeedback.style.color = '#4caf50'
        }
    }

    searchInput.addEventListener('input', filtrarSeries)

    clearSearch.addEventListener('click', () => {
        searchInput.value = ''
        filtrarSeries()
        searchInput.focus()
    })

}


// ================================================
// FILTROS — apenas no catalogo.html
// ================================================

if (estaNoCalogo) {

    const seriesGrid = document.getElementById('seriesGrid')
    const resultadoCount = document.getElementById('resultadoCount')
    const filtrosAtivos = document.getElementById('filtrosAtivos')
    const semResultado = document.getElementById('semResultado')
    const limparFiltros = document.getElementById('limparFiltros')
    const btnLimparVazio = document.getElementById('btnLimparVazio')
    const btnToggleFiltros = document.getElementById('btnToggleFiltros')
    const filtrosCorpo = document.getElementById('filtrosCorpo')

    // Toggle do painel no mobile
    btnToggleFiltros.addEventListener('click', () => {
        filtrosCorpo.classList.toggle('aberto')
        btnToggleFiltros.classList.toggle('aberto')
    })

    // Função principal de filtros
    function aplicarFiltros() {
        const generoSelecionado = document.querySelector('input[name="genero"]:checked').value
        const plataformaSelecionada = document.querySelector('input[name="plataforma"]:checked').value
        const avaliacaoMinima = parseFloat(document.querySelector('input[name="avaliacao"]:checked').value)

        const cards = seriesGrid.querySelectorAll('.card')
        let visiveis = 0

        cards.forEach(card => {
            const generoCard = card.dataset.genero
            const plataformaCard = card.dataset.plataforma
            const avaliacaoCard = parseFloat(card.dataset.avaliacao)

            const passaGenero = generoSelecionado === 'todos' || generoCard === generoSelecionado
            const passaPlataforma = plataformaSelecionada === 'todas' || plataformaCard === plataformaSelecionada
            const passaAvaliacao = avaliacaoCard >= avaliacaoMinima

            if (passaGenero && passaPlataforma && passaAvaliacao) {
                card.classList.remove('oculto')
                visiveis++
            } else {
                card.classList.add('oculto')
            }
        })

        atualizarContador(visiveis)
        atualizarTagsFiltros(generoSelecionado, plataformaSelecionada, avaliacaoMinima)
        atualizarMensagemVazia(visiveis)
    }

    function atualizarContador(visiveis) {
        if (visiveis === 0) {
            resultadoCount.textContent = 'Nenhuma série encontrada'
        } else if (visiveis === 1) {
            resultadoCount.textContent = 'Mostrando 1 série'
        } else {
            resultadoCount.textContent = `Mostrando ${visiveis} séries`
        }
    }

    function atualizarTagsFiltros(genero, plataforma, avaliacao) {
        filtrosAtivos.innerHTML = ''

        if (genero !== 'todos') {
            filtrosAtivos.appendChild(criarTag('Gênero: ' + capitalizarPrimeira(genero), 'genero'))
        }
        if (plataforma !== 'todas') {
            filtrosAtivos.appendChild(criarTag('Plataforma: ' + plataforma.toUpperCase(), 'plataforma'))
        }
        if (avaliacao > 0) {
            filtrosAtivos.appendChild(criarTag('Avaliação: ' + avaliacao + '+', 'avaliacao'))
        }
    }

    function criarTag(texto, tipo) {
        const tag = document.createElement('span')
        tag.classList.add('filtro-tag')

        tag.innerHTML = `
      ${texto}
      <button aria-label="Remover filtro ${texto}">✕</button>
    `

        tag.querySelector('button').addEventListener('click', () => {
            if (tipo === 'genero') {
                document.querySelector('input[name="genero"][value="todos"]').checked = true
            }
            if (tipo === 'plataforma') {
                document.querySelector('input[name="plataforma"][value="todas"]').checked = true
            }
            if (tipo === 'avaliacao') {
                document.querySelector('input[name="avaliacao"][value="0"]').checked = true
            }
            aplicarFiltros()
        })

        return tag
    }

    function atualizarMensagemVazia(visiveis) {
        if (visiveis === 0) {
            semResultado.classList.add('visivel')
        } else {
            semResultado.classList.remove('visivel')
        }
    }

    function capitalizarPrimeira(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1)
    }

    function limparTodosFiltros() {
        document.querySelector('input[name="genero"][value="todos"]').checked = true
        document.querySelector('input[name="plataforma"][value="todas"]').checked = true
        document.querySelector('input[name="avaliacao"][value="0"]').checked = true
        aplicarFiltros()
    }

    limparFiltros.addEventListener('click', limparTodosFiltros)
    btnLimparVazio.addEventListener('click', limparTodosFiltros)

    const todosOsRadios = document.querySelectorAll('input[type="radio"]')
    todosOsRadios.forEach(radio => {
        radio.addEventListener('change', aplicarFiltros)
    })

    // Inicialização
    aplicarFiltros()

}