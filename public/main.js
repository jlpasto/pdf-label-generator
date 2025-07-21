document.addEventListener('DOMContentLoaded', function() {
  const templateSize = document.getElementById('templateSize');
  const bigLabelFields = document.getElementById('bigLabelFields');
  const smallLabelFields = document.getElementById('smallLabelFields');
  const addLabelBtn = document.getElementById('addLabelBtn');
  const labelsContainer = document.getElementById('labelsContainer');
  const form = document.getElementById('labelForm');
  const errorMsg = document.getElementById('errorMsg');

  let labelCount = 1;

  templateSize.addEventListener('change', function() {
    if (this.value === 'Big Labels') {
      bigLabelFields.style.display = '';
      smallLabelFields.style.display = 'none';
      // Remove required from all label inputs
      labelsContainer.querySelectorAll('input[name="labels"]').forEach(input => {
        input.required = false;
      });
      // Optionally, set required for title if needed
      document.getElementById('title').required = true;
    } else if (this.value === 'Small Labels') {
      bigLabelFields.style.display = 'none';
      smallLabelFields.style.display = '';
      // Set required for all label inputs
      labelsContainer.querySelectorAll('input[name="labels"]').forEach(input => {
        input.required = true;
      });
      document.getElementById('title').required = false;
    } else {
      bigLabelFields.style.display = 'none';
      smallLabelFields.style.display = 'none';
      // Remove required from all
      labelsContainer.querySelectorAll('input[name="labels"]').forEach(input => {
        input.required = false;
      });
      document.getElementById('title').required = false;
    }
    errorMsg.textContent = '';
  });

  addLabelBtn.addEventListener('click', function() {
    const inputs = labelsContainer.querySelectorAll('input[name="labels"]');
    if (inputs.length >= 12) return; // Max 12 for multi-page
    labelCount++;
    const label = document.createElement('label');
    label.textContent = `Label ${labelCount}:`;
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'labels';
    input.maxLength = 30;
    input.required = true;
    labelsContainer.appendChild(label);
    labelsContainer.appendChild(input);
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    errorMsg.textContent = '';
    const formData = new FormData(form);
    const template = formData.get('templateSize');
    if (!template) {
      errorMsg.textContent = 'Please select a template size.';
      return;
    }
    if (template === 'Big Labels') {
      if (!formData.get('title')) {
        errorMsg.textContent = 'Title is required for Big Labels.';
        return;
      }
    } else if (template === 'Small Labels') {
      const labels = formData.getAll('labels').filter(l => l.trim() !== '');
      if (labels.length === 0) {
        errorMsg.textContent = 'At least one label is required.';
        return;
      }
      if (labels.length > 12) {
        errorMsg.textContent = 'Maximum 12 labels allowed.';
        return;
      }
    }
    // Prepare data
    const data = {
      templateSize: formData.get('templateSize'),
      title: formData.get('title'),
      description: formData.get('description'),
      labels: formData.getAll('labels').filter(l => l.trim() !== '')
    };
    fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) throw new Error('PDF generation failed');
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'label.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch(err => {
      errorMsg.textContent = err.message;
    });
  });
}); 