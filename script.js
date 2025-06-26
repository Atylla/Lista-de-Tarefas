// Initial Data
let qtdLista = 0;
let ulAtiva = null;
let liEditando = null;

const newLists = document.querySelector('.newList');
const botaoList = document.querySelector('.botaoNewList');
const listas = document.querySelector('.lists');
const painelListas = document.querySelector('.listas--criadas');

const botaoCriarModal = document.querySelector('#modal .tarefa--criar');
const criarNomeTarefa = document.querySelector('.criar--nome');
const criarDescricaoTarefa = document.querySelector('.criar--descricao');
const criarPrioridade = document.querySelector('.criar--prioridade');

const modal = document.getElementById('modal');
const btnFechar = document.getElementById('fecharModal');
const btnFecharDescricao = document.getElementById('fecharDescricaoModal');

// Events
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

// Functions
function criarLista() {
    if (newLists.value === '') {
        return alert('Digite um valor');
    }
    const todasAsListas = document.querySelectorAll('.lists .list');
    todasAsListas.forEach(lista => {
        lista.style.display = 'none';
    });

    const itemPainel = document.createElement('div');
    itemPainel.classList.add('item-painel');
    itemPainel.textContent = newLists.value;

    const div1 = document.createElement('div');
    div1.classList.add('list');

    const div2 = document.createElement('div');
    div2.classList.add('list--header');

    const novaH3 = document.createElement('h3');
    novaH3.textContent = newLists.value;

    const contador = document.createElement('div');
    contador.classList.add('contador');

    const botaoTarefa = document.createElement('button');
    botaoTarefa.textContent = 'Criar tarefa';
    botaoTarefa.classList.add('tarefa--criar');

    const botaoExcluirLista = document.createElement('button');
    botaoExcluirLista.classList.add('lista--excluir');
    botaoExcluirLista.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';

    const ulTarefas = document.createElement('ul');
    ulTarefas.classList.add('tarefa');

    botaoTarefa.addEventListener('click', () => abrirModalTarefas(ulTarefas));
    botaoExcluirLista.addEventListener('click', () => excluirLista(div1, itemPainel, ulTarefas));
    itemPainel.addEventListener('click', () => {
        const todasAsListas = document.querySelectorAll('.lists .list');
        todasAsListas.forEach(lista => lista.style.display = 'none');
        div1.style.display = 'block';
    });


    div2.appendChild(novaH3);
    div1.appendChild(contador);
    div2.appendChild(botaoTarefa);

    div1.appendChild(div2);
    div1.appendChild(ulTarefas);
    div1.appendChild(botaoExcluirLista);
    painelListas.appendChild(itemPainel);

    div1.style.display = 'block';

    listas.appendChild(div1);
    listas.style.display = 'block'
    newLists.value = "";
    qtdLista++;
}

function salvarTarefa(ul) {
    if (criarNomeTarefa.value === '') {
        return alert('Digite um valor');
    }

    let li = document.createElement('li');
    li.classList.add('itemLista');

    let botaoSelect = document.createElement('input');
    botaoSelect.type = 'checkbox'
    botaoSelect.classList.add('tarefa--selecionar');

    let botaoExcluir = document.createElement('button');
    botaoExcluir.classList.add('tarefa--excluir');
    botaoExcluir.innerHTML = '<ion-icon name="trash-outline"></ion-icon>'

    let nomeTarefa = document.createElement('p');
    nomeTarefa.classList.add('tarefa--nome');
    nomeTarefa.textContent = criarNomeTarefa.value;

    nomeTarefa.dataset.descricao = criarDescricaoTarefa.value;
    nomeTarefa.dataset.prioridade = criarPrioridade.value;

    const prioridade = Number(criarPrioridade.value);
    if (prioridade > 70) {
        li.classList.add('alta');
    } else if (prioridade > 30) {
        li.classList.add('media');
    } else {
        li.classList.add('baixa');
    }

    nomeTarefa.addEventListener('click', () => {
        abrirDescricao({
            nome: nomeTarefa.textContent,
            descricao: nomeTarefa.dataset.descricao,
            prioridade: nomeTarefa.dataset.prioridade,
            li: li
        });
    });

    botaoSelect.addEventListener('change', () => selecionar(li));
    botaoExcluir.addEventListener('click', () => excluirTarefa(li));

    li.appendChild(botaoSelect);
    li.appendChild(nomeTarefa);
    li.appendChild(botaoExcluir);

    ul.appendChild(li);
    ordenarTarefasPorPrioridade(ul);
    atualizarContador(ul);
}

function abrirModalTarefas(ul) {
    ulAtiva = ul;
    modal.style.display = "block";
}

function selecionar(el) {
    el.classList.toggle('concluida');
    const listContainer = el.closest('.list');
    const ul = listContainer.querySelector('ul.tarefa');
    atualizarContador(ul);
}

function excluirTarefa(li) {
    const ul = li.closest('ul.tarefa');
    li.remove();
    atualizarContador(ul);
}
function excluirLista(lista, itemPainel, ul) {
    qtdLista--;

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
            proximas[0].style.display = 'block';
        }
    }

}

function atualizarContador(ul) {
    if (!ul) return;

    const total = ul.querySelectorAll('li').length;
    const concluidas = ul.querySelectorAll('li.concluida').length;

    let pctConc = total === 0 ? 0 : (concluidas / total) * 100;

    console.log('est entrando?', total)

    const listContainer = ul.closest('.list');
    if (!listContainer) return;

    const contador = listContainer.querySelector('.contador');
    if (!contador) return;

    contador.style.width = `${pctConc}%`;
}


function abrirDescricao(tarefa) {
    const modalDesc = document.getElementById('modal-descricao');
    const botaoEditar = modalDesc.querySelector('.tarefa--editar');
    const h2 = modalDesc.querySelector('h2');
    const ps = modalDesc.querySelectorAll('p');

    h2.textContent = tarefa.nome;
    ps[0].textContent = tarefa.descricao;
    ps[1].textContent = `Prioridade: ${tarefa.prioridade}`;

    botaoEditar.onclick = () => {
        criarNomeTarefa.value = tarefa.nome;
        criarDescricaoTarefa.value = tarefa.descricao;
        criarPrioridade.value = tarefa.prioridade;

        liEditando = tarefa.li;
        modalDesc.style.display = 'none';
        modal.style.display = 'block';
    }

    modalDesc.style.display = 'block';


}
function editarTarefa(li) {
    if (criarDescricaoTarefa.value === '' || criarNomeTarefa.value === '') {
        return alert('Digite um valor');
    }
    const nomeTarefa = li.querySelector('.tarefa--nome');

    nomeTarefa.textContent = criarNomeTarefa.value;
    nomeTarefa.dataset.descricao = criarDescricaoTarefa.value;
    nomeTarefa.dataset.prioridade = criarPrioridade.value;

    const prioridade = Number(criarPrioridade.value);
    li.classList.remove('alta', 'media', 'baixa');
    if (prioridade > 70) {
        li.classList.add('alta');
    } else if (prioridade > 30) {
        li.classList.add('media');
    } else {
        li.classList.add('baixa');
    }
    const ul = li.closest('ul.tarefa');
    ordenarTarefasPorPrioridade(ul);
}

btnFechar.onclick = function () {
    modal.style.display = "none";
}
btnFecharDescricao.onclick = function () {
    document.getElementById('modal-descricao').style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
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