function removeMessage(){
  const message = document.querySelector(".message");

  if (message){
    setTimeout(() => {
      message.remove()
    }, 10000)  
  }
}

removeMessage();