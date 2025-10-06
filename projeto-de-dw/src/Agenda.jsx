import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import { useContatosAPI } from './API';
import { FaEdit, FaTrashAlt, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';
import { IoMdContact } from "react-icons/io";
import './style.css';

const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;

const ContatoItem = ({ contato, updateContato, deleteContato }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState(contato.nome);
  const [telefone, setTelefone] = useState(contato.telefone);
  const [editError, setEditError] = useState('');

  const handleSave = async () => {
    if (!nome || !telefone) {
      setEditError("Nome e Telefone são obrigatórios.");
      return;
    }
    if (!phoneRegex.test(telefone)) {
      setEditError("Telefone inválido. Formato: (XX) XXXXX-XXXX");
      return;
    }

    setEditError('');
    const result = await updateContato(contato.id, nome, telefone);
    if (result.success) {
      setIsEditing(false);
    } else {
      setEditError(result.error);
    }
  };

  return (
    <div className="contato-item">
      {isEditing ? (
        <div className="contato-edit-form">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
          />
          <IMaskInput
            mask="(00) 00000-0000"
            value={telefone}
            onAccept={(value) => setTelefone(value)}
            placeholder="(XX) XXXXX-XXXX"
          />
          <button className="btn btn-icon btn-save" onClick={handleSave} title="Salvar">
            <FaCheck />
          </button>
          <button className="btn btn-icon btn-cancel" onClick={() => { setIsEditing(false); setEditError(''); }} title="Cancelar">
            <FaTimes />
          </button>
          {editError && <p className="error-message">{editError}</p>}
        </div>
      ) : (
        <div className="contato-info">
          <span>{contato.nome}</span>
          <span>{contato.telefone}</span>
          <div className="contato-actions">
            <button className="btn btn-icon btn-edit" onClick={() => setIsEditing(true)} title="Editar">
              <FaEdit />
            </button>
            <button className="btn btn-icon btn-remove" onClick={() => deleteContato(contato.id)} title="Remover">
              <FaTrashAlt />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const Agenda = () => {
  const { contatos, loading, error, addContato, updateContato, deleteContato } = useContatosAPI();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [formError, setFormError] = useState('');

  const handleAddContato = async (e) => {
    e.preventDefault();

    if (!nome.trim() || !telefone.trim()) {
      setFormError("Nome e Telefone são obrigatórios.");
      return;
    }
    if (!phoneRegex.test(telefone)) {
      setFormError("Telefone inválido. Formato esperado: (XX) XXXXX-XXXX");
      return;
    }

    setFormError('');
    const result = await addContato(nome, telefone);
    if (result.success) {
      setNome('');
      setTelefone('');
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="container agenda-container">
      <h2><IoMdContact /> Agenda de Contatos</h2>

      <form onSubmit={handleAddContato} className="form-add-contato">
        <input
          type="text"
          placeholder="Nome do Contato"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <IMaskInput
          mask="(00) 00000-0000"
          value={telefone}
          onAccept={(value) => setTelefone(value)}
          placeholder="(XX) XXXXX-XXXX"
        />
        <button type="submit" className="btn btn-add">
          <FaPlus /> Adicionar Contato
        </button>
        {formError && <p className="error-message">{formError}</p>}
      </form>

      <div className="contatos-list">
        <h3>Lista</h3>
        {loading && <p>Carregando contatos...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && contatos.length === 0 && <p>Nenhum contato encontrado.</p>}
        {contatos.map(contato => (
          <ContatoItem
            key={contato.id}
            contato={contato}
            updateContato={updateContato}
            deleteContato={deleteContato}
          />
        ))}
      </div>
    </div>
  );
};