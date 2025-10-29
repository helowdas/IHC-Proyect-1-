// components/user/Button.js
import React  from "react";
import {Button as MaterialButton, Grid, FormControl, FormLabel, RadioGroup,Radio, FormControlLabel} from "@mui/material";
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
  )
}

const ButtonSettings = () => {
  const { actions: {setProp}, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div>
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Size</FormLabel>
        <RadioGroup defaultValue={props.size} onChange={(e) => setProp(props => props.size = e.target.value )}>
          <FormControlLabel label="Small" value="small" control={<Radio size="small" color="primary" />} />
          <FormControlLabel label="Medium" value="medium" control={<Radio size="small" color="primary" />} />
          <FormControlLabel label="Large" value="large" control={<Radio size="small" color="primary" />} />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset">
        <FormLabel component="legend">Variant</FormLabel>
        <RadioGroup defaultValue={props.variant} onChange={(e) => setProp(props => props.variant = e.target.value )}>
          <FormControlLabel label="Text" value="text" control={<Radio size="small" color="primary" />} />
          <FormControlLabel label="Outlined" value="outlined" control={<Radio size="small" color="primary" />} />
          <FormControlLabel label="Contained" value="contained" control={<Radio size="small" color="primary" />} />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset">
        <FormLabel component="legend">Color</FormLabel>
        <RadioGroup defaultValue={props.color} onChange={(e) => setProp(props => props.color = e.target.value )}>
          <FormControlLabel label="Inherit" value="inherit" control={<Radio size="small" color="primary" />} />
          <FormControlLabel label="Primary" value="primary" control={<Radio size="small" color="primary" />} />
          <FormControlLabel label="Secondary" value="secondary" control={<Radio size="small" color="primary" />} />
        </RadioGroup>
      </FormControl>
    </div>
  )
};

Button.craft = {
  props: { 
    size: "small", 
    variant: "contained",
    color: "primary",
    text: "Click me"
  },

  related: {
    settings: ButtonSettings
  }
}
