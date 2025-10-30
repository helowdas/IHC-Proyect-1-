// components/user/Button.jsx (Bootstrap/Tailwind)
import React from "react";
import { useNode } from "@craftjs/core";
import { useNavigate } from "react-router-dom";

export const Button = ({ size = "small", variant = "contained", color = "primary", to = "", text = "Click me", className = "", children }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const navigate = useNavigate();

  const handleClick = () => {
    if (to && typeof to === "string" && to.trim()) {
      navigate(to);
    }
  };

  // Map props -> Bootstrap classes and merge with custom className
  const colorToken = (color || "primary").toLowerCase();
  const isOutline = variant === "outlined";
  const isLink = variant === "text";
  const base = isLink ? "btn btn-link" : `btn ${isOutline ? "btn-outline-" : "btn-"}${colorToken}`;
  const sizeCls = size === "large" ? "btn-lg" : size === "small" ? "btn-sm" : ""; // medium => default
  const classes = [base, sizeCls, className].filter(Boolean).join(" ");

  return (
    <button
      ref={(ref) => connect(drag(ref))}
      type="button"
      className={`${classes} justify-content-center`}
      onClick={handleClick}
    >
      {text}
    </button>
  )
}

const ButtonSettings = () => {
  const { actions: {setProp}, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <>
      <div className="d-grid gap-3">
        <div>
          <label className="form-label">Texto</label>
          <input
            className="form-control form-control-sm"
            type="text"
            value={props.text ?? ""}
            onChange={(e) => setProp((props) => (props.text = e.target.value))}
            placeholder="Texto del botón"
          />
        </div>
        <div>
          <label className="form-label">Tamaño</label>
          <select
            className="form-select form-select-sm"
            value={props.size || 'small'}
            onChange={(e) => setProp((props) => (props.size = e.target.value))}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div>
          <label className="form-label">Variante</label>
          <select
            className="form-select form-select-sm"
            value={props.variant || 'contained'}
            onChange={(e) => setProp((props) => (props.variant = e.target.value))}
          >
            <option value="text">Text</option>
            <option value="outlined">Outlined</option>
            <option value="contained">Contained</option>
          </select>
        </div>
        <div>
          <label className="form-label">Color</label>
          <select
            className="form-select form-select-sm"
            value={props.color || 'primary'}
            onChange={(e) => setProp((props) => (props.color = e.target.value))}
          >
            <option value="primary">primary</option>
            <option value="secondary">secondary</option>
            <option value="success">success</option>
            <option value="danger">danger</option>
            <option value="warning">warning</option>
            <option value="info">info</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </div>
        <div>
          <label className="form-label">URL destino (opcional)</label>
          <input
            className="form-control form-control-sm"
            type="text"
            value={props.to ?? ''}
            onChange={(e) => setProp((props) => (props.to = e.target.value))}
            placeholder="/ruta-o-url"
          />
        </div>
      </div>
    </>
  )
};

Button.craft = {
  props: { 
    size: "small", 
    variant: "contained",
    color: "primary",
    text: "Click me",
    to: "", // si está vacío, no navega
    className: ""
  },

  related: {
    settings: ButtonSettings
  }
}
