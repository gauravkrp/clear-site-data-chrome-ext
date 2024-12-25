document.getElementById('clearData').addEventListener('click', async () => {
	const button = document.getElementById('clearData');
	const status = document.getElementById('status');
	const spinner = document.getElementById('spinner');
	
	// Disable button and show spinner
	button.disabled = true;
	spinner.classList.add('show');
	status.textContent = 'Clearing...';
	status.className = 'status';

	try {
		// Get the current tab's URL
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		const url = new URL(tab.url);
		const origin = url.origin;  // This gets just the protocol + domain (e.g., https://example.com)
		
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

		// Reset after 2 seconds
		setTimeout(() => {
			status.textContent = '';
			status.className = 'status';
			button.disabled = false;
		}, 2000);
	} catch (error) {
		// Show error message
		spinner.classList.remove('show');
		status.textContent = 'Error: ' + error.message;
		status.classList.add('error');
		
		// Reset after 3 seconds
		setTimeout(() => {
			status.textContent = '';
			status.className = 'status';
			button.disabled = false;
		}, 3000);
	}
});
