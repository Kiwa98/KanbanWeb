// Tipos de dados do sistema Kanban

export interface Produto {
    id: number;
    sku: string;
    nome: string;
    qtdPorPalete: number;
    ativo: boolean;
}

export interface CreateProduto {
    sku: string;
    nome: string;
    qtdPorPalete: number;
    ativo?: boolean;
}

export interface Palete {
    id: number;
    uid: string;
    produtoId: number;
    produtoNome: string;
    produtoSku: string;
    dataGeracao: string;
    status: 'NO_PULMAO' | 'BAIXADO';
}

export interface GerarPalete {
    produtoId: number;
    qtdPorPalete: number;
    quantidadePaletes: number;
}

export interface PaleteGerado {
    uid: string;
    sku: string;
    nome: string;
    qtd: number;
    dt: string;
    qrCodeBase64: string;
    numero: number;
    total: number;
}

export interface Movimentacao {
    id: number;
    paleteId: number;
    paleteUid: string;
    tipo: 'ENTRADA' | 'SAIDA';
    data: string;
}

export interface RegistrarMovimentacao {
    paleteUid: string;
}

export interface KanbanItem {
    sku: string;
    nome: string;
    paletesNoPulmao: number;
    capacidade: number;
    totalProdutos: number;
    status: 'VERDE' | 'AMARELO' | 'VERMELHO';
}

// Conteúdo decodificado do QR Code
export interface QrCodeContent {
    uid: string;
    sku: string;
    nome: string;
    qtd: number;
    dt: string;
}
