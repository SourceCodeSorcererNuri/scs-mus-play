import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as musicMetadata from 'music-metadata';
import dotenv from 'dotenv';
import os from 'os'; // 👈 Imported native OS module to find local IP addresses

// Initialize configuration variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Support multiple comma-separated paths, trimming any excess spaces
const MUSIC_DIRS = (process.env.MUSIC_DIR || '/home/delta/Music/FAVS/')
    .split(',')
    .map(dir => dir.trim())
    .filter(dir => dir.length > 0);

// Core ESM Path Helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable Middleware
app.use(cors());
app.use(express.json());

const SUPPORTED_EXTENSIONS = ['.mp3', '.m4a', '.flac', '.wav', '.ogg'];

/**
 * HELPER: Safe Base64 encoding/decoding for path resolution
 */
const encodePathId = (absolutePath) => Buffer.from(absolutePath).toString('base64url');
const decodePathId = (pathId) => Buffer.from(pathId, 'base64url').toString('utf-8');

/**
 * 1. ASYNC SCAN MULTI-DIRECTORY LIBRARY ENDPOINT
 */
app.get('/api/songs', async (req, res) => {
    try {
        const allSongs = [];
        const folderPlaylists = {};

        for (const dir of MUSIC_DIRS) {
            if (!fs.existsSync(dir)) {
                console.warn(`[Warning] Music directory target skipped (Not Found): ${dir}`);
                continue;
            }

            const folderName = path.basename(dir) || dir;
            if (!folderPlaylists[folderName]) {
                folderPlaylists[folderName] = [];
            }

            const files = fs.readdirSync(dir);

            const lrcFilesSet = new Set(
                files
                    .filter(file => path.extname(file).toLowerCase() === '.lrc')
                    .map(file => path.parse(file).name.toLowerCase())
            );

            for (const file of files) {
                const ext = path.extname(file).toLowerCase();
                if (!SUPPORTED_EXTENSIONS.includes(ext)) continue;

                const fullPath = path.resolve(path.join(dir, file));
                const baseName = path.parse(file).name;
                const hasLyrics = lrcFilesSet.has(baseName.toLowerCase());

                const trackId = encodePathId(fullPath);

                try {
                    const metadata = await musicMetadata.parseFile(fullPath);
                    const picture = metadata.common.picture?.[0];

                    allSongs.push({
                        id: trackId,
                        filename: file,
                        title: metadata.common.title || baseName,
                        artist: metadata.common.artist || 'Unknown Artist',
                        album: metadata.common.album || 'Unknown Album',
                        duration: metadata.format.duration || 0,
                        hasLyrics: hasLyrics,
                        hasArtwork: !!picture,
                        folderGroup: folderName
                    });

                    folderPlaylists[folderName].push(trackId);

                } catch (err) {
                    console.error(`Error parsing metadata for ${file}:`, err.message);

                    allSongs.push({
                        id: trackId,
                        filename: file,
                        title: baseName,
                        artist: 'Unknown Artist',
                        album: 'Unknown Album',
                        duration: 0,
                        hasLyrics: hasLyrics,
                        hasArtwork: false,
                        folderGroup: folderName
                    });

                    folderPlaylists[folderName].push(trackId);
                }
            }
        }

        console.log(`[Multi-Library Scan] Aggregated ${allSongs.length} total tracks across directories.`);
        res.json({ songs: allSongs, autoPlaylists: folderPlaylists });

    } catch (err) {
        console.error("[Library Scan Error]", err);
        res.status(500).json({ error: "Failed to execute global library multi-directory sweep." });
    }
});

/**
 * 2. LIVE LYRICS CONTENT STREAMER (BY TRACK ID)
 */
app.get('/api/lyrics/:trackId', (req, res) => {
    try {
        const filePath = decodePathId(req.params.trackId);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Target audio file location missing." });
        }

        const parsedPath = path.parse(filePath);
        const lrcFilePath = path.join(parsedPath.dir, `${parsedPath.name}.lrc`);

        if (!fs.existsSync(lrcFilePath)) {
            return res.status(404).json({ error: "No matching physical LRC documentation asset located." });
        }

        const rawLrcContent = fs.readFileSync(lrcFilePath, 'utf-8');
        res.json({ lyrics: rawLrcContent });
    } catch (err) {
        console.error("[LRC Asset Stream Error]", err);
        res.status(500).json({ error: "Internal crash reading local lyric text reference file." });
    }
});

/**
 * 3. ADVANCED AUDIO STREAM ENGINE (BY TRACK ID WITH BYTE-RANGE SEEK SUPPORT)
 */
app.get('/api/stream/:trackId', (req, res) => {
    try {
        const filePath = decodePathId(req.params.trackId);

        if (!fs.existsSync(filePath)) {
            return res.status(404).send("Target audio source element not found on system disk.");
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;

            const file = fs.createReadStream(filePath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mpeg',
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'audio/mpeg',
            };
            res.writeHead(200, head);
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (err) {
        console.error("[Streaming Extraction Crash]", err);
        res.status(500).send("Stream runtime pipe failure.");
    }
});

/**
 * 4. EMBEDDED BINARY ARTWORK EXTRACTOR (BY TRACK ID)
 */
app.get('/api/artwork/:trackId', async (req, res) => {
    try {
        const filePath = decodePathId(req.params.trackId);

        if (!fs.existsSync(filePath)) {
            return res.status(404).send("Audio track file not found.");
        }

        const metadata = await musicMetadata.parseFile(filePath);
        const picture = metadata.common.picture?.[0];

        if (picture) {
            res.setHeader('Content-Type', picture.format);
            return res.send(picture.data);
        }

        const baseName = path.parse(filePath).name;
        const displayInitials = baseName.substring(0, 2).toUpperCase();

        const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="100%" height="100%" fill="#111827" />
        <circle cx="150" cy="150" r="60" fill="#374151" />
        <text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="48" fill="#9CA3AF">${displayInitials}</text>
      </svg>
    `.trim();

        res.setHeader('Content-Type', 'image/svg+xml');
        return res.send(svgContent);

    } catch (err) {
        console.error("[Artwork Endpoint Error]", err);
        res.status(500).send("Failed to extract embedded tags.");
    }
});

// Helper function to extract the local network IPv4 address
function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const iface of interfaces[interfaceName]) {
            // Filter out loopback (127.0.0.1) and internal addresses, must be IPv4
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Launch Server listening on '0.0.0.0' (Broadcasting on local network network layer)
app.listen(PORT, '0.0.0.0', () => {
    const localIp = getLocalIpAddress();
    console.log(`================================================================`);
    console.log(` 🎧  SCS Audio Orchestrator Running Successfully!`);
    console.log(` 🏠  Local Engine Address:  http://localhost:${PORT}`);
    console.log(` 🌐  Local Network Link:     http://${localIp}:${PORT}`);
    console.log(` 📂  Active Directories Tracked: ${MUSIC_DIRS.length}`);
    console.log(`================================================================`);
});
