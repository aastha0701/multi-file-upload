document.addEventListener('DOMContentLoaded', function () {
  const viewAllButton = document.getElementById('viewAll');
  const fileListContainer = document.getElementById('fileList');
  const downloadSelectedButton = document.getElementById('downloadSelected');
  const downloadAllButton = document.getElementById('downloadAll');

  viewAllButton.addEventListener('click', function () {
    fetch('/files')
      .then(response => response.json())
      .then(files => {
        fileListContainer.innerHTML = '';
        files.forEach(file => {
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.name = 'selectedFiles';
          checkbox.value = file;

          const label = document.createElement('label');
          label.textContent = file;

          fileListContainer.appendChild(checkbox);
          fileListContainer.appendChild(label);
          fileListContainer.appendChild(document.createElement('br'));
        });
      })
      .catch(error => console.error('Error fetching files:', error));
  });

  downloadSelectedButton.addEventListener('click', function () {
    const selectedFiles = Array.from(document.querySelectorAll('input[name="selectedFiles"]:checked')).map(checkbox => checkbox.value);
    if (selectedFiles.length > 0) {
      window.location.href = `/download?files=${selectedFiles.join(',')}`;
    }
  });

  downloadAllButton.addEventListener('click', function () {
    window.location.href = '/download/all';
  });
});
