import { supabase } from './supabase-config.js';

const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

async function authenticateAdmin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('authForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadUserData();
    } else {
        alert('Invalid admin password');
    }
}

async function loadUserData() {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error loading users:', error);
            return;
        }
        
        document.getElementById('totalUsers').textContent = users.length;
        
        if (users.length > 0) {
            const lastLogin = users.find(user => user.last_login)?.last_login;
            document.getElementById('lastLogin').textContent = lastLogin ? new Date(lastLogin).toLocaleString() : 'N/A';
        }
        
        const tableBody = document.getElementById('usersTable');
        tableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.name}</td>
                <td>${user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</td>
                <td>${new Date(user.created_at).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error:', error);
    }
}

function exportToCSV() {
    const rows = document.querySelectorAll('#usersTable tr');
    let csv = 'ID,Username,Email,Name,Last Login,Created At\n';
    
    rows.forEach(row => {
        const cols = row.querySelectorAll('td');
        const rowData = Array.from(cols).map(col => `"${col.textContent}"`).join(',');
        csv += rowData + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function logoutAdmin() {
    document.getElementById('authForm').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

// Auto-load if already authenticated (simple session)
if (localStorage.getItem('adminAuthenticated') === 'true') {
    document.getElementById('authForm').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadUserData();
}

function authenticateAdmin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminAuthenticated', 'true');
        document.getElementById('authForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadUserData();
    } else {
        alert('Invalid admin password');
    }
}