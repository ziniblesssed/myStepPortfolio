
// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.
 */
function addMessage() {
  const messages = "Your respose has been received.";

  // Add it to the page.
  const responseContainer = document.getElementById('responseContainer');
  responseContainer.innerText = messages;
}

//Function to load when contact page is loaded
function getServerString (){
    fetch('/data').then(response => response.json()).then((res) => {
    const responseElement = document.getElementById('responseContainer');
    responseElement.innerHTML = '';
    for(let i=0; (i < res.length); i++){
        responseElement.appendChild(
            createListElement('First name: ' + res[i].firstName));
        responseElement.appendChild(
            createListElement('Last name: ' + res[i].lastName));
        responseElement.appendChild(
            createListElement('Country: ' + res[i].country));
        responseElement.appendChild(
            createListElement('Message: ' + res[i].subject));
    }
});
}

//Function to load when max comment is changed
function loadComments() {
    const max = document.getElementById("messageChoice").value;
     fetch('/data?messageChoice='+max).then(response => response.json()).then((res) => {
         const responseElement = document.getElementById('responseContainer');
    responseElement.innerHTML = '';
    for(let i=0; (i <max) && (i < res.length); i++){
        responseElement.appendChild(
            createListElement('First name: ' + res[i].firstName));
        responseElement.appendChild(
            createListElement('Last name: ' + res[i].lastName));
        responseElement.appendChild(
            createListElement('Country: ' + res[i].country));
        responseElement.appendChild(
            createListElement('Message: ' + res[i].subject));
    }
});
}

function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}
