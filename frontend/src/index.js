import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RefreshProvider } from './context/RefreshContext';
import { LoadingProvider } from './context/LoadingContext';
import { ConfirmProvider } from './context/SweetAlert2Context';
import { LanguageProvider } from './context/LanguageContext';
import CookieTermGuard from './context/CookieTermGuard/CookieTermGuard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CookieTermGuard>
    <LanguageProvider>
      <RefreshProvider>
        <LoadingProvider>
          <ConfirmProvider>
            <App />
          </ConfirmProvider>
        </LoadingProvider>
      </RefreshProvider>
    </LanguageProvider>  
  </CookieTermGuard>
);