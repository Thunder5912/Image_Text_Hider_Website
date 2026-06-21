const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let imageLoaded = false;

imageInput.addEventListener("change", e => {

    const file = e.target.files[0];
    const img = new Image();

    img.onload = () => {

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        imageLoaded = true;
    };

    img.src = URL.createObjectURL(file);
});

function encodeMessage() {

    if(!imageLoaded){
        alert("Upload image first");
        return;
    }

    const message =
        document.getElementById("message").value + "#";

    const imageData =
        ctx.getImageData(0,0,canvas.width,canvas.height);

    const data = imageData.data;

    let bitIndex = 0;

    for(let i=0;i<message.length;i++){

        let charCode = message.charCodeAt(i);

        for(let bit=7;bit>=0;bit--){

            let value = (charCode >> bit) & 1;

            data[bitIndex] =
                (data[bitIndex] & 254) | value;

            bitIndex++;
        }
    }

    ctx.putImageData(imageData,0,0);

    const link =
        document.getElementById("downloadLink");

    link.href = canvas.toDataURL();

    link.download = "encoded.png";

    link.style.display = "inline";

    link.innerText = "Download Encoded Image";

    alert("Message Encoded Successfully");
}

function decodeMessage(){

    const imageData =
        ctx.getImageData(0,0,canvas.width,canvas.height);

    const data = imageData.data;

    let message = "";
    let currentChar = 0;
    let count = 0;

    for(let i=0;i<data.length;i++){

        currentChar =
            (currentChar << 1) | (data[i] & 1);

        count++;

        if(count === 8){

            let ch =
                String.fromCharCode(currentChar);

            if(ch === "#")
                break;

            message += ch;

            currentChar = 0;
            count = 0;
        }
    }

    document.getElementById("output")
        .innerText = "Decoded Message: " + message;
}
