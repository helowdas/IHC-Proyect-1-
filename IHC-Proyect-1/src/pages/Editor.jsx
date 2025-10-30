import Header from '../components/ui/Header';
import Palette from '../components/ui/Palette';
import Sidebar from '../components/ui/Sidebar';
import SettingsLite from '../components/ui/SettingsLite';

import { Container } from '../components/user/Container';
import { Button } from '../components/user/Button';
import { Card } from '../components/user/Card';
import { Text } from '../components/user/Text';
import { Image } from '../components/user/Image';
import { CardBottom, CardTop } from '../components/user/Card';

import { Editor, Frame, Element } from '@craftjs/core';

function App() {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Editor resolver={{ Card, Button, Text, Image, Container, CardTop, CardBottom }}>
        <Header />
        <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
          {/* Columna izquierda: Sidebar encima de la paleta de componentes */}
          <div className="d-flex flex-column">
            <Palette />
          </div>
          <div className="flex-grow-1 p-3" style={{ overflow: 'auto' }}>
            <div className="bg-white border rounded-3 p-3">
              <Frame>
                <Element is={Container} padding={8} background="#ffffff" canvas>
                  {/* Ejemplo de contenido inicial */}
                  <Image />
                </Element>
              </Frame>
            </div>
          </div>
          <div className="border-start bg-white" style={{ width: 320 }}>
            <SettingsLite />
          </div>
        </div>
      </Editor>
    </div>
  );
}

export default App;