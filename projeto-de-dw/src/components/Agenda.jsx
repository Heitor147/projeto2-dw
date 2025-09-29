import React, { useEffect, useState } from "react";
import "/src/styles/agenda.css"; // ajuste o caminho se necessário

// Helper: parse seguro do localStorage
const safeParseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

// Limita e retorna só dígitos
const getDigits = (value = "") => String(value).replace(/\D/g, "").slice(0, 11);

// Formatação visual (suporta 0..11 dígitos; BR-friendly)
const formatPhone = (value = "") => {
  const d = getDigits(value);
  if (!d) return "";
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length === 11)
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`; // covers lengths 7..10
};

export default function Agenda({
  contatos: contatosProp, // lista controlada (vinda do App)
  onCreate,               // async ({ name, phone_number }) => contatoCriado
  onUpdate,               // async (id, { name, phone_number }) => contatoAtualizado
  onDelete,               // async (id) => boolean
  onRefresh,              // () => void
  loading = false,
  error = null,
}) {
  // Estado local para modo não-controlado (fallback: localStorage)
  const [contatosLocal, setContatosLocal] = useState(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("MeusContatos");
    const parsed = safeParseJSON(raw);
    return Array.isArray(parsed) ? parsed : [];
  });

  const [inputNome, setInputNome] = useState("");
  const [inputTelefone, setInputTelefone] = useState("");
  const [editContatoId, setEditContatoId] = useState(null);

  // Controlado quando contatosProp é fornecido
  const isControlled = Array.isArray(contatosProp);
  const contatos = isControlled ? contatosProp : contatosLocal;

  // Sincroniza com localStorage apenas no modo não-controlado
  useEffect(() => {
    if (isControlled) return;
    try {
      localStorage.setItem("MeusContatos", JSON.stringify(contatosLocal));
    } catch (err) {
      console.error("Erro salvando contatos no localStorage:", err);
    }
  }, [contatosLocal, isControlled]);

  const validarContato = (nome, digits) => {
    if (!nome) {
      alert("Por favor, insira um nome.");
      return false;
    }
    if (digits.length < 8) {
      alert("Por favor, insira um número de telefone válido (mínimo 8 dígitos).");
      return false;
    }
    return true;
  };

  const gerarId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString();

  const handleNumeroChange = (e) => {
    setInputTelefone(formatPhone(e.target.value));
  };

  // Adiciona/Salva no modo controlado (Supabase) ou local (fallback)
  const adicionarContato = async () => {
    const nome = inputNome.trim();
    const digits = getDigits(inputTelefone);
    if (!validarContato(nome, digits)) return;

    if (isControlled && onCreate) {
      await onCreate({ name: nome, phone_number: digits });
    } else {
      const novoContato = { id: gerarId(), name: nome, phone_number: digits };
      setContatosLocal((prev) => [...prev, novoContato]);
    }

    setInputNome("");
    setInputTelefone("");
  };

  const editarContato = (id) => {
    const contato = contatos.find((c) => c.id === id);
    if (!contato) return;
    setEditContatoId(id);
    setInputNome(contato.name);
    setInputTelefone(formatPhone(contato.phone_number));
  };

  const salvarEdicaoContato = async () => {
    const nome = inputNome.trim();
    const digits = getDigits(inputTelefone);
    if (editContatoId === null) return;
    if (!validarContato(nome, digits)) return;

    if (isControlled && onUpdate) {
      await onUpdate(editContatoId, { name: nome, phone_number: digits });
    } else {
      setContatosLocal((prev) =>
        prev.map((c) =>
          c.id === editContatoId ? { ...c, name: nome, phone_number: digits } : c
        )
      );
    }

    setEditContatoId(null);
    setInputNome("");
    setInputTelefone("");
  };

  const removerContato = async (id) => {
    const contato = contatos.find((c) => c.id === id);
    const confirmMsg = contato ? `Remover ${contato.name}?` : "Remover contato?";
    if (!window.confirm(confirmMsg)) return;

    if (isControlled && onDelete) {
      await onDelete(id);
    } else {
      setContatosLocal((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // permite Enter para adicionar/editar
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editContatoId !== null) await salvarEdicaoContato();
    else await adicionarContato();
  };

  return (
    <div className="container">
      <h1 className="titulo">Agenda de Contatos</h1>

      <form
        onSubmit={handleSubmit}
        className="form-agenda"
        aria-label="Formulário de contatos"
      >
        <div className="form-field">
          <label htmlFor="nome">Nome do contato</label>
          <input
            id="nome"
            type="text"
            value={inputNome}
            onChange={(e) => setInputNome(e.target.value)}
            aria-label="Nome do contato"
            placeholder="Nome"
          />
        </div>

        <div className="form-field">
          <label htmlFor="telefone">Número de telefone</label>
          <input
            id="telefone"
            type="tel"
            inputMode="tel"
            value={inputTelefone}
            onChange={handleNumeroChange}
            maxLength={15}
            aria-label="Número de telefone"
            placeholder="(XX) XXXXX-XXXX"
          />
        </div>

        {editContatoId !== null ? (
          <button type="submit" className="btn salvar" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Edição"}
          </button>
        ) : (
          <button type="submit" className="btn adicionar" disabled={loading}>
            {loading ? "Adicionando..." : "Adicionar Contato"}
          </button>
        )}

        {onRefresh && (
          <button
            type="button"
            className="btn"
            onClick={onRefresh}
            disabled={loading}
            style={{ marginLeft: 8 }}
          >
            {loading ? "Atualizando..." : "Recarregar"}
          </button>
        )}
      </form>

      <h2 className="subtitulo">Contatos</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {contatos.length === 0 ? (
        <p className="vazio">Nenhum contato ainda — adiciona aí!</p>
      ) : (
        <ul className="lista-contatos">
          {contatos.map((contato) => (
            <li key={contato.id} className="contato-item">
              <div className="contato-dados">
                <strong className="contato-nome">{contato.name}</strong>
                <span className="contato-telefone">
                  {formatPhone(contato.phone_number)}
                </span>
              </div>

              <div className="contato-acoes">
                <button
                  type="button"
                  className="buttonedit"
                  onClick={() => editarContato(contato.id)}
                  aria-label={`Editar ${contato.name}`}
                  disabled={loading}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="buttonremove"
                  onClick={() => removerContato(contato.id)}
                  aria-label={`Remover ${contato.name}`}
                  disabled={loading}
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}