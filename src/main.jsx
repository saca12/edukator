import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Theme } from '@radix-ui/themes';
import { UserProvider } from './context/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { ClasseProvider } from './context/ClasseContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Theme 
      appearance="light"
      accentColor="indigo" 
      grayColor="slate" 
      panelBackground="translucent" 
      radius="medium"
    >
      <UserProvider>
        <ClasseProvider>
          <Router>
            <App />
          </Router>
        </ClasseProvider>
      </UserProvider>
    </Theme>
  </StrictMode>,
)
