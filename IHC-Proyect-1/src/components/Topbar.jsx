// components/Topbar.js
import React from "react";
import { Box, FormControlLabel, Switch, Grid, Button as MaterialButton } from "@mui/material";

export const Topbar = () => {
  return (
    <div className="bg-green-300 flex justify-between align-center p-1">
        <Grid item xs>
          <FormControlLabel
            control={<Switch checked={true} />}
            label="Enable"
          />
        </Grid>
        <Grid item>
          <MaterialButton size="small" variant="outlined" color="secondary">Serialize JSON to console</MaterialButton>
        </Grid>
    </div>
  )
};