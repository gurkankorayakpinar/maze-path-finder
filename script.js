const mazeContainer = document.getElementById('maze-container');
const distanceElement = document.getElementById('distance');
const refreshBtn = document.getElementById('refreshBtn');
const size = 35; // Maze size (35x35) - Tek sayı olması şart!

let maze = [];

// Create empty maze grid
function createMaze() {
    maze = [];
    for (let i = 0; i < size; i++) {
        maze[i] = [];
        for (let j = 0; j < size; j++) {
            maze[i][j] = 1; // Default is wall (1)
        }
    }
}

// Function to generate the maze (same as before)
function generateMaze(x, y) {
    maze[x][y] = 0; // Path (0)

    const directions = [
        [-2, 0], [2, 0], [0, -2], [0, 2]
    ];
    directions.sort(() => Math.random() - 0.5);  // Shuffle

    for (let dir of directions) {
        const nx = x + dir[0];
        const ny = y + dir[1];

        if (nx >= 0 && ny >= 0 && nx < size && ny < size && maze[nx][ny] === 1) {
            maze[nx][ny] = 0;
            maze[x + dir[0] / 2][y + dir[1] / 2] = 0; // Carve wall between
            generateMaze(nx, ny); // Recursively generate maze
        }
    }
}

// Function to randomly place blue and red squares (ensure they are on paths)
function placeStartAndEnd() {
    let startPlaced = false;
    let endPlaced = false;
    let startX, startY, endX, endY;

    while (!startPlaced || !endPlaced) {
        if (!startPlaced) {
            startX = Math.floor(Math.random() * size);
            startY = Math.floor(Math.random() * size);
            if (maze[startX][startY] === 0) { // If it's a path
                startPlaced = true;
            }
        }

        if (!endPlaced) {
            endX = Math.floor(Math.random() * size);
            endY = Math.floor(Math.random() * size);
            if (maze[endX][endY] === 0 && (startX !== endX || startY !== endY)) { // If it's a path and not the same as start
                endPlaced = true;
            }
        }
    }

    return { startX, startY, endX, endY };
}

// DFS Algorithm to find the path
function dfs(x, y, endX, endY, visited, path) {
    if (x < 0 || y < 0 || x >= size || y >= size || maze[x][y] === 1 || visited[x][y]) {
        return false; // Out of bounds or already visited or wall
    }

    visited[x][y] = true;
    path.push({ x, y });

    if (x === endX && y === endY) {
        return true;
    }

    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
    ];

    for (let dir of directions) {
        const nx = x + dir[0];
        const ny = y + dir[1];

        if (dfs(nx, ny, endX, endY, visited, path)) {
            return true;
        }
    }

    path.pop();
    return false;
}

// Render the maze with start and end
function renderMaze() {
    mazeContainer.innerHTML = '';  // Clear the container first
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (maze[i][j] === 1) {
                cell.classList.add('wall');
            }
            mazeContainer.appendChild(cell);
        }
    }

    const { startX, startY, endX, endY } = placeStartAndEnd();
    const cells = document.querySelectorAll('.cell');
    const startCell = cells[startX * size + startY];
    const endCell = cells[endX * size + endY];

    startCell.classList.add('start');
    endCell.classList.add('end');

    const visited = Array.from({ length: size }, () => Array(size).fill(false));
    const path = [];

    if (dfs(startX, startY, endX, endY, visited, path)) {
        path.slice(1, path.length - 1).forEach(({ x, y }) => {
            const pathCell = cells[x * size + y];
            pathCell.classList.add('path');
        });
        distanceElement.textContent = `Mesafe: ${path.length - 2} birim`;
    } else {
        distanceElement.textContent = "Mesafe: Yol bulunamadı";
    }
}

// Start generating the maze
createMaze();
generateMaze(1, 1);
renderMaze();

// Button action for refresh
refreshBtn.addEventListener('click', () => {
    createMaze();  // Reset the maze array
    generateMaze(1, 1);  // Regenerate the maze
    renderMaze();  // Re-render the maze
});

// "Sağ tık ile menü açma" özelliği devre dışı
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});