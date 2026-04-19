document.addEventListener('DOMContentLoaded', adjustFontSize);

function adjustFontSize() {
    const cells = document.querySelectorAll('.cell');
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