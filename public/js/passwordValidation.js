document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm_password");

  const reqLength = document.getElementById("req-length");
  const reqMayus = document.getElementById("req-mayus");
  const reqMinus = document.getElementById("req-minus");
  const reqNum = document.getElementById("req-num");
  const reqSpecial = document.getElementById("req-special");
  const matchError = document.getElementById("match-error");

  const regex = {
    length: /.{8,}/,
    mayus: /[A-Z]/,
    minus: /[a-z]/,
    num: /[0-9]/,
    special: /[!@#$%^&*]/,
  };

  function updateRequirement(elem, valid) {
    elem.classList.remove("text-muted", "text-danger", "text-success");
    elem.classList.add(valid ? "text-success" : "text-danger");
  }

  function validatePassword() {
    const value = passwordInput.value;

    updateRequirement(reqLength, regex.length.test(value));
    updateRequirement(reqMayus, regex.mayus.test(value));
    updateRequirement(reqMinus, regex.minus.test(value));
    updateRequirement(reqNum, regex.num.test(value));
    updateRequirement(reqSpecial, regex.special.test(value));

    validateMatch();
  }

  function validateMatch() {
    if (confirmInput.value === "") {
      matchError.style.display = "none";
      return;
    }

    if (passwordInput.value === confirmInput.value) {
      matchError.style.display = "none";
    } else {
      matchError.style.display = "block";
    }
  }

  passwordInput.addEventListener("input", validatePassword);
  confirmInput.addEventListener("input", validateMatch);
});
