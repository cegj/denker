const dates = document.querySelectorAll('.date')

dates.forEach((date) => {
  const fullDate = new Date(date.innerText)
  let formatedDate = fullDate.toLocaleString("pt-BR")
  date.innerText = formatedDate;
})