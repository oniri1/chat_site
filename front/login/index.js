(async () => {
  try {
    const check = await axios.post(
      `${serverport}/api/cookieCheck`,
      {},
      { withCredentials: true }
    );

    console.log("check", check.data);

    if (check.data.user != undefined) {
      location.href = "/chatSite";
    }
  } catch (err) {}
})();

const form = document.forms.login;
const emailCheckElem = document.getElementById("email");
const pwCheckElem = document.getElementById("pw");

let isEmail = false,
  isPw = false;

form.email.oninput = (e) => {
  const emailReg = /^[A-z0-9가-힣]+@[A-z]+\.[a-z]{2,3}$/;
  if (!emailReg.test(e.target.value)) {
    emailCheckElem.innerHTML = "이메일 형식을 지켜주세요.";
    isEmail = false;
  } else {
    emailCheckElem.innerHTML = "";
    isEmail = true;
  }
};

form.pw.oninput = (e) => {
  const pwReg = /(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]){8,30}/;
  isPw = false;

  if (e.target.value.length < 8 || e.target.value.length > 30) {
    pwCheckElem.innerHTML = "비밀번호는 8 글자 이상, 30글자 이하로 작성하세요.";
  } else if (!pwReg.test(e.target.value)) {
    pwCheckElem.innerHTML = "비밀번호는 영어, 특수문자, 숫자를 포함하세요.";
  } else {
    isPw = true;
    pwCheckElem.innerHTML = "";
  }
};

form.onsubmit = async (e) => {
  e.preventDefault();

  if (!isEmail || !isPw) return;

  try {
    const user = (
      await axios.post(
        `${serverport}/api/login`, // url
        { email: form.email.value, pw: form.pw.value }, // body
        {
          // options
          withCredentials: true,
        }
      )
    ).data;

    console.log(user);

    if (user.redirect) location.href = user.redirect;
    if (user.error) console.error("error : ", user.error);
    if (user.result) console.log("result : ", user.result);
  } catch (err) {
    console.error(err);
  }
};
