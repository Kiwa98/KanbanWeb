import React, { useState, useEffect } from 'react';
import { produtosApi } from '../services/api';
import type { Produto, CreateProduto } from '../types';
import './ProdutosPage.css';

export const ProdutosPage: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<CreateProduto>({
        sku: '',
        nome: '',
        qtdPorPalete: 100,
        ativo: true
    });
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
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (editingId) {
                await produtosApi.update(editingId, formData);
            } else {
                await produtosApi.create(formData);
            }

            await loadProdutos();
            resetForm();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar produto';
            setError(errorMessage);
        }
    };

    const handleEdit = (produto: Produto) => {
        setFormData({
            sku: produto.sku,
            nome: produto.nome,
            qtdPorPalete: produto.qtdPorPalete,
            ativo: produto.ativo
        });
        setEditingId(produto.id);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({ sku: '', nome: '', qtdPorPalete: 100, ativo: true });
        setEditingId(null);
        setShowForm(false);
        setError(null);
    };

    if (loading) {
        return (
            <div className="produtos-loading">
                <div className="loading-spinner"></div>
                <p>Carregando produtos...</p>
            </div>
        );
    }

    return (
        <div className="produtos-page">
            <div className="produtos-header">
                <h1 className="produtos-title">
                    <span className="title-icon">📝</span>
                    Produtos
                </h1>
                <button
                    className="btn-novo"
                    onClick={() => setShowForm(true)}
                >
                    + Novo Produto
                </button>
            </div>

            {showForm && (
                <div className="form-overlay">
                    <div className="form-modal">
                        <h2>{editingId ? 'Editar Produto' : 'Novo Produto'}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>SKU</label>
                                <input
                                    type="text"
                                    value={formData.sku}
                                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                    required
                                    placeholder="Ex: ACA-410"
                                />
                            </div>

                            <div className="form-group">
                                <label>Nome</label>
                                <input
                                    type="text"
                                    value={formData.nome}
                                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                    required
                                    placeholder="Ex: ACA 410 NEON"
                                />
                            </div>

                            <div className="form-group">
                                <label>Qtd por Palete</label>
                                <input
                                    type="number"
                                    value={formData.qtdPorPalete}
                                    onChange={e => setFormData({ ...formData, qtdPorPalete: Number(e.target.value) })}
                                    required
                                    min="1"
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.ativo}
                                        onChange={e => setFormData({ ...formData, ativo: e.target.checked })}
                                    />
                                    Produto Ativo
                                </label>
                            </div>

                            {error && <div className="form-error">{error}</div>}

                            <div className="form-actions">
                                <button type="button" className="btn-cancelar" onClick={resetForm}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-salvar">
                                    {editingId ? 'Atualizar' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="produtos-table-container">
                <table className="produtos-table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Nome</th>
                            <th>Qtd/Palete</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="no-data">
                                    Nenhum produto cadastrado
                                </td>
                            </tr>
                        ) : (
                            produtos.map(produto => (
                                <tr key={produto.id}>
                                    <td className="sku-cell">{produto.sku}</td>
                                    <td>{produto.nome}</td>
                                    <td className="qtd-cell">{produto.qtdPorPalete}</td>
                                    <td>
                                        <span className={`status-badge ${produto.ativo ? 'ativo' : 'inativo'}`}>
                                            {produto.ativo ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-editar"
                                            onClick={() => handleEdit(produto)}
                                        >
                                            ✏️ Editar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
