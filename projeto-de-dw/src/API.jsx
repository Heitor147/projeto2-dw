import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export const useContatosAPI = () => {
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar todos os contatos
  const fetchContatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('contatos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContatos(data);
    } catch (err) {
      console.error("Erro ao buscar contatos:", err);
      setError("Não foi possível carregar os contatos.");
    } finally {
      setLoading(false);
    }
  };

  // Função para criar um novo contato
  const addContato = async (nome, telefone) => {
    const telefoneLimpo = telefone.replace(/\D/g, ''); 

    try {
      const { data, error } = await supabase
        .from('contatos')
        .insert([{ nome, telefone: telefoneLimpo }])
        .select();

      if (error) throw error;
      // Adiciona o novo contato à lista local
      setContatos(prev => [data[0], ...prev]);
      return { success: true };
    } catch (err) {
      console.error("Erro ao adicionar contato:", err);
      return { success: false, error: "Não foi possível adicionar o contato." };
    }
  };

  // Função para editar um contato existente
  const updateContato = async (id, nome, telefone) => {
    const telefoneLimpo = telefone.replace(/\D/g, '');

    try {
      const { error } = await supabase
        .from('contatos')
        .update({ nome, telefone: telefoneLimpo })
        .eq('id', id);

      if (error) throw error;
      // Atualiza o contato na lista local
      setContatos(prev => prev.map(c => c.id === id ? { ...c, nome, telefone } : c));
      return { success: true };
    } catch (err) {
      console.error("Erro ao editar contato:", err);
      return { success: false, error: "Não foi possível salvar a edição." };
    }
  };

  // Função para deletar um contato
  const deleteContato = async (id) => {
    try {
      const { error } = await supabase
        .from('contatos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      // Remove o contato da lista local
      setContatos(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (err) {
      console.error("Erro ao deletar contato:", err);
      return { success: false, error: "Não foi possível remover o contato." };
    }
  };

  useEffect(() => {
    fetchContatos();
  }, []);

  return { contatos, loading, error, addContato, updateContato, deleteContato };
};