const API_URL = 'https://indicadores-api-r588.onrender.com/api/indicadores/';

// === SELIC ===
function buscarSelic() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataFinal = `${dia}/${mes}/${ano}`;
    const dataInicial = `${dia}/${mes}/${ano - 1}`; 

    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados?formato=json&dataInicial=${dataInicial}&dataFinal=${dataFinal}`;

    fetch(url)
        .then(res => res.json())
        .then(dados => {
            if (dados.length === 0) {
                document.getElementById('selic').innerText = 'Selic: dados indisponíveis';
                return;
            }
            const ultimo = dados[dados.length - 1];
            document.getElementById('selic').innerText = `Selic: ${ultimo.valor}% em ${ultimo.data}`;
        })
        .catch(() => {
            document.getElementById('selic').innerText = 'Selic: erro ao carregar';
        });
}

// === INDICADORES ===
function listarIndicadores() {
    fetch(API_URL)
        .then(async res => {
            if (!res.ok) {
                const erro = await res.text();
                console.error('Erro HTTP:', res.status, erro);
                throw new Error('Erro HTTP: ' + res.status);
            }
            return res.json();
        })
        .then(dados => {
            if (!dados) {
                alert('Resposta vazia da API.');
                return;
            }
            if (Array.isArray(dados)) {
                preencherTabela(dados);
            } else if (dados.results && Array.isArray(dados.results)) {
                preencherTabela(dados.results);
            } else {
                alert('Formato inesperado da resposta da API. Veja o console para detalhes.');
                console.error('Resposta inesperada:', dados);
            }
        })
        .catch(erro => {
            alert('Erro ao buscar indicadores. Veja o console para detalhes.');
            console.error('Erro ao buscar indicadores:', erro);
        });
}

function preencherTabela(indicadores) {
    const tbody = document.querySelector('#indicadores-table tbody');
    tbody.innerHTML = '';
    indicadores.forEach(ind => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${ind.id}</td>
            <td>${ind.tipo}</td>
            <td>${ind.valor}</td>
            <td>${ind.ano}</td>
            <td>
                <button class="btn-editar" title="Editar" onclick="editarIndicador(${ind.id}, '${ind.tipo}', ${ind.valor}, ${ind.ano})">
                    <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm14.71-9.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                    Editar
                </button>
                <button class="btn-excluir" title="Excluir" onclick="excluirIndicador(${ind.id})">
                    <svg viewBox="0 0 24 24"><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z"/></svg>
                    Excluir
                </button>
            </td>
        `;
        if (editandoId && ind.id === editandoId) {
            tr.classList.add('editando');
        }
        tbody.appendChild(tr);
    });
}

let editandoId = null;

// Feedback visual
function mostrarMensagem(texto, tipo = 'sucesso') {
    const msg = document.getElementById('mensagem');
    msg.textContent = texto;
    msg.className = 'mensagem ' + tipo;
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 3000);
}

// Botão cancelar edição
const btnCancelar = document.getElementById('cancelar-edicao');
btnCancelar.addEventListener('click', function() {
    editandoId = null;
    document.getElementById('indicador-form').reset();
    document.getElementById('indicador-form').querySelector('button[type="submit"]').textContent = 'Cadastrar';
    btnCancelar.style.display = 'none';
    // Remove destaque de linha
    document.querySelectorAll('tr.editando').forEach(tr => tr.classList.remove('editando'));
});

function editarIndicador(id, tipo, valor, ano) {
    editandoId = id;
    document.getElementById('tipo').value = tipo;
    document.getElementById('valor').value = valor;
    document.getElementById('ano').value = ano;
    document.getElementById('indicador-form').querySelector('button[type="submit"]').textContent = 'Salvar';
    btnCancelar.style.display = 'inline-block';
    document.querySelectorAll('tr.editando').forEach(tr => tr.classList.remove('editando'));
    const trs = document.querySelectorAll('#indicadores-table tbody tr');
    trs.forEach(tr => {
        if (tr.firstElementChild && tr.firstElementChild.textContent == id) {
            tr.classList.add('editando');
        }
    });
}

// === EXCLUIR ===
function excluirIndicador(id) {
    if (!confirm('Tem certeza que deseja excluir este indicador?')) return;
    fetch(API_URL + id + '/', { method: 'DELETE' })
        .then(res => {
            if (!res.ok) throw new Error();
            listarIndicadores();
            mostrarMensagem('Indicador excluído com sucesso!', 'sucesso');
        })
        .catch(() => mostrarMensagem('Erro ao excluir indicador.', 'erro'));
}

// === INICIALIZAÇÃO ===
buscarSelic();
listarIndicadores();

document.getElementById('indicador-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = this;
    const tipo = document.getElementById('tipo').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const ano = parseInt(document.getElementById('ano').value);
    const anoAtual = new Date().getFullYear();
    if (ano < 1900 || ano > anoAtual + 1) {
        mostrarMensagem('Ano inválido. Digite um ano entre 1900 e ' + (anoAtual + 1) + '.', 'erro');
        return;
    }
    if (editandoId) {
        // Modo edição
        const idParaEditar = editandoId;
        editandoId = null; 
        document.getElementById('indicador-form').querySelector('button[type="submit"]').textContent = 'Cadastrar';
        btnCancelar.style.display = 'none';
        fetch(API_URL + idParaEditar + '/', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo, valor, ano })
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(() => {
            listarIndicadores();
            form.reset();
            mostrarMensagem('Indicador editado com sucesso!', 'sucesso');
            document.querySelectorAll('tr.editando').forEach(tr => tr.classList.remove('editando'));
        })
        .catch(() => mostrarMensagem('Erro ao editar indicador.', 'erro'));
    } else {
        // Modo cadastro
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo, valor, ano })
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(() => {
            listarIndicadores();
            form.reset();
            mostrarMensagem('Indicador cadastrado com sucesso!', 'sucesso');
        })
        .catch(() => mostrarMensagem('Erro ao cadastrar indicador.', 'erro'));
    }
}); 
