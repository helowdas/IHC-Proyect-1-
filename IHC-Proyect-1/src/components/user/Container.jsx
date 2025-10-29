// components/user/Container.js
import React from "react";
import { FormControl, FormLabel, Slider } from "@mui/material";
import { Paper } from "@mui/material";
import { useNode } from "@craftjs/core";

export const Container = ({ background, padding = 0, borderRadius = 0, boxShadow = "", children }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <Paper
      ref={ref => connect(drag(ref))}
      style={{
        margin: "5px 0",
        background,
        padding: `${padding}px`,
        borderRadius: `${borderRadius}px`,
        boxShadow: boxShadow ? `0 4px 8px ${boxShadow}` : "none"
      }}
    >
      {children}
    </Paper>
  )
}

export const ContainerSettings = () => {
  const { background, padding, borderRadius, boxShadow, actions: { setProp } } = useNode(node => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
    borderRadius: node.data.props.borderRadius,
    boxShadow: node.data.props.boxShadow
  }));
  return (
    <div>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Background</FormLabel>
        <input
          type="color"
          value={background || '#000000'}
          onChange={(e) => setProp(props => props.background = e.target.value)}
          style={{ width: 40, height: 40, padding: 0, border: 'none', background: 'transparent' }}
        />
      </FormControl>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Padding</FormLabel>
        <Slider
          value={typeof padding === 'number' ? padding : 3}
          step={1}
          min={0}
          max={100}
          valueLabelDisplay="auto"
          onChange={(_, value) => {
            const v = Array.isArray(value) ? value[0] : value;
            if (typeof v === 'number') {
              setProp(props => props.padding = v)
            }
          }}
        />
      </FormControl>
      {/* Nuevo apartado: Decoration */}
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Border Radius</FormLabel>
        <Slider
          value={typeof borderRadius === 'number' ? borderRadius : 0}
          step={1}
          min={0}
          max={50}
          valueLabelDisplay="auto"
          onChange={(_, value) => {
            const v = Array.isArray(value) ? value[0] : value;
            if (typeof v === 'number') {
              setProp(props => props.borderRadius = v)
            }
          }}
        />
      </FormControl>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Box Shadow</FormLabel>
        <input
          type="color"
          value={boxShadow || '#000000'}
          onChange={(e) => setProp(props => props.boxShadow = e.target.value)}
          style={{ width: 40, height: 40, padding: 0, border: 'none', background: 'transparent' }}
        />
      </FormControl>
    </div>
  )
}

export const ContainerDefaultProps = {
  background: "#ffffff",
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