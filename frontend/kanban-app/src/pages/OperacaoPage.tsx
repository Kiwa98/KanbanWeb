import React, { useState, useEffect, useRef } from 'react';
import { movimentacoesApi, paletesApi } from '../services/api';
import { decodeQrCode } from '../services/utils';
import type { QrCodeContent, Palete } from '../types';
import './OperacaoPage.css';

type OperacaoMode = 'ENTRADA' | 'SAIDA';

export const OperacaoPage: React.FC = () => {
    const [mode, setMode] = useState<OperacaoMode>('ENTRADA');
    const [qrInput, setQrInput] = useState('');
    const [lastPalete, setLastPalete] = useState<Palete | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Foco automático no input para leitura de QR Code
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const processQrCode = async (rawInput: string) => {
        setLoading(true);
        setMessage(null);

        try {
            // Decodificar Base64 -> JSON
            const decoded = decodeQrCode(rawInput.trim());

            if (!decoded) {
                throw new Error('QR Code inválido');
            }

            // Registrar movimentação
            if (mode === 'ENTRADA') {
                await movimentacoesApi.entrada({ paleteUid: decoded.uid });
                setMessage({ type: 'success', text: `✅ ENTRADA registrada: ${decoded.nome}` });
            } else {
                await movimentacoesApi.saida({ paleteUid: decoded.uid });
                setMessage({ type: 'success', text: `✅ SAÍDA registrada: ${decoded.nome}` });
            }

            // Buscar dados atualizados do palete
            const palete = await paletesApi.getByUid(decoded.uid);
            setLastPalete(palete);

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao processar QR Code';
            setMessage({ type: 'error', text: `❌ ${errorMessage}` });
            setLastPalete(null);
        } finally {
            setLoading(false);
            setQrInput('');
            inputRef.current?.focus();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQrInput(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Leitores USB geralmente enviam Enter após a leitura
        if (e.key === 'Enter' && qrInput.trim()) {
            e.preventDefault();
            processQrCode(qrInput);
        }
    };

    return (
        <div className="operacao-page">
            <div className="operacao-container">
                <h1 className="operacao-title">
                    <span className="title-icon">📱</span>
                    Operação de Paletes
                </h1>

                <div className="mode-selector">
                    <button
                        className={`mode-btn ${mode === 'ENTRADA' ? 'active entrada' : ''}`}
                        onClick={() => setMode('ENTRADA')}
                    >
                        <span className="mode-icon">📥</span>
                        ENTRADA
                    </button>
                    <button
                        className={`mode-btn ${mode === 'SAIDA' ? 'active saida' : ''}`}
                        onClick={() => setMode('SAIDA')}
                    >
                        <span className="mode-icon">📤</span>
                        SAÍDA
                    </button>
                </div>

                <div className="qr-input-section">
                    <label className="qr-label">
                        Escaneie o QR Code do palete:
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        className="qr-input"
                        value={qrInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Aguardando leitura do QR Code..."
                        disabled={loading}
                        autoComplete="off"
                    />
                    <p className="qr-hint">
                        O leitor USB envia automaticamente os dados ao escanear
                    </p>
                </div>

                {loading && (
                    <div className="operacao-loading">
                        <div className="loading-spinner"></div>
                        <span>Processando...</span>
                    </div>
                )}

                {message && (
                    <div className={`operacao-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {lastPalete && (
                    <div className="palete-info">
                        <h3>Último Palete Processado</h3>
                        <div className="palete-details">
                            <div className="detail-row">
                                <span className="detail-label">UID:</span>
                                <span className="detail-value">{lastPalete.uid}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Produto:</span>
                                <span className="detail-value">{lastPalete.produtoNome}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">SKU:</span>
                                <span className="detail-value">{lastPalete.produtoSku}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Status:</span>
                                <span className={`detail-value status-${lastPalete.status.toLowerCase()}`}>
                                    {lastPalete.status === 'NO_PULMAO' ? 'No Pulmão' : 'Baixado'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
