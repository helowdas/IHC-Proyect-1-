// components/user/Card.js
import React, { useRef } from "react";
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
}) => {
  const {
    connectors: { connect, drag },
    setProp,
    selected
  } = useNode((node) => ({
    selected: node.events.selected
  }));

  const start = useRef({ x: 0, y: 0, w: width, h: height });
  // Asegura números desde el inicio (evita concatenaciones con strings como "10px")
  const moveStart = useRef({ mx: 0, my: 0, x: Number(x) || 0, y: Number(y) || 0 });

  const onResizeMouseDown = (e) => {
    e.stopPropagation();
    start.current = {
      x: e.clientX,
      y: e.clientY,
      w: typeof width === 'number' ? width : (e.currentTarget.parentElement?.getBoundingClientRect().width || minWidth),
      h: typeof height === 'number' ? height : (e.currentTarget.parentElement?.getBoundingClientRect().height || minHeight),
    };

    const onMove = (ev) => {
      const dx = ev.clientX - start.current.x;
      const dy = ev.clientY - start.current.y;
      const newW = Math.max(minWidth, Math.round(start.current.w + dx));
      const newH = Math.max(minHeight, Math.round(start.current.h + dy));
      setProp((props) => {
        props.width = newW;
        props.height = newH;
      }, 0);
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // NUEVO: movimiento libre en X/Y
  const onMoveMouseDown = (e) => {
    e.stopPropagation();
    // Lee los valores actuales como números al comenzar el drag
    moveStart.current = {
      mx: e.clientX,
      my: e.clientY,
      x: Number(x) || 0,
      y: Number(y) || 0,
    };

    const onMove = (ev) => {
      const dx = ev.clientX - moveStart.current.mx;
      const dy = ev.clientY - moveStart.current.my;
      setProp((props) => {
        props.x = Math.round((moveStart.current.x ?? 0) + dx);
        props.y = Math.round((moveStart.current.y ?? 0) + dy);
      }, 0);
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      style={{
        // Posicionamiento libre
        position: 'absolute',
        left: typeof x === 'number' ? `${x}px` : x,
        top: typeof y === 'number' ? `${y}px` : y,

        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        minWidth,
        minHeight,
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

      {selected && (
        <>
          {/* Handle de movimiento */}
          <div
            onMouseDown={onMoveMouseDown}
            title="Arrastra para mover"
            style={{
              position: 'absolute',
              left: 4,
              top: 4,
              width: 14,
              height: 14,
              borderRadius: 3,
              cursor: 'move',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.15)',
              background: 'rgba(0,0,0,0.15)',
            }}
          />
        </>
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
  },
  related: {
    settings: ContainerSettings
  }
}
