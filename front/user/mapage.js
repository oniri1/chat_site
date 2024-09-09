hamburger = document.querySelector(".hamburger");
hamburger.onclick = function () {
  navBar = document.querySelector(".nav-bar");
  navBar.classList.toggle("active");
};

const dataChecker = (data) => {
  console.log(data);
  if (data.data.redirect) location.href = data.data.redirect;
  if (data.data.error) console.error("error : ", data.data.error);
  if (data.data.result) console.log("result : ", data.data.result);
};

//탭 셋업
const setupTabs = () => {
  document.querySelectorAll(".tabs__button").forEach((button) => {
    button.addEventListener("click", () => {
      const sideBar = button.parentElement;
      const tabsContainer = sideBar.parentElement;
      const tabNumber = button.dataset.forTab;
      const tabToActivate = tabsContainer.querySelector(
        `.tabs__content[data-tab="${tabNumber}"]`
      );

      sideBar.querySelectorAll(".tabs__button").forEach((button) => {
        button.classList.remove("tabs__button--active");
      });

      tabsContainer.querySelectorAll(".tabs__content").forEach((button) => {
        button.classList.remove("tabs__content--active");
      });

      button.classList.add("tabs__button--active");
      tabToActivate.classList.add("tabs__content--active");
    });
  });
};

//탭 클릭 이벤트 셋업
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();

  document.querySelectorAll(".tabs").forEach((tabsContainer) => {
    tabsContainer.querySelector(".tabs__sidebar .tabs__button").click();
  });
});

//유저 navbar
const userinfoElem = document.getElementById("user-info");
(async () => {
  const user = (
    await axios.post(
      `${serverport}/api/user/info`, //url
      {}, //body
      {
        //options
        withCredentials: true,
      }
    )
  ).data;

  // console.log(user.user);
  if (user.user) {
    userinfoElem.innerHTML = `<ul>
    <li>
      <a href="/" class="">메인 페이지</a>
    </li>
    <li>
        <a href="./" class="">${user.user}</a>
    </li>
    <li>
      <a href="/logout" class="">로그아웃</a>
    </li>
  </ul>`;
  }
})();

//룸 만들기 펑션
const loadNewRoom = (data) => {
  const { id, title, tag } = data;
  // console.log(data);

  let tagName;

  if (tag == "1") tagName = "찬반토론";
  if (tag == "2") tagName = "정보공유";
  if (tag == "3") tagName = "친목수다";

  const room = ` <form class="room">
  <div class="box">
    <div class="room">
      <div class="title">
        방제 : ${title}
      </div>
      <div>
        <div class="bgi"></div>
        <div class="status">
        <div class="roomIdElem" style="display:none">${id}</div>
          <div class="tag"># ${tagName}</div>
          <div class="host">태그 (업데이트 예정)</div>

          <a href="/room/?roomId=${id}"><button type="button" class="enter">입장하기</button></a>
          <button class="delete">삭제하기</button>
        </div>
      </div>
    </div>
  </div></form>`;

  const roomContainer = document.getElementById("tab1");
  roomContainer.innerHTML += room;
};

//내 방
(async () => {
  let roomData = await (
    await axios.post(
      `${serverport}/api/user/get/rooms`,
      {},
      { withCredentials: true }
    )
  ).data.Rooms;

  roomData.forEach((e) => {
    loadNewRoom(e);
  });

  //쓴 댓글
  let recomment = await (
    await axios.post(
      `${serverport}/api/user/get/recomments`,
      {},
      { withCredentials: true }
    )
  ).data.data;

  // console.log(recomment);

  const recommentElem = document.getElementById("commentTap");

  // console.log(recommentElem);
  for (const { _id, content, chatId } of recomment) {
    // console.log("실횅");
    const recomment2 = `<form class="recomment">
    <div class="list_container">
        내용 : ${content}

          <a href="/chat/?chatId=${chatId}"><button type="button" class="enter">입장하기</button></a>
          <button class="delete">삭제하기</button>
      
      </div>
    <div id="recommentIdElem" style="display:none">${_id}</div>
  </form>`;

    recommentElem.innerHTML += recomment2;
  }

  const everyForms = [...document.forms];

  //form 처리
  everyForms.forEach((element) => {
    const deleteBtn = [...element][1];

    deleteBtn.onclick = async (e) => {
      e.preventDefault();

      //룸 삭제
      if (element.classList[0] == "room") {
        const roomId =
          element.children[0].children[0].children[1].children[1].children[0]
            .innerText;

        console.log(roomId);
        const data = await axios.post(
          `${serverport}/api/user/delete/room`,
          { roomId: +roomId },
          {
            withCredentials: true,
          }
        );
        console.log(data.data.data);
        dataChecker(data);
      }

      //댓글 삭제
      if (element.classList[0] == "recomment") {
        console.log("rec");

        const recommentId = element.children[1].innerText;

        //댓글 삭제
        const data = await axios.post(
          `${serverport}/api/user/delete/recomment`,
          { recommentId: recommentId },
          {
            withCredentials: true,
          }
        );

        dataChecker(data);
      }
    };
  });

  //닉변
  const nickBtn = document.getElementById("nickBtn");
  nickBtn.onclick = async (e) => {
    e.preventDefault();

    const nick = document.getElementById("nickInput").value;

    if (nick != "") {
      const data = await axios.post(
        `${serverport}/api/user/set/name`,
        { name: nick },
        {
          withCredentials: true,
        }
      );
      dataChecker(data);
    } else {
      return;
    }
  };

  //비밀번호 변경

  //닉변
  const pwBtn = document.getElementById("pwBtn");
  pwBtn.onclick = async (e) => {
    e.preventDefault();

    const pw = document.getElementById("pwInput").value;

    if (pw != "") {
      const data = await axios.post(
        `${serverport}/api/user/set/pw`,
        { pw: pw },
        {
          withCredentials: true,
        }
      );
      dataChecker(data);
    } else {
      return;
    }
  };

  const killBtn = document.getElementById("killBtn");

  killBtn.onclick = async (e) => {
    e.preventDefault();
    console.log("hi");

    //회원탈퇴
    const data = await axios.post(
      `${serverport}/api/user/kill`,
      {},
      {
        withCredentials: true,
      }
    );
    dataChecker(data);
  };
})();
