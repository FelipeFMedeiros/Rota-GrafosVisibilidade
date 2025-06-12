export interface ObstaclePosition {
    id: string;
    x: number; // posição X inicial (em metros/células)
    y: number; // posição Y inicial (em metros/células)
    width: number; // largura em metros
    height: number; // altura em metros
    type: 'laboratorio' | 'mesa' | 'cadeira' | 'armario' | 'banheiro' | 'escada' | 'elevador' | 'sala' | 'corredor';
    color: string; // cor para visualização
    label: string; // rótulo para exibir
    minDisplaySize?: { width: number; height: number }; // tamanho mínimo para exibição
}

// Posições dos obstáculos baseadas na imagem fornecida
export const obstaclePositions: ObstaclePosition[] = [
    // Laboratórios
    {
        id: 'L1',
        x: 2,
        y: 2,
        width: 7.2,
        height: 7.0,
        type: 'laboratorio',
        color: '#E3F2FD',
        label: 'LAB 01\n7.20 X 7.0',
    },
    {
        id: 'L2',
        x: 15,
        y: 2,
        width: 4.2,
        height: 3.6,
        type: 'laboratorio',
        color: '#E8F5E8',
        label: 'LAB 02\n4.20 X 3.60',
    },

    // Banheiros (lado esquerdo) - posições ajustadas para evitar gaps
    {
        id: 'B1',
        x: 0,
        y: 11,
        width: 4,
        height: 4,
        type: 'banheiro',
        color: '#FFF3E0',
        label: 'B. F\n4.10 X 3.40',
    },
    {
        id: 'B3',
        x: 2,
        y: 16,
        width: 2,
        height: 2,
        type: 'banheiro',
        color: '#F3E5F5',
        label: 'B. C.\n2.20 X 1.80',
    },
    {
        id: 'B2',
        x: 0,
        y: 19,
        width: 4,
        height: 4,
        type: 'banheiro',
        color: '#E1F5FE',
        label: 'B. M\n4.10 X 3.40',
    },

    // Mesas
    {
        id: 'M1',
        x: 11,
        y: 11,
        width: 1.2,
        height: 1.2,
        type: 'mesa',
        color: '#8D6E63',
        label: 'MESA 01',
    },
    {
        id: 'M2',
        x: 18,
        y: 11,
        width: 1.2,
        height: 1.2,
        type: 'mesa',
        color: '#8D6E63',
        label: 'MESA 02',
    },

    // Cadeiras ao redor das mesas - com tamanho mínimo para visualização
    // Mesa 1
    {
        id: 'C1',
        x: 10.25,
        y: 10.25,
        width: 0.5,
        height: 0.55,
        type: 'cadeira',
        color: '#5D4037',
        label: 'C1',
        minDisplaySize: { width: 0.8, height: 0.8 },
    },
    {
        id: 'C2',
        x: 12.45,
        y: 10.25,
        width: 0.5,
        height: 0.55,
        type: 'cadeira',
        color: '#5D4037',
        label: 'C2',
        minDisplaySize: { width: 0.8, height: 0.8 },
    },
    {
        id: 'C3',
        x: 10.25,
        y: 12.45,
        width: 0.5,
        height: 0.55,
        type: 'cadeira',
        color: '#5D4037',
        label: 'C3',
        minDisplaySize: { width: 0.8, height: 0.8 },
    },
    {
        id: 'C4',
        x: 12.45,
        y: 12.45,
        width: 0.5,
        height: 0.55,
        type: 'cadeira',
        color: '#5D4037',
        label: 'C4',
        minDisplaySize: { width: 0.8, height: 0.8 },
    },

    // Mesa 2
    {
        id: 'C5',
        x: 17.25,
        y: 10.25,
        width: 0.5,
        height: 0.55,
        type: 'cadeira',
        color: '#5D4037',
        label: 'C5',
        minDisplaySize: { width: 0.8, height: 0.8 },
    },
    {
        id: 'C6',
        x: 19.45,
        y: 10.25,
        width: 0.5,
        height: 0.55,
        type: 'cadeira',
        color: '#5D4037',
        label: 'C6',
        minDisplaySize: { width: 0.8, height: 0.8 },
    },
    {
        id: 'C7',
        x: 17.25,
        y: 12.45,
        width: 0.5,
        height: 0.55,
        type: 'cadeira',
        color: '#5D4037',
        label: 'C7',
        minDisplaySize: { width: 0.8, height: 0.8 },
    },
    {
        id: 'C8',
        x: 19.45,
        y: 12.45,
        width: 0.5,
        height: 0.55,
        type: 'cadeira',
        color: '#5D4037',
        label: 'C8',
        minDisplaySize: { width: 0.8, height: 0.8 },
    },

    // Escadas e Elevador (centro) - posições ajustadas
    {
        id: 'E1',
        x: 6,
        y: 15,
        width: 4,
        height: 1,
        type: 'escada',
        color: '#ECEFF1',
        label: 'ESCADA 1\n4.20 x 1.30',
    },
    {
        id: 'E3',
        x: 12,
        y: 15,
        width: 2,
        height: 2,
        type: 'elevador',
        color: '#CFD8DC',
        label: 'ELEVADOR\n2X2',
    },
    {
        id: 'E2',
        x: 16,
        y: 15,
        width: 4,
        height: 1,
        type: 'escada',
        color: '#ECEFF1',
        label: 'ESCADA 2\n4.20 x 1.30',
    },

    // Corredor central - ajustado para evitar gaps
    {
        id: 'CORREDOR',
        x: 12,
        y: 18,
        width: 2,
        height: 17,
        type: 'corredor',
        color: '#F5F5F5',
        label: 'CORREDOR\n18m X 1m50',
    },

    // Salas inferiores - posições ajustadas
    {
        id: 'S1',
        x: 5,
        y: 25,
        width: 7,
        height: 7,
        type: 'sala',
        color: '#FFF8E1',
        label: 'SALA 01\n7.50 X 7.0',
    },
    {
        id: 'S2',
        x: 14,
        y: 25,
        width: 7,
        height: 7,
        type: 'sala',
        color: '#FFF8E1',
        label: 'SALA 02\n7.50 X 7.0',
    },

    // Armários nas salas
    {
        id: 'A1',
        x: 5,
        y: 24,
        width: 0.8,
        height: 0.5,
        type: 'armario',
        color: '#795548',
        label: 'A1',
        minDisplaySize: { width: 1, height: 1 },
    },
    {
        id: 'A2',
        x: 20,
        y: 24,
        width: 0.8,
        height: 0.5,
        type: 'armario',
        color: '#795548',
        label: 'A2',
        minDisplaySize: { width: 1, height: 1 },
    },
];

// Função utilitária para obter obstáculo por ID
export const getObstacleById = (id: string): ObstaclePosition | undefined => {
    return obstaclePositions.find((obstacle) => obstacle.id === id);
};

// Função utilitária para obter obstáculos por tipo
export const getObstaclesByType = (type: ObstaclePosition['type']): ObstaclePosition[] => {
    return obstaclePositions.filter((obstacle) => obstacle.type === type);
};
