import { Agenda } from './Agenda';
import { Gerador } from './Gerador';
import { LuMessageCircle } from "react-icons/lu";
import './style.css';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1><LuMessageCircle /> WhatsHub</h1>
        <p>O jeito mais rápido de iniciar conversas no WhatsApp. Gere links instantâneos e mantenha seus contatos organizados.</p>
      </header>
      
      <main className="content-wrapper">
        <Gerador />
        <Agenda />
      </main>
    </div>
  );
}

export default App;