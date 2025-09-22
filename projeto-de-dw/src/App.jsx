import "./styles/global.css";
import "./styles/theme.css";
import Gerador from './components/Gerador.jsx';
// import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

export default function App() {

  // const [tarefas, setTarefas] = useState([])

  // const URL = "https://nbcmpthkozfvapdtxjrc.supabase.co"
  // const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iY21wdGhrb3pmdmFwZHR4anJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDA0MDYsImV4cCI6MjA3NDExNjQwNn0.tS4et_B8-dkc-cdCF8rjY2eDTIFxXuHc8FLK2LWBpNw"
  // const supabase = createClient(URL, KEY)

  // const consultaTarefas = async () => {
  //  const { data, error } = await supabase
  //    .from('tarefa')
  //    .select('*')
  //    .order('created_at', {ascending: true})
  //  setTarefas(data)
  // } 

  return (
    <>
      <Gerador />

      <br />

      
    </>
    
    // <div>
      // <button onClick={consultaTarefas}>Teste</button>
    // </div>

  );
}