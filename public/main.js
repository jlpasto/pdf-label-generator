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
      // Set required for title and description
      document.getElementById('title').required = true;
      document.getElementById('description').required = true;
    } else if (this.value === 'Small Labels') {
      bigLabelFields.style.display = 'none';
      smallLabelFields.style.display = '';
      // Set required for all label inputs
      labelsContainer.querySelectorAll('input[name="labels"]').forEach(input => {
        input.required = true;
      });
      // Remove required from title and description
      document.getElementById('title').required = false;
      document.getElementById('description').required = false;
    } else {
      bigLabelFields.style.display = 'none';
      smallLabelFields.style.display = 'none';
      // Remove required from all
      labelsContainer.querySelectorAll('input[name="labels"]').forEach(input => {
        input.required = false;
      });
      document.getElementById('title').required = false;
      document.getElementById('description').required = false;
    }
    errorMsg.textContent = '';
  });

  function updateRemoveButtons() {
    const labelDivs = labelsContainer.querySelectorAll('.label-input-group');
    // Remove all existing remove buttons
    labelsContainer.querySelectorAll('.remove-label-btn').forEach(btn => btn.remove());
    if (labelDivs.length > 1) {
      // Add remove button to the last label group
      const lastDiv = labelDivs[labelDivs.length - 1];
      const btnContainer = lastDiv.querySelector('.remove-label-btn-container');
      btnContainer.innerHTML = '';
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = '×';
      removeBtn.className = 'remove-label-btn';
      removeBtn.style.width = '28px';
      removeBtn.style.height = '28px';
      removeBtn.style.display = 'flex';
      removeBtn.style.alignItems = 'center';
      removeBtn.style.justifyContent = 'center';
      removeBtn.addEventListener('click', function() {
        lastDiv.remove();
        updateRemoveButtons();
        labelCount = labelsContainer.querySelectorAll('.label-input-group').length;
      });
      btnContainer.appendChild(removeBtn);
    }
    // Clear all other btn containers
    for (let i = 0; i < labelDivs.length - 1; i++) {
      const btnContainer = labelDivs[i].querySelector('.remove-label-btn-container');
      if (btnContainer) btnContainer.innerHTML = '';
    }
  }

  addLabelBtn.addEventListener('click', function() {
    const labelDivs = labelsContainer.querySelectorAll('.label-input-group');
    if (labelDivs.length >= 12) return; // Max 12 for multi-page
    labelCount++;
    const groupDiv = document.createElement('div');
    groupDiv.className = 'label-input-group';
    groupDiv.style.display = 'flex';
    groupDiv.style.alignItems = 'center';
    groupDiv.style.gap = '8px';
    const label = document.createElement('label');
    label.textContent = `Label ${labelCount}:`;
    label.style.marginRight = '4px';
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';
    inputContainer.style.flex = '1';
    inputContainer.style.display = 'flex';
    inputContainer.style.alignItems = 'center';
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'labels';
    input.maxLength = 30;
    input.required = true;
    input.style.width = '100%';
    inputContainer.appendChild(input);
    const btnContainer = document.createElement('div');
    btnContainer.className = 'remove-label-btn-container';
    btnContainer.style.width = '40px';
    btnContainer.style.display = 'flex';
    btnContainer.style.alignItems = 'center';
    btnContainer.style.justifyContent = 'center';
    groupDiv.appendChild(label);
    groupDiv.appendChild(inputContainer);
    groupDiv.appendChild(btnContainer);
    labelsContainer.appendChild(groupDiv);
    updateRemoveButtons();
  });

  // Refactor initial label to be in a group div with input and button container
  (function refactorInitialLabel() {
    const firstLabel = labelsContainer.querySelector('label');
    const firstInput = labelsContainer.querySelector('input[name="labels"]');
    const groupDiv = document.createElement('div');
    groupDiv.className = 'label-input-group';
    groupDiv.style.display = 'flex';
    groupDiv.style.alignItems = 'center';
    groupDiv.style.gap = '8px';
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';
    inputContainer.style.flex = '1';
    inputContainer.style.display = 'flex';
    inputContainer.style.alignItems = 'center';
    firstInput.style.width = '100%';
    inputContainer.appendChild(firstInput);
    const btnContainer = document.createElement('div');
    btnContainer.className = 'remove-label-btn-container';
    btnContainer.style.width = '40px';
    btnContainer.style.display = 'flex';
    btnContainer.style.alignItems = 'center';
    btnContainer.style.justifyContent = 'center';
    groupDiv.appendChild(firstLabel);
    groupDiv.appendChild(inputContainer);
    groupDiv.appendChild(btnContainer);
    labelsContainer.appendChild(groupDiv);
  })();
  // Remove old label/input nodes if still present
  Array.from(labelsContainer.childNodes).forEach(node => {
    if (node.nodeType === 1 && !node.classList.contains('label-input-group')) {
      node.remove();
    }
  });
  updateRemoveButtons();

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