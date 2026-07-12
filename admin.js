/**
 * admin.js
 * Logic for the Admin Dashboard
 */

const adminView = {
    login(e) {
        e.preventDefault();
        const user = document.getElementById('login-admin-user').value;
        const pass = document.getElementById('login-admin-pass').value;

        // Hardcoded admin for demo
        if (user === 'admin' && pass === 'admin123') {
            app.currentUser = { type: 'admin' };
            e.target.reset();
            app.navigate('admin-dashboard');
            app.showToast('Admin Login successful');
        } else {
            alert("Invalid Admin Credentials");
        }
    },

    showTab(tabId) {
        // Hide all tabs
        document.querySelectorAll('.admin-tab').forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('active');
        });
        
        // Show target
        const target = document.getElementById(`admin-tab-${tabId}`);
        if (target) {
            target.classList.remove('hidden');
            setTimeout(() => target.classList.add('active'), 50);
        }

        // Update sidebar
        document.querySelectorAll('.admin-sidebar li').forEach(el => {
            el.classList.remove('active');
        });
        const activeLink = Array.from(document.querySelectorAll('.admin-sidebar li')).find(el => el.textContent.toLowerCase() === tabId);
        if (activeLink) activeLink.classList.add('active');

        if (tabId === 'applicants') {
            this.filterApplicants();
        }
    },

    async refresh() {
        const apps = await Store.getApplications();
        
        document.getElementById('stat-total').innerText = apps.length;
        document.getElementById('stat-pending').innerText = apps.filter(a => a.status === 'Pending Verification').length;
        document.getElementById('stat-selected').innerText = apps.filter(a => a.status === 'Selected').length;
        document.getElementById('stat-rejected').innerText = apps.filter(a => a.status === 'Rejected').length;
    },

    async filterApplicants() {
        const query = document.getElementById('admin-search').value.toLowerCase();
        const status = document.getElementById('admin-filter-status').value;
        
        let apps = await Store.getApplications();

        if (query) {
            apps = apps.filter(a => a.id.toLowerCase().includes(query) || a.name.toLowerCase().includes(query));
        }
        if (status) {
            apps = apps.filter(a => a.status === status);
        }

        this.renderApplicantsTable(apps);
    },

    renderApplicantsTable(apps) {
        const tbody = document.getElementById('admin-applicants-tbody');
        tbody.innerHTML = '';

        apps.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${a.id}</td>
                <td>${a.name}</td>
                <td>${a.role}</td>
                <td>${new Date(a.date).toLocaleDateString()}</td>
                <td><span class="badge ${this.getBadgeClass(a.status)}">${a.status}</span></td>
                <td>
                    <button class="btn-primary btn-small" onclick="adminView.openModal('${a.id}')">Manage</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    getBadgeClass(status) {
        if (status === 'Submitted') return 'badge-submitted';
        if (status === 'Pending Review' || status === 'Under Verification' || status === 'Pending Verification') return 'badge-pending';
        if (status === 'Approved' || status === 'Selected') return 'badge-approved';
        if (status === 'Rejected') return 'badge-rejected';
        return '';
    },

    async openModal(id) {
        const a = await Store.getApplicationById(id);
        if (!a) return;

        const detailsHtml = Object.keys(a.details || {}).map(k => `<p><strong>${k}:</strong> ${a.details[k]}</p>`).join('');

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div style="margin-bottom: 2rem;">
                <p><strong>Name:</strong> ${a.name}</p>
                <p><strong>Mobile:</strong> ${a.mobile}</p>
                <p><strong>Email:</strong> ${a.email}</p>
                <p><strong>Role:</strong> ${a.role}</p>
                <hr style="border:0; border-top: 1px solid var(--border-glass); margin: 1rem 0;">
                <h4>Role Details</h4>
                ${detailsHtml}
            </div>

            <div class="form-group">
                <label>Update Status</label>
                <select id="modal-status-update" onchange="document.getElementById('reporting-fields').style.display = this.value === 'Selected' ? 'block' : 'none'">
                    <option value="Submitted" ${a.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
                    <option value="Approved" ${a.status === 'Approved' ? 'selected' : ''}>Approved for Stage 2</option>
                    <option value="Pending Verification" ${a.status === 'Pending Verification' ? 'selected' : ''}>Pending Verification</option>
                    <option value="Rejected" ${a.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                    <option value="Selected" ${a.status === 'Selected' ? 'selected' : ''}>Selected / Hire</option>
                </select>
            </div>
            
            <div id="reporting-fields" style="display: ${a.status === 'Selected' ? 'block' : 'none'};">
                <div class="form-group">
                    <label>Reporting Date</label>
                    <input type="date" id="modal-reporting-date" value="${a.reportingDate || ''}">
                </div>
                <div class="form-group">
                    <label>Reporting Time</label>
                    <input type="time" id="modal-reporting-time" value="${a.reportingTime || ''}">
                </div>
            </div>
            
            <button class="btn-primary w-full" onclick="adminView.saveModalStatus('${a.id}')">Save Changes</button>
        `;

        document.getElementById('admin-modal').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('admin-modal').classList.add('hidden');
    },

    async saveModalStatus(id) {
        const newStatus = document.getElementById('modal-status-update').value;
        const appData = await Store.getApplicationById(id);
        
        let updates = { status: newStatus };

        // Handle logical progression
        if (newStatus === 'Selected' && appData.status !== 'Selected') {
            const empId = Store.generateEmployeeId();
            updates.stage = 'Recruitment Complete';
            app.showToast(`Employee ID ${empId} generated!`);
        }
        
        if (newStatus === 'Selected') {
            updates.reportingDate = document.getElementById('modal-reporting-date').value;
            updates.reportingTime = document.getElementById('modal-reporting-time').value;
        }

        await Store.updateApplication(id, updates);
        
        this.closeModal();
        await this.filterApplicants(); // refresh table
        await this.refresh(); // refresh dashboard numbers
        app.showToast(`Application ${id} updated.`);
    }
};
