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

export default function Agenda() {
  const [contatos, setContatos] = useState(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("MeusContatos");
    const parsed = safeParseJSON(raw);
    return Array.isArray(parsed) ? parsed : [];
  });

  const [inputNome, setInputNome] = useState("");
  const [inputTelefone, setInputTelefone] = useState(""); // mantém valor formatado pra UX
  const [editContatoId, setEditContatoId] = useState(null);

  // Sincroniza com localStorage (seguro)
  useEffect(() => {
    try {
      localStorage.setItem("MeusContatos", JSON.stringify(contatos));
    } catch (err) {
      console.error("Erro salvando contatos no localStorage:", err);
    }
  }, [contatos]);

  const validarContato = (nome, digits) => {
    if (!nome) {
      alert("Por favor, insira um nome.");
      return false;
    }
    // validação mínima: DDD + número (ajuste conforme necessidade)
    if (digits.length < 8) {
      alert(
        "Por favor, insira um número de telefone válido (mínimo 8 dígitos)."
      );
      return false;
    }
    return true;
  };

  const gerarId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString();

  const adicionarContato = () => {
    const nome = inputNome.trim();
    const digits = getDigits(inputTelefone);
    if (!validarContato(nome, digits)) return;

    const novoContato = {
      id: gerarId(),
      name: nome,
      phone: digits, // salvo como string só com dígitos
    };

    setContatos((prev) => [...prev, novoContato]);
    setInputNome("");
    setInputTelefone("");
  };

  const editarContato = (id) => {
    const contato = contatos.find((c) => c.id === id);
    if (!contato) return;
    setEditContatoId(id);
    setInputNome(contato.name);
    setInputTelefone(formatPhone(contato.phone)); // mostra formatado no input
  };

  const salvarEdicaoContato = () => {
    const nome = inputNome.trim();
    const digits = getDigits(inputTelefone);
    if (editContatoId === null) return;
    if (!validarContato(nome, digits)) return;

    setContatos((prev) =>
      prev.map((c) =>
        c.id === editContatoId ? { ...c, name: nome, phone: digits } : c
      )
    );

    setEditContatoId(null);
    setInputNome("");
    setInputTelefone("");
  };

  const removerContato = (id) => {
    const contato = contatos.find((c) => c.id === id);
    const confirmMsg = contato
      ? `Remover ${contato.name}?`
      : "Remover contato?";
    if (!window.confirm(confirmMsg)) return;
    setContatos((prev) => prev.filter((c) => c.id !== id));
  };

  const handleNumeroChange = (e) => {
    setInputTelefone(formatPhone(e.target.value));
  };

  // permite Enter para adicionar/editar
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editContatoId !== null) salvarEdicaoContato();
    else adicionarContato();
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
          <button type="submit" className="btn salvar">
            Salvar Edição
          </button>
        ) : (
          <button type="submit" className="btn adicionar">
            Adicionar Contato
          </button>
        )}
      </form>

      <h2 className="subtitulo">Contatos</h2>

      {contatos.length === 0 ? (
        <p className="vazio">Nenhum contato ainda — adiciona aí!</p>
      ) : (
        <ul className="lista-contatos">
          {contatos.map((contato) => (
            <li key={contato.id} className="contato-item">
              <div className="contato-dados">
                <strong className="contato-nome">{contato.name}</strong>
                <span className="contato-telefone">
                  {formatPhone(contato.phone)}
                </span>
              </div>

              <div className="contato-acoes">
                <button
                  type="button"
                  className="buttonedit"
                  onClick={() => editarContato(contato.id)}
                  aria-label={`Editar ${contato.name}`}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="buttonremove"
                  onClick={() => removerContato(contato.id)}
                  aria-label={`Remover ${contato.name}`}
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
