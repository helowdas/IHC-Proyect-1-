import React, { useEffect } from 'react';
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

import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { useSearchParams } from 'react-router-dom';
import { useGetSectionData } from '../hooks/useGetSectionData';

// Carga el JSON guardado para la sección indicada y lo inyecta al editor
function SectionDataLoader({ sectionName }) {
  const { actions } = useEditor();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (!sectionName) return;
        const result = await useGetSectionData(sectionName);
        console.log('Section data loaded in Editor:', result);
        if (cancelled) return;
        if (!result) return;
        const raw = typeof result === 'string' ? result : JSON.stringify(result);
        actions.deserialize(raw);
      } catch (e) {
        console.error('No se pudo cargar la sección desde la BD', e);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [sectionName, actions]);

  return null;
}

function App({nameSection}) {
  const [searchParams] = useSearchParams();
  const sectionFromQuery = searchParams.get('section') || nameSection;
  
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Editor resolver={{ Card, Button, Text, Image, Container, CardTop, CardBottom }}>
        <Header nameSection={sectionFromQuery} />
        {/* Carga el estado inicial del editor desde Supabase según la sección */}
        <SectionDataLoader sectionName={sectionFromQuery} />
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