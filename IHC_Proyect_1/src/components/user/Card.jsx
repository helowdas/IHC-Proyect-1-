// components/user/Card.js
import React from "react";
import { Text } from "./Text";
import { Button } from "./Button";
import { Container } from "./Container";
import { Element, useNode, useEditor } from "@craftjs/core";
import {ContainerSettings} from "./Container";
import { ContainerDefaultProps } from "./Container";

export const CardTop = ({children}) => {
  const { connectors: {connect} } = useNode();
  return (
    <div ref={connect} className="text-only">
      {children}
    </div>
  )
}

CardTop.craft = {
  rules: {
    // Only accept Text
    canMoveIn: (incomingNodes) => incomingNodes.every(incomingNode => incomingNode.data.type === Text)
  }
}

export const CardBottom = ({children}) => {
  const { connectors: {connect} } = useNode();
  return (
    <div ref={connect}>
      {children}
    </div>
  )
}

CardBottom.craft = {
  rules: {
    // Only accept Buttons
    canMoveIn : (incomingNodes) => incomingNodes.every(incomingNode => incomingNode.data.type === Button)
  }
}

export const Card = ({
  background,
  padding = 20,
  width = 360,
  height = 220,
  minWidth = 180,
  minHeight = 120,
  // NUEVO: posición libre
  x = 0,
  y = 0,
  // Z-index para evitar desplazamiento
  zIndex = 0,
}) => {
  const {
    id,
    connectors: { connect, drag },
    selected
  } = useNode((node) => ({
    selected: node.events.selected
  }));
  const { actions: { add, selectNode }, query: { createNode, node } } = useEditor();
 

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      style={{
        // Posicionamiento libre
        position: 'absolute',
        left: typeof x === 'number' ? `${x}px` : x,
        top: typeof y === 'number' ? `${y}px` : y,
        zIndex: Number(zIndex) || 0,

        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        minWidth,
        minHeight,
        boxSizing: 'border-box',
        // contorno solo cuando está seleccionada
        outline: selected ? '1px dashed #3b82f6' : undefined,
      }}
    >
      <Container background={background} padding={padding}>
        <Element id="text" is={CardTop} canvas>
          <Text text="Título" fontSize={20} />
          <Text text="Subtítulo" fontSize={15} />
        </Element>
        <Element id="buttons" is={CardBottom} canvas>
          <Button size="small" text="Saber más" variant="contained" color="primary">Haz clic aquí</Button>
        </Element>
      </Container>
      {selected && (
        <span
          role="button"
          aria-label="Duplicar"
          className="position-absolute"
          style={{
            top: -14,
            right: -14,
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: '#590004',
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 8px #590004, 0 0 12px #590004',
            cursor: 'pointer',
            zIndex: 9999,
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const current = node(id).get();
            const { type, props, parent } = {
              type: current.data.type,
              props: current.data.props,
              parent: current.data.parent,
            };
            const parentNode = node(parent).get();
            const siblings = parentNode.data.nodes || [];
            const index = Math.max(0, siblings.indexOf(id));
            const shiftedProps = {
              ...props,
              x: (Number(props.x) || 0) + 10,
              y: (Number(props.y) || 0) + 10,
            };
            const newNode = createNode(React.createElement(type, shiftedProps));
            add(newNode, parent, index + 1);
            selectNode(newNode.id);
          }}
        >
          <i className="bi bi-copy" />
        </span>
      )}
    </div>
  )
}

Card.craft = {
  props: {
    ...ContainerDefaultProps,
    width: 360,
    height: 220,
    minWidth: 180,
    minHeight: 120,
    // NUEVO: defaults posición
    x: 0,
    y: 0,
    // Z-index para evitar desplazamiento
    zIndex: 0,
  },
  related: {
    settings: ContainerSettings
  }
}
