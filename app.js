const version = "v0.0.13";
const dest = document.getElementById("result");
const camera = document.getElementsByClassName("camera")[0];
let interval;
let scannedValues = [];

if (!("BarcodeDetector" in globalThis)) {
	dest.innerHTML = "Barcode Detector is not supported by this browser.";
	camera.style.display = "none";
}
else {

	const barcodeDetector = new BarcodeDetector({ formats: ["qr_code"] });

	navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } })
		.then(function(stream) {
			localStream = stream;
			camera.srcObject = stream;

			interval = setInterval(function() {
				barcodeDetector
					.detect(camera)
					.then((barcodes) => {
						barcodes.forEach((barcode) => {
							if (!scannedValues.includes(barcode.rawValue)) {
								dest.innerHTML = barcode.rawValue + "<br />" + dest.innerHTML;
								scannedValues.push(barcode.rawValue);
							}
						});
					})
					.catch((err) => {
						dest.innerHTML += "<br />" + err;
					});
			}, 500);
		}).catch(function(err) {
			console.error('getUserMediaError', err, err.stack);
			alert(err.message);
		});
}