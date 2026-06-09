const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const ytdlexec = require('youtube-dl-exec').create('/usr/local/bin/yt-dlp');
require('dotenv').config();

const app = express();

app.use(cors({ exposedHeaders: ['Content-Disposition'] }));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const COOKIES_PATH = path.join(__dirname, 'cookies.txt');

// ─── Utilitários ────────────────────────────────────────────────────────────

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

function safeDecodeURL(raw) {
    try {
        return decodeURIComponent(raw);
    } catch {
        return raw;
    }
}

// Delay aleatório entre 2-5s para evitar rate-limit do YouTube
function randomDelay() {
    const ms = Math.random() * 3000 + 2000;
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Detecta se o erro é de rate-limit do YouTube
function isRateLimitError(err) {
    return err?.stderr?.includes('rate-limited') || err?.stderr?.includes('try again later');
}

// ─── Rotas ───────────────────────────────────────────────────────────────────

// Validação rápida — o Vue usa para exibir o banner de erro na interface
app.get('/validate', (req, res) => {
    const url = safeDecodeURL(req.query.url);

    console.log('[validate] URL recebida:', url);

    if (!url || !isValidYouTubeURL(url)) {
        console.log('[validate] URL inválida ou não reconhecida como YouTube.');
        return res.json({ valid: false, error: 'A URL inserida não pertence a um vídeo válido do YouTube.' });
    }

    console.log('[validate] URL válida ✅');
    return res.json({ valid: true });
});

app.get('/download', async (req, res) => {
    const url = safeDecodeURL(req.query.url);
    const { format } = req.query;

    console.log('[download] URL recebida:', url);

    if (!url || !isValidYouTubeURL(url)) {
        return res.status(400).json({ error: 'URL inválida ou não informada.' });
    }

    if (!['mp3', 'mp4'].includes(format)) {
        return res.status(400).json({ error: 'Formato inválido. Use "mp3" ou "mp4".' });
    }

    // Verifica se cookies.txt existe antes de chamar o yt-dlp
    if (!fs.existsSync(COOKIES_PATH)) {
        console.warn('[download] cookies.txt não encontrado em:', COOKIES_PATH);
        return res.status(500).json({ error: 'Arquivo de autenticação não encontrado no servidor.' });
    }

    try {
        // Delay para reduzir chance de rate-limit
        await randomDelay();

        const info = await ytdlexec(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificates: true,
            cookies: COOKIES_PATH,
            format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best',
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
                cookies: COOKIES_PATH,
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
                cookies: COOKIES_PATH,
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
        }

    } catch (error) {
        console.error('Erro no processamento:', error);

        if (isRateLimitError(error)) {
            return res.status(429).json({
                error: 'O servidor foi limitado pelo YouTube temporariamente. Tente novamente em alguns minutos.'
            });
        }

        res.status(500).json({ error: 'Erro ao processar o download da mídia.' });
    }
});

app.get('/', (req, res) => {
    res.send('🚀 API do HYPERSAVE está online e pronta para baixar mídias!');
});

app.listen(PORT, () => {
    console.log(`🚀 HYPERSAVE Back-end rodando em: http://localhost:${PORT}`);
});
