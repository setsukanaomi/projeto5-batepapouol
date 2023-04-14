axios.defaults.headers.common["Authorization"] = "vvle8VbK4wZapd4aU2tBxywk";

window.username = null;

// Função que scrolla para última mensagem
function scrollToBottom(chat) {
  const lastMessage = chat.lastChild;
  lastMessage.scrollIntoView();
}
//----------------------------

// Função que mostra as mensagens
function showMessages(message) {
  const chat = document.querySelector(".content");
  let toClasses = "to";
  if (message.type === "status") {
    toClasses += " hidden";
  }
  chat.innerHTML += `<div data-test="message" class="chat">
    <div class="time">(${message.time})</div>
    <div class="name"><strong>${message.from}</strong></div>
    <div class="${toClasses}">para <strong>${message.to}:</strong></div>
    <div class="message">${message.text}</div>
  </div>`;
  stayConnected();
  setInterval(stayConnected, 5000);
  scrollToBottom(chat);
}
//----------------------------

// Função que mantém conexão
function stayConnected() {
  const promiseConnected = axios.post(
    "https://mock-api.driven.com.br/api/vm/uol/status",
    window.username
  );
}
//----------------------------

// Função para enviar mensagem
function sendMessage() {
  const input = document.querySelector(".send-box input");
  const message = input.value;
  const fullMessage = {
    from: window.username.name,
    to: "Todos",
    text: message,
    type: "message",
  };
  const promiseSend = axios.post(
    "https://mock-api.driven.com.br/api/vm/uol/messages",
    fullMessage
  );
  promiseSend.then(updateMessages);
  promiseSend.catch(updateUsername);

  function updateMessages(update) {
    if (update.status === 200) {
      getMessage();
    }
  }
  function updateUsername(usernameAgain) {
    if (usernameAgain.response.status === 400) {
      window.location.reload();
    }
  }
  input.value = "";
}
//----------------------------

// Função que pega as mensagens
function getMessage() {
  const chat = document.querySelector(".content");
  const promiseGet = axios.get(
    "https://mock-api.driven.com.br/api/vm/uol/messages"
  );
  promiseGet.then(succeedMessages);

  function succeedMessages(promise) {
    const messages = promise.data;
    console.log(messages);
    chat.innerHTML = ""; // Limpa as mensagens antigas
    messages.forEach(showMessages);
  }
}
//----------------------------

// Função que solicita o nome, com const global username
function promptUsername() {
  let user = prompt("Qual seu nome?");
  window.username = {
    name: user,
  };
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/vm/uol/participants",
    window.username
  );
  promise.then(processAnswer);
  promise.catch(showError);

  function processAnswer(answer) {
    if (answer.status === 200) {
      window.username = username;
      getMessage();
      setInterval(getMessage, 3000);
    }
  }
  function showError(error) {
    if (error.response.status === 400) {
      promptUsername();
    }
  }
}
//-----------------------------

promptUsername();
