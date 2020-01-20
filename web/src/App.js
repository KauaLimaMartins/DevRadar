import React, { useState, useEffect } from 'react';
import api from './services/api';

import './Global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevForm from './components/DevForm/index';
import DevItem from './components/DevItem/index';

// Componente: Bloco isolado de HTML, CSS E JS, o qual não interfere no restante da aplicação
// Componentes sempre começam com a primeira letra maiuscula

// Estado: informações mantidas pelo componente (Lembrar: Imutabilidade) 

// Propriedade: Informações que o componente PAI(App) passa para o componente FILHO

function App() {
  const [devs,setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
    const response = await api.get('/devs');
    
    setDevs(response.data);

    }

    loadDevs();
  }, []);

   async function handleAddDev(data) {

      const response = await api.post('/devs',data)

      setDevs([...devs, response.data]);
  }

    return (
      <div id="app">
        <aside>
          <strong>Cadastrar</strong>
          <DevForm onSubmit={handleAddDev} />
        </aside>
        <main>
          <ul>
            {/*traverses the "devs" variable and returns the content within*/}
            {devs.map(dev => (
              <DevItem key={dev._id} dev={dev} />
            ))}

          </ul>
        </main>
      </div> 
    );
}

export default App;
