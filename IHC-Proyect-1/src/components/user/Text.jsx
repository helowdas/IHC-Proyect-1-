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
      <div className="d-grid gap-3">
          <div>
            <label className="form-label">Texto</label>
            <input
              className="form-control form-control-sm"
              type="text"
              value={props.text ?? ''}
              onChange={(e) => setProp(props => props.text = e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Tamaño de fuente</label>
            <input
              type="range"
              className="form-range"
              min={8}
              max={64}
              step={1}
              value={typeof props.fontSize === 'number' ? props.fontSize : 20}
              onChange={(e) => setProp(props => props.fontSize = Number(e.target.value))}
            />
            <div className="small text-muted">{props.fontSize ?? 20}px</div>
          </div>
        </div>
    </>
  )
}

Text.craft = {
  props: {
    text: "Texto de ejemplo",
    fontSize: 20
  },
  rules:{
    canDrag: (node) => node.data.props.text !== "Drag",
  },
  related: {
    settings: TextSettings
  }
}