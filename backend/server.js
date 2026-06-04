const express = require('express');
const cors = require('cors');
const ytdlexec = require('youtube-dl-exec');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

function isValidYouTubeURL(url) {
    try {
        const parsed = new URL(url);
        return (
            parsed.hostname.includes('youtube.com') ||
            parsed.hostname.includes('youtu.be')
        );
    } catch {
        return false;
    }
}

app.get('/download', async (req, res) => {
    const { url, format } = req.query;

    if (!url || !isValidYouTubeURL(url)) {
        return res.status(400).json({ error: 'URL inválida ou não informada.' });
    }

    try {
        
        const info = await ytdlexec(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificates: true,
        });

        const safeTitle = info.title.replace(/[^\w\s-]/gi, '').trim();

        if (format === 'mp3') {
            res.header('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`);
            res.header('Content-Type', 'audio/mpeg');

            const subprocess = ytdlexec.exec(url, {
                extractAudio: true,
                audioFormat: 'mp3',
                audioQuality: 0,
                output: '-',
            });

            subprocess.stdout.pipe(res);

            subprocess.stderr.on('data', (data) => {
                console.error('[yt-dlp stderr]', data.toString());
            });

            subprocess.on('error', (err) => {
                console.error('Erro no subprocess mp3:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Erro ao processar o áudio.' });
                }
            });

        } else if (format === 'mp4') {
            res.header('Content-Disposition', `attachment; filename="${safeTitle}.mp4"`);
            res.header('Content-Type', 'video/mp4');

            const subprocess = ytdlexec.exec(url, {
                format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
                output: '-',
            });

            subprocess.stdout.pipe(res);

            subprocess.stderr.on('data', (data) => {
                console.error('[yt-dlp stderr]', data.toString());
            });

            subprocess.on('error', (err) => {
                console.error('Erro no subprocess mp4:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Erro ao processar o vídeo.' });
                }
            });

        } else {
            return res.status(400).json({ error: 'Formato inválido. Use "mp3" ou "mp4".' });
        }

    } catch (error) {
        console.error('Erro no processamento:', error);
        res.status(500).json({ error: 'Erro ao processar o download da mídia.' });
    }
});

app.get('/', (req, res) => {
    res.send('🚀 API do HYPERSAVE está online e pronta para baixar mídias!');
});

app.listen(PORT, () => {
    console.log(`🚀 HYPERSAVE Back-end rodando em: http://localhost:${PORT}`);
});