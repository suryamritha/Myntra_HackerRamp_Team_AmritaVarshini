let currentOutfitName = '';

function loadImages(event) {
  const files = event.target.files;
  const canvas = document.getElementById('canvas');

  for (const file of files) {
    const imgWrapper = document.createElement('div');
    imgWrapper.classList.add('draggable', 'resizable');
    imgWrapper.setAttribute('data-filename', file.name);

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.onload = () => URL.revokeObjectURL(img.src); // Free memory

    imgWrapper.appendChild(img);
    canvas.appendChild(imgWrapper);

    // Add resize handles
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'interact-resize-handle bottom-right';
    imgWrapper.appendChild(resizeHandle);

    // Enable drag-and-drop functionality
    interact(imgWrapper).draggable({
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          // Translate the element
          target.style.transform = `translate(${x}px, ${y}px)`;

          // Update the position attributes
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      }
    }).resizable({
      edges: { left: false, right: true, bottom: true, top: false },
      listeners: {
        move(event) {
          const target = event.target;
          let x = parseFloat(target.getAttribute('data-x')) || 0;
          let y = (parseFloat(target.getAttribute('data-y')) || 0);

          // Update the element's style
          target.style.width = `${event.rect.width}px`;
          target.style.height = `${event.rect.height}px`;

          // Translate when resizing from top or left edges
          x += event.deltaRect.left;
          y += event.deltaRect.top;

          target.style.transform = `translate(${x}px, ${y}px)`;

          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      }
    });
  }
}

function showSaveDialog() {
  document.getElementById('saveDialog').style.display = 'block';
}

function closeDialog() {
  document.getElementById('saveDialog').style.display = 'none';
}

function confirmSave() {
  const outfitName = document.getElementById('outfitName').value.trim();
  if (outfitName === '') {
    alert('Please enter a name for the outfit.');
    return;
  }

  const canvas = document.getElementById('canvas');
  html2canvas(canvas).then(canvas => {
    const imgData = canvas.toDataURL('image/png');

    const savedOutfits = JSON.parse(localStorage.getItem('savedOutfits')) || {};
    savedOutfits[outfitName] = imgData;
    localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));

    addToSidebar(outfitName);

    document.getElementById('outfitName').value = '';
    closeDialog();
  });
}

function addToSidebar(name) {
  const savedOutfitsDiv = document.getElementById('saved-outfits');
  const outfitDiv = document.createElement('div');
  outfitDiv.textContent = name;
  outfitDiv.onclick = () => loadOutfit(name);
  savedOutfitsDiv.appendChild(outfitDiv);
}

function loadOutfit(name) {
  const savedOutfits = JSON.parse(localStorage.getItem('savedOutfits')) || {};
  const imgData = savedOutfits[name];

  const canvas = document.getElementById('canvas');
  canvas.innerHTML = '';

  const imgWrapper = document.createElement('div');
  imgWrapper.classList.add('draggable', 'resizable');
  imgWrapper.setAttribute('data-filename', name);

  const img = document.createElement('img');
  img.src = imgData;

  imgWrapper.appendChild(img);
  canvas.appendChild(imgWrapper);

  // Add resize handles
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'interact-resize-handle bottom-right';
  imgWrapper.appendChild(resizeHandle);

  // Enable drag-and-drop functionality
  interact(imgWrapper).draggable({
    listeners: {
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // Translate the element
        target.style.transform = `translate(${x}px, ${y}px)`;

        // Update the position attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
    }
  }).resizable({
    edges: { left: false, right: true, bottom: true, top: false },
    listeners: {
      move(event) {
        const target = event.target;
        let x = parseFloat(target.getAttribute('data-x')) || 0;
        let y = (parseFloat(target.getAttribute('data-y')) || 0);

        // Update the element's style
        target.style.width = `${event.rect.width}px`;
        target.style.height = `${event.rect.height}px`;

        // Translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.transform = `translate(${x}px, ${y}px)`;

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
    }
  });
}

function clearCanvas() {
  document.getElementById('canvas').innerHTML = '';
}

function shareOutfit() {
  const canvas = document.getElementById('canvas');
  html2canvas(canvas).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const shareLink = document.createElement('a');
    shareLink.href = imgData;
    shareLink.download = 'outfit.png';
    shareLink.textContent = 'Download and share this outfit';
    document.body.appendChild(shareLink);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const savedOutfits = JSON.parse(localStorage.getItem('savedOutfits')) || {};
  for (const name in savedOutfits) {
    addToSidebar(name);
  }
});
