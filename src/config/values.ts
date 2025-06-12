export const gridValues = {
    width: 25, // Largura do grid em metros
    height: 35, // Altura do grid em metros
    cellSize: 20, // Tamanho da célula em pixels para o PDF
    margin: 50, // Margem do documento
    get coordinatesX() {
        return Array.from({ length: this.width }, (_, i) => i);
    }, // Coordenadas X de 0 a width-1
    get coordinatesY() {
        return Array.from({ length: this.height }, (_, i) => i);
    }, // Coordenadas Y de 0 a height-1
};
