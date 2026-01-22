import React from 'react';
import type { KanbanItem } from '../types';
import { getStatusColor } from '../services/utils';
import './KanbanCard.css';

interface KanbanCardProps {
    item: KanbanItem;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const percentage = Math.min((item.paletesNoPulmao / item.capacidade) * 100, 100);

    return (
        <div className="kanban-card" style={{ borderColor: statusColor }}>
            <div className="kanban-card-header" style={{ backgroundColor: statusColor }}>
                <span className="kanban-sku">{item.sku}</span>
                <span className="kanban-status">{item.status}</span>
            </div>

            <div className="kanban-card-body">
                <h3 className="kanban-nome">{item.nome}</h3>

                <div className="kanban-stats">
                    <div className="kanban-stat">
                        <span className="stat-value">{item.paletesNoPulmao}</span>
                        <span className="stat-label">Paletes</span>
                    </div>
                    <div className="kanban-stat">
                        <span className="stat-value">{item.totalProdutos}</span>
                        <span className="stat-label">Produtos</span>
                    </div>
                    <div className="kanban-stat">
                        <span className="stat-value">{item.capacidade}</span>
                        <span className="stat-label">Capacidade</span>
                    </div>
                </div>

                <div className="kanban-progress">
                    <div
                        className="kanban-progress-bar"
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: statusColor
                        }}
                    />
                </div>
                <div className="kanban-progress-label">
                    {item.paletesNoPulmao} / {item.capacidade}
                </div>
            </div>
        </div>
    );
};
