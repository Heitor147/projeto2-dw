import React, { useState } from "react";
import styles from "./Gerador.module.css";

const onlyDigits = (str = "") => String(str).replace(/\D/g, "");

const formatPhone = (value = "") => {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const buildWaMeLink = (rawPhone, message) => {
  let digits = onlyDigits(rawPhone);
  if (!digits) return "";

  if (!digits.startsWith("55")) {
    if (digits.length >= 10 && digits.length <= 11) {
      digits = "55" + digits;
    }
  }

  const base = `https://wa.me/${digits}`;
  const params = message ? `?text=${encodeURIComponent(message)}` : "";
  return base + params;
};

export default function Gerador() {
  const [inputNumero, setInputNumero] = useState("");
  const [inputMensagem, setInputMensagem] = useState("");
  const [waLink, setWaLink] = useState("");
  const [copiado, setCopiado] = useState(false);

  const handleNumeroChange = (e) => {
    setInputNumero(formatPhone(e.target.value));
  };

  const handleGerar = (e) => {
    e.preventDefault();
    const digits = onlyDigits(inputNumero);
    if (digits.length < 8) {
      alert("Por favor, insira um número de telefone válido (mínimo 8 dígitos).");
      return;
    }
    const link = buildWaMeLink(inputNumero, inputMensagem);
    setWaLink(link);
    setCopiado(false);
  };

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(waLink);
      setCopiado(true);
    } catch (err) {
      console.error("Erro ao copiar:", err);
      alert("Não foi possível copiar o link para a área de transferência.");
    }
  };

  return (
    <div className="container">
      <h1 className="titulo">Gerador de Links</h1>

      <p className="texto">Número de Telefone</p>
      <input
        type="tel"
        value={inputNumero}
        onChange={handleNumeroChange}
        placeholder="(XX) XXXXX-XXXX"
        maxLength={15}
      />

      <p className="texto">Mensagem (opcional)</p>
      <input
        type="text"
        value={inputMensagem}
        onChange={(e) => setInputMensagem(e.target.value)}
        placeholder="Digite sua mensagem aqui..."
      />

      <div className="botaoContainer">
        <button className="botao" onClick={handleGerar}>Gerar Link</button>
        {waLink && (
          <>
            <a
              className="botao"
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir no WhatsApp
            </a>
            <button className="botao" onClick={handleCopiar}>
              {copiado ? "Copiado!" : "Copiar link"}
            </button>
          </>
        )}
      </div>

      {waLink && (
        <>
          <p className="texto">Link gerado:</p>
          <input type="text" readOnly value={waLink} onFocus={(e) => e.target.select()} />
        </>
      )}
    </div>
  );
}
