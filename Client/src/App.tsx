import { Toaster } from 'sonner';
import './index.css'
import EditorPage from '@/features/editor/EditorPage';

function App() {
  return (
    <>
    <EditorPage />
    < Toaster richColors position='bottom-center' />
    </>
  ) 
}
export default App;
