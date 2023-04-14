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
}

function processAnswer(answer) {
  console.log(answer.data);
}
getMessage();
//-----------------------------

promptUsername();
