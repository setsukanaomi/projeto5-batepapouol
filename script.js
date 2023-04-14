axios.defaults.headers.common["Authorization"] = "nFHynGaV0aEvGo6vS1iNTaJa";

// Função que pega as mensagens
function getMessage() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/vm/uol/messages"
  );
  promise.then(succeedMessages);

  function succeedMessages(promise) {
    const messages = promise.data;
    messages.forEach(showMessages);
  }
}
//----------------------------

// Função que mostra as mensagens
function showMessages(message) {
  const chat = document.querySelector(".content");
  chat.innerHTML += `<div class="chat">
<div class="time">(${message.time})</div>
<div class="name">${message.from}</div>
<div class="message">${message.text}</div>`;
}
//----------------------------

// Função para enviar mensagem
function sendMessage() {
  const input = document.querySelector(".send-box input");
  const message = input.value;
  console.log(message);
  input.value = "";
}
//----------------------------

// Função que solicita o nome
function promptUsername() {
  let user = prompt("Qual seu nome?");
  const username = {
    name: user,
  };
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/vm/uol/participants",
    username
  );
  promise.then(processAnswer);
  promise.catch(showError);
}

function processAnswer(answer) {
  if (answer.status === 200) {
    getMessage();
  }
}
function showError(error) {
  if (error.response.status === 400) {
    promptUsername();
  }
}
//-----------------------------

promptUsername();
