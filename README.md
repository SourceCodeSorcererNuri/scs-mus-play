
# 🎵 SCS-MUS-PLAY

> **Kinetic Audio Environment** — A premium, standalone local music player built to break the mold of traditional, heavy desktop media engines.

---

## ⚜️ About SCS-MUS-PLAY⚜️

**SCS-MUS-PLAY** is a localized, web-native music sanctuary designed for audio purists who keep their media libraries right where they belong: *locally on their own drives*. It bridges the gap between high-performance local tracking and sleek, ultra-modern cinematic user interfaces. 

### Why is it Faster and More Efficient?
Traditional desktop music applications (like Electron-bloated standalone players or heavy native software) run extensive background indexing, bloated tracking engines, and hog gigabytes of system memory just to play a simple audio file. 

* **Direct System I/O streaming:** It drops the heavy abstraction layer. Audio files are read directly from your local hardware storage paths and processed via optimized, lightweight pipelines.
* **Vite-Powered Frontend Architecture:** Leveraging a decoupled client-server relationship, the interface loads instantly, completely caching layouts and state management cleanly without constant redraw lag.
* **Low Footprint Background Server:** The server acts as a rapid, minimal file-system router—streaming track blocks on demand rather than buffering massive files into memory at startup.

---

## 🎨 Vibe-Coded Architecture

This application wasn't constructed inside a rigid corporate sandbox. It was completely **Vibe-Coded**—built rapidly using highly iterative automation, local code-generation pipelines, and AI collaborative engineering to go directly from artistic vision to functional execution. 

Instead of dealing with days of architectural boilerplate, the focus went entirely into structural logic, data persistence, and interactive fluidity. The result is a specialized piece of software that prioritizes raw performance, precise dynamic visuals, and a deeply satisfying UX over standard, generic layouts.

---

## 💎 Premium UI Features You Won't Find in Standard Players

While most standalone players give you a static grid of album covers and a boring playlist view, SCS-MUS-PLAY steps into a cinematic ecosystem:

| Feature | What It Does | Why It's Better |
| :--- | :--- | :--- |
| **Vibrant Color-Thief Loop** | Scans the active track's artwork in real-time, extracting dominant and secondary bright tones. | The entire application UI dynamically morphs its radial backdrop and accent colors to match the exact aesthetic energy of the song playing. |
| **Panoramic LRC Lyrics Stream** | A dedicated lyric viewport that parses standard physical `.lrc` timestamp files down to 2-digit decimals. | Lines are completely interactive. Clicking on a lyric instantly skips the audio engine to that exact hook timestamp. |
| **Automatic Center-Focus Alignment** | Tracks playback timing to smoothly scroll and pin the currently active lyric line perfectly to the center of your screen. | You never have to hunt for your place in the song; the text moves effortlessly around the music, dimming inactive lines to prevent visual distraction. |
| **Chunky Audio Fins Visualizer** | A customized visualizer built on the Web Audio API that renders live frequencies into solid graphic shapes. | It mimics hardware audio decks rather than messy thin lines, reacting dynamically to the track's treble and bass outputs. |
| **Persistent Local Storage Migration** | An intelligent data healing engine that handles layout changes automatically on boot. | If you rearrange files, the player handles old structural playlist formats and gracefully heals your active local collection maps without data loss. |

---

## 🛠️ Prerequisites & Requirements

Before setting up SCS-MUS-PLAY, make sure you have the following essential software utilities installed on your system:

* **Git:** To clone and manage the repository ecosystem.
* **Node.js (v18+ recommended):** The core JavaScript runtime required to execute the backend environment and run the frontend build pipeline.
* **npm (Node Package Manager):** Comes bundled with Node.js to install and manage the application dependencies.

---

## 🚀 Installation & Setup Guides

### 📥 1. Clone the Repository
Regardless of your operating system, begin by cloning the source code down to your local environment machine:

```bash
git clone [https://github.com/YOUR_USERNAME/SCS-MUS-PLAY.git](https://github.com/YOUR_USERNAME/SCS-MUS-PLAY.git)
cd SCS-MUS-PLAY

```

### 🐧 Linux Setup (Automatic Initializer)

The system includes an intelligent environment script (`start.sh`) that manages port conflict detection, handles dependency installations, prompts for your music folder on first-time boots, expands environment paths, and handles cleanup traps gracefully.

**1. Make the launcher script executable:**

Bash

```
chmod +x start.sh

```

**2. Boot the engine:**

Bash

```
./start.sh

```

> **Note:** If you ever want to stop the system safely, simply hit `Ctrl + C` in your open terminal shell. The script will catch the signal immediately, terminate the background processes safely, and free ports `5000` and `5173`.

### 🍏 macOS Setup (Manual Launch)

If you are running on macOS, you can spin up the decoupled client and server processes using standard terminal commands:

**1. Setup Environment Configuration:**

Create a `.env` file inside your `/server` directory:

Bash

```
nano server/.env

```

Paste your folder configurations (adjusting paths for macOS layout):

Kod parchasi

```
MUSIC_DIR=/Users/YOUR_USERNAME/Music/
PORT=5000

```

**2. Launch Backend Server:**

Bash

```
cd server
npm install
npm run dev

```

**3. Launch Frontend Client (In a new terminal window):**

Bash

```
cd client
npm install
npm run dev

```

Open your browser and navigate to `http://localhost:5173`.

### 🪟 Windows Setup (Manual Launch)

For Windows environments, use a terminal tool like Git Bash, PowerShell, or command prompt:

**1. Setup Environment Configuration:**

Create a file named `.env` inside the `server` folder using your text editor (e.g., Notepad):

Kod parchasi

```
MUSIC_DIR=C:/Users/YOUR_USERNAME/Music/
PORT=5000

```

_(Make sure to use forward slashes `/` for your folder directory structure blocks inside the configuration file)._

**2. Launch Backend Server:**

Open PowerShell or Git Bash inside the project root:

Bash

```
cd server
npm install
npm run dev

```

**3. Launch Frontend Client:**

Open a separate PowerShell or Git Bash window in the project root:

Bash

```
cd client
npm install
npm run dev

```

Launch your browser of choice and go to `http://localhost:5173` to interact with your local music grid.

