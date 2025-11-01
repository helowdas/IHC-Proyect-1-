// components/user/Card.js
import React from "react";
import { Text } from "./Text";
import { Button } from "./Button";
import { Container } from "./Container";
import { Element, useNode } from "@craftjs/core";
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
    connectors: { connect, drag },
    selected
  } = useNode((node) => ({
    selected: node.events.selected
  }));
 

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
          <Text text="Title" fontSize={20} />
          <Text text="Subtitle" fontSize={15} />
        </Element>
        <Element id="buttons" is={CardBottom} canvas>
          <Button size="small" text="Learn more" variant="contained" color="primary">Click me</Button>
        </Element>
      </Container>

      {selected && null}
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
