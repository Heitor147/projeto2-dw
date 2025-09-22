import React, { useState } from "react";
import "/src/styles/gerador.css";

export default function Gerador() {
  const [inputNumero, setInputNumero] = useState("");
  const [inputMensagem, setInputMensagem] = useState("");

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 2) {
      return digits;
    }
    if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleNumeroChange = (e) => {
    setInputNumero(formatPhone(e.target.value));
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
      <button className="botaoContainer">Preparar Mensagem</button>
    </div>
  );
}
