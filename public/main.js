document.addEventListener('DOMContentLoaded', function() {
  const templateSize = document.getElementById('templateSize');
  const bigLabelFields = document.getElementById('bigLabelFields');
  const smallLabelFields = document.getElementById('smallLabelFields');
  const addLabelBtn = document.getElementById('addLabelBtn');
  const labelsContainer = document.getElementById('labelsContainer');
  const form = document.getElementById('labelForm');
  const errorMsg = document.getElementById('errorMsg');

  let labelCount = 1;

  // --- Big Labels dynamic add/remove ---
  const bigLabelsContainer = document.getElementById('bigLabelsContainer');
  const addBigLabelBtn = document.getElementById('addBigLabelBtn');

  function updateBigLabelRemoveButtons() {
    const sets = bigLabelsContainer.querySelectorAll('.big-label-set');
    sets.forEach((set, idx) => {
      // Update group title
      let groupTitle = set.querySelector('.big-label-group-title');
      if (!groupTitle) {
        groupTitle = document.createElement('div');
        groupTitle.className = 'big-label-group-title';
        groupTitle.style.fontWeight = 'bold';
        groupTitle.style.marginBottom = '4px';
        set.insertBefore(groupTitle, set.firstChild);
      }
      groupTitle.textContent = `Label ${idx + 1}`;
      // Remove button logic
      let btn = set.querySelector('.remove-big-label-btn');
      if (btn) btn.remove();
      btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = '×';
      btn.className = 'remove-big-label-btn';
      btn.style.width = '28px';
      btn.style.height = '28px';
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
      btn.style.marginLeft = '8px';
      btn.addEventListener('click', function() {
        set.remove();
        updateBigLabelRemoveButtons();
      });
      set.appendChild(btn);
      // Style the set container
      set.style.border = '1px solid #ccc';
      set.style.padding = '12px';
      set.style.marginBottom = '12px';
      set.style.borderRadius = '6px';
      set.style.background = '#fafbfc';
      set.style.position = 'relative';
      // Place the button in the top right corner
      btn.style.position = 'absolute';
      btn.style.top = '8px';
      btn.style.right = '8px';
    });
  }

  addBigLabelBtn.addEventListener('click', function() {
    const sets = bigLabelsContainer.querySelectorAll('.big-label-set');
    if (sets.length >= 30) {
      errorMsg.textContent = 'Maximum 30 Big Labels allowed.';
      return;
    }
    errorMsg.textContent = '';
    const setDiv = document.createElement('div');
    setDiv.className = 'big-label-set';
    setDiv.style.marginTop = '12px';
    setDiv.innerHTML = `
      <label>Title:</label>
      <input type="text" class="title" name="title" maxlength="50" required>
      <label>Short Description:</label>
      <input type="text" class="description" name="description" maxlength="100" required>
    `;
    bigLabelsContainer.appendChild(setDiv);
    updateBigLabelRemoveButtons();
  });

  // Initial call
  updateBigLabelRemoveButtons();

  // --- Update required attributes for Big/Small Labels on template change ---
  templateSize.addEventListener('change', function() {
    if (this.value === 'Big Labels') {
      bigLabelFields.style.display = '';
      smallLabelFields.style.display = 'none';
      // Remove required from all label inputs
      labelsContainer.querySelectorAll('input[name="labels"]').forEach(input => {
        input.required = false;
      });
      // Set required for all big label fields
      bigLabelsContainer.querySelectorAll('input').forEach(input => {
        input.required = true;
      });
    } else if (this.value === 'Small Labels') {
      bigLabelFields.style.display = 'none';
      smallLabelFields.style.display = '';
      // Set required for all label inputs
      labelsContainer.querySelectorAll('input[name="labels"]').forEach(input => {
        input.required = true;
      });
      // Remove required from all big label fields
      bigLabelsContainer.querySelectorAll('input').forEach(input => {
        input.required = false;
      });
    } else {
      bigLabelFields.style.display = 'none';
      smallLabelFields.style.display = 'none';
      // Remove required from all
      labelsContainer.querySelectorAll('input[name="labels"]').forEach(input => {
        input.required = false;
      });
      bigLabelsContainer.querySelectorAll('input').forEach(input => {
        input.required = false;
      });
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
    if (labelDivs.length >= 30) return; // Max 30 for multi-page
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

  // --- Update form submission for Big Labels ---
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
      // Collect all big label sets
      const titles = Array.from(bigLabelsContainer.querySelectorAll('input.title')).map(i => i.value.trim());
      const descriptions = Array.from(bigLabelsContainer.querySelectorAll('input.description')).map(i => i.value.trim());
      if (titles.length > 30) {
        errorMsg.textContent = 'Maximum 30 Big Labels allowed.';
        return;
      }
      if (titles.some(t => !t)) {
        errorMsg.textContent = 'All Title fields are required for Big Labels.';
        return;
      }
      if (descriptions.some(d => !d)) {
        errorMsg.textContent = 'All Description fields are required for Big Labels.';
        return;
      }
      // Prepare data
      const data = {
        templateSize: 'Big Labels',
        titles,
        descriptions
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
      return;
    }
    if (template === 'Small Labels') {
      const labels = formData.getAll('labels').filter(l => l.trim() !== '');
      if (labels.length === 0) {
        errorMsg.textContent = 'At least one label is required.';
        return;
      }
      if (labels.length > 30) {
        errorMsg.textContent = 'Maximum 30 labels allowed.';
        return;
      }
      // Prepare data
      const data = {
        templateSize: 'Small Labels',
        labels
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
      return;
    }
  });
}); 