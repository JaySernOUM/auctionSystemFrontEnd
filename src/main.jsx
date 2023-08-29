import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import { Sepolia } from "@thirdweb-dev/chains";
import { StateContextProvider } from './context';
import App from './App';
import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
const clientId = "44ca18756d633bb0a537e095eac903ee";
root.render(
    <ThirdwebProvider activeChain={ Sepolia } 
        clientId={clientId}>
        <Router>
            <StateContextProvider>
                <App />
            </StateContextProvider>
        </Router>
    </ThirdwebProvider>
)