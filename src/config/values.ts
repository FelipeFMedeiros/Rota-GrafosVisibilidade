export const gridValues = {
    width: 25, // Largura do grid em metros
    height: 35, // Altura do grid em metros
    cellSize: 20, // Tamanho da célula em pixels para o PDF
    margin: 50, // Margem do documento
    get coordinatesX() { return Array.from({ length: this.width }, (_, i) => i); }, // Coordenadas X de 0 a width-1
    get coordinatesY() { return Array.from({ length: this.height }, (_, i) => i); }, // Coordenadas Y de 0 a height-1
};

// Constantes para os obstáculos
export const obstacles = {
    mesa: {
        width: 1.2, // metros
        height: 1.2, // metros
        count: 2, // M1, M2
    },
    cadeira: {
        width: 0.5, // metros
        height: 0.55, // metros
        count: 8, // C1-C8
    },
    armario: {
        width: 0.8, // metros
        height: 0.5, // metros
        count: 2, // A1, A2
    },
    laboratorio: [
        { width: 7.2, height: 7.0, id: 'L1' }, // Laboratório 1
        { width: 4.2, height: 3.6, id: 'L2' }, // Laboratório 2
    ],
    corredor: {
        width: 1.85, // metros
        height: 1.5, // metros
    },
    sala: {
        width: 7.5, // metros
        height: 7.0, // metros
        count: 2, // S1, S2
    },
    banheiro: [
        { width: 4.1, height: 3.4, id: 'B1' }, // Banheiro comum 1
        { width: 4.1, height: 3.4, id: 'B2' }, // Banheiro comum 2
        { width: 2.2, height: 1.8, id: 'B3' }, // Banheiro cadeirante
    ],
    escada: {
        width: 4.2, // metros
        height: 1.3, // metros
        count: 2, // E1, E2
    },
    elevador: {
        width: 2.0, // metros
        height: 2.0, // metros
        id: 'E3',
    },
};
