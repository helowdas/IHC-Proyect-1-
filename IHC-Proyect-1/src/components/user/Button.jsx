// components/user/Button.js
import React from "react";
import { Button as MaterialButton } from "@mui/material";
import { useNode } from "@craftjs/core";
import { useNavigate } from "react-router-dom";

export const Button = ({ size, variant, color, to, children }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const navigate = useNavigate();

  const handleClick = () => {
    if (to && typeof to === "string" && to.trim()) {
      navigate(to);
    }
  };

  return (
    <MaterialButton
      ref={(ref) => connect(drag(ref))}
      size={size}
      variant={variant}
      color={color}
      onClick={handleClick}
    >
      {children}
    </MaterialButton>
  );
};

const ButtonSettings = () => {
  const {
    actions: { setProp },
    to,
    size,
    variant,
    color,
  } = useNode((node) => ({
    to: node.data.props.to,
    size: node.data.props.size,
    variant: node.data.props.variant,
    color: node.data.props.color,
  }));

  return (
    <div className="p-2 space-y-2 text-sm">
      <label className="block">Ruta (to)</label>
      <input
        className="w-full border p-1"
        placeholder="/"
        value={to || ""}
        onChange={(e) => setProp((p) => (p.to = e.target.value))}
      />

      <label className="block">Tamaño</label>
      <select
        className="w-full border p-1"
        value={size || "small"}
        onChange={(e) => setProp((p) => (p.size = e.target.value))}
      >
        <option value="small">small</option>
        <option value="medium">medium</option>
        <option value="large">large</option>
      </select>

      <label className="block">Variant</label>
      <select
        className="w-full border p-1"
        value={variant || "contained"}
        onChange={(e) => setProp((p) => (p.variant = e.target.value))}
      >
        <option value="text">text</option>
        <option value="outlined">outlined</option>
        <option value="contained">contained</option>
      </select>

      <label className="block">Color</label>
      <select
        className="w-full border p-1"
        value={color || "primary"}
        onChange={(e) => setProp((p) => (p.color = e.target.value))}
      >
        <option value="primary">primary</option>
        <option value="secondary">secondary</option>
        <option value="success">success</option>
        <option value="error">error</option>
        <option value="info">info</option>
        <option value="warning">warning</option>
      </select>
    </div>
  );
};

Button.defaultProps = {
  size: "small",
  variant: "contained",
  color: "primary",
  to: "",
};

Button.craft = {
  props: Button.defaultProps,
  related: {
    settings: ButtonSettings,
  },
};