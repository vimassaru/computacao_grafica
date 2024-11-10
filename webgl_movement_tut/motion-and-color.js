"use strict";
/* Display an error in our error box*/
function showError(errorText) {
    const errorBoxDiv = document.querySelector('#error-box');
    if (errorBoxDiv == null) {
        return;
    }
    const errorTextElement = document.createElement('p');
    errorTextElement.innerText = errorText;
    errorBoxDiv.appendChild(errorTextElement);
    console.log(errorText);
}
showError('Hello World!');
