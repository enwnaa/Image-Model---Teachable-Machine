// Your model URL from Teachable Machine
const URL = "https://teachablemachine.withgoogle.com/models/7QSQ5kA2O/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup the webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Grab webcam element and clear any placeholder text before appending
    const webcamBox = document.getElementById("webcam-container");
    webcamBox.innerHTML = ""; 
    webcamBox.appendChild(webcam.canvas);
    
    // Clear old labels if starting again, then create new label elements
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = ""; 
    for (let i = 0; i < maxPredictions; i++) { 
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// Run the webcam image through the image model
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        // Formats decimals (like 0.95) to clean percentages (95%)
        const percentage = (prediction[i].probability * 100).toFixed(0);
        const classPrediction = prediction[i].className + " 🎀 " + percentage + "%";
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
