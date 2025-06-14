// Generate a new K/BAN
async function generateKban() {
  const response = await fetch('/api/kban/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  console.log('Generated K/BAN:', data.kban);
}

// Validate a K/BAN
async function validateKban(kban: string) {
  const response = await fetch('/api/kban/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kban })
  });
  const data = await response.json();
  console.log('Is K/BAN valid?', data.valid);
}

// Generate a PKPass for a K/BAN
async function createPass(kban: string) {
  const response = await fetch('/api/pass/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kban })
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kban}.pkpass`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } else {
    console.error('Failed to generate PKPass');
  }
}
