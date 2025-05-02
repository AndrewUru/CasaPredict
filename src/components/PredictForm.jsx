import { useState } from "react";

const comunidades = [
  "andalucia",
  "aragon",
  "canarias",
  "cantabria",
  "castilla-leon",
  "castilla-mancha",
  "catalunya",
  "ceuta",
  "comunidad-foral-navarra",
  "comunidad-madrid",
  "comunitat-valenciana",
  "extremadura",
  "galicia",
  "islas-baleares",
  "la-rioja",
  "melilla",
  "pais-vasco",
  "principado-asturias",
  "region-murcia",
];

function PredictForm() {
  const [comunidad, setComunidad] = useState("");
  const [precio, setPrecio] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [insight, setInsight] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPrecio(null);
    setInsight("");

    if (!comunidad) {
      setError("Por favor selecciona una comunidad.");
      return;
    }

    setCargando(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/predecir/${comunidad}`
      );
      const data = await response.json();

      if (response.ok) {
        setPrecio(data.precio_medio);
        setError("");
        const textoIA = await obtenerInsightSimulado(comunidad);
        setInsight(textoIA);
      } else {
        setError(data.detail || "Error en la predicción.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const obtenerInsightSimulado = async (comunidad) => {
    return `La comunidad de ${comunidad} presenta una tendencia estable en el mercado inmobiliario, con precios medios ajustados a la demanda actual.`;
  };

  return (
    <form onSubmit={handleSubmit} className="prediction-form">
      <h2>Selecciona una comunidad autónoma</h2>
      <select
        value={comunidad}
        onChange={(e) => setComunidad(e.target.value)}
        required
      >
        <option value="">-- Selecciona --</option>
        {comunidades.map((c) => (
          <option key={c} value={c}>
            {c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ")}
          </option>
        ))}
      </select>

      <button type="submit" className="btn-primary" disabled={cargando}>
        {cargando ? "Calculando..." : "Predecir Precio"}
      </button>

      {precio !== null && (
        <div className="resultado">
          Precio estimado: {precio.toFixed(2)} €/m2
        </div>
      )}

      {insight && (
        <div className="ia-insight">
          <strong>🔎 Insight IA:</strong> {insight}
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default PredictForm;
