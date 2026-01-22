import React, { useEffect, useState } from 'react';
import { KanbanCard } from '../components/KanbanCard';
import { kanbanApi } from '../services/api';
import type { KanbanItem } from '../types';
import './KanbanDashboard.css';

export const KanbanDashboard: React.FC = () => {
    const [items, setItems] = useState<KanbanItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const fetchKanban = async () => {
        try {
            const data = await kanbanApi.get();
            setItems(data);
            setLastUpdate(new Date());
            setError(null);
        } catch (err) {
            setError('Erro ao carregar dados do Kanban');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKanban();

        // Auto-refresh a cada 5 segundos
        const interval = setInterval(fetchKanban, 5000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Carregando Kanban...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">
                    <span className="title-icon">📊</span>
                    Kanban - Pulmão de Produção
                </h1>
                <div className="dashboard-info">
                    <span className="update-time">
                        Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
                    </span>
                    <span className="auto-refresh">🔄 Auto-refresh: 5s</span>
                </div>
            </div>

            {error && (
                <div className="dashboard-error">
                    <span>⚠️ {error}</span>
                    <button onClick={fetchKanban}>Tentar novamente</button>
                </div>
            )}

            <div className="dashboard-legend">
                <div className="legend-item">
                    <span className="legend-color verde"></span>
                    <span>VERDE: 9-14 paletes</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color amarelo"></span>
                    <span>AMARELO: 4-8 paletes</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color vermelho"></span>
                    <span>VERMELHO: 0-3 paletes</span>
                </div>
            </div>

            <div className="kanban-grid">
                {items.length === 0 ? (
                    <div className="no-data">
                        <p>Nenhum produto cadastrado</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <KanbanCard key={item.sku} item={item} />
                    ))
                )}
            </div>
        </div>
    );
};
