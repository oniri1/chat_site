(async () => {
  try {
    const firstOb = document.getElementById("forOb");

    //소켓용 쿠키
    const userName = await (
      await axios.post(
        `${serverport}/api/cookieCheck`,
        {},
        {
          withCredentials: true,
        }
      )
    ).data;

    //소켓
    const localhost = location.href;
    const roomIdStr = localhost.slice(localhost.lastIndexOf("/") + 1);

    console.log(roomIdStr);

    const roomData = await (
      await axios.post(
        `${serverport}/api/room/${roomIdStr}`,
        {},
        {
          withCredentials: true,
        }
      )
    ).data;

    if (firstOb != null) {
      firstOb.innerHTML = `<h2 for="nickname">방 제목 : ${roomData.title} </h2>`;
    } else {
      const timer = setTimeout(() => {
        location.href = location.href;
      }, 500);
    }
    document.getElementById("forOb");
    const roomId = roomData.roomId;

    //소켓 통신
    let time = Date.now();

    const socket = io(`${roomIdStr}`, {
      path: "/socket.io/room",
    }); // chat 네임스페이스

    //보낼 때
    document.getElementById("sendBtn").onclick = async (e) => {
      e.preventDefault();
      //chat
      const talk = document.getElementById("talk");

      //img
      const form = document.forms.chatDatasForm;
      const formData = new FormData();

      formData.append("img", form.imgInputer.files[0]);

      const imgName = await (
        await axios.post(`${serverport}/api/img`, formData, {
          withCredentials: true,
          headers: { "Content-type": "multipart/form-data" },
        })
      ).data.fileName;

      console.log(imgName);

      socket.emit("chatReply", {
        chat: talk.value,
        fileName: imgName,
        userName: userName,
      });
    };

    //받을 때
    socket.on("chat", (data) => {
      document.getElementById("chats").innerHTML += data;
      document.getElementById("imgInputer").value = null;
      document.getElementById("talk").value = null;
    });

    socket.on("chatload", (data) => {
      document.getElementById("chats").innerHTML =
        data + document.getElementById("chats").innerHTML;

      const forScroll = document.getElementById("scrollId");
      forScroll.scrollTop = forScroll.scrollHeight;

      const a = document.getElementsByClassName("received");
      const lastRoomElem = a[0];
      lastroomObserver.observe(lastRoomElem);
    });

    socket.on("CliTimeReset", (data) => {
      time = --data;
    });

    //Observer
    let lastroom;
    const lastroomObserver = new IntersectionObserver(
      async (entries) => {
        console.log("obs 실행 중");
        lastroom = entries[0];

        socket.emit("chatLoad", {
          time: time,
          roomId: +roomId,
        });

        //기존 옵저버 지우기
        lastroomObserver.unobserve(lastroom.target);
        console.log("실행 종료");
      },
      { threshold: 0.3 }
    );

    if (firstOb != null) {
      lastroomObserver.observe(firstOb);
    } else {
      const timer = setTimeout(() => {
        location.href = location.href;
      }, 500);
      // timer();
    }
    console.log(location);
  } catch (err) {
    console.log(err);
    document.getElementsByTagName("body")[0].innerHTML = "방 없음";
  }
})();
