import React from 'react';
import ReactDOM from 'react-dom/client';
import {MantineProvider} from '@mantine/core';
import App from './App';

import {BrowserRouter, Route, Routes,} from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MantineProvider withGlobalStyles withNormalizeCSS>
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<App/>}/>s
            </Routes>
        </BrowserRouter>
    </MantineProvider>
);
