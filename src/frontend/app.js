// --- STATE ---
let csrfToken = null;
let currentUser = null;
let currentRequestData = null;
const API_BASE = '/api'; 

// --- UTILS ---
async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = { 'Accept': 'application/json' };
    if (body) headers['Content-Type'] = 'application/json';
    if (method !== 'GET' && method !== 'HEAD' && csrfToken) headers['X-CSRF-Token'] = csrfToken;

    const options = { method, headers, credentials: 'include' };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) throw { status: response.status, message: data.error || 'API Error' };
    return data;
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

function getStatusBadge(status) {
    let cls = 'status-received';
    if (status === 'Assigned') cls = 'status-assigned';
    if (status === 'In progress') cls = 'status-progress';
    if (status === 'Resolved' || status === 'Closed') cls = 'status-resolved';
    if (status === 'Rejected') cls = 'status-rejected';
    return `<span class="status-pill ${cls}">${status}</span>`;
}

// --- LOGIN / LOGOUT ---
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.getElementById('login-error');
    errorBox.textContent = '';
    
    try {
        const result = await apiCall('/login', 'POST', { 
            username: document.getElementById('username').value, 
            password: document.getElementById('password').value 
        });
        currentUser = result.user;
        csrfToken = result.csrf;
        
        if (currentUser.role === 'Staff') {
            loadStaffDashboard('all');
        } else if (currentUser.role === 'Requester') {
            loadRequesterDashboard();
        } else {
            alert('Oversight UI is not yet implemented in this M2 working slice.');
            logout();
        }
    } catch (err) {
        errorBox.textContent = err.message;
    }
});

async function logout() {
    try { await apiCall('/logout', 'POST', {}); } catch (err) {}
    currentUser = null;
    csrfToken = null;
    document.getElementById('login-form').reset();
    showView('login-view');
}

// --- REQUESTER JOURNEY ---
async function loadRequesterDashboard() {
    showView('requester-home-view');
    document.getElementById('req-welcome').textContent = `Welcome, ${currentUser.name}`;
    
    const tbody = document.getElementById('req-requests-tbody');
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Loading...</td></tr>';

    try {
        const requests = await apiCall('/requests', 'GET');
        tbody.innerHTML = '';
        if (requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No requests found.</td></tr>';
            return;
        }
        requests.forEach(req => {
            tbody.innerHTML += `
                <tr>
                    <td>REQ-${req.id}</td>
                    <td>${req.category_label || req.category_id}</td>
                    <td>${getStatusBadge(req.status)}</td>
                    <td style="color: #6b7280;">${req.created_at.split('T')[0]}</td>
                </tr>`;
        });
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="4" style="color:red;">Error: ${err.message}</td></tr>`;
    }
}

async function loadSubmitForm() {
    showView('submit-view');
    document.getElementById('submit-error').textContent = '';
    document.getElementById('submit-request-form').reset();

    try {
        const categories = await apiCall('/categories', 'GET');
        const select = document.getElementById('req-category');
        select.innerHTML = '<option value="">Select a category</option>';
        categories.forEach(cat => {
            select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
        });
    } catch (err) {}
}

document.getElementById('submit-request-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const result = await apiCall('/requests', 'POST', {
            title: document.getElementById('req-title').value,
            category_id: parseInt(document.getElementById('req-category').value, 10),
            location: document.getElementById('req-location').value,
            description: document.getElementById('req-description').value
        });
        
        alert(`Request submitted successfully!\nReference: ${result.reference}`);
        
        loadRequesterDashboard();
    } catch (err) {
        document.getElementById('submit-error').textContent = err.message;
    }
});

// --- STAFF JOURNEY ---
async function loadStaffDashboard(filterType) {
    showView('staff-dashboard-view');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${filterType}`).classList.add('active');

    const tbody = document.getElementById('staff-requests-tbody');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Loading...</td></tr>';

    try {
        let url = '/requests';
        if (filterType === 'unassigned') url += '?status=Received';
        if (filterType === 'mine') url += `?owner=${currentUser.id}`;

        const requests = await apiCall(url, 'GET');
        tbody.innerHTML = '';
        if (requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No requests found.</td></tr>';
            return;
        }

        requests.forEach(req => {
            let ownerText = 'Unassigned';
            if (req.owner_id) {
                ownerText = (req.owner_id === currentUser.id) ? 'You' : `Staff ID ${req.owner_id}`;
            }

            tbody.innerHTML += `
                <tr>
                    <td>REQ-${req.id}</td>
                    <td>${req.category_label || req.category_id}</td>
                    <td>${getStatusBadge(req.status)}</td>
                    <td>${ownerText}</td>
                    <td style="color: #6b7280;">${req.created_at.split('T')[0]}</td>
                    <td><button class="btn-secondary" style="padding: 5px 10px; border-radius:4px; font-size:12px;" onclick="loadStaffDetail(${req.id})">View</button></td>
                </tr>`;
        });
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" style="color:red;">Error: ${err.message}</td></tr>`;
    }
}

async function loadStaffDetail(id) {
    showView('staff-detail-view');
    document.getElementById('update-error').textContent = '';
    document.getElementById('update-status-form').reset();
    
    try {
        currentRequestData = await apiCall(`/requests/${id}`, 'GET');
        
        let ownerText = 'Unassigned';
        if (currentRequestData.owner_id) {
            ownerText = (currentRequestData.owner_id === currentUser.id) ? 'You' : `Staff ID ${currentRequestData.owner_id}`;
        }

        document.getElementById('detail-id').textContent = `Request REQ-${currentRequestData.id}`;
        document.getElementById('detail-status-badge').innerHTML = getStatusBadge(currentRequestData.status);
        document.getElementById('detail-category').textContent = currentRequestData.category_label;
        document.getElementById('detail-location').textContent = currentRequestData.location || 'N/A';
        document.getElementById('detail-description').textContent = currentRequestData.description;
        document.getElementById('detail-date').textContent = currentRequestData.created_at.split('T')[0];
        document.getElementById('detail-owner').textContent = ownerText;
    } catch (err) {
        document.getElementById('update-error').textContent = err.message;
    }
}

document.getElementById('update-status-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.getElementById('update-error');
    const newStatus = document.getElementById('update-status').value;
    const note = document.getElementById('update-note').value;

    try {
        if (newStatus === 'Assigned' && currentRequestData.status === 'Received') {
            let futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 7);
            await apiCall(`/requests/${currentRequestData.id}/assign`, 'POST', {
                version: currentRequestData.version,
                owner_id: currentUser.id,
                priority: 'Normal',
                due_at: futureDate.toISOString(),
                note: note || 'Assigned via Dashboard'
            });
        } else {
            await apiCall(`/requests/${currentRequestData.id}/status`, 'POST', {
                version: currentRequestData.version,
                status: newStatus,
                note: note || 'Status updated'
            });
        }
        loadStaffDashboard('all');
    } catch (err) {
        if (err.status === 409) errorBox.textContent = "Conflict: Record modified by another user. Please refresh.";
        else errorBox.textContent = err.message;
    }
});