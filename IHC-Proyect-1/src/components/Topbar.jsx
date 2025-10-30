// components/Topbar.js
import {useState} from "react";
import { Box, FormControlLabel, Switch, Grid, Button as MaterialButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Snackbar } from "@mui/material";
import { useEditor } from "@craftjs/core";

export const Topbar = () => {

  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState();
  const [stateToLoad, setStateToLoad] = useState(null);

  return (
    <div className="bg-green-300 flex justify-between align-center p-1">
        <Grid item xs>
          <FormControlLabel
            control={<Switch checked={enabled} onChange={(_, value) => actions.setOptions(options => options.enabled = value)} />}
            label="Enable"
          />
        </Grid>
        <Grid item>

          <MaterialButton 
            size="small" 
            variant="outlined" 
            color="secondary"
            onClick={async () => {
              const json = query.serialize();
              console.log(json);
              try {
                if (navigator.clipboard && window.isSecureContext) {
                  await navigator.clipboard.writeText(json);
                } else {
                  const ta = document.createElement('textarea');
                  ta.value = json;
                  ta.style.position = 'fixed';
                  ta.style.left = '-9999px';
                  document.body.appendChild(ta);
                  ta.focus();
                  ta.select();
                  document.execCommand('copy');
                  document.body.removeChild(ta);
                }
              } catch (e) {
                console.error('No se pudo copiar al portapapeles', e);
              }
            }}
          >
            Copiar estado
          </MaterialButton>

          <MaterialButton 
            className="load-state-btn"
            size="small" 
            variant="outlined" 
            color="secondary"
            onClick={() => setDialogOpen(true)}
          >
              cargar estado
          </MaterialButton>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle id="alert-dialog-title">Cargar estado</DialogTitle>
            <DialogContent>
              <TextField 
                multiline 
                fullWidth
                placeholder='Pega el contenido que fue copiado del botón "Copiar estado actual"'
                size="small"
                value={stateToLoad}
                onChange={e => setStateToLoad(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <MaterialButton onClick={() => setDialogOpen(false)} color="primary">
                Cancel
              </MaterialButton>
              <MaterialButton 
                onClick={() => {
                  setDialogOpen(false);
                  const json = stateToLoad;
                  actions.deserialize(json);
                  setSnackbarMessage("Estado cargado")
                }} 
                color="primary" 
                autoFocus
              >
                Cargar
              </MaterialButton>
            </DialogActions>
          </Dialog>

        </Grid>
    </div>
  )
};