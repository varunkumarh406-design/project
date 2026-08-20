import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const appRoot = (
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  googleClientId && !googleClientId.includes('your_google_client_id') ? (
    <GoogleOAuthProvider clientId={googleClientId}>{appRoot}</GoogleOAuthProvider>
  ) : (
    appRoot
  )
);
