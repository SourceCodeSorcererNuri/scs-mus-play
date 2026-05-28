#!/bin/bash

# Get the directory where the script is located
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ENV_PATH="$PROJECT_DIR/server/.env"

echo "🎵 SCS Music Player System Initializer"
echo "------------------------------------------"

# Function to clear out a port using cross-platform fallbacks (lsof, fuser)
free_port() {
    local port=$1
    if command -v lsof >/dev/null 2>&1; then
        if lsof -Pi :"$port" -sTCP:LISTEN -t >/dev/null ; then
            echo "⚠️ Port $port is currently blocked. Clearing old process..."
            kill -9 $(lsof -t -i:"$port") 2>/dev/null
            sleep 0.3
        fi
    elif command -v fuser >/dev/null 2>&1; then
        if fuser "$port"/tcp >/dev/null 2>&1; then
            echo "⚠️ Port $port is currently blocked. Clearing old process..."
            fuser -k "$port"/tcp >/dev/null 2>&1
            sleep 0.3
        fi
    fi
}

# 1. Port Conflict Guard
free_port 5000
free_port 5173

# 2. Dependency Verification Engine
echo "📦 Verifying project dependencies..."
if [ ! -d "$PROJECT_DIR/server/node_modules" ]; then
    echo "⚡ 'node_modules' missing in /server. Initializing backend installation..."
    (cd "$PROJECT_DIR/server" && npm install)
    echo "✅ Backend dependencies loaded."
    echo "------------------------------------------"
fi

if [ ! -d "$PROJECT_DIR/client/node_modules" ]; then
    echo "⚡ 'node_modules' missing in /client. Initializing frontend installation..."
    (cd "$PROJECT_DIR/client" && npm install)
    echo "✅ Frontend dependencies loaded."
    echo "------------------------------------------"
fi

# 3. Environment Configuration & Validation Engine
if [ ! -f "$ENV_PATH" ]; then
    echo "⚙️ First-time setup detected. Configuring your media profile..."
    echo ""
    
    while true; do
        read -p "📂 Enter your local music directories (separate multiple with commas): " USER_DIR
        
        # FIXED: Corrected syntax to check for non-empty string
        if [ -n "$USER_DIR" ]; then
            break
        fi
    done

    echo "MUSIC_DIR=$USER_DIR" > "$ENV_PATH"
    echo "PORT=5000" >> "$ENV_PATH"
    echo "✅ Configuration file successfully constructed inside server directory!"
    echo "--------------------------------------------------------------------------"
else
    # 🔄 Split and validate multiple directories individually
    CURRENT_MUSIC_RAW=$(grep -E "^MUSIC_DIR=" "$ENV_PATH" | cut -d'=' -f2-)
    
    # Process comma-separated string into a loop
    IFS=',' read -ra ADDR <<< "$CURRENT_MUSIC_RAW"
    for dir in "${ADDR[@]}"; do
        # Trim leading/trailing spaces
        dir=$(echo "$dir" | xargs)
        # Expand tilde if present
        dir="${dir/#\~/$HOME}"

        if [ ! -d "$dir" ] || [ -z "$dir" ]; then
            echo "❌ CRITICAL: One of your configured music folders does not exist!"
            echo "📍 Path missing: $dir"
            echo "💡 Please check your configuration inside: $ENV_PATH"
            exit 1
        fi
    done
fi

echo "🚀 Booting up local application engines..."

# FIXED: Moved trap definition BEFORE starting background processes 
# to guarantee cleanup if interrupted early.
trap "echo -e '\n🛑 Stopping engines and clearing runtime processes...'; kill \$SERVER_PID \$CLIENT_PID 2>/dev/null; exit" INT TERM

# 4. Start the backend server
cd "$PROJECT_DIR/server" || exit
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!

# 5. Start the Vite client frontend
cd "$PROJECT_DIR/client" || exit
npm run dev > /dev/null 2>&1 &
CLIENT_PID=$!

# Wait for Vite port bindings to initialize completely
sleep 1.5

URL="http://localhost:5173"

echo -e "\n======================================================="
echo -e "✅ Core engines running smoothly in the background!"
echo -e "🔗 Application UI Interface Link: $URL"
echo -e "🛑 To stop everything safely, press [Ctrl + C] here."
echo -e "=======================================================\n"

# 6. Automatic Browser Opener
if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL" >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then
    open "$URL" >/dev/null 2>&1 &
fi

# Keep the shell process open to track background threads
wait
