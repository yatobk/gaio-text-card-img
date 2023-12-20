const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const app = express();
const HOSTNAME = "YOUR_SERVER_IP";
const PORT = 6001;
const baseImageNameFile = "reuniao-secreta-card.jpg"

// Middleware para servir arquivos estáticos do diretório 'temp'
app.use('/temp', express.static(path.join(__dirname, 'temp')));
// Middleware para servir arquivos estáticos do diretório 'base-image'
app.use('/base-image', express.static(path.join(__dirname, 'base-image')));

app.get('/generate', async (req, res) => {
    const queryText = req.query.text || 'hello world';
    const text = queryText.charAt(0).toUpperCase() + queryText.slice(1);

    try {
        // Carregar a imagem base do diretório estático
        const baseImage = await loadImage(path.join(__dirname, 'base-image', baseImageNameFile));

        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext('2d');

        // Desenhar a imagem base no canvas
        ctx.drawImage(baseImage, 0, 0);

        // Definir estilo da fonte e tamanho
        const fontSize = [70, 60, 40][Math.min(Math.floor((text.length - 1) / 2), 2)];
        ctx.font = `bold ${fontSize}px Times New Roman`;

        // Escrever texto verticalmente
        const startY = canvas.height / 2 - (fontSize * text.length * 0.9) / 2;
        const startX = canvas.width / 2 - 282; // <-- AQUI: Ajuste esta posição para mover o texto para a esquerda

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charWidth = ctx.measureText(char).width;

            ctx.save();
            ctx.translate(startX, startY + i * fontSize * 0.7); // 0.9 para diminuir o espaçamento entre as letras
            ctx.rotate(Math.PI / 2); // Rotaciona -90 graus
            ctx.fillText(char, -charWidth / 2, fontSize / 2);
            ctx.restore();
        }

        // Gerar um nome único para a imagem temporária
        const uniqueID = Date.now().toString();
        const tempImagePath = path.join(__dirname, 'temp', `${uniqueID}.png`);

        // Converter o canvas para um buffer de imagem PNG
        const imageBuffer = canvas.toBuffer('image/png');

        // Gravar o buffer da imagem em um arquivo
        fs.writeFile(tempImagePath, imageBuffer, (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo:', err);
                res.status(500).send('Erro ao processar a imagem.');
            } else {
                console.log('Imagem gravada com sucesso:', tempImagePath);

                // Retornar a URL da imagem temporária
                const tempLink = `http://${HOSTNAME}:${PORT}/temp/${uniqueID}.png`;
                res.json({ image: tempLink });

                // Excluir a imagem após 2 minutos
                setTimeout(() => {
                    fs.unlink(tempImagePath, (err) => {
                        if (err) {
                            console.error(`Erro ao excluir a imagem ${uniqueID}.png:`, err);
                        } else {
                            console.log(`Imagem ${uniqueID}.png foi excluída com sucesso.`);
                        }
                    });
                }, 2 * 60 * 1000);
            }
        });

    } catch (error) {
        console.error('Erro ao processar a imagem:', error);
        res.status(500).send('Erro ao processar a imagem.');
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://${HOSTNAME}:${PORT}/generate?text=hello-world`);
});
