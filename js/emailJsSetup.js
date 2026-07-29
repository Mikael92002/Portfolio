(function () {
  emailjs.init({
    publicKey: "dDPfia7WODH1fNRVx",
    blockHeadless: true,
  });
})();

function sendEmail(form) {
  emailjs.sendForm("service_n9hmb7g", "template_cgckofl", form).then(
    (response) => {
      console.log("email successfully sent", response.status, response.text);
      alert("Message successfully sent!")
    },
    (error) => {
      console.log("email failed to send: ", error);
      alert("Message failed to send, please message Mikael on LinkedIn");
    },
  );
}

const form = document.querySelector("#email-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendEmail(e.target);
  e.target.reset();
});
