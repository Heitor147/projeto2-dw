import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import { FaWhatsapp, FaLink } from 'react-icons/fa';
import { LuMessageCircle } from "react-icons/lu";
import './style.css';

const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;

export const Gerador = () => {
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [linkGerado, setLinkGerado] = useState('');
  const [formError, setFormError] = useState('');

  const handleGerarLink = (e) => {
    e.preventDefault();
    setLinkGerado('');

    if (!telefone.trim() || !mensagem.trim()) {
      setFormError("Telefone e Mensagem são obrigatórios.");
      return;
    }
    if (!phoneRegex.test(telefone)) {
      setFormError("Telefone inválido. Formato esperado: (XX) XXXXX-XXXX");
      return;
    }

    setFormError('');

    const telefoneLimpo = telefone.replace(/\D/g, '');

    const numeroFormatado = `55${telefoneLimpo}`;

    const mensagemCodificada = encodeURIComponent(mensagem);

    const link = `https://wa.me/${numeroFormatado}?text=${mensagemCodificada}`;
    setLinkGerado(link);
  };

  const handleAbrirWhatsApp = () => {
    if (linkGerado) {
      window.open(linkGerado, '_blank');
    }
  };

  return (
    <div className="container gerador-container">
      <h2> <LuMessageCircle /> Gerador de Links</h2>

      <form onSubmit={handleGerarLink} className="form-gerador">
        <IMaskInput
          mask="(00) 00000-0000"
          value={telefone}
          onAccept={(value) => setTelefone(value)}
          placeholder="(XX) XXXXX-XXXX"
        />
        <textarea
          placeholder="Digite a mensagem..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows="4"
        />
        <button type="submit" className="btn btn-add">
          <FaLink /> Gerar Link
        </button>
        {formError && <p className="error-message">{formError}</p>}
      </form>

      {linkGerado && (
        <div className="link-output">
          <p>Link Gerado:</p>
          <a href={linkGerado} target="_blank" rel="noopener noreferrer">
            {linkGerado}
          </a>
          <button className="btn btn-whatsapp" onClick={handleAbrirWhatsApp}>
            <FaWhatsapp /> Abrir no WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};