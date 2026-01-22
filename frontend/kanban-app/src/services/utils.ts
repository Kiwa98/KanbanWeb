import type { QrCodeContent } from '../types';

/**
 * Decodifica o conteúdo Base64 de um QR Code para JSON
 */
export function decodeQrCode(base64Content: string): QrCodeContent | null {
    try {
        const jsonString = atob(base64Content);
        const data = JSON.parse(jsonString) as QrCodeContent;
        return data;
    } catch (error) {
        console.error('Erro ao decodificar QR Code:', error);
        return null;
    }
}

/**
 * Codifica o conteúdo JSON para Base64 (para geração de QR Code)
 */
export function encodeQrCode(content: QrCodeContent): string {
    const jsonString = JSON.stringify(content);
    return btoa(jsonString);
}

/**
 * Formata data para exibição
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Retorna a classe CSS baseada no status do Kanban
 */
export function getStatusClass(status: string): string {
    switch (status) {
        case 'VERDE':
            return 'status-verde';
        case 'AMARELO':
            return 'status-amarelo';
        case 'VERMELHO':
            return 'status-vermelho';
        default:
            return '';
    }
}

/**
 * Retorna a cor baseada no status do Kanban
 */
export function getStatusColor(status: string): string {
    switch (status) {
        case 'VERDE':
            return '#22c55e';
        case 'AMARELO':
            return '#eab308';
        case 'VERMELHO':
            return '#ef4444';
        default:
            return '#6b7280';
    }
}
