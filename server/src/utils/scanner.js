import fs from 'fs';
import path from 'path';
import * as musicMetadata from 'music-metadata';

const SUPPORTED_EXTENSIONS = ['.mp3', '.m4a', '.flac', '.wav', '.ogg'];

export async function scanMusicFolder(dirPath) {
    const songs = [];

    try {
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            if (!SUPPORTED_EXTENSIONS.includes(ext)) continue;

            const fullPath = path.join(dirPath, file);

            try {
                // Parse metadata from audio file
                const metadata = await musicMetadata.parseFile(fullPath);

                // Check if there's embedded album art
                const picture = metadata.common.picture?.[0];
                const hasArtwork = !!picture;

                songs.push({
                    id: Buffer.from(file).toString('base64url'), // Safe unique ID based on filename
                    filename: file,
                    title: metadata.common.title || file.replace(ext, ''),
                    artist: metadata.common.artist || 'Unknown Artist',
                    album: metadata.common.album || 'Unknown Album',
                    duration: metadata.format.duration || 0, // in seconds
                    hasArtwork: hasArtwork
                });
            } catch (err) {
                console.error(`Error parsing metadata for ${file}:`, err.message);
                // Fallback for files with corrupted metadata
                songs.push({
                    id: Buffer.from(file).toString('base64url'),
                    filename: file,
                    title: file.replace(ext, ''),
                    artist: 'Unknown Artist',
                    album: 'Unknown Album',
                    duration: 0,
                    hasArtwork: false
                });
            }
        }
    } catch (error) {
        console.error("Failed to read directory:", error);
    }

    return songs;
}
