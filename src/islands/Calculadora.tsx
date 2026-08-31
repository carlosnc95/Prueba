import { useState } from 'react';
import './Calculadora.css';

const SEMANAS_LABORABLES = 46;
const nf = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });

export default function Calculadora() {
  const [horas, setHoras] = useState(8);
  const [personas, setPersonas] = useState(3);
  const [coste, setCoste] = useState(25);

  const horasAnuales = horas * personas * SEMANAS_LABORABLES;
  const costeAnual = horasAnuales * coste;
  const jornadas = horasAnuales / 8;

  return (
    <div className="calc-grid" id="calculadora-widget">
      <div>
        <p className="calc-eyebrow">Calcula</p>
        <h2 className="calc-title">¿Cuánto te cuesta hacerlo a mano?</h2>
        <label className="calc-field">
          <span className="calc-field__row">
            Horas a la semana en esa tarea <b className="calc-field__value">{horas} h</b>
          </span>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={horas}
            onChange={(e) => setHoras(Number(e.target.value))}
            aria-label="Horas a la semana"
            className="calc-range"
          />
        </label>
        <label className="calc-field">
          <span className="calc-field__row">
            Personas implicadas <b className="calc-field__value">{personas}</b>
          </span>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={personas}
            onChange={(e) => setPersonas(Number(e.target.value))}
            aria-label="Personas implicadas"
            className="calc-range"
          />
        </label>
        <label className="calc-field calc-field--last">
          <span className="calc-field__row">
            Coste medio por hora <b className="calc-field__value">{coste} €</b>
          </span>
          <input
            type="range"
            min={12}
            max={45}
            step={1}
            value={coste}
            onChange={(e) => setCoste(Number(e.target.value))}
            aria-label="Coste medio por hora"
            className="calc-range"
          />
        </label>
      </div>

      <div className="calc-result">
        <p className="calc-result__eyebrow">Coste anual de esa tarea</p>
        <b className="calc-result__figure" aria-live="polite">
          {nf.format(costeAnual)} €
        </b>
        <div className="calc-result__metrics">
          <div>
            <b>{nf.format(horasAnuales)} h</b>
            <span>horas al año</span>
          </div>
          <div>
            <b>{nf.format(jornadas)}</b>
            <span>jornadas de 8 h al año</span>
          </div>
        </div>
        <p className="calc-result__note">
          Cálculo directo sobre tus datos: horas × personas × 46 semanas laborables × coste/hora. Las jornadas
          son esas horas divididas entre 8. Cuánto de eso se puede automatizar lo dice el diagnóstico, no una
          estimación genérica.
        </p>
        <a href="#diagnostico" className="calc-result__cta">
          Pedir el diagnóstico <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
