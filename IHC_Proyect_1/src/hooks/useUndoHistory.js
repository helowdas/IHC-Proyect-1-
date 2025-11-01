import { useEffect, useRef, useState, useCallback } from 'react';
import { useEditor } from '@craftjs/core';

/**
 * Hook personalizado para manejar el historial de deshacer (Ctrl+Z)
 * Mantiene un historial de estados del editor y permite deshacer cambios
 */
export function useUndoHistory(maxHistorySize = 50) {
  const { query, actions } = useEditor();
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isUndoingRef = useRef(false);
  const timeoutRef = useRef(null);
  const lastSerializedRef = useRef('');

  // Guarda el estado actual en el historial
  const saveState = useCallback(() => {
    if (isUndoingRef.current) return;
    
    try {
      // Verificar que query existe y tiene el método serialize
      if (!query || typeof query.serialize !== 'function') {
        return;
      }
      
      const currentState = query.serialize();
      if (!currentState) return;
      
      const serializedState = typeof currentState === 'string' ? currentState : JSON.stringify(currentState);
      
      // Evitar guardar estados duplicados
      if (serializedState === lastSerializedRef.current) {
        return;
      }
      
      lastSerializedRef.current = serializedState;
      
      setHistory((prevHistory) => {
        // Eliminar estados futuros si estamos en medio del historial
        const newHistory = prevHistory.slice(0, currentIndex + 1);
        
        // Agregar el nuevo estado
        const updated = [...newHistory, serializedState];
        
        // Limitar el tamaño del historial
        if (updated.length > maxHistorySize) {
          return updated.slice(-maxHistorySize);
        }
        
        return updated;
      });
      
      setCurrentIndex((prev) => {
        const newIndex = prev + 1;
        return Math.min(newIndex, maxHistorySize - 1);
      });
    } catch (error) {
      console.error('Error guardando estado en historial:', error);
    }
  }, [query, currentIndex, maxHistorySize]);

  // Deshace el último cambio
  const undo = useCallback(() => {
    if (currentIndex <= 0) return;
    if (!actions || typeof actions.deserialize !== 'function') return;
    
    isUndoingRef.current = true;
    const previousState = history[currentIndex - 1];
    
    if (previousState) {
      try {
        actions.deserialize(previousState);
        setCurrentIndex((prev) => prev - 1);
        lastSerializedRef.current = previousState;
      } catch (error) {
        console.error('Error deshaciendo:', error);
      }
    }
    
    // Resetear el flag después de un breve delay
    setTimeout(() => {
      isUndoingRef.current = false;
    }, 100);
  }, [actions, currentIndex, history]);

  // Escucha cambios usando un intervalo simple
  // El historial se guardará periódicamente y se capturarán cambios importantes
  useEffect(() => {
    // Inicializar con el estado actual
    const initTimeout = setTimeout(() => {
      saveState();
    }, 500);

    // Usar un intervalo para guardar periódicamente (cada 2 segundos)
    // Esto capturará cambios aunque no detectemos eventos específicos
    const interval = setInterval(() => {
      if (!isUndoingRef.current) {
        saveState();
      }
    }, 2000);

    return () => {
      clearTimeout(initTimeout);
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [saveState]);

  // Manejar Ctrl+Z
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Solo procesar si no estamos en un input o textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo]);

  return {
    canUndo: currentIndex > 0,
    undo,
  };
}

