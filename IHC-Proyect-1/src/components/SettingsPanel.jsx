import React from "react";
import { Box, Chip, Grid, Typography, Button as MaterialButton } from "@mui/material";
import { useEditor } from "@craftjs/core";

export const SettingsPanel = () => {
  const { actions,selected } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if ( currentNodeId ) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable()
      };
    }

    return {
      selected
    }
  });

  return selected ? (    
    <Box bgcolor="rgba(0, 0, 0, 0.06)" mt={2} px={2} py={2}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Box pb={2}>
            <Grid container alignItems="center">
              <Grid item xs><Typography variant="subtitle1">Selected</Typography></Grid>
              <Grid item><Chip size="small" color="primary" label={selected.name} /></Grid>
            </Grid>
          </Box>
        </Grid>
        {selected.settings && typeof selected.settings === 'function' && (
          <Grid item>
            {/* Renderiza el formulario de configuración del nodo */}
            {React.createElement(selected.settings)}
          </Grid>
        )}
        {
          selected.isDeletable ? (
            <MaterialButton
              variant="contained"
              color="inherit"
              onClick={() => {
                actions.delete(selected.id);
              }}
            >
              Delete
            </MaterialButton>
          ) : null
        }
      </Grid>
    </Box>
  ) : null
}