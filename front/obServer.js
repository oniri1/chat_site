(async () => {
  try {
    let roomData = [];

    let roomValue = 0;
    let tagValueForServer = 0;

    //하이라이트 룸
    let highLightRoom = await (
      await axios.post(
        `${serverport}/api/api/highLight/rooms`, //url
        {}, //body
        {
          //options
          withCredentials: true,
        }
      )
    ).data;

    //하이라이트 댓글
    let highLightChat = await (
      await axios.post(
        `${serverport}/api/api/highLight/recomments`,
        {},
        { withCredentials: true }
      )
    ).data;

    let lastroom;

    //옵저버 실행 코드
    const lastroomObserver = new IntersectionObserver(
      async (entries) => {
        console.log("옵저버 실행");
        if (roomData[0] == undefined) {
          roomData = await (
            await axios.post(
              `${serverport}/api/api/room/ran`,
              { roomValue: roomValue, tag: tagValueForServer },
              { withCredentials: true }
            )
          ).data;

          roomValue = roomData[0].roomValue;
        }

        if (roomData[0].roomId === undefined) {
          lastroom = entries[0];
          lastroomObserver.unobserve(lastroom.target);
        } else {
          lastroom = entries[0];
          if (!lastroom.isIntersecting) return;
          roomData.forEach(() => {
            console.log(roomData[0]);
            loadNewRoom(roomData[0]);

            roomData.splice(0, 1);
          });

          lastroomObserver.unobserve(lastroom.target);

          const a = document.getElementsByClassName("room");
          const lastRoomElem = a[a.length - 1];

          lastroomObserver.observe(lastRoomElem);
        }
      },
      { threshold: 0.3 }
    );

    //클릭 이벤트
    const tag1 = document.getElementById("tab01");
    const tag2 = document.getElementById("tab02");
    const tag3 = document.getElementById("tab03");
    const tag4 = document.getElementById("tab04");
    const searchBtn = document.getElementById("searchBtn");

    tag1.onclick = (e) => {
      tagValueForServer = 0;

      const roombox = document.getElementById("roomShower");

      lastroomObserver.unobserve(lastroom.target);

      while (roombox.children[1]) {
        roombox.removeChild(roombox.lastChild);
      }

      lastroomObserver.observe(document.querySelector(".room:last-child"));
    };
    tag2.onclick = (e) => {
      tagValueForServer = 1;

      const roombox = document.getElementById("roomShower");

      lastroomObserver.unobserve(lastroom.target);

      while (roombox.children[1]) {
        roombox.removeChild(roombox.lastChild);
      }

      lastroomObserver.observe(document.querySelector(".room:last-child"));
    };
    tag3.onclick = (e) => {
      tagValueForServer = 2;

      const roombox = document.getElementById("roomShower");

      lastroomObserver.unobserve(lastroom.target);

      while (roombox.children[1]) {
        roombox.removeChild(roombox.lastChild);
      }

      lastroomObserver.observe(document.querySelector(".room:last-child"));
    };
    tag4.onclick = (e) => {
      tagValueForServer = 3;

      const roombox = document.getElementById("roomShower");

      lastroomObserver.unobserve(lastroom.target);

      while (roombox.children[1]) {
        roombox.removeChild(roombox.lastChild);
      }

      lastroomObserver.observe(document.querySelector(".room:last-child"));
    };

    searchBtn.onclick = async (e) => {
      try {
        e.preventDefault();

        const roombox = document.getElementById("roomShower");
        while (roombox.children[1]) {
          roombox.removeChild(roombox.lastChild);
        }
        const searchValue = document.forms.searchs.searchValue.value;

        if (searchValue != "") {
          let searchArr = await (
            await axios.post(
              `${serverport}/api/api/room/search`, //url
              { title: searchValue }, //body
              {
                //options
                withCredentials: true,
              }
            )
          ).data.data;

          console.log(searchArr);

          searchArr.forEach(() => {
            loadNewRoom(searchArr[0]);
            searchArr.splice(0, 1);
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    const makeRoomForm = document.forms.makeRoomForm;
    const makeRoomBtn = makeRoomForm.submit;
    makeRoomBtn.onclick = async (e) => {
      try {
        e.preventDefault();

        const roomTag = makeRoomForm.category.value;
        const roomTitle = makeRoomForm.roomTitle.value;

        if (roomTag != 0 || roomTitle != "") {
          const data = await axios.post(
            `${serverport}/api/api/room/make`,
            { title: roomTitle, tag: roomTag },
            { withCredentials: true }
          );

          if (data.data.redirect) location.href = data.data.redirect;
        } else {
        }
      } catch (err) {
        console.log(err);
      }
    };

    //윗줄
    hamburger = document.querySelector(".hamburger");
    hamburger.onclick = () => {
      navBar = document.querySelector(".nav-bar");
      navBar.classList.toggle("active");
    };

    lastroomObserver.observe(document.querySelector(".room:last-child"));

    const roomContainer = document.querySelector(".room-container");

    const loadNewRoom = (data) => {
      const { roomId, title, tag } = data;

      let tagName;

      if (tag == "0") tagName = "태그를 선택하지 않은 씹상남자";
      if (tag == "1") tagName = "찬반토론";
      if (tag == "2") tagName = "정보공유";
      if (tag == "3") tagName = "친목수다";

      const room = `
  <div class="box">
    <div class="room">
      <div class="title">
        방제 : ${title}
      </div>
      <div>
        <div class="bgi"></div>
        <div class="status">
          <div class="tag"># ${tagName}</div>
          <div class="host">태그(업데이트 예정)</div>
          <a href="/room/?roomId=${roomId}"><button class="enter">입장하기</button></a>
        </div>
      </div>
    </div>
  </div>`;

      roomContainer.innerHTML += room;
    };

    const li_style = document.querySelector(".li-style");
    const li_style2 = document.querySelector(".li-style2");

    //하이라이트 룸
    const roomHotTopic = (data) => {
      const { roomId, title, tag } = data;

      let tagName;

      if (tag == "0") tagName = "태그를 선택하지 않은 씹상남자";
      if (tag == "1") tagName = "찬반토론";
      if (tag == "2") tagName = "정보공유";
      if (tag == "3") tagName = "친목수다";

      const HotTopic = `<a href="/room/?roomId=${roomId}"><li class="li-style">${tagName} ${title}</li></a>`;
      li_style.innerHTML += HotTopic;
    };

    console.log("하이룸", highLightRoom);
    for (const { roomId, title, tag } of highLightRoom) {
      const data = { roomId: roomId, title: title, tag: tag };

      roomHotTopic(data);
    }

    //하이라이트 댓글
    const recommentHotTopic = (data) => {
      const { chatId, chat, userName } = data;

      const reHotTopic = `<a href="/chat/?chatId=${chatId}"><li class="li-style2">${userName} -${chat}</li></a>`;
      li_style2.innerHTML += reHotTopic;
    };

    for (const { _id, content, userId, ghostId } of highLightChat) {
      let user;
      if (userId == null) {
        user = ghostId;
      } else {
        user = userId;
      }

      const data = { chatId: _id, chat: content, userName: user };

      recommentHotTopic(data);
    }
  } catch (err) {
    console.log(err);
  }
})();
