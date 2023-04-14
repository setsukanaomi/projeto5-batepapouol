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
  let chatClasses = "chat";
  if (message.type === "status") {
    toClasses += " hidden";
    chatClasses += " status";
  } else if (message.type === "message") {
    chatClasses += " message";
  }

  chat.innerHTML += `<div data-test="message" class="${chatClasses}">
    <p>
    <span class="time">(${message.time})</span>
    <span class="name"><strong>${message.from}</strong></span>
    <span class="${toClasses}">para <strong>${message.to}:</strong></span>
    <span class="msg">${message.text}</span>
    </p>
  </div>`;
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
  const inputMessage = document.querySelector(".send-box input");
  const message = inputMessage.value;
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
  inputMessage.value = "";
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

// Função que envia com enter
function setupInput() {
  const inputSend = document.querySelector(".send-box input");
  inputSend.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
}
//----------------------------

// Função que envia o username
function sendUsername(participants) {
  const inputLogin = document.querySelector(".login input");
  const user = inputLogin.value;
  window.username = {
    name: user,
  };
  const promiseGetParticipants = axios.get(
    "https://mock-api.driven.com.br/api/vm/uol/participants"
  );

  promiseGetParticipants.then(function (response) {
    const participants = response.data;

    // Verifica se o nome de usuário já está em uso
    if (participants.find((p) => p.name === window.username.name)) {
      alert(
        "Este nome de usuário já está em uso. Por favor, escolha outro nome."
      );
      return;
    }
    //------------------------------

    // Envia usuário caso não esteja em uso
    const promise = axios.post(
      "https://mock-api.driven.com.br/api/vm/uol/participants",
      window.username
    );
    promise.then(processAnswer);
    promise.catch(showError);
  });

  function processAnswer(answer) {
    if (answer.status === 200) {
      window.username = username;
      const loginDiv = document.querySelector(".login");
      loginDiv.classList.remove("login");
      loginDiv.classList.add("hidden");
      getMessage();
      setInterval(stayConnected, 5000); // Verifica a conexão a cada 5 segundos
      setInterval(getMessage, 3000); // Atualiza as mensagens a cada 3 segundos
    }
  }
  function showError(error) {
    if (error.response.status === 400) {
      window.location.reload();
    }
  }
}
//----------------------------

setupInput();
