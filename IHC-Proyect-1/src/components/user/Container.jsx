// components/user/Container.jsx
import React from "react";
import { useNode } from "@craftjs/core";

export const Container = ({ background, padding = 0, borderRadius = 0, boxShadow = "", children }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div
      ref={ref => connect(drag(ref))}
      style={{
        margin: "5px 0",
        background: `${background}`,
        padding: `${padding}px`,
        borderRadius: `${borderRadius}px`,
        boxShadow: boxShadow ? `0 4px 8px ${boxShadow}` : "none"
      }}
    >
      {children}
    </div>
  )
}
export const ContainerSettings = () => {
  // Get current props and the setter from Craft.js
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));
  return (
    <>
      <div className="d-grid gap-3">
        <div>
          <label className="form-label">Fondo</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={props.background || '#ffffff'}
            onChange={(e) => setProp((props) => (props.background = e.target.value))}
          />
        </div>

        <div>
          <label className="form-label">Padding</label>
          <input
            type="range"
            className="form-range"
            min={0}
            max={100}
            step={1}
            value={typeof props.padding === 'number' ? props.padding : 3}
            onChange={(e) => setProp((props) => (props.padding = Number(e.target.value)))}
          />
        </div>

        <div>
          <label className="form-label">Border Radius</label>
          <input
            type="range"
            className="form-range"
            min={0}
            max={100}
            step={1}
            value={typeof props.borderRadius === 'number' ? props.borderRadius : 0}
            onChange={(e) => setProp((props) => (props.borderRadius = Number(e.target.value)))}
          />
          <div className="small text-muted">{props.borderRadius ?? 0}px</div>
        </div>

        <div>
          <label className="form-label">Box Shadow</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={props.boxShadow || '#000000'}
            onChange={(e) => setProp((props) => (props.boxShadow = e.target.value))}
            style={{ width: 40, height: 40, padding: 0, border: 'none', background: 'transparent' }}
          />
        </div>
          
      </div>
    </>
  )
}

export const ContainerDefaultProps = {
  background: "#adb5bd",
  padding: 3,
  borderRadius: 0,
  boxShadow: ""
};

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings
  }
}