//Chat

let nextMessageId = 0;

const chat = document.getElementById('chat');
const nick = document.getElementById('nick');
const msg = document.getElementById('msg');
const btn = document.getElementById('send');

function delay(ms){
  return new Promise(res => setTimeout(() => res('done'), ms))
}

async function jsonPost(url, data){
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async function sendMessage(nick, message){
  return await jsonPost("http://students.a-level.com.ua:10012", {func: "addMessage", nick: nick, message: message});
}

async function getMessages(){
  const response = await jsonPost("http://students.a-level.com.ua:10012", {func: "getMessages", messageId: nextMessageId});
  const data = await response.json();

  let chatContent = '';

  const sorted = data.data.sort((a, b) => b.timestamp - a.timestamp);

  sorted.map((item) => {
    chatContent += `
      <div class='messages'>
        <span>${item.nick}</span>
        <p>${item.message}</p>
        <span>${new Date(item.timestamp).toLocaleString()}</span>
      </div>`
  })

  chat.innerHTML = chatContent;
  nextMessageId = data.nextMessageId - 50;
}

getMessages();

async function sendAndCheck(){
  if(nick.value === '' || msg.value === ''){
    return alert('Nickname or message fields should not be empty!');
  }

  await sendMessage(nick.value, msg.value);
  getMessages();
}

btn.addEventListener('click', function(){
  sendAndCheck();
  nick.value = '';
  msg.value = '';
})

async function checkLoop(){
  while(true){
    await delay(4000);
    getMessages();
  }
}

checkLoop();



//domEventPromise

const knopka = document.createElement('button');
knopka.innerText = 'Батон';
document.body.append(knopka);

function domEventPromise(element, eventName){
  function executor(resolve) {
  element.addEventListener(eventName, function onclick() {
    element.removeEventListener(eventName, onclick);
    resolve(element)});
}
return new Promise(executor)
}


domEventPromise(knopka, 'click').then( e => console.log('event click happens', e));