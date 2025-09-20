const canvas = document.getElementById("myCanvas"),
    toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker"),
    clearCanvas = document.querySelector(".clear-canvas"),
    saveImg = document.querySelector(".save-img"),
    ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000";

window.addEventListener("load", () => {
    // встановлення ширини/висоти полотна.. offsetwidth/height повертає видиму ширину/висоту елемента
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

const drawRect = (e) => {
    //якщо fillColor не позначено, намалювати прямокутник з рамкою, інакше намалювати прямокутник з фоном
    if (!fillColor.checked) {
        //створення кола відповідно до вказівника миші
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}
   
const drawCircle = (e) => {
    ctx.beginPath(); // створення нового шляху для малювання кола 
    // // отримання радіуса кола відповідно до вказівника миші
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); //створення кола відповідно до вказівника миші
    ctx.stroke();
    fillColor.checked ? ctx.fill() : ctx.stroke(); 
}

const drawLine = (e) => {     
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke()
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY); // переміщення трикутника до вказівника миші
    ctx.lineTo(e.offsetX, e.offsetY); // створення першого рядка відповідно до вказівника миші
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // створення нижньої лінії трикутника
    ctx.closePath(); // замикання шляху трикутника, щоб третя лінія малювалася автоматично
    fillColor.checked ? ctx.fill() : ctx.stroke(); // якщо fillColor позначено, заповнити трикутник, інакше намалювати рамку
}


const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // передача поточної позиції mouseX як значення prevMouseX
    prevMouseY = e.offsetY; // передача поточної позиції mouseY як значення prevMouseY
    ctx.beginPath(); // створення нового шляху для малювання 
    ctx.lineWidth = brushWidth; // передача brushSize як ширини лінії
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    // копіювання даних полотна та передача як значення знімка.. це дозволяє уникнути перетягування зображення
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0)

    if (selectedTool === "brush") {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke(); // малювання/заповнення лінії кольором
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else if(selectedTool === "triangle"){
        drawTriangle(e);
    }  else if (selectedTool === "line") {
        drawLine(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // додавання події кліку до всіх опцій інструментів 
    // // видалення активного класу з попередньої опції та додавання до поточної опції, на яку було натиснуто
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(btn.id);
        
    })
})

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // передача значення слайдера як brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // передача вибраного кольору фону btn як значення selectedColor
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");        
    })
})

colorPicker.addEventListener("change", () => {
    // передача значення вибраного кольору з палітра кольорів до останнього кольору btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // очищення всього полотна
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // // створення елемента <a> 
    link.download = `${Date.now()}.jpg`; // передача поточної дати як значення посилання для завантаження
    link.href = canvas.toDataURL(); //  передача canvasData як значення href посилання
    link.click(); // клік на посиланні для завантаження зображення
});
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);