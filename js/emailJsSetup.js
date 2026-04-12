(function () {
  emailjs.init({
    publicKey: "dDPfia7WODH1fNRVx",
    blockHeadless: true,
  });
})();

function sendEmail(form) {
  emailjs.sendForm("service_2546r5r", "template_cgckofl", form).then(
    (response) => {
      console.log("email successfully sent", response.status, response.text);
    },
    (error) => {
      console.log("email failed to send: ", error);
    },
  );
}

const form = document.querySelector("#email-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendEmail(e.target);
  e.target.reset();
});
