axios.defaults.headers.common["Authorization"] = "nFHynGaV0aEvGo6vS1iNTaJa";

const promise = axios.get("https://mock-api.driven.com.br/api/vm/uol/messages");
promise.then(showMessages);

function showMessages(message) {
  console.log(message.data);
}
