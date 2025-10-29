// pages/index.js
import {Typography, Paper, Grid} from '@mui/material';

import { Toolbox } from './components/Toolbox';
import { SettingsPanel } from './components/SettingsPanel';
import { Topbar } from './components/Topbar';

import { Container } from './components/user/Container';
import { Button } from './components/user/Button';
import { Card } from './components/user/Card';
import { Text } from './components/user/Text';

function App() {
  return (
    <div className='w-[800px]' style={{margin: "0 auto"}}>
      <p className="text-center text-2xl font-bold">A super simple page editor</p>
      <div className='flex-column'>
        <Topbar />

        <div className='grid grid-cols-4 grid-rows-1 my-2 gap-2'>
          <div className='col-span-3'>
            <Container padding={5} background="#eee">
              <Card />
            </Container>
          </div>

          <div className='col-span-1'>
            <Paper>
                <Toolbox />
                <SettingsPanel />
            </Paper>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
