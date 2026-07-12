/**
 * app.js
 * Global App Logic & Routing
 */

const App = {
    currentUser: null, // can be { type: 'applicant', data: ... } or { type: 'admin' }

    init() {
        // Handle basic routing via views
        this.navigate('home');
    },

    async navigate(viewId) {
        // Hide all views
        document.querySelectorAll('.view').forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('active');
        });

        // Show target view
        const target = document.getElementById(`${viewId}-view`);
        if (target) {
            target.classList.remove('hidden');
            // Small delay for fade in
            setTimeout(() => target.classList.add('active'), 50);
        }
        
        // Refresh data based on view
        if (viewId === 'admin-dashboard') {
            if (this.currentUser?.type !== 'admin') {
                this.navigate('admin-login');
                return;
            }
            await adminView.refresh();
        }
        if (viewId === 'applicant-dashboard') {
            if (this.currentUser?.type !== 'applicant') {
                this.navigate('applicant-login');
                return;
            }
            await applicantView.refreshDashboard();
        }
    },

    startApplication(role) {
        document.getElementById('apply-role-name').innerText = role;
        document.getElementById('app-role').value = role;
        
        const dynamicFields = document.getElementById('dynamic-fields');
        dynamicFields.innerHTML = ''; // clear

        let commonFields = `
            <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" id="app-dob" required>
            </div>
            <div class="form-group">
                <label>Gender</label>
                <select id="app-gender" required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Residential Address</label>
                <textarea id="app-address" required rows="3"></textarea>
            </div>
            <div class="form-group">
                <label>Driving License Upload</label>
                <input type="file" id="app-dl-upload" required>
            </div>
            <div class="form-group">
                <label>Aadhaar / PAN / Govt ID Upload</label>
                <input type="file" id="app-id-upload" required>
            </div>
            <div class="form-group">
                <label>Passport-size Photo</label>
                <input type="file" id="app-photo-upload" required accept="image/*">
            </div>
        `;

        let extraFields = '';

        if (role === 'Delivery Staff') {
            extraFields = `
                <div class="form-group">
                    <label>PUC Certificate Upload</label>
                    <input type="file" id="app-puc-upload" required>
                </div>
            `;
        } else if (role === 'Technical Staff' || role === 'Webcam Staff') {
            extraFields = `
                <div class="form-group">
                    <label>Highest Qualification</label>
                    <input type="text" id="app-qualification" required>
                </div>
                <div class="form-group">
                    <label>Course Certificate Upload</label>
                    <input type="file" id="app-course-upload">
                </div>
            `;
        } else if (role === 'Manager') {
            extraFields = `
                <div class="form-group">
                    <label>Management Track</label>
                    <select id="app-track" required>
                        <option value="Operations Manager">Operations Manager</option>
                        <option value="Finance Manager">Finance Manager</option>
                        <option value="Auditor">Auditor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Highest Qualification</label>
                    <input type="text" id="app-qualification" required>
                </div>
                <div class="form-group">
                    <label>Course Certificate Upload</label>
                    <input type="file" id="app-course-upload">
                </div>
                <div class="form-group">
                    <label>CV / Resume</label>
                    <input type="file" id="app-resume-upload" required>
                </div>
            `;
        }

        dynamicFields.innerHTML = commonFields + extraFields;
        
        this.navigate('apply');
    },

    showEligibility(role) {
        // Hide all panes
        document.querySelectorAll('.elig-pane').forEach(el => el.classList.add('hidden'));
        // Show target pane
        const target = document.getElementById(`elig-${role}`);
        if (target) {
            target.classList.remove('hidden');
        }

        // Reset button styles
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'btn-primary');
            btn.classList.add('btn-outline');
        });
        
        // Find and activate the clicked button
        const clickedBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => btn.getAttribute('onclick').includes(role));
        if (clickedBtn) {
            clickedBtn.classList.remove('btn-outline');
            clickedBtn.classList.add('active', 'btn-primary');
        }
    },

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.innerText = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    },

    logout() {
        this.currentUser = null;
        this.navigate('home');
        this.showToast("Logged out successfully");
    }
};

window.app = App;
document.addEventListener('DOMContentLoaded', () => app.init());
