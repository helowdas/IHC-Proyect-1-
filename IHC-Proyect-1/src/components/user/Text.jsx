// components/user/Text.js
import React, { useEffect, useState} from "react";
import { useNode } from "@craftjs/core";
import {Slider, FormControl, FormLabel} from "@mui/material";

export const Text = ({text, fontSize}) => {
  const { connectors: { connect, drag },hasSelectedNode, hasDraggedNode, actions: { setProp } } = useNode((state) => ({
    hasSelectedNode: state.events.selected,
    hasDraggedNode: state.events.dragged
  }));

  const [editable, setEditable] = useState(false);

  function handleChange(e) {
    setProp(props => props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, ""));
  }

  useEffect(() => {!hasSelectedNode && setEditable(false)},[hasSelectedNode])

  return (
    <div 
      ref={ref => connect(drag(ref))}
      onClick={() => setEditable(true)}
    >
      <p style={{ fontSize }}>{text}</p>
    </div>
  )
}

const TextSettings = () => {
  const { actions: {setProp}, fontSize, props } = useNode((node) => ({
    fontSize: node.data.props.fontSize,
    props: node.data.props
  }));

  return (
    <>
      <label htmlFor="text">Texto</label>
      <input className="form-control" type="text" name="text" id="text" value={props?.text??""}
        onChange={(e) =>{setProp(props => props.text = e.target.value)}}
      />
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Font size</FormLabel>
        <Slider
          value={typeof fontSize === 'number' ? fontSize : 20}
          step={1}
          min={1}
          max={50}
          valueLabelDisplay="auto"
          onChange={(_, value) => {
            const v = Array.isArray(value) ? value[0] : value;
            if (typeof v === 'number') {
              setProp(props => props.fontSize = v);
            }
          }}
        />
      </FormControl>
    </>
  )
}

Text.craft = {
  props: {
    text: "Hi",
    fontSize: 20
  },
  rules:{
    canDrag: (node) => node.data.props.text !== "Drag",
  },
  related: {
    settings: TextSettings
  }
}