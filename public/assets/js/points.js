const points = (function() {
	setInterval(function() {
		console.log('working?')
		if (AdBlockEnabled == false) {
			const request = new XMLHttpRequest();
			const url = window.location.origin + '/gibcoins';
			request.open('get', url);
			console.log('it sent doe');
			request.onreadystatechange = () => {
				if (request.status == 200) {
					document.getElementById('points').innerHTML = request.responseText;
				}
			};
		}
		else {
			document.getElementById('points').innerHTML = 'Disabled your ad blocker first 🙄';
		}
	}, 5000);
})();