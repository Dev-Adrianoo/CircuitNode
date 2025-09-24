import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'reactflow/dist/style.css';
import { Provider } from 'react-redux'
import { store } from './service/store.tsx';
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
