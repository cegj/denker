const dates = document.querySelectorAll('[data-date]')

dates.forEach((date) => {
  const fullDate = new Date(date.innerText)
  let formatedDate = fullDate.toLocaleString("pt-BR")
  date.innerText = formatedDate;
})