import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { KanbanDashboard } from './pages/KanbanDashboard';
import { OperacaoPage } from './pages/OperacaoPage';
import { GerarQRCodePage } from './pages/GerarQRCodePage';
import { ProdutosPage } from './pages/ProdutosPage';
import './App.css';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="app">
                <Navbar />
                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<KanbanDashboard />} />
                        <Route path="/operacao" element={<OperacaoPage />} />
                        <Route path="/gerar-qrcode" element={<GerarQRCodePage />} />
                        <Route path="/produtos" element={<ProdutosPage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
};

export default App;
