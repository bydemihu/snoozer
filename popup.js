// This is the script attached to the popup that runs the injector when the button is toggled.

let on = false;

document.addEventListener('DOMContentLoaded', async function () {
    let onbutton = document.getElementById('onbutton');
    let oncolor = document.getElementById('oncolor');

    onbutton.onclick = () => {
        console.log("on toggled");

        if(on){
            on = false;
            oncolor.style.backgroundColor = "rgb(194, 210, 255)";
            onbutton.style.left = "0";
            onbutton.style.right = "";
        }
        else{
            on = true;
            oncolor.style.backgroundColor = "rgb(119, 57, 255)";
            onbutton.style.left = "";
            onbutton.style.right = "0";

        }
    }

})