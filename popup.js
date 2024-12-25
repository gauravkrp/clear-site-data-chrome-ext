document.getElementById('clearData').addEventListener('click', async () => {
	const button = document.getElementById('clearData');
	const status = document.getElementById('status');
	const spinner = document.getElementById('spinner');
	const reloadToggle = document.getElementById('reloadTab');
	
	// Disable button and show spinner
	button.disabled = true;
	spinner.classList.add('show');
	status.textContent = 'Clearing...';
	status.className = 'status';

	try {
		// Get the current tab's URL
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		const url = new URL(tab.url);
		const origin = url.origin;
		
		// Clear data only for the current site
		await chrome.browsingData.remove({
			"origins": [origin],
			"since": 0
		}, {
			"cache": true,
			"cookies": true,
			"localStorage": true,
			"webSQL": true,
			"indexedDB": true
		});

		// Show success message
		spinner.classList.remove('show');
		status.textContent = 'Site data cleared!';
		status.classList.add('success');

		// Reload tab if toggle is checked
		if (reloadToggle.checked) {
			await chrome.tabs.reload(tab.id);
		}

		// Auto close popup after success
		setTimeout(() => {
			window.close();
		}, 1000);

	} catch (error) {
		// Show error message
		spinner.classList.remove('show');
		status.textContent = 'Error: ' + error.message;
		status.classList.add('error');
		
		// Reset after 1.5 seconds
		setTimeout(() => {
			status.textContent = '';
			status.className = 'status';
			button.disabled = false;
		}, 1500);
	}
});

// Save toggle state
document.getElementById('reloadTab').addEventListener('change', (e) => {
	chrome.storage.local.set({ reloadTabEnabled: e.target.checked });
});

// Load saved toggle state
document.addEventListener('DOMContentLoaded', async () => {
	const { reloadTabEnabled = true } = await chrome.storage.local.get('reloadTabEnabled');
	document.getElementById('reloadTab').checked = reloadTabEnabled;
});
