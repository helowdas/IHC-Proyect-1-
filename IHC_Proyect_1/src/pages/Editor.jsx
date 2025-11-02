import React, { useEffect } from 'react';
import Header from '../components/ui/Header';
import Palette from '../components/ui/Palette';
import Sidebar from '../components/ui/Sidebar';
import RightPanel from '../components/ui/RightPanel';

import { Container } from '../components/user/Container';
import { Button } from '../components/user/Button';
import { Card } from '../components/user/Card';
import { Text } from '../components/user/Text';
import { Image } from '../components/user/Image';
import { CardBottom, CardTop } from '../components/user/Card';
import { BackgroundImageContainer } from '../components/user/ImageContainer';
import { ChevronButton } from '../components/user/ChevronButton';
import { IconButton } from '../components/user/IconButton';

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

      <Editor resolver={{ Card, Button, Text, Image, Container, CardTop, CardBottom, BackgroundImageContainer, ChevronButton, IconButton }}>
        <Header nameSection={sectionFromQuery} />
        {/* Carga el estado inicial del editor desde Supabase según la sección */}
        <SectionDataLoader sectionName={sectionFromQuery} />
        <div className="d-flex grow" style={{ minHeight: 0 }}>
          {/* Columna izquierda: Sidebar encima de la paleta de componentes */}
          <div className="d-flex flex-column">
            <Palette />
          </div>
          <div className="grow p-3" style={{ overflow: 'scroll', maxWidth: '750px' }}>

            <div className="px-2 pt-2 pb-1 small text-muted">
                Sección actual: <span className="fw-semibold">{sectionFromQuery || 'Sin sección'}</span>
            </div>

            <div className="bg-white border rounded-1 px-1" style={{ maxWidth: '100%' }}>
              <Frame>
                <Element is={BackgroundImageContainer} padding={10} canvas>
                          
                </Element>
              </Frame>
            </div>
            
          </div>
          {/* Panel derecho: Personalización y Capas */}
          <RightPanel />
        </div>
      </Editor>

    </div>
  );
}

export default App;