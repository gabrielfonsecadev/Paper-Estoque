const API_BASE_URL = 'http://localhost:3000';


const itemForm = document.getElementById('item-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const itemsTableBody = document.getElementById('items-tbody');
const emptyMessage = document.getElementById('empty-message');
const totalItemsSpan = document.getElementById('total-items');
const totalValueSpan = document.getElementById('total-value');
const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const notification = document.getElementById('notification');


let editingItemId = null;
let itemToDelete = null;


document.addEventListener('DOMContentLoaded', function() {
    loadItems();
    setupEventListeners();
});


function setupEventListeners() {

    itemForm.addEventListener('submit', handleFormSubmit);
    

    cancelBtn.addEventListener('click', cancelEdit);
    

    confirmDeleteBtn.addEventListener('click', confirmDelete);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    

    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
    

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDeleteModal();
        }
    });
}


async function loadItems() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/items`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const items = await response.json();
        displayItems(items);
        updateStatistics(items);
        
    } catch (error) {
        console.error('Erro ao carregar itens:', error);
        showNotification('Erro ao carregar itens. Verifique se o servidor está rodando.', 'error');
    } finally {
        showLoading(false);
    }
}


function displayItems(items) {
    itemsTableBody.innerHTML = '';
    if (items.length === 0) {
        emptyMessage.style.display = 'block';
        document.querySelector('table').style.display = 'none';
        return;
    }
    emptyMessage.style.display = 'none';
    document.querySelector('table').style.display = 'table';
    items.forEach(item => {
        const row = createItemRow(item);
        itemsTableBody.appendChild(row);
    });
}


function createItemRow(item) {
    const row = document.createElement('tr');
    const valorTotal = (item.quantidade * item.preco).toFixed(2);
    
    row.innerHTML = `
        <td>${item.id}</td>
        <td>${escapeHtml(item.nome)}</td>
        <td>${item.quantidade}</td>
        <td>R$ ${item.preco.toFixed(2).replace('.', ',')}</td>
        <td>R$ ${valorTotal.replace('.', ',')}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-edit" onclick="editItem(${item.id})">
                    ✏️ Editar
                </button>
                <button class="btn-delete" onclick="deleteItem(${item.id})">
                    🗑️ Excluir
                </button>
            </div>
        </td>
    `;
    
    return row;
}


function updateStatistics(items) {
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.quantidade * item.preco), 0);
    
    totalItemsSpan.textContent = totalItems;
    totalValueSpan.textContent = `R$ ${totalValue.toFixed(2).replace('.', ',')}`;
}


async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(itemForm);
    const itemData = {
        nome: formData.get('nome').trim(),
        quantidade: parseInt(formData.get('quantidade')),
        preco: parseFloat(formData.get('preco'))
    };
    

    if (!itemData.nome) {
        showNotification('Nome do produto é obrigatório', 'error');
        return;
    }
    
    if (itemData.quantidade < 0) {
        showNotification('Quantidade deve ser um valor positivo', 'error');
        return;
    }
    
    if (itemData.preco < 0) {
        showNotification('Preço deve ser um valor positivo', 'error');
        return;
    }
    
    try {
        showLoading(true);
        
        if (editingItemId) {
            await updateItem(editingItemId, itemData);
        } else {
            await createItem(itemData);
        }
        
        resetForm();
        loadItems();
        
    } catch (error) {
        console.error('Erro ao salvar item:', error);
        showNotification('Erro ao salvar item', 'error');
    } finally {
        showLoading(false);
    }
}


async function createItem(itemData) {
    const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar item');
    }
    
    showNotification('Item adicionado com sucesso!', 'success');
}


async function updateItem(id, itemData) {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar item');
    }
    
    showNotification('Item atualizado com sucesso!', 'success');
}


function editItem(id) {

    const rows = itemsTableBody.querySelectorAll('tr');
    let itemData = null;
    
    for (const row of rows) {
        const cells = row.querySelectorAll('td');
        if (parseInt(cells[0].textContent) === id) {
            itemData = {
                id: id,
                nome: cells[1].textContent,
                quantidade: parseInt(cells[2].textContent),
                preco: parseFloat(cells[3].textContent.replace('R$ ', '').replace(',', '.'))
            };
            break;
        }
    }
    
    if (!itemData) {
        showNotification('Item não encontrado', 'error');
        return;
    }
    

    document.getElementById('nome').value = itemData.nome;
    document.getElementById('quantidade').value = itemData.quantidade;
    document.getElementById('preco').value = itemData.preco.toFixed(2);
    

    editingItemId = id;
    formTitle.textContent = 'Editar Item';
    submitBtn.textContent = 'Atualizar Item';
    cancelBtn.style.display = 'block';
    

    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}


function cancelEdit() {
    resetForm();
}


function resetForm() {
    itemForm.reset();
    editingItemId = null;
    formTitle.textContent = 'Adicionar Novo Item';
    submitBtn.textContent = 'Adicionar Item';
    cancelBtn.style.display = 'none';
}


function deleteItem(id) {
    itemToDelete = id;
    deleteModal.style.display = 'block';
}


async function confirmDelete() {
    if (!itemToDelete) return;
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/items/${itemToDelete}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao excluir item');
        }
        
        showNotification('Item excluído com sucesso!', 'success');
        loadItems();
        
    } catch (error) {
        console.error('Erro ao excluir item:', error);
        showNotification('Erro ao excluir item', 'error');
    } finally {
        showLoading(false);
        closeDeleteModal();
    }
}


function closeDeleteModal() {
    deleteModal.style.display = 'none';
    itemToDelete = null;
}


function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}


function showLoading(isLoading) {
    const container = document.querySelector('.container');
    if (isLoading) {
        container.classList.add('loading');
    } else {
        container.classList.remove('loading');
    }
}


function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}


window.addEventListener('unhandledrejection', function(event) {
    console.error('Erro não tratado:', event.reason);
    showNotification('Ocorreu um erro inesperado', 'error');
});


window.addEventListener('load', function() {

    setTimeout(() => {
        fetch(`${API_BASE_URL}/items`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Servidor não está respondendo');
                }
            })
            .catch(() => {
                showNotification('Servidor não está rodando. Execute "npm start" para iniciar.', 'error');
            });
    }, 1000);
});