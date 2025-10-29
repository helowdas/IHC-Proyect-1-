// components/user/Container.js
import React from "react";
import {FormControl, FormLabel, Slider} from "@mui/material";
import { Paper } from "@mui/material";
import { useNode } from "@craftjs/core";

export const Container = ({background, padding = 0, children}) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <Paper 
      ref={ref => connect(drag(ref))} 
      style={{margin: "5px 0", background, padding: `${padding}px`}}
    >
      {children}
    </Paper>
  )
}

export const ContainerSettings = () => {
  const { background, padding, actions: {setProp} } = useNode(node => ({
    background: node.data.props.background,
    padding: node.data.props.padding
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
    </div>
  )
}

export const ContainerDefaultProps = {
  background : "#ffffff",
  padding: 3
};

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings
  }
}