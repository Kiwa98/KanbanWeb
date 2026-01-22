import axios from 'axios';
import type {
    Produto,
    CreateProduto,
    Palete,
    GerarPalete,
    PaleteGerado,
    Movimentacao,
    RegistrarMovimentacao,
    KanbanItem
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Produtos
export const produtosApi = {
    getAll: async (): Promise<Produto[]> => {
        const response = await api.get<Produto[]>('/produtos');
        return response.data;
    },

    getById: async (id: number): Promise<Produto> => {
        const response = await api.get<Produto>(`/produtos/${id}`);
        return response.data;
    },

    create: async (data: CreateProduto): Promise<Produto> => {
        const response = await api.post<Produto>('/produtos', data);
        return response.data;
    },

    update: async (id: number, data: CreateProduto): Promise<Produto> => {
        const response = await api.put<Produto>(`/produtos/${id}`, data);
        return response.data;
    },
};

// Paletes
export const paletesApi = {
    getByUid: async (uid: string): Promise<Palete> => {
        const response = await api.get<Palete>(`/paletes/${uid}`);
        return response.data;
    },

    gerar: async (data: GerarPalete): Promise<PaleteGerado[]> => {
        const response = await api.post<PaleteGerado[]>('/paletes/gerar', data);
        return response.data;
    },
};

// Movimentações
export const movimentacoesApi = {
    entrada: async (data: RegistrarMovimentacao): Promise<Movimentacao> => {
        const response = await api.post<Movimentacao>('/movimentacoes/entrada', data);
        return response.data;
    },

    saida: async (data: RegistrarMovimentacao): Promise<Movimentacao> => {
        const response = await api.post<Movimentacao>('/movimentacoes/saida', data);
        return response.data;
    },
};

// Kanban
export const kanbanApi = {
    get: async (): Promise<KanbanItem[]> => {
        const response = await api.get<KanbanItem[]>('/kanban');
        return response.data;
    },
};

export default api;
