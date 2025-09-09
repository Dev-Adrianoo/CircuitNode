import { Toaster } from 'sonner';
import './index.css'
import EditorPage from './pages/EditorPage';

function App() {
  return (
    <>
    <EditorPage />
    < Toaster richColors position='bottom-center' />
    </>
  ) 
}
export default App;
