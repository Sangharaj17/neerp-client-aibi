# Frontend Setup Screen Implementation

## How It Works

When a user logs in:
1. Backend returns `202 Accepted` with `requiresInitialization: true` if setup is needed
2. Frontend shows a "System Updating" screen
3. Frontend polls `/api/tenants/init-status` endpoint every 2 seconds
4. When `initialized: true`, redirect to dashboard

---

## Backend Response Format

### Login Response (Setup Required)
```json
{
  "requiresInitialization": true,
  "message": "Please wait, your system is being set up...",
  "isFirstTime": true  // optional, only for first-time setup
}
```

### Init Status Response (In Progress)
```json
{
  "initialized": false,
  "currentStep": "creating_tables",
  "progress": 45,
  "message": "Creating database tables..."
}
```

### Init Status Response (Complete)
```json
{
  "initialized": true
}
```

---

## Example React Implementation

### 1. Login Form Component

```jsx
// components/LoginForm.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import SetupScreen from './SetupScreen';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/api/login', {
        email,
        password
      });

      // Check if initialization is required
      if (response.data.requiresInitialization) {
        console.log('System setup required, showing setup screen...');
        setShowSetup(true);
        return;
      }

      // Normal login successful
      console.log('Login successful');
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // If setup is required, show setup screen
  if (showSetup) {
    return <SetupScreen onComplete={() => router.push('/dashboard')} />;
  }

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

### 2. Setup Screen Component

```jsx
// components/SetupScreen.js
import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';

export default function SetupScreen({ onComplete }) {
  const [status, setStatus] = useState({
    message: 'Initializing your system...',
    progress: 0,
    currentStep: 'starting'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Poll for initialization status every 2 seconds
    const pollInterval = setInterval(async () => {
      try {
        const response = await axiosInstance.get('/api/tenants/init-status');
        const data = response.data;

        if (data.initialized) {
          // Setup complete!
          console.log('Setup completed successfully');
          clearInterval(pollInterval);

          // Wait a moment to show 100% completion
          setStatus({
            message: 'Setup complete! Redirecting...',
            progress: 100,
            currentStep: 'completed'
          });

          setTimeout(() => {
            onComplete();
          }, 1500);
        } else {
          // Update progress
          setStatus({
            message: data.message || 'Setting up your system...',
            progress: data.progress || 0,
            currentStep: data.currentStep || 'in_progress'
          });
        }
      } catch (error) {
        console.error('Error polling init status:', error);
        setError('Error checking setup status');
      }
    }, 2000); // Poll every 2 seconds

    // Cleanup on unmount
    return () => clearInterval(pollInterval);
  }, [onComplete]);

  return (
    <div className="setup-screen">
      <div className="setup-container">
        <div className="setup-icon">
          {/* Add your loading spinner/icon here */}
          <div className="spinner"></div>
        </div>

        <h2>System Setup</h2>
        <p className="setup-message">{status.message}</p>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${status.progress}%` }}
          >
            <span className="progress-text">{status.progress}%</span>
          </div>
        </div>

        <p className="setup-hint">
          Please wait while we set up your system. This may take a few moments...
        </p>

        {error && (
          <div className="error-message">{error}</div>
        )}
      </div>

      <style jsx>{`
        .setup-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .setup-container {
          background: white;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 90%;
          text-align: center;
        }

        .setup-icon {
          margin-bottom: 2rem;
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        h2 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.8rem;
        }

        .setup-message {
          color: #666;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .progress-bar-container {
          width: 100%;
          height: 40px;
          background: #f0f0f0;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 20px;
          transition: width 0.5s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-text {
          color: white;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .setup-hint {
          color: #999;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .error-message {
          margin-top: 1rem;
          padding: 0.75rem;
          background: #fee;
          color: #c33;
          border-radius: 6px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
```

---

## API Endpoints Used

### 1. Login
```
POST /api/login
Headers: X-Tenant: <domain>
Body: { email, password }

Response (Setup Required):
Status: 202 Accepted
{
  "requiresInitialization": true,
  "message": "Please wait, your system is being set up...",
  "isFirstTime": true
}

Response (Normal Login):
Status: 200 OK
{
  "token": "...",
  "username": "...",
  "message": "Login successful"
}
```

### 2. Check Init Status
```
GET /api/tenants/init-status
Headers: X-Tenant: <domain>

Response (In Progress):
{
  "initialized": false,
  "currentStep": "creating_tables",
  "progress": 45,
  "message": "Creating database tables..."
}

Response (Complete):
{
  "initialized": true
}
```

---

## Integration Steps

1. **Copy the `SetupScreen` component** to your project
2. **Modify your login flow** to check for `requiresInitialization` in the response
3. **Show the setup screen** when initialization is required
4. **The setup screen automatically polls** and redirects when complete

---

## Customization Options

### Change Polling Interval
```javascript
// Poll every 5 seconds instead of 2
const pollInterval = setInterval(async () => {
  // ...
}, 5000);
```

### Custom Styling
Modify the `<style jsx>` section in the SetupScreen component to match your design system.

### Add More Details
Show the current step being executed:
```jsx
<p className="current-step">
  Current step: {status.currentStep}
</p>
```

---

## Testing

1. **Test first-time setup**: Use a new client that hasn't logged in before
2. **Test existing client**: Login with an existing client (should be fast, no setup screen)
3. **Test interrupted setup**: Refresh page during setup and login again (should resume)

---

## Notes

- Setup runs in background, doesn't block the application
- Safe to refresh - status is tracked on backend
- Progress bar shows real-time updates
- Automatic redirect when complete
