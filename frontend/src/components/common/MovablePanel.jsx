import React from "react";
import { GripVertical, ChevronUp, ChevronDown, ArrowLeft, ArrowRight, Maximize2, Minimize2 } from "lucide-react";

/**
 * Contenedor de Panel Interactivo Desplazable y Reordenable
 * Permite mover el panel hacia arriba/abajo, expandir a ancho completo o contraer,
 * y arrastrar (Drag & Drop) para que la pantalla se adapte dinámicamente al usuario.
 */
export const MovablePanel = ({
  id,
  title,
  badgeText,
  accentColor = "#2563eb",
  Icon,
  children,
  onMoveUp,
  onMoveDown,
  isExpanded = false,
  onToggleExpand,
  onDragStart,
  onDragOver,
  onDrop,
  headerRight = null,
  explicacionMedica = null,
}) => {
  return (
    <div
      draggable={Boolean(onDragStart)}
      onDragStart={(e) => onDragStart && onDragStart(e, id)}
      onDragOver={(e) => {
        if (onDragOver) {
          e.preventDefault();
          onDragOver(e, id);
        }
      }}
      onDrop={(e) => onDrop && onDrop(e, id)}
      className="card movable-panel-card"
      style={{
        borderTop: `4px solid ${accentColor}`,
        padding: "1.15rem 1.25rem",
        position: "relative",
        transition: "all 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
        gridColumn: isExpanded ? "1 / -1" : "auto",
      }}
    >
      {/* Cabecera compacta con controles de desplazamiento */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "0.85rem",
          paddingBottom: "0.65rem",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <div
            style={{
              cursor: "grab",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              padding: "0.2rem",
              borderRadius: "6px",
              background: "#f8fafc",
            }}
            title="Arrastrar o usar flechas para mover este panel"
          >
            <GripVertical size={16} />
          </div>

          {Icon && (
            <div
              style={{
                background: `${accentColor}15`,
                color: accentColor,
                padding: "0.45rem",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={18} />
            </div>
          )}

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
              <h3 style={{ fontSize: "1.02rem", fontWeight: "900", color: "#0f172a", margin: 0 }}>
                {title}
              </h3>
              {badgeText && (
                <span
                  style={{
                    background: `${accentColor}15`,
                    color: accentColor,
                    fontSize: "0.66rem",
                    fontWeight: "800",
                    padding: "0.12rem 0.5rem",
                    borderRadius: "999px",
                    textTransform: "uppercase",
                  }}
                >
                  {badgeText}
                </span>
              )}
            </div>
            {explicacionMedica}
          </div>
        </div>

        {/* Controles de Movimiento y Adaptación de Pantalla */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          {headerRight}

          {onMoveUp && (
            <button
              type="button"
              onClick={() => onMoveUp(id)}
              className="btn-panel-ctrl"
              title="Desplazar panel hacia arriba / izquierda"
            >
              <ChevronUp size={15} />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={() => onMoveDown(id)}
              className="btn-panel-ctrl"
              title="Desplazar panel hacia abajo / derecha"
            >
              <ChevronDown size={15} />
            </button>
          )}
          {onToggleExpand && (
            <button
              type="button"
              onClick={() => onToggleExpand(id)}
              className="btn-panel-ctrl"
              title={isExpanded ? "Adaptar a columna" : "Expandir a pantalla completa"}
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Cuerpo del panel */}
      <div>{children}</div>
    </div>
  );
};

export default MovablePanel;
