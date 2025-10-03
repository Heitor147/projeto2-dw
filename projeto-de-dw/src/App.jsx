import "./styles/global.css";
import "./styles/theme.css";
import Gerador from "./components/Gerador.jsx";
import Agenda from "./components/Agenda.jsx";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function App() {
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const TABLE = "contacts";

  const URL = "https://nbcmpthkozfvapdtxjrc.supabase.co";
  const KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iY21wdGhrb3pmdmFwZHR4anJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDA0MDYsImV4cCI6MjA3NDExNjQwNn0.tS4et_B8-dkc-cdCF8rjY2eDTIFxXuHc8FLK2LWBpNw";
  const supabase = createClient(URL, KEY);

  // READ
  const listarContatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("id", { ascending: true }); // troque a coluna de ordenação se preferir

      if (error) throw error;
      setContatos(data ?? []);
    } catch (err) {
      console.error("Erro ao listar contatos:", err);
      setError("Não foi possível carregar os contatos.");
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const criarContato = async ({ name, phone_number }) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from(TABLE)
        .insert([{ name, phone_number }])
        .select()
        .single();

      if (error) throw error;
      setContatos((prev) => (data ? [...prev, data] : prev));
      return data;
    } catch (err) {
      console.error("Erro ao criar contato:", err);
      setError("Não foi possível criar o contato.");
      return null;
    }
  };

  // UPDATE
  const atualizarContato = async (id, updates) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from(TABLE)
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setContatos((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data } : c))
      );
      return data;
    } catch (err) {
      console.error("Erro ao atualizar contato:", err);
      setError("Não foi possível atualizar o contato.");
      return null;
    }
  };

  // DELETE
  const removerContato = async (id) => {
    try {
      setError(null);
      const { error } = await supabase.from(TABLE).delete().eq("id", id);
      if (error) throw error;

      setContatos((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      console.error("Erro ao remover contato:", err);
      setError("Não foi possível remover o contato.");
      return false;
    }
  };

  useEffect(() => {
    listarContatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="div-titulo">
              <h1>App</h1>
      </div>

      
      <Gerador />

      <Agenda
        contatos={contatos}
        onCreate={criarContato}
        onUpdate={atualizarContato}
        onDelete={removerContato}
        onRefresh={listarContatos}
        loading={loading}
        error={error}
      />
    </div>
  );
}
