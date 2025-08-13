document.addEventListener('DOMContentLoaded', function() {
    
    // =================================================================
    // CORE CONFIGURATION & STATE
    // =================================================================
    const DB_KEY = 'fisterSMS_db_v15_stable';
    const USER_STATE_KEY = 'fisterSMS_user_v15_stable';
    let db, userState;

    const getInitialDB = () => ({
        servers: [], services: [],
        seo: { websiteTitle: 'FisterSMS', websiteDescription: 'OTP Verification' },
        analytics: { totalUsers: 0, todaysOrders: 0, todaysPayment: 0 }
    });

    const getInitialUserState = () => ({
        balance: 100.00, lifetimeRecharge: 0.00, numbersPurchased: 0, activeOrders: []
    });
    
    // =================================================================
    // DATA MANAGEMENT
    // =================================================================
    const saveData = (type) => {
        try {
            if (type === 'db' || !type) localStorage.setItem(DB_KEY, btoa(JSON.stringify(db)));
            if (type === 'user' || !type) localStorage.setItem(USER_STATE_KEY, btoa(JSON.stringify(userState)));
        } catch (e) { console.error("Error saving data:", e); }
    };

    const loadData = () => {
        try {
            db = JSON.parse(atob(localStorage.getItem(DB_KEY) || ''));
        } catch (e) { db = getInitialDB(); }

        try {
            userState = JSON.parse(atob(localStorage.getItem(USER_STATE_KEY) || ''));
        } catch (e) { userState = getInitialUserState(); }
        
        if (!db || !db.servers) db = getInitialDB();
        if (!userState || typeof userState.balance === 'undefined') userState = getInitialUserState();

        saveData();
    };

    // =================================================================
    // UI & VIEW MANAGEMENT
    // =================================================================
    const frontendView = document.getElementById('frontend-view');
    const adminPanelView = document.getElementById('admin-panel');
    
    // We will define these after HTML is injected
    let loginSection, appSection, loadingSpinner;

    function showView(viewName) {
        if (loginSection) loginSection.style.display = viewName === 'login' ? 'flex' : 'none';
        if (appSection) appSection.style.display = viewName === 'app' ? 'block' : 'none';
    }

    // =================================================================
    // EVENT HANDLING (Using Event Delegation)
    // =================================================================
    function setupGlobalEventListeners() {
        document.body.addEventListener('click', function(event) {
            const target = event.target;

            // --- Login Button ---
            if (target.classList.contains('form-btn')) {
                event.preventDefault();
                if (loadingSpinner) loadingSpinner.style.display = 'flex';
                setTimeout(() => {
                    if (loadingSpinner) loadingSpinner.style.display = 'none';
                    showView('app');
                    frontend.init();
                }, 1000);
            }

            // --- Show/Hide Admin Panel ---
            if (target.closest('#show-admin-panel-link')) {
                event.preventDefault();
                frontendView.classList.add('hidden');
                adminPanelView.classList.remove('hidden');
                adminPanel.init();
            }
            
            if (target.closest('#back-to-frontend-btn')) {
                event.preventDefault();
                adminPanelView.classList.add('hidden');
                frontendView.classList.remove('hidden');
            }

            // --- Login/Register Tab Toggle ---
            if (target.id === 'login-toggle-btn' || target.id === 'register-toggle-btn') {
                const isLogin = target.id === 'login-toggle-btn';
                document.querySelector('#login-form').classList.toggle('active', isLogin);
                document.querySelector('#register-form').classList.toggle('active', !isLogin);
                document.querySelector('#login-toggle-btn').classList.toggle('active', isLogin);
                document.querySelector('#register-toggle-btn').classList.toggle('active', !isLogin);
            }

            // --- Password Visibility Toggle ---
            if (target.classList.contains('eye-icon')) {
                const input = target.previousElementSibling;
                if (input.type === 'password') {
                    input.type = 'text';
                } else {
                    input.type = 'password';
                }
            }
        });
    }
    
    // =================================================================
    // MODULES
    // =================================================================
    const frontend = {
        isInitialized: false,
        init: function() {
            if (this.isInitialized) return;
            // Add any functions that need to run once the app view is shown
            console.log("Frontend Initialized.");
            this.isInitialized = true;
        }
    };

    const adminPanel = {
        isInitialized: false,
        init: function() {
            if (this.isInitialized) return;
             // Add any functions that need to run once the admin panel is shown
            console.log("Admin Panel Initialized.");
            this.isInitialized = true;
        }
    };

    // =================================================================
    // APP BOOTSTRAP
    // =================================================================
    function initializeApp() {
        // Step 1: Inject HTML from templates
        const feTemplate = document.getElementById('frontend-template');
        const adminTemplate = document.getElementById('admin-template');

        if (feTemplate) {
            frontendView.innerHTML = feTemplate.innerHTML;
        } else {
            frontendView.innerHTML = '<h1>Error: Frontend template missing.</h1>';
            console.error('Frontend template not found!');
        }

        if (adminTemplate) {
            adminPanelView.innerHTML = adminTemplate.innerHTML;
        } else {
            adminPanelView.innerHTML = '<h1>Error: Admin template missing.</h1>';
            console.error('Admin template not found!');
        }

        // Step 2: Define references to the now-existing elements
        loginSection = document.getElementById('login-section');
        appSection = document.getElementById('app-section');
        loadingSpinner = document.getElementById('loading-spinner');

        if (!loginSection || !appSection || !loadingSpinner) {
            console.error("Core app sections (#login-section, #app-section, #loading-spinner) are missing from your HTML templates!");
            return;
        }
        
        // Step 3: Load data
        loadData();
        
        // Step 4: Set up event listeners that work everywhere
        setupGlobalEventListeners();

        // Step 5: Set the initial view
        showView('login');
    }

    // Start the application
    initializeApp();

});        if (typeof userState.balance === 'undefined') userState = getInitialUserState();
        saveData(); // Save back to ensure consistency
    };

    // =================================================================
    // UTILITIES
    // =================================================================
    const showMessage = (msg, type = 'success') => { /* Your existing showMessage function */ };
    const sanitizeHTML = (str) => { /* Your existing sanitizeHTML function */ };
    window.addEventListener('error', (event) => { console.error('Global Error Caught:', event.message); });


    // =================================================================
    // VIEW & DOM MANAGEMENT
    // =================================================================
    const frontendView = document.getElementById('frontend-view');
    const adminPanelView = document.getElementById('admin-panel');

    // References to main sections, will be defined in initializeApp
    let loginSection, appSection, loadingSpinner; 

    function showView(viewName) {
        loginSection.style.display = viewName === 'login' ? 'flex' : 'none';
        appSection.style.display = viewName === 'app' ? 'block' : 'none';
    }
    
    // =================================================================
    // EVENT LISTENERS SETUP
    // =================================================================
    function setupEventListeners() {
        // Use event delegation for dynamically added content
        document.body.addEventListener('click', function(e) {
            // --- Login Functionality ---
            if (e.target.matches('.form-btn')) {
                e.preventDefault();
                loadingSpinner.style.display = 'flex';
                setTimeout(() => {
                    loadingSpinner.style.display = 'none';
                    showView('app'); // Show the main app view
                    frontend.init(); // Initialize main app functionalities
                }, 1000); // Simulate login delay
            }

            if (e.target.closest('#show-admin-panel-link')) {
                e.preventDefault();
                frontendView.classList.add('hidden');
                adminPanelView.classList.remove('hidden');
                adminPanel.init();
            }
            
            if (e.target.closest('#back-to-frontend-btn')) {
                e.preventDefault();
                adminPanelView.classList.add('hidden');
                frontendView.classList.remove('hidden');
            }

            // Add other event listeners here (toggle forms, password visibility etc.)
            if (e.target.matches('#login-toggle-btn, #register-toggle-btn')) {
                 const isLogin = e.target.id === 'login-toggle-btn';
                 document.querySelector('#login-form').classList.toggle('active', isLogin);
                 document.querySelector('#register-form').classList.toggle('active', !isLogin);
                 document.querySelector('#login-toggle-btn').classList.toggle('active', isLogin);
                 document.querySelector('#register-toggle-btn').classList.toggle('active', !isLogin);
            }

        });
    }

    // =================================================================
    // MODULES (Frontend & Admin)
    // =================================================================
    const frontend = {
        isInitialized: false,
        init: function() {
            if (this.isInitialized || !appSection) return;
            // Populate app section with content from templates if needed
            this.updateDisplay();
            this.isInitialized = true;
        },
        updateDisplay: function() {
            // Your balance update logic etc.
        }
    };

    const adminPanel = {
        isInitialized: false,
        init: function() {
            if (this.isInitialized || !adminPanelView) return;
            // Admin panel initializations (forms, buttons etc.)
            this.isInitialized = true;
        }
    };

    // =================================================================
    // APP INITIALIZATION
    // =================================================================
    function initializeApp() {
        // Inject templates into views if they are not already there
        const feTemplate = document.getElementById('frontend-template');
        if (frontendView.children.length === 0 && feTemplate) {
             frontendView.innerHTML = feTemplate.innerHTML;
        }
        
        const adminTemplateEl = document.getElementById('admin-template');
        if (adminPanelView.children.length === 0 && adminTemplateEl) {
             adminPanelView.innerHTML = adminTemplateEl.innerHTML;
        }
        
        // Define main section variables
        loginSection = document.getElementById('login-section');
        appSection = document.getElementById('app-section');
        loadingSpinner = document.getElementById('loading-spinner');

        if (!loginSection || !appSection || !loadingSpinner) {
            console.error('Core HTML sections are missing!');
            document.body.innerHTML = "<h1>Error: App structure is broken.</h1>";
            return;
        }

        loadData();
        setupEventListeners();
        
        // Check login status here in a real app
        // For now, default to login page
        showView('login');
    }

    initializeApp();
});
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
