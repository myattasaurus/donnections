document.addEventListener('DOMContentLoaded', adjustFontSize);
document.addEventListener('DOMContentLoaded', toggleMode);

function adjustFontSize() {
    let cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        let fontSize = 16; // starting font size
        cell.style.fontSize = fontSize + 'px';
        // Check if text fits
        while ((cell.scrollWidth > cell.clientWidth || cell.scrollHeight > cell.clientHeight) && fontSize > 8) {
            fontSize -= 1;
            cell.style.fontSize = fontSize + 'px';
        }
    });
}

function toggleMode() {
    document.getElementById('mode').addEventListener('click', e => {
        if (e.target.innerText === 'Enter Words') {
            e.target.innerText = 'Play';
            editWords();
        } else {
            e.target.innerText = 'Enter Words';
            readOnlyWords();
        }
    });
}

function readOnlyWords() {
    let inputs = document.querySelectorAll('.cell input');
    inputs.forEach(input => {
        let word = input.value.toUpperCase().trim();
        let span = document.createElement('span');
        span.textContent = word;
        input.parentElement.appendChild(span);
        input.remove();
    });
}

function editWords() {
    let spans = document.querySelectorAll('.cell span');
    spans.forEach(span => {
        let word = span.textContent;
        let input = document.createElement('input');
        input.type = 'text';
        input.value = word;
        span.parentElement.appendChild(input);
        span.remove();
    });
}