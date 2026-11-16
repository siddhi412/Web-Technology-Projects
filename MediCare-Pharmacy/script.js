let isAdmin = false;

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadMedicines();
});

async function checkAuth() {
    const res = await fetch('/api/auth-status');
    const data = await res.json();
    isAdmin = data.isAdmin;

    document.getElementById('adminPanel').classList.toggle('d-none', !isAdmin);
    document.getElementById('loginBtn').classList.toggle('d-none', isAdmin);
    document.getElementById('logoutBtn').classList.toggle('d-none', !isAdmin);
}

async function loadMedicines(searchQuery = '') {
    const res = await fetch(`/api/medicines?search=${encodeURIComponent(searchQuery)}`);
    const medicines = await res.json();

    const grid = document.getElementById('medicineGrid');
    const select = document.getElementById('medSelect');
    
    grid.innerHTML = '';
    select.innerHTML = '<option value="">-- Choose Medicine --</option>';

    medicines.forEach(med => {
        if (med.stock > 0) {
            select.innerHTML += `<option value="${med.id}">${med.name} (Rs. ${med.price})</option>`;
        }

        const stockBadge = med.stock > 0 
            ? `<span class="badge bg-success">In Stock: ${med.stock}</span>` 
            : `<span class="badge bg-danger">Out of Stock</span>`;

        const deleteBtn = isAdmin 
            ? `<button class="btn btn-outline-danger btn-sm mt-2 w-100" onclick="deleteMedicine(${med.id})">Delete Item</button>` 
            : '';

        grid.innerHTML += `
            <div class="col-md-3 col-sm-6">
                <div class="card h-100 shadow-sm med-card">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <small class="text-muted fw-bold">${med.category}</small>
                            <h5 class="card-title fw-bold mt-1">${med.name}</h5>
                            <p class="fs-5 text-primary fw-bold mb-2">Rs. ${med.price}</p>
                            ${stockBadge}
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-primary btn-sm w-100" 
                                ${med.stock === 0 ? 'disabled' : ''} 
                                onclick="selectMedicine(${med.id})">
                                Order Now
                            </button>
                            ${deleteBtn}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    loadMedicines(e.target.value);
});

function selectMedicine(id) {
    document.getElementById('medSelect').value = id;
    document.getElementById('orderSection').scrollIntoView();
}

document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        customer_name: document.getElementById('custName').value,
        medicine_id: document.getElementById('medSelect').value,
        quantity: parseInt(document.getElementById('orderQty').value)
    };

    const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
        alert(data.message);
        document.getElementById('orderForm').reset();
        loadMedicines();
    } else {
        alert(data.error);
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    });

    if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        await checkAuth();
        await loadMedicines();
    } else {
        alert('Invalid login! Use admin / admin123');
    }
});

async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    await checkAuth();
    await loadMedicines();
}

document.getElementById('addMedForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        name: document.getElementById('medName').value,
        category: document.getElementById('medCategory').value,
        price: parseFloat(document.getElementById('medPrice').value),
        stock: parseInt(document.getElementById('medStock').value)
    };

    const res = await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        document.getElementById('addMedForm').reset();
        loadMedicines();
    }
});

async function deleteMedicine(id) {
    if (!confirm('Remove this medicine from inventory?')) return;
    await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
    loadMedicines();
}