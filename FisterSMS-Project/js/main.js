document.addEventListener('DOMContentLoaded', function() {
    
    // =================================================================
    // CONFIGURATION
    // =================================================================
    const DB_KEY = 'fisterSMS_db_v13_config';
    const USER_STATE_KEY = 'fisterSMS_user_v13_state';

    // =================================================================
    // DATA HANDLING & SECURITY
    // =================================================================
    const encryptData = (data) => btoa(JSON.stringify(data));
    const decryptData = (encodedData) => {
        try {
            return JSON.parse(atob(encodedData));
        } catch (e) {
            console.error("Failed to parse or decrypt data:", e);
            return null;
        }
    };

    const getInitialDB = () => ({
        servers: [],
        services: [],
        seo: { websiteTitle: 'FisterSMS', websiteDescription: 'Buy phone numbers for OTP verification.'},
        analytics: { todaysUsers: 0, totalUsers: 0, todaysOrders: 0, todaysPayment: 0 }
    });

    const getInitialUserState = () => ({
        balance: 100.00,
        lifetimeRecharge: 0.00,
        numbersPurchased: 0,
        activeOrders: []
    });

    let db, userState;

    const saveData = (type) => {
        try {
            if (type === 'db' || !type) {
                localStorage.setItem(DB_KEY, encryptData(db));
            }
            if (type === 'user' || !type) {
                localStorage.setItem(USER_STATE_KEY, encryptData(userState));
            }
        } catch (e) {
            console.error("Error saving data:", e);
            showMessage('Could not save data. Storage might be full.', 'error');
        }
    };
    
    const loadData = () => {
        try {
            const encryptedDb = localStorage.getItem(DB_KEY);
            db = encryptedDb ? decryptData(encryptedDb) : null;
            if (!db || !db.servers || !db.analytics) {
                db = getInitialDB();
                saveData('db');
            }
        } catch (e) {
            console.error("Critical error loading DB config. Resetting.", e);
            db = getInitialDB();
            saveData('db');
        }

        try {
            const encryptedUserState = localStorage.getItem(USER_STATE_KEY);
            userState = encryptedUserState ? decryptData(encryptedUserState) : null;
            if (!userState || typeof userState.balance === 'undefined') {
                userState = getInitialUserState();
                saveData('user');
            }
        } catch (e) {
             console.error("Critical error loading user state. Resetting.", e);
             userState = getInitialUserState();
             saveData('user');
        }
    };

    // =================================================================
    // UTILITIES
    // =================================================================
    const showMessage = (msg, type = 'success') => {
        const el = document.createElement('div');
        el.className = `wallet-notification ${type}`;
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => el.remove(), 500);
        }, 4000);
    };

    const sanitizeHTML = str => {
        if (!str) return "";
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    window.addEventListener('error', (event) => {
        console.error('Global Error Caught:', event.message, event.filename, event.lineno);
        showMessage(`A system error occurred. Please refresh.`, 'error');
    });

    // =================================================================
    // INITIALIZATION & VIEW MANAGEMENT
    // =================================================================
    const frontendView = document.getElementById('frontend-view');
    const adminPanelView = document.getElementById('admin-panel');

    function initializeApp() {
        // Inject templates into views
        const feTemplate = document.getElementById('frontend-template');
        const adminTemplateEl = document.getElementById('admin-template');
        
        if (feTemplate && feTemplate.innerHTML.trim().length > 100) {
            frontendView.innerHTML = feTemplate.innerHTML;
        } else {
             console.error("Frontend template not found or is empty!");
             frontendView.innerHTML = "<h1>Frontend failed to load.</h1>";
        }
        
        if (adminTemplateEl && adminTemplateEl.innerHTML.trim().length > 100) {
            adminPanelView.innerHTML = adminTemplateEl.innerHTML;
        } else {
            console.error("Admin template not found or is empty!");
            adminPanelView.innerHTML = "<h1>Admin Panel failed to load.</h1>";
        }

        loadData();
        setupEventListeners();
        
        // Initial render based on state
        // For now, let's assume the user is "logged in" for simplicity
        document.getElementById('login-section')?.classList.add('hidden');
        document.getElementById('app-section')?.style.display = 'block';

        // Initialize modules
        adminPanel.init();
        frontend.init();
    }
    
    function setupEventListeners() {
        // This is a placeholder for all event listener setups
        // Example for showing admin panel (assuming a link with this ID exists)
        const showAdminLink = document.querySelector('#show-admin-panel-link'); // You need to add this link to your frontend HTML
        if(showAdminLink) {
             showAdminLink.addEventListener('click', e => {
                e.preventDefault();
                frontendView.classList.add('hidden');
                adminPanelView.classList.remove('hidden');
            });
        }
        
        const backToFrontendBtn = adminPanelView.querySelector('#back-to-frontend-btn');
        if (backToFrontendBtn) {
            backToFrontendBtn.addEventListener('click', e => {
                e.preventDefault();
                adminPanelView.classList.add('hidden');
                frontendView.classList.remove('hidden');
            });
        }
    }

    // =================================================================
    // ADMIN PANEL LOGIC
    // =================================================================
    const adminPanel = {
        isInitialized: false,
        init: function() {
            if (this.isInitialized || !adminPanelView) return;
            
            const addServerForm = adminPanelView.querySelector('#add-server-form');
            if (addServerForm) {
                addServerForm.addEventListener('submit', e => {
                    e.preventDefault();
                    const fd = new FormData(e.target);
                    const newServer = { id: Date.now() };
                    fd.forEach((value, key) => newServer[key] = value);
                    db.servers.push(newServer);
                    saveData('db');
                    showMessage('Server added successfully!', 'success');
                    e.target.reset();
                    // Optional: Render server list or switch page
                });
            }
            
            // Setup navigation between admin pages
            adminPanelView.querySelectorAll('.back-btn').forEach(btn => {
                btn.addEventListener('click', () => this.showPage(btn.dataset.page));
            });

            this.isInitialized = true;
        },
        showPage: function(pageId) {
            if(!adminPanelView) return;
            adminPanelView.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const page = adminPanelView.querySelector(`#${pageId}`);
            if (page) page.classList.add('active');
        }
    };

    // =================================================================
    // FRONTEND LOGIC
    // =================================================================
    const frontend = {
        isInitialized: false,
        init: function() {
            if (this.isInitialized || !frontendView) return;
            // You can add frontend-specific initializations here, like populating dropdowns
            this.updateDisplay();
            this.isInitialized = true;
        },
        updateDisplay: function() {
            if(!frontendView) return;
            const balanceEl = frontendView.querySelector('.balance-display'); // Make sure you have an element with this class
            if (balanceEl) {
                balanceEl.textContent = `₹${userState.balance.toFixed(2)}`;
            }
        }
    };

    // Start the application
    initializeApp();
});
