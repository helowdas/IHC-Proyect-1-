// components/SettingsPanel.js
import React from 'react';
import { Box, Chip, Grid, Typography } from "@mui/material";
import { useEditor } from '@craftjs/core';

export const SettingsPanel = () => {
  const { selected, Settings } = useEditor((state, query) => {
    const [id] = state.events.selected;
    let Settings = null;
    if (id) {
      const node = query.node(id).get();
      Settings = node.data?.related?.settings || null;
    }
    return { selected: id, Settings };
  });

  return (
    <Box bgcolor="rgba(0, 0, 0, 0.06)" mt={2} px={2} py={2}>
      <Grid container direction="column" spacing={0}>
        <Grid item>  
          <Box pb={2}>
            <Grid container alignItems="center">
              <Grid item xs><Typography variant="subtitle1">Selected</Typography></Grid>
              <Grid item><Chip size="small" color={selected ? 'primary' : 'default'} label={selected ? 'Selected' : 'None'} /></Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item>
          {Settings ? (
            <Settings />
          ) : (
            <Typography variant="body2" color="textSecondary">Selecciona un elemento para ver sus ajustes</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}