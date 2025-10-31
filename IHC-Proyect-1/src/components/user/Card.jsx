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
  minHeight = 120
}) => {
  const {
    connectors: { connect, drag },
    setProp,
    selected
  } = useNode((node) => ({
    selected: node.events.selected
  }));

  const start = useRef({ x: 0, y: 0, w: width, h: height });

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

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      style={{
        position: 'relative',
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
        <div
          onMouseDown={onResizeMouseDown}
          title="Arrastra para redimensionar"
          style={{
            position: 'absolute',
            right: 4,
            bottom: 4,
            width: 14,
            height: 14,
            color: '#666',
            borderRadius: 3,
            border: '20px #black',
            backgroundColor: 'rgba(0,0,0,0.1)',
            cursor: 'nwse-resize',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
            
          }}
        />
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
  },
  related: {
    // Reusa settings del Container
    settings: ContainerSettings
  }
}
