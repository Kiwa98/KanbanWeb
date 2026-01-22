import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { produtosApi, paletesApi } from '../services/api';
import type { Produto, PaleteGerado } from '../types';
import './GerarQRCodePage.css';

export const GerarQRCodePage: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [selectedProdutoId, setSelectedProdutoId] = useState<number | ''>('');
    const [qtdPorPalete, setQtdPorPalete] = useState<number>(0);
    const [quantidadePaletes, setQuantidadePaletes] = useState<number>(1);
    const [paletesGerados, setPaletesGerados] = useState<PaleteGerado[]>([]);
    const [qrCodeImages, setQrCodeImages] = useState<{ [uid: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProdutos();
    }, []);

    const loadProdutos = async () => {
        try {
            const data = await produtosApi.getAll();
            setProdutos(data);
        } catch (err) {
            console.error('Erro ao carregar produtos:', err);
        }
    };

    const handleProdutoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const produtoId = Number(e.target.value);
        setSelectedProdutoId(produtoId || '');

        const produto = produtos.find(p => p.id === produtoId);
        if (produto) {
            setQtdPorPalete(produto.qtdPorPalete);
        }
    };

    const handleGerar = async () => {
        if (!selectedProdutoId || quantidadePaletes < 1) {
            setError('Selecione um produto e informe a quantidade de paletes');
            return;
        }

        setLoading(true);
        setError(null);
        setPaletesGerados([]);
        setQrCodeImages({});

        try {
            const paletes = await paletesApi.gerar({
                produtoId: selectedProdutoId as number,
                qtdPorPalete,
                quantidadePaletes
            });

            setPaletesGerados(paletes);

            // Gerar imagens QR Code
            const images: { [uid: string]: string } = {};
            for (const palete of paletes) {
                const qrDataUrl = await QRCode.toDataURL(palete.qrCodeBase64, {
                    width: 200,
                    margin: 2,
                    errorCorrectionLevel: 'H',
                    color: {
                        dark: '#000000',
                        light: '#ffffff'
                    }
                });
                images[palete.uid] = qrDataUrl;
            }
            setQrCodeImages(images);

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar paletes';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="gerar-qrcode-page">
            <div className="gerar-container">
                <h1 className="gerar-title">
                    <span className="title-icon">🏷️</span>
                    Gerar QR Codes
                </h1>

                <div className="gerar-form">
                    <div className="form-group">
                        <label>Produto</label>
                        <select
                            value={selectedProdutoId}
                            onChange={handleProdutoChange}
                            className="form-select"
                        >
                            <option value="">Selecione um produto</option>
                            {produtos.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.sku} - {p.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Qtd por Palete</label>
                            <input
                                type="number"
                                value={qtdPorPalete}
                                onChange={e => setQtdPorPalete(Number(e.target.value))}
                                className="form-input"
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Quantidade de Paletes</label>
                            <input
                                type="number"
                                value={quantidadePaletes}
                                onChange={e => setQuantidadePaletes(Number(e.target.value))}
                                className="form-input"
                                min="1"
                                max="50"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGerar}
                        className="btn-gerar"
                        disabled={loading || !selectedProdutoId}
                    >
                        {loading ? 'Gerando...' : '🏷️ Gerar QR Codes'}
                    </button>
                </div>

                {error && (
                    <div className="gerar-error">
                        ❌ {error}
                    </div>
                )}

                {paletesGerados.length > 0 && (
                    <>
                        <div className="gerar-actions">
                            <button onClick={handlePrint} className="btn-print">
                                🖨️ Imprimir Etiquetas
                            </button>
                        </div>

                        <div className="qrcodes-grid">
                            {paletesGerados.map((palete) => (
                                <div key={palete.uid} className="qrcode-card">
                                    <div className="qrcode-image">
                                        {qrCodeImages[palete.uid] && (
                                            <img src={qrCodeImages[palete.uid]} alt={`QR Code ${palete.uid}`} />
                                        )}
                                    </div>
                                    <div className="qrcode-info">
                                        <span className="qrcode-nome">{palete.nome}</span>
                                        <span className="qrcode-palete">Palete {palete.numero} / {palete.total}</span>
                                        <span className="qrcode-sku">{palete.sku}</span>
                                        <span className="qrcode-qtd">{palete.qtd} unidades</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
