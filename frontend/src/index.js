import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RefreshProvider } from './context/RefreshContext';
import { LoadingProvider } from './context/LoadingContext';
import { ConfirmProvider } from './context/SweetAlert2Context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RefreshProvider>
    <LoadingProvider>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </LoadingProvider>
  </RefreshProvider>
);