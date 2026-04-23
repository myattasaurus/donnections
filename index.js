let donnections;

// Style variables (copied from CSS for use in JS)
let width = 90;
let gap = 1.5;
let vmin, cellWidth, cellPadding, cellFontSize, cellMaxTextWidth;

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
    let widthPixels = width * vmin;
    let gapPixels = gap * vmin;

    cellWidth = Math.floor((widthPixels - 3 * gapPixels) / 4);
    cellPadding = 0 * cellWidth;
    cellMaxTextWidth = paddedMaxTextWidth(cellWidth);
    // console.log('Width:', widthPixels, 'Gap:', gapPixels, 'Cell width:', cellWidth, 'Cell padding:', cellPadding, 'Cell max text width:', cellMaxTextWidth);
}

function paddedMaxTextWidth(thingWidth) {
    return Math.floor(thingWidth - 2 * cellPadding);
}

document.addEventListener('DOMContentLoaded', () => {
    // Set style variables
    onWindowResize();

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
        let modifyCell;
        if (modeButton.dataset.mode === 'edit') {
            modeButton.dataset.mode = 'play';
            e.target.innerText = 'Enter Words';
            modifyCell = makeCellColorable;
        } else {
            modeButton.dataset.mode = 'edit';
            e.target.innerText = 'Play';
            modifyCell = makeCellEditable;
        }
        document.querySelectorAll('.cell').forEach(cell => {
            setWord(cell, getWord(cell));
            modifyCell(cell);
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

        // Set word
        setWord(cell, donnections.words[row][col]);
        adjustFontSize({ target: cell });

        // Set cell properties based on mode
        modifyCell(cell);
    });

    // Clear button
    let clearButton = document.getElementById('clear');
    clearButton.addEventListener('click', e => {
        if (modeButton.dataset.mode === 'edit') {
            cells.forEach(cell => setWord(cell, ''));
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
        donnections.words[row][col] = getWord(cell);

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

function makeCellEditable(cell) {
    cell.setAttribute('contenteditable', 'true');
    cell.setAttribute('inputmode', 'text');
    cell.setAttribute('enterkeyhint', isFinalCell(cell) ? 'go' : 'next');
    cell.removeEventListener('click', recolorCell);
    cell.addEventListener('focus', editCell);
    cell.addEventListener('input', adjustFontSize);
    cell.addEventListener('keydown', onCellKeydown);
    return cell;
}

function makeCellColorable(cell) {
    cell.setAttribute('contenteditable', 'false');
    cell.removeAttribute('inputmode');
    cell.removeAttribute('enterkeyhint');
    cell.addEventListener('click', recolorCell);
    cell.removeEventListener('focus', editCell);
    cell.removeEventListener('input', adjustFontSize);
    cell.removeEventListener('keydown', onCellKeydown);
    return cell;
}

function onCellKeydown(e) {
    if (e.key === 'Enter') {
        let cell = e.currentTarget;
        e.preventDefault();
        if (isFinalCell(cell)) {
            document.getElementById('mode').click();
        } else {
            // Focus next cell
            let row = getRow(cell);
            let col = getCol(cell);

            let next = 4 * row + col + 1;
            if (next >= 16) {
                next = 0;
            }
            let nextRow = Math.floor(next / 4);
            let nextCol = next % 4;

            let nextCell = document.querySelector(
                `.row[data-row="${nextRow}"] .cell[data-col="${nextCol}"]`
            );

            if (nextCell) {
                nextCell.focus();
            } else {
                cell.blur();
            }
            saveData();
        }
    }
}

function adjustFontSize(e) {
    let cell = e.target;
    let fontSize = 3.5;
    do {
        cell.style.fontSize = `${fontSize}vmin`;
        fontSize -= 0.1;
    } while (paddedMaxTextWidth(cell.scrollWidth) > cellMaxTextWidth && fontSize > 0);
}

function recolorCell(e) {
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

function editCell(e) {
    let cell = e.currentTarget;

    if (getWord(cell) !== '') {
        let range = document.createRange();
        range.selectNodeContents(cell);
        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function clearColorClasses(cell) {
    cell.classList.remove(...donnections.colors);
}

function getWord(cell) {
    return cell.innerText.toUpperCase().trim();
}

function setWord(cell, word) {
    if (!word || word.trim() === '') {
        word = '&nbsp;';
    }
    cell.innerHTML = word;
}

function setColoring(cell, color) {
    cell.classList.add(color);
}

function isFinalCell(cell) {
    return getRow(cell) === 3 && getCol(cell) === 3;
}

function getRow(cell) {
    return Number(cell.parentElement.dataset.row);
}

function getCol(cell) {
    return Number(cell.dataset.col);
}