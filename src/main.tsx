import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// Handle GitHub Pages 404 redirect
const urlParams = new URLSearchParams(window.location.search);
const redirectPath = urlParams.get('redirect');

if (redirectPath) {
  // Remove the redirect parameter from the URL and navigate to the original path
  const decodedPath = decodeURIComponent(redirectPath);
  window.history.replaceState(null, '', decodedPath);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)