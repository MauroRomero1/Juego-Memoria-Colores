import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [patron, setPatron] = useState([]);
  const [jugadorPatron, setJugadorPatron] = useState([]); 
  const [proceso, setProceso] = useState(false); 
  const [score, setScore] = useState(0); 
  const [mostrandoPatron, setMostrandoPatron] = useState(false); 
  const [gameover, setGameover] = useState(false); 
  const botones = [
    { id: 'rojo', nombre: 'Rojo', color: '#b41818' },
    { id: 'azul', nombre: 'Azul', color: '#1f1fd2' },
    { id: 'verde', nombre: 'Verde', color: '#2dab2d' },
    { id: 'amarillo', nombre: 'Amarillo', color: '#f6d118e0' }
  ];

  const obtenerColorAleatorio = () => {//------ obtener un color aleatorio
    return botones[Math.floor(Math.random() * botones.length)].id;
  };
  
  const iniciar = () => {
      setProceso(true);
      setScore(0);
      setGameover(false);
      const primerColor = obtenerColorAleatorio();
      setPatron([primerColor]);
      setJugadorPatron([]);
      setMostrandoPatron(true);
  };
  const manejarClickColor = (color) => {//click del jugador 
      if (!proceso || mostrandoPatron || gameover) return;

    const nuevaSecuenciaJugador = [...jugadorPatron, color];
    setJugadorPatron(nuevaSecuenciaJugador);
// ----------- verifica si es correcto
    if (nuevaSecuenciaJugador[nuevaSecuenciaJugador.length - 1] !== patron[nuevaSecuenciaJugador.length - 1]) {
      setGameover(true);
      setProceso(false);
    } else if (nuevaSecuenciaJugador.length === patron.length) {
      //-----------  completo el patronn -----------------------------------------
      const siguienteColor = obtenerColorAleatorio();
      setPatron([...patron, siguienteColor]);
      setJugadorPatron([]);
      setScore(score + 1);
      setMostrandoPatron(true);
    }
  };

  useEffect(() => { //------------Muestra colores del juego
    const mostrarPatron = async () => {
      for (let i = 0; i < patron.length; i++) {
        await iluminarColor(patron[i], 700);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      setMostrandoPatron(false);
    };

    if (proceso && mostrandoPatron) {
      mostrarPatron();
    }
  }, [patron, proceso, mostrandoPatron]);

  const iluminarColor = (color, duracion) => {  //--------Iluminar boton
    return new Promise((resolve) => {
      const boton = document.getElementById(color);
      boton.classList.add('iluminado');
      setTimeout(() => {
        boton.classList.remove('iluminado');
        resolve();
      }, duracion);
    });
  };

  return (
    <div className="app">
      <section className="contenedor-juego">
        {botones.map((boton) => (
          <button
            key={boton.id}
            id={boton.id}
            className="boton"
            onClick={() => manejarClickColor(boton.id)}
            style={{ backgroundColor: boton.color }}
          >
            {boton.nombre}
          </button>
        ))}
      </section>
      <div className="controles">
        {!proceso && !gameover && <button onClick={iniciar}>Iniciar Juego</button>}
      
        {gameover && <p>Juego terminado. Tu puntuación fue: {score}</p>}
        {gameover && <button onClick={iniciar}>Reiniciar</button>}
        <p>Puntuación: {score}</p>
      </div>
    </div>
  );
}
export default App;
