// pages/index.js
import {Typography, Paper, Grid} from '@mui/material';

import { Toolbox } from './components/Toolbox';
import { SettingsPanel } from './components/SettingsPanel';
import { Topbar } from './components/Topbar';

import { Container } from './components/user/Container';
import { Button } from './components/user/Button';
import { Card } from './components/user/Card';
import { Text } from './components/user/Text';

import {Editor, Frame, Element} from "@craftjs/core";
import { ClassNames } from '@emotion/react';

function App() {
  return (
    <div className='w-[800px]' style={{margin: "0 auto"}}>
      <p className="text-center text-2xl font-bold">A super simple page editor</p>
      <div className='flex-column'>
        <Topbar />
        <Editor resolver={{Card, Button, Text, Container}}>

          <div className='grid grid-cols-4 grid-rows-1 my-2 gap-2'>
            <div className='col-span-3'>
              <Frame>
                <Element is={Container} padding={5} background="#eee" canvas>
                  <Card />
                  <Button size="small" variant="contained">Clic me</Button>
                  <Text size="small" text="hi world"></Text>
                  <Element is={Container} padding={2} background="#999" canvas>
                    <Text size="small" text="It's me again!" />
                  </Element>
                </Element>
              </Frame>
            </div>

            <div className='col-span-1'>
              <Paper>
                  <Toolbox />
                  <SettingsPanel />
              </Paper>

            </div>
          </div>

        </Editor>
      </div>
    </div>
  );
}

export default App;
