document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const spinner = document.getElementById('spinner');
    const buttonText = document.getElementById('buttonText');
    const messageDiv = document.getElementById('message');
    
    // Create Supabase client
    const supabase = window.supabase.createClient(window.supabaseUrl, window.supabaseAnonKey);
    
    loginBtn.addEventListener('click', handleLogin);
    
    // Also allow login on Enter key press
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    async function handleLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Basic validation
        if (!username || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        try {
            // Check if user exists and verify password
            const { data: users, error } = await supabase
                .from('users')
                .select('*')
                .or(`username.eq.${username},email.eq.${username}`)
                .single();
            
            if (error || !users) {
                showMessage('Invalid username or password', 'error');
                setLoadingState(false);
                return;
            }
            
            // Simple password check (for demo)
            if (password === users.password) {
                // Update last login
                await supabase
                    .from('users')
                    .update({ last_login: new Date().toISOString() })
                    .eq('id', users.id);
                
                showMessage('Login successful!', 'success');
                console.log('User data:', users);
                
                // Store in localStorage
                localStorage.setItem('user', JSON.stringify(users));
                localStorage.setItem('login_time', new Date().toISOString());
                
            } else {
                showMessage('Invalid password', 'error');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            showMessage('Login failed. Please try again.', 'error');
        } finally {
            setLoadingState(false);
        }
    }
    
    function setLoadingState(isLoading) {
        if (isLoading) {
            loginBtn.disabled = true;
            spinner.style.display = 'block';
            buttonText.textContent = 'Logging in...';
        } else {
            loginBtn.disabled = false;
            spinner.style.display = 'none';
            buttonText.textContent = 'Log in';
        }
    }
    
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = 'message ' + type;
        messageDiv.style.display = 'block';
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    }
});
