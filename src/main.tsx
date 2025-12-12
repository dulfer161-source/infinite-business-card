import * as React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { initMetrika } from './lib/metrika'

initMetrika();

createRoot(document.getElementById("root")!).render(<App />);