var polygons = [];


setTimeout(function() {
    var iframe = document.getElementById('iframe360');
    var iframeContent = iframe.contentDocument || iframe.contentWindow.document;
    // Die Polygone im Iframe finden und im Array speichern
    polygons = Array.from(iframeContent.querySelectorAll('polygon'));

    console.log(polygons);
}, 1000); // 1000 Millisekunden entsprechen 1 Sekunde

// Funktion zum Aktualisieren des Alpha-Wertes eines bestimmten Polygons
function updatePolygonAlpha(index, alpha) {
    if (polygons[index]) {
        var currentFill = polygons[index].getAttribute('fill');
        var rgbaComponents = currentFill.match(/rgba\((\d+),(\d+),(\d+),([\d.]+)\)/);
        if (rgbaComponents) {
            var updatedFill = `rgba(${rgbaComponents[1]},${rgbaComponents[2]},${rgbaComponents[3]},${alpha})`;
            polygons[index].setAttribute('fill', updatedFill);
        }
    }
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('popupOverlay').style.display = 'none'; // Verstecke das Overlay
}


window.onload = function() {
    document.getElementById('popup').style.display = 'flex';
    document.getElementById('popupOverlay').style.display = 'block'; // Zeige das Overlay

    // Schließt das Popup, wenn auf das Overlay geklickt wird
    document.getElementById('popupOverlay').addEventListener('click', closePopup);
}