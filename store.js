/**
 * store.js
 * Backend integration using Fetch API to Flask.
 */

const Store = {
    async getApplications() {
        const response = await fetch('/api/applicants');
        return response.json();
    },

    async saveApplication(application) {
        const response = await fetch('/api/applicants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(application)
        });
        return response.json();
    },

    async updateApplication(id, updates) {
        const response = await fetch(`/api/applicants/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        return response.json();
    },

    async getApplicationById(id) {
        const response = await fetch(`/api/applicants/${id}`);
        if (!response.ok) return null;
        return response.json();
    },

    async getApplicationByCredentials(idOrPhone, password) {
        const apps = await this.getApplications();
        return apps.find(a => 
            (a.appId === idOrPhone || a.mobile === idOrPhone) && a.password === password
        );
    },

    async getEmployees() {
        const response = await fetch('/api/employees');
        return response.json();
    },

    async addEmployee(employee) {
        const response = await fetch('/api/employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        });
        return response.json();
    },

    // --- Helpers ---
    generateApplicantId() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `AURA-APP-${timestamp}${random}`;
    },

    generatePassword() {
        return Math.random().toString(36).slice(-8);
    },
    
    generateEmployeeId() {
        return 'EMP-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    }
};

// Removed Store.init() because DB is persistent.
