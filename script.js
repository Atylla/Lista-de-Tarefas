// Initial Data
let qtdLista = 0;
let ulAtiva = null;
let liEditando = null;
let listasConcluidas = 0;
let totalTarefasCriadas = 0;
const listasConcluidasArray = [];

const newLists = document.querySelector('.newList');
const botaoList = document.querySelector('.botaoNewList');
const painelListas = document.querySelector('.listas--criadas');

const progressoDiv = document.querySelector('.progresso');
const listas = document.querySelector('.lists');
const criarNomeTarefa = document.querySelector('.criar--nome');
const criarDescricaoTarefa = document.querySelector('.criar--descricao');
const criarPrioridade = document.querySelector('.criar--prioridade');

const botaoCriarModal = document.querySelector('#modal .tarefa--criar');
const modal = document.getElementById('modal');
const btnFechar = document.getElementById('fecharModal');
const btnFecharDescricao = document.getElementById('fecharDescricaoModal');

// Events
progressoDiv.addEventListener('click', (event) => {
    if (event.target.classList.contains('limpar-progresso')) {
        listasConcluidas = 0;
        listasConcluidasArray.length = 0;
        atualizarProgresso();
        salvarNoLocalStorage();
    }
});
botaoCriarModal.addEventListener('click', () => {
    if (ulAtiva) {
        if (liEditando) {
            editarTarefa(liEditando);
            liEditando = null;
        } else {
            salvarTarefa(ulAtiva);
        }

        modal.style.display = 'none';

        criarNomeTarefa.value = '';
        criarDescricaoTarefa.value = '';
        criarPrioridade.value = 50;
    }
});
botaoList.addEventListener('click', criarLista);
btnFechar.addEventListener('click', () => {
    modal.style.display = "none";
})
btnFecharDescricao.addEventListener('click', () => {
    document.getElementById('modal-descricao').style.display = "none";
})

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
})

// Functions
function criarLista() {

    //Verificação
    if (newLists.value === '') {
        return alert('Digite um valor');
    }
    const nomeNovaLista = newLists.value.trim().toLowerCase();
    const nomesExistentes = Array.from(document.querySelectorAll('.nome--lista'))
        .map(el => el.textContent.trim().toLowerCase());

    if (nomesExistentes.includes(nomeNovaLista)) {
        return alert('Essa lista já existe!');
    }
    // Initial Datas
    const todasAsListas = document.querySelectorAll('.lists .list');
    const itemPainel = document.createElement('div');
    const div1 = document.createElement('div');
    const divHeader = document.createElement('div');
    const divFooter = document.createElement('div');
    const novaH3 = document.createElement('h3');
    const contador = document.createElement('div');
    const botaoTarefa = document.createElement('button');
    const botaoExcluirLista = document.createElement('button');
    const ulTarefas = document.createElement('ul');
    const botaoConcluirLista = document.createElement('button');

    // Atribuições ClassLists
    itemPainel.classList.add('item-painel');
    div1.classList.add('list');
    divHeader.classList.add('list--header');
    divFooter.classList.add('list--footer');
    novaH3.classList.add('nome--lista');
    contador.classList.add('contador');
    botaoTarefa.classList.add('tarefa--criar');
    botaoExcluirLista.classList.add('lista--excluir');
    ulTarefas.classList.add('tarefa');
    botaoConcluirLista.classList.add('lista--concluir');


    // Atribuição de Valor
    itemPainel.textContent = newLists.value;
    novaH3.textContent = newLists.value;
    botaoTarefa.textContent = 'Criar tarefa';
    botaoExcluirLista.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
    botaoConcluirLista.textContent = 'Concluir lista';
    // Events
    todasAsListas.forEach(lista => {
        lista.style.display = 'none';
    });
    botaoTarefa.addEventListener('click', () => abrirModalTarefas(ulTarefas));
    botaoExcluirLista.addEventListener('click', () => excluirLista(div1, itemPainel, ulTarefas));
    itemPainel.addEventListener('click', () => {
        const todasAsListas = document.querySelectorAll('.lists .list');
        todasAsListas.forEach(lista => lista.style.display = 'none');
        div1.style.display = 'block';
    });
    botaoConcluirLista.addEventListener('click', () => {
        concluirLista(div1, novaH3.textContent, ulTarefas, itemPainel);
    });

    // Inserindo na DOM

    div1.appendChild(contador);
    divHeader.appendChild(novaH3);
    divHeader.appendChild(botaoTarefa);

    divFooter.appendChild(botaoExcluirLista);
    divFooter.appendChild(botaoConcluirLista);

    div1.appendChild(divHeader);
    div1.appendChild(ulTarefas);
    div1.appendChild(divFooter);

    painelListas.appendChild(itemPainel);
    listas.appendChild(div1);

    // Extras
    div1.style.display = 'block';
    listas.style.display = 'block'
    newLists.value = "";
    qtdLista++;
    salvarNoLocalStorage();
}

function salvarTarefa(ul) {
    //Verificação
    const nomeTarefaDigitado = criarNomeTarefa.value.trim().toLowerCase();
    if (nomeTarefaDigitado === '') {
        return alert('Digite um valor');
    }
    const nomesTarefas = Array.from(ul.querySelectorAll('.tarefa--nome'))
        .map(el => el.textContent.trim().toLowerCase());
    if (nomesTarefas.includes(nomeTarefaDigitado)) {
        return alert('Essa tarefa já existe nessa lista!');
    }
    // Initial Data
    let li = document.createElement('li');
    let botaoSelect = document.createElement('input');
    let botaoExcluir = document.createElement('button');
    let nomeTarefa = document.createElement('p');

    // Atribuição ClassList
    li.classList.add('itemLista');
    botaoSelect.classList.add('tarefa--selecionar');
    botaoExcluir.classList.add('tarefa--excluir');
    nomeTarefa.classList.add('tarefa--nome');

    // Atribuição de Valor
    botaoSelect.type = 'checkbox'
    botaoExcluir.innerHTML = '<ion-icon name="trash-outline"></ion-icon>'
    nomeTarefa.textContent = criarNomeTarefa.value;
    nomeTarefa.dataset.descricao = criarDescricaoTarefa.value;
    nomeTarefa.dataset.prioridade = criarPrioridade.value;

    // Lógica
    const prioridade = Number(criarPrioridade.value);
    if (prioridade > 70) {
        li.classList.add('alta');
    } else if (prioridade > 30) {
        li.classList.add('media');
    } else {
        li.classList.add('baixa');
    }

    // Events
    nomeTarefa.addEventListener('click', () => {
        abrirDescricao({
            nome: nomeTarefa.textContent,
            descricao: nomeTarefa.dataset.descricao,
            prioridade: nomeTarefa.dataset.prioridade,
            li: li
        });
    });
    botaoSelect.addEventListener('change', () => {
        selecionar(li)
        salvarNoLocalStorage();
    });
    botaoExcluir.addEventListener('click', () => excluirTarefa(li));

    // Inserindo na DOM
    li.appendChild(botaoSelect);
    li.appendChild(nomeTarefa);
    li.appendChild(botaoExcluir);
    ul.appendChild(li);

    //Extras
    ordenarTarefasPorPrioridade(ul);
    atualizarContador(ul);
    totalTarefasCriadas++;
    atualizarProgresso();
    salvarNoLocalStorage();
}
function ordenarTarefasPorPrioridade(ul) {
    const tarefas = Array.from(ul.querySelectorAll('li'));
    tarefas.sort((a, b) => {
        const pA = Number(a.querySelector('.tarefa--nome').dataset.prioridade);
        const pB = Number(b.querySelector('.tarefa--nome').dataset.prioridade);
        return pB - pA;
    });

    tarefas.forEach(li => ul.appendChild(li));
}
function abrirDescricao(tarefa) {
    // Initial Data
    const modalDesc = document.getElementById('modal-descricao');
    const botaoEditar = modalDesc.querySelector('.tarefa--editar');
    const h2 = modalDesc.querySelector('h2');
    const ps = modalDesc.querySelectorAll('p');

    // Atribuição de Valor
    h2.textContent = tarefa.nome;
    ps[0].innerHTML = tarefa.descricao.replace(/\n/g, '<br>');
    ps[1].textContent = `Prioridade: ${tarefa.prioridade}`;

    // Events
    botaoEditar.addEventListener('click', () => {
        criarNomeTarefa.value = tarefa.nome;
        criarDescricaoTarefa.value = tarefa.descricao;
        criarPrioridade.value = tarefa.prioridade;

        liEditando = tarefa.li;
        modalDesc.style.display = 'none';
        modal.style.display = 'block';
    })

    // Extras
    modalDesc.style.display = 'block';
}


function editarTarefa(li) {
    if (criarDescricaoTarefa.value === '' || criarNomeTarefa.value === '') {
        return alert('Digite um valor');
    }

    // Initial Data
    const nomeTarefa = li.querySelector('.tarefa--nome');
    const prioridade = Number(criarPrioridade.value);
    const ul = li.closest('ul.tarefa');

    // Atribuição de Valor
    nomeTarefa.textContent = criarNomeTarefa.value;
    nomeTarefa.dataset.descricao = criarDescricaoTarefa.value;
    nomeTarefa.dataset.prioridade = criarPrioridade.value;

    //Lógica
    li.classList.remove('alta', 'media', 'baixa');
    if (prioridade > 70) {
        li.classList.add('alta');
    } else if (prioridade > 30) {
        li.classList.add('media');
    } else {
        li.classList.add('baixa');
    }

    // Extras
    ordenarTarefasPorPrioridade(ul);
    salvarNoLocalStorage();
}
function selecionar(el) {
    el.classList.toggle('concluida');

    // Initial Data
    const listContainer = el.closest('.list');
    const ul = listContainer.querySelector('ul.tarefa');

    // Extras
    atualizarContador(ul);
    atualizarProgresso();
    salvarNoLocalStorage();
}
function excluirTarefa(li) {
    const nomeTarefa = li.querySelector('.tarefa--nome')?.textContent || 'essa tarefa';
    const confirmar = confirm(`Tem certeza de que quer excluir "${nomeTarefa}"?`);
    if (!confirmar) return;

    const ul = li.closest('ul.tarefa');
    li.remove();
    atualizarContador(ul);
    salvarNoLocalStorage();
}
function excluirLista(lista, itemPainel, ul, forcar = false) {
    const nomeLista = lista.querySelector('.nome--lista')?.textContent || 'essa lista';

    if (!forcar) {
        const confirmar = confirm(`Tem certeza de que quer excluir "${nomeLista}"?`);
        if (!confirmar) return;
    }

    qtdLista--;

    // Lógica
    if (ul) {
        atualizarContador(ul);
    }
    if (lista) lista.remove();
    if (itemPainel) itemPainel.remove();
    if (qtdLista === 0) {
        //listas.style.display = 'none';
    } else {
        const proximas = document.querySelectorAll('.lists .list');
        if (proximas[0]) {
            proximas[0].style.display = 'none';
        }
    }
    salvarNoLocalStorage();
}

function concluirLista(divLista, nomeLista, ulTarefas, itemPainel) {
    const tarefas = ulTarefas.querySelectorAll('li');
    const concluidas = ulTarefas.querySelectorAll('li.concluida');
    if (tarefas.length === 0) {
        alert('Você não pode concluir a lista sem adicionar nenhuma tarefa.');
        return;
    }
    if (concluidas.length < tarefas.length) {
        alert('Você só pode concluir a lista depois de marcar todas as tarefas como concluídas.');
        return;
    }
    listasConcluidas++;
    listasConcluidasArray.push(nomeLista);
    atualizarProgresso();
    salvarNoLocalStorage();

    excluirLista(divLista, itemPainel, ulTarefas, true);
}

function atualizarProgresso() {
    console.log('Listas concluídas:', listasConcluidas);
    progressoDiv.innerHTML = `
        <h2>Progresso</h2>
        <p class="lista-concluidas"><strong>Listas concluídas:</strong> ${listasConcluidas}</p>
        <ul>
            ${listasConcluidasArray.map(nome => `<li>${nome}</li>`).join('')}
        </ul>
        ${listasConcluidas > 0 ? `<button class="limpar-progresso">Limpar Progresso</button>` : ''}
    `;
}

function atualizarContador(ul) {
    if (!ul) return;
    // Initial Data
    const total = ul.querySelectorAll('li').length;
    const concluidas = ul.querySelectorAll('li.concluida').length;
    const listContainer = ul.closest('.list');
    const contador = listContainer.querySelector('.contador');

    //Lógica
    let pctConc = total === 0 ? 0 : (concluidas / total) * 100;

    if (!listContainer) return;
    if (!contador) return;

    contador.style.width = `${pctConc}%`;
}
function abrirModalTarefas(ul) {
    ulAtiva = ul;
    modal.style.display = "block";
}
function salvarNoLocalStorage() {
    const listasSalvas = [];

    document.querySelectorAll('.list').forEach(divLista => {
        const nomeLista = divLista.querySelector('.nome--lista').textContent;
        const tarefas = [];

        divLista.querySelectorAll('li').forEach(li => {
            const nome = li.querySelector('.tarefa--nome').textContent;
            const descricao = li.querySelector('.tarefa--nome').dataset.descricao;
            const prioridade = parseInt(li.querySelector('.tarefa--nome').dataset.prioridade);
            const concluida = li.classList.contains('concluida');

            tarefas.push({ nome, descricao, prioridade, concluida });
        });

        listasSalvas.push({ nome: nomeLista, tarefas });
    });

    const dados = {
        listas: listasSalvas,
        listasConcluidas: listasConcluidasArray
    };

    localStorage.setItem('dadosApp', JSON.stringify(dados));
}
function carregarDoLocalStorage() {
    const dados = JSON.parse(localStorage.getItem('dadosApp'));
    if (!dados) return;

    dados.listas.forEach(lista => {
        newLists.value = lista.nome;
        criarLista();

        const listaDOM = document.querySelectorAll('.list');
        const ul = listaDOM[listaDOM.length - 1].querySelector('ul');

        lista.tarefas.forEach(tarefa => {
            criarNomeTarefa.value = tarefa.nome;
            criarDescricaoTarefa.value = tarefa.descricao;
            criarPrioridade.value = tarefa.prioridade;
            salvarTarefa(ul);

            const tarefaDOM = ul.lastChild;
            if (tarefa.concluida) {
                tarefaDOM.classList.add('concluida');
                tarefaDOM.querySelector('.tarefa--selecionar').checked = true;
            }
        });
        atualizarContador(ul);
    });

    listasConcluidasArray.push(...dados.listasConcluidas);
    listasConcluidas = listasConcluidasArray.length;
    atualizarProgresso();
}
carregarDoLocalStorage();




