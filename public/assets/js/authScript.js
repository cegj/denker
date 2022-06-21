function validatePassword(){
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirmpassword");
  const confirmMsg = document.querySelector("#confirmMsg")
  const submitBtn = document.querySelector(".submitBtn")

  const flds = [password, confirmPassword]

  flds.forEach((fld) => {
    fld.addEventListener("change", () => {

      if (password.value != "" && confirmPassword.value != ""){
        if (confirmPassword.value != password.value){
          confirmMsg.innerText = "A confirmação não confere com a senha";
          submitBtn.setAttribute("disabled", "true");
        } else {
          confirmMsg.innerText = ""
          submitBtn.removeAttribute("disabled")
        }
      } else {
        confirmMsg.innerText = ""
        submitBtn.removeAttribute("disabled")
      }
    })
  })
}

validatePassword();