// components/user/Button.jsx (Bootstrap/Tailwind)
import React from "react";
import { useNode } from "@craftjs/core";
import { useNavigate } from "react-router-dom";

export const Button = ({
  size = "small",
  variant = "contained",
  color = "primary",
  // Custom colors
  buttonTextColor = '',
  buttonBgColor = '',
  buttonBorderColor = '',
  // Navigation/action
  actionType = 'route', // 'route' | 'section' | 'external'
  to = "", // internal route (react-router)
  sectionName = "", // for section navigation
  externalUrl = "", // for external link
  externalNewTab = true,
  // Positioning
  translateX = 0,
  translateY = 0,
  zIndex = 0,
  text = "Click me",
  opacity = 1,
  className = "",
  children
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    // Section navigation (like ChevronButton)
    if (actionType === 'section') {
      const target = sectionName ? `/editor?section=${encodeURIComponent(sectionName)}` : '';
      if (!target) return;
      if (target.startsWith('#')) {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      navigate(target);
      return;
    }
    // External link
    if (actionType === 'external') {
      const url = (externalUrl || '').trim();
      if (!url) return;
      if (typeof window !== 'undefined') {
        window.open(url, externalNewTab ? '_blank' : '_self');
      }
      return;
    }
    // Default: internal route
    const route = (to || '').trim();
    if (route) {
      if (route.startsWith('#')) {
        const el = document.querySelector(route);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      navigate(route);
    }
  };

  // Map props -> Bootstrap classes and merge with custom className
  const colorToken = (color || "primary").toLowerCase();
  const isOutline = variant === "outlined";
  const isLink = variant === "text";
  const hasCustomColors = !!(buttonTextColor || buttonBgColor || buttonBorderColor);
  const base = hasCustomColors
    ? "btn" // usamos estilo base y aplicamos colores personalizados por inline style
    : (isLink ? "btn btn-link" : `btn ${isOutline ? "btn-outline-" : "btn-"}${colorToken}`);
  const sizeCls = size === "large" ? "btn-lg" : size === "small" ? "btn-sm" : ""; // medium => default
  const classes = [base, sizeCls, className].filter(Boolean).join(" ");

  const computedStyle = {
    transform: `translate(${Number(translateX) || 0}px, ${Number(translateY) || 0}px)`,
    opacity: Math.max(0, Math.min(1, Number(opacity) || 0)),
    position: 'relative',
    zIndex: Number(zIndex) || 0
  };

  if (hasCustomColors) {
    if (isLink) {
      computedStyle.backgroundColor = 'transparent';
      if (buttonTextColor) computedStyle.color = buttonTextColor;
      computedStyle.border = 'none';
    } else if (isOutline) {
      computedStyle.backgroundColor = 'transparent';
      if (buttonTextColor) computedStyle.color = buttonTextColor;
      computedStyle.borderStyle = 'solid';
      computedStyle.borderWidth = 1;
      if (buttonBorderColor) computedStyle.borderColor = buttonBorderColor;
      else if (buttonTextColor) computedStyle.borderColor = buttonTextColor;
    } else {
      if (buttonBgColor) computedStyle.backgroundColor = buttonBgColor;
      if (buttonTextColor) computedStyle.color = buttonTextColor;
      computedStyle.borderStyle = 'solid';
      computedStyle.borderWidth = 1;
      if (buttonBorderColor) computedStyle.borderColor = buttonBorderColor;
      else if (buttonBgColor) computedStyle.borderColor = buttonBgColor;
    }
  }

  return (
    <button
      ref={(ref) => connect(drag(ref))}
      type="button"
      className={`${classes} justify-content-center`}
      style={computedStyle}
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
        <div className="row g-2">
          <div className="col-6">
            <label className="form-label">Mover X (px)</label>
            <input
              className="form-control form-control-sm"
              type="number"
              value={Number.isFinite(props.translateX) ? props.translateX : 0}
              onChange={(e) => setProp((p) => (p.translateX = Number(e.target.value)))}
            />
          </div>
          <div className="col-6">
            <label className="form-label">Mover Y (px)</label>
            <input
              className="form-control form-control-sm"
              type="number"
              value={Number.isFinite(props.translateY) ? props.translateY : 0}
              onChange={(e) => setProp((p) => (p.translateY = Number(e.target.value)))}
            />
          </div>
        </div>
        <div>
          <label className="form-label">Z-index</label>
          <input
            className="form-control form-control-sm"
            type="number"
            value={Number.isFinite(props.zIndex) ? props.zIndex : 0}
            onChange={(e) => setProp((p) => (p.zIndex = Number(e.target.value)))}
          />
        </div>
        <div className="row g-2">
          <div className="col-4">
            <label className="form-label">Color texto</label>
            <input
              type="color"
              className="form-control form-control-color"
              value={props.buttonTextColor || ''}
              onChange={(e) => setProp((p) => (p.buttonTextColor = e.target.value))}
            />
          </div>
          <div className="col-4">
            <label className="form-label">Color fondo</label>
            <input
              type="color"
              className="form-control form-control-color"
              value={props.buttonBgColor || ''}
              onChange={(e) => setProp((p) => (p.buttonBgColor = e.target.value))}
            />
          </div>
          <div className="col-4">
            <label className="form-label">Color borde</label>
            <input
              type="color"
              className="form-control form-control-color"
              value={props.buttonBorderColor || ''}
              onChange={(e) => setProp((p) => (p.buttonBorderColor = e.target.value))}
            />
          </div>
        </div>
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
        <hr />
        <div>
          <label className="form-label">Acción al hacer clic</label>
          <select
            className="form-select form-select-sm"
            value={props.actionType || 'route'}
            onChange={(e) => setProp((p) => (p.actionType = e.target.value))}
          >
            <option value="section">Ir a sección</option>
            <option value="external">Enlace externo</option>
          </select>
        </div>
        { (props.actionType || 'route') === 'section' && (
          <div>
            <label className="form-label">Nombre de sección</label>
            <input
              className="form-control form-control-sm"
              type="text"
              value={props.sectionName ?? ''}
              onChange={(e) => setProp((p) => (p.sectionName = e.target.value))}
              placeholder="Landing, Home, ..."
            />
          </div>
        )}
        { (props.actionType || 'route') === 'external' && (
          <div className="row g-2">
            <div className="col-8">
              <label className="form-label">URL externa</label>
              <input
                className="form-control form-control-sm"
                type="text"
                value={props.externalUrl ?? ''}
                onChange={(e) => setProp((p) => (p.externalUrl = e.target.value))}
                placeholder="https://..."
              />
            </div>
            <div className="col-4 d-flex align-items-end">
              <div className="form-check">
                <input
                  id="btn-ext-newtab"
                  className="form-check-input"
                  type="checkbox"
                  checked={!!props.externalNewTab}
                  onChange={(e) => setProp((p) => (p.externalNewTab = e.target.checked))}
                />
                <label className="form-check-label" htmlFor="btn-ext-newtab">Nueva pestaña</label>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
};

Button.craft = {
  props: { 
    size: "small", 
    variant: "contained",
    color: "primary",
    buttonTextColor: '',
    buttonBgColor: '',
    buttonBorderColor: '',
    actionType: 'route',
    text: "Click me",
    to: "", // ruta interna o #ancla
    sectionName: "",
    externalUrl: "",
    externalNewTab: true,
    translateX: 0,
    translateY: 0,
    zIndex: 0,
      opacity: 1,
    className: ""
  },

  related: {
    settings: ButtonSettings
  }
}
