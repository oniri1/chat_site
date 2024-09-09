const userinfoElem = document.getElementById("user-info");
const makeElem = document.getElementById("makeBtn");
(async () => {
  try {
    const user = await (
      await axios.post(
        `${serverport}/api/user/info`, //url
        {}, //body
        {
          //options
          withCredentials: true,
        }
      )
    ).data;

    if (user.user) {
      userinfoElem.innerHTML = `<ul>

    <li>
      <a href="/chatSite/user" class="">마이페이지</a>
    </li>
    <li>
        <a href="/chatSite/user" class="">${user.user}님</a>
    </li>
    <li>
      <a href="/chatSite/logout" class="">로그아웃</a>
    </li>
  </ul>`;
    }
    if (user.user) {
      makeElem.innerHTML = `
    <input type="submit" id="makeBtn" class="makeBtn" value="채팅방 생성"/>`;
    }

    const btn = document.getElementById("makeBtn");

    btn.onclick = () => {
      const roomEle = document.getElementsByClassName("body")[0];
      if (roomEle.style.display != "flex") {
        roomEle.style.display = "flex";
      } else {
        roomEle.style.display = "none";
      }
    };
  } catch (err) {
    console.log("캐치에러");
    console.error(err);
  }
})();
