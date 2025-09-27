import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const formatCommunityLabel = (value) =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const buildInsightMessage = (
  comunidad,
  precioEstimado,
  anioDatos,
  precioHistorico
) => {
  if (typeof precioEstimado !== "number") {
    return "";
  }

  const label = formatCommunityLabel(comunidad);
  const baseMessage = `La IA estima que ${label} puede situarse en ${currencyFormatter.format(
    precioEstimado
  )} por metro cuadrado.`;

  const historicoMessage =
    typeof precioHistorico === "number"
      ? ` El registro historico disponible marca ${currencyFormatter.format(
          precioHistorico
        )} por metro cuadrado.`
      : "";

  const anioMessage = anioDatos ? ` Modelo alimentado con datos de ${anioDatos}.` : "";

  return `${baseMessage}${historicoMessage}${anioMessage}`;
};

function PredictForm() {
  const [comunidades, setComunidades] = useState([]);
  const [comunidad, setComunidad] = useState("");
  const [precio, setPrecio] = useState(null);
  const [precioHistorico, setPrecioHistorico] = useState(null);
  const [anioDatos, setAnioDatos] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cargandoComunidades, setCargandoComunidades] = useState(true);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    const cargarComunidades = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/comunidades`);
        if (!response.ok) {
          throw new Error("No se pudieron cargar las comunidades");
        }
        const data = await response.json();
        setComunidades(data.comunidades ?? []);
      } catch (err) {
        setError("No se pudieron cargar las comunidades disponibles.");
      } finally {
        setCargandoComunidades(false);
      }
    };

    cargarComunidades();
  }, []);

  const algunaComunidadDisponible = useMemo(
    () => comunidades.length > 0,
    [comunidades]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setInsight("");
    setPrecio(null);
    setPrecioHistorico(null);
    setAnioDatos("");

    if (!comunidad) {
      setError("Por favor selecciona una comunidad.");
      return;
    }

    setCargando(true);

    try {
      const response = await fetch(`${API_BASE_URL}/predecir/${comunidad}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error en la prediccion.");
      }

      setPrecio(data.precio_estimado);
      setPrecioHistorico(
        typeof data.precio_medio_historico === "number"
          ? data.precio_medio_historico
          : null
      );
      setAnioDatos(data.anio_datos || "");
      setInsight(
        buildInsightMessage(
          comunidad,
          data.precio_estimado,
          data.anio_datos,
          data.precio_medio_historico
        )
      );
    } catch (err) {
      setError(err.message || "No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="prediction-form">
      <h2>Selecciona una comunidad autonoma</h2>
      <select
        value={comunidad}
        onChange={(e) => setComunidad(e.target.value)}
        disabled={cargandoComunidades || !algunaComunidadDisponible}
        required
      >
        <option value="">
          {cargandoComunidades ? "Cargando..." : "-- Selecciona --"}
        </option>
        {comunidades.map((c) => (
          <option key={c} value={c}>
            {formatCommunityLabel(c)}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="btn-primary"
        disabled={cargando || cargandoComunidades || !algunaComunidadDisponible}
      >
        {cargando ? "Calculando..." : "Predecir con IA"}
      </button>

      {precio !== null && (
        <div className="resultado">
          Precio estimado: {currencyFormatter.format(precio)} /m2
        </div>
      )}

      {precioHistorico !== null && (
        <div className="resultado secundario">
          Precio medio historico: {currencyFormatter.format(precioHistorico)} /m2
        </div>
      )}

      {anioDatos && (
        <div className="detalle-datos">Ultima actualizacion del modelo: {anioDatos}</div>
      )}

      {insight && (
        <div className="ia-insight">
          <strong>Insight IA:</strong> {insight}
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default PredictForm;
