class EditMode {
    populate() {
        let spans = document.querySelectorAll('.cell span');
        spans.forEach(span => {
            let word = span.textContent;
            let input = document.createElement('input');
            input.type = 'text';
            input.value = word;
            span.parentElement.appendChild(input);
            span.remove();
        });
        document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', clickCell));
    }

    clear() {
        let inputs = document.querySelectorAll('.cell input');
        inputs.forEach(input => {
            input.value = '';
        });
    }
}

class PlayMode {

    constructor() {
        this.colors = [];
        document.querySelectorAll('.color-button').forEach(button => this.colors.push(button.id));
    }

    populate() {
        let inputs = document.querySelectorAll('.cell input');
        inputs.forEach(input => {
            let word = input.value.toUpperCase().trim();
            let span = document.createElement('span');
            span.textContent = word;
            input.parentElement.appendChild(span);
            input.remove();
        });
        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', clickCell));
    }

    clear() {
        let cells = document.querySelectorAll('.cell:not(.ungrouped)');
        cells.forEach(cell => {
            cell.classList.remove(...this.colors);
            cell.classList.add('ungrouped');
        });
    }
}

let mode, playMode, editMode;
let selectedColor = null;


document.addEventListener('DOMContentLoaded', init);


function init() {
    toggleMode();
    colorButtons();
    clearButton();
}

function toggleMode() {
    playMode = new PlayMode();
    editMode = new EditMode();

    let modeButton = document.getElementById('mode')
    modeButton.addEventListener('click', e => {
        if (e.target.innerText === 'Enter Words') {
            e.target.innerText = 'Play';
            mode = editMode;
        } else {
            e.target.innerText = 'Enter Words';
            mode = playMode;
        }
        mode.populate();
    });
}

function colorButtons() {
    let buttons = document.querySelectorAll('.color-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('color-selected'));
            button.classList.add('color-selected');
            selectedColor = button.id;
        });
    });
    selectedColor = document.querySelector('.color-selected').id;
}

function clearButton() {
    let button = document.getElementById('clear');
    button.addEventListener('click', () => {
        mode.clear();
    });
}

function clickCell(e) {
    let cell = e.currentTarget;
    if (!selectedColor) return;
    if (cell.classList.contains(selectedColor)) {
        cell.classList.remove(selectedColor);
        cell.classList.add('ungrouped');
        return;
    } else if (cell.classList.contains('ungrouped')) {
        cell.classList.remove('ungrouped');
        cell.classList.add(selectedColor);
        return;
    } else {
        cell.classList.remove(...mode.colors);
        cell.classList.add(selectedColor);
        return;
    }
}