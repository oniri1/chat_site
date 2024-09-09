const registForm = document.forms.regist;

const emailResultElem = document.getElementById("email-result");
const pwResultElem = document.getElementById("pw-result");
const checkResultElem = document.getElementById("pw-check-result");
const nickResultElem = document.getElementById("nick-result");

let isEmail = false,
  isPw = false,
  isCheck = true,
  isNick = true;

registForm.email.oninput = (e) => {
  const emailReg = /^[A-z0-9가-힣]+@[A-z]+\.[a-z]{2,3}$/;
  if (!emailReg.test(e.target.value)) {
    emailResultElem.innerHTML = "이메일 형식을 지켜주세요.";
    isEmail = false;
  } else {
    emailResultElem.innerHTML = "";
    isEmail = true;
  }
};

let nowPw;
registForm.pw.oninput = (e) => {
  const pwReg = /(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]){8,30}/;
  console.log(e.target.value);
  isPw = false;

  if (e.target.value.length < 8 || e.target.value.length > 30) {
    pwResultElem.innerHTML =
      "비밀번호는 8 글자 이상, 30글자 이하로 작성하세요.";
  } else if (!pwReg.test(e.target.value)) {
    pwResultElem.innerHTML = "비밀번호는 영어, 특수문자, 숫자를 포함하세요.";
  } else {
    isPw = true;
    nowPw = e.target.value;
    pwResultElem.innerHTML = "";
  }
};

registForm["pw-check"].oninput = (e) => {
  isCheck = false;

  if (e.target.value != nowPw) {
    checkResultElem.innerHTML = "비밀번호를 확인해주세요.";
  } else {
    isCheck = true;
    checkResultElem.innerHTML = "";
  }
};

// form에서의 요청 보내기 == submit
registForm.onsubmit = async (e) => {
  try {
    e.preventDefault();

    if (!(isEmail && isPw && isCheck && isNick)) {
      alert("내용 확인 후 다시 시도해주세요.");
      return;
    }

    const data = await axios.post(
      `${serverport}/api/regist`,
      {
        email: registForm.email.value,
        pw: registForm.pw.value,
        pwCk: registForm["pw-check"].value,
        name: registForm.nick.value,
      },
      {
        withCredentials: true,
      }
    );

    if (data.data.redirect) location.href = data.data.redirect;
    if (data.data.error) console.error("error : ", data.data.error);
    if (data.data.result) console.log("result : ", data.data.result);
  } catch (err) {
    console.log(err);
  }
};
