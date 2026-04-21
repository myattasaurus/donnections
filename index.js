let donnections;

document.addEventListener('DOMContentLoaded', () => {
    // Model
    donnections = localStorage.getItem('donnections');
    if (!donnections) {
        donnections = {
            words: [
                ["", "", "", ""],
                ["", "", "", ""],
                ["", "", "", ""],
                ["", "", "", ""]
            ],
            colorings: [
                ["ungrouped", "ungrouped", "ungrouped", "ungrouped"],
                ["ungrouped", "ungrouped", "ungrouped", "ungrouped"],
                ["ungrouped", "ungrouped", "ungrouped", "ungrouped"],
                ["ungrouped", "ungrouped", "ungrouped", "ungrouped"]
            ],
            colors: ['ungrouped', 'yellow', 'green', 'blue', 'purple'],
            selectedColor: 'yellow',
            mode: 'edit'
        };
    } else {
        donnections = JSON.parse(donnections);
    }

    // Color buttons
    let colorButtons = document.querySelectorAll('.color-button');
    colorButtons.forEach(button => {
        // Set selected color
        if (button.id === donnections.selectedColor) {
            button.classList.add('color-selected');
        } else {
            button.classList.remove('color-selected');
        }

        // Set selected color on click
        button.addEventListener('click', () => {
            colorButtons.forEach(b => b.classList.remove('color-selected'));
            button.classList.add('color-selected');
            donnections.selectedColor = button.id;
            saveData();
        });
    });

    // Mode button
    let modifyCell;
    let modeButton = document.getElementById('mode');
    modeButton.dataset.mode = donnections.mode;
    if (modeButton.dataset.mode === 'play') {
        modeButton.innerText = 'Enter Words';
        modifyCell = makeCellColorable;
    } else {
        modeButton.innerText = 'Play';
        modifyCell = makeCellEditable;
    }
    modeButton.addEventListener('click', e => {
        let modifyCell, getWord;
        if (modeButton.dataset.mode === 'edit') {
            modeButton.dataset.mode = 'play';
            e.target.innerText = 'Enter Words';
            modifyCell = makeCellColorable;
            getWord = cell => cell.firstChild.value.toUpperCase().trim();
        } else {
            modeButton.dataset.mode = 'edit';
            e.target.innerText = 'Play';
            modifyCell = makeCellEditable;
            getWord = cell => cell.firstChild.innerText;
        }
        document.querySelectorAll('.cell').forEach(cell => {
            cell.appendChild(modifyCell(cell, getWord(cell)));
            cell.firstChild.remove();
        });
        saveData();
    });

    // Cells
    let cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        let row = getRow(cell);
        let col = getCol(cell);

        // Set coloring
        cell.classList.add(donnections.colorings[row][col]);

        // Set word and cell properties based on mode
        let word = donnections.words[row][col];
        cell.appendChild(modifyCell(cell, word));
    });

    // Clear button
    let clearButton = document.getElementById('clear');
    clearButton.addEventListener('click', e => {
        if (modeButton.dataset.mode === 'edit') {
            cells.forEach(cell => cell.firstChild.value = '');
        }
        cells.forEach(cell => {
            clearColorClasses(cell);
            setColoring(cell, 'ungrouped');
        });
        saveData();
    });
});

function saveData() {
    // Set mode
    donnections.mode = document.getElementById('mode').dataset.mode;

    document.querySelectorAll('.cell').forEach(cell => {
        let row = getRow(cell);
        let col = getCol(cell);

        // Set word
        if (donnections.mode === 'edit') {
            donnections.words[row][col] = cell.firstChild.value.toUpperCase().trim();
        } else {
            donnections.words[row][col] = cell.firstChild.innerText;
        }

        // Set colorings
        for (let color of donnections.colors) {
            if (cell.classList.contains(color)) {
                donnections.colorings[row][col] = color;
                break;
            }
        }
    });

    localStorage.setItem('donnections', JSON.stringify(donnections));
}

function makeCellEditable(cell, word) {
    let element = document.createElement('input');
    element.type = 'text';
    element.value = word;
    cell.removeEventListener('click', clickCell);
    return element;
}

function makeCellColorable(cell, word) {
    let element = document.createElement('span');
    element.textContent = word;
    cell.addEventListener('click', clickCell);
    return element;
}

function clickCell(e) {
    if (!donnections.selectedColor) return;

    let cell = e.currentTarget;

    if (cell.classList.contains(donnections.selectedColor)) {
        clearColorClasses(cell);
        setColoring(cell, 'ungrouped');
    } else {
        clearColorClasses(cell);
        setColoring(cell, donnections.selectedColor);
    }
    saveData();
}

function clearColorClasses(cell) {
    cell.classList.remove(...donnections.colors);
}

function setColoring(cell, color) {
    cell.classList.add(color);
}

function getRow(cell) {
    return Number(cell.parentElement.dataset.row);
}

function getCol(cell) {
    return Number(cell.dataset.col);
}