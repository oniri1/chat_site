(async () => {
  try {
    await axios.post(
      `${serverport}/api/cookieCheck`,
      {},
      { withCredentials: true }
    );
  } catch (err) {}
})();

const localhost = location.href;
const chatId = localhost.split("chatId=")[1];
const sendform = document.forms.send;
const sendBtn = send.fight;

(async () => {
  try {
    console.log(chatId);

    const contents = await (
      await axios.post(
        `${serverport}/api/chat/get/contents`,
        { chatId: chatId },
        {
          withCredentials: true,
        }
      )
    ).data;

    document.getElementById(
      "userInfo"
    ).innerHTML = `<h2>작성자 : ${contents.user}</h2>`;

    const contentsElem = document.getElementById("imgElem");

    if (contents.file != null) {
      contentsElem.innerHTML = `<img src="../userFiles/${contents.file}" alt="" />`;
    }

    contentsElem.innerHTML += `<h3>${contents.chat}</h3>`;

    //댓글
    const commentList = await (
      await axios.post(
        `${serverport}/api/chat/get/recomments`,
        { chatId: chatId },
        {
          withCredentials: true,
        }
      )
    ).data.data;

    console.log(commentList);

    let commentsHtml = "";

    for (const { content, createdAt, userId, ghostId } of commentList) {
      let user;

      if (userId === null) {
        user = ghostId;
      } else {
        user = userId;
      }

      let tempHtml = "";
      tempHtml += `<div class="comment">
        <div class="comment-mainbar">
          <div class="comment-datas">
            <div class="comment-user-img">
              <img src="../img/gladiator-in-colosseum.jpeg" alt="">
            </div>
            <div class="comment-user-name">${user}</div>
            <div class="comment-createdAt">${createdAt}</div>
          </div>
          <div class="comment-content">${content}</div>
          <div class="comment-options">
    
          </div>
        </div>
      </div>`;

      tempHtml = `<div class="comments">${tempHtml}</div>`;

      commentsHtml += tempHtml;
    }

    const commentListEle = document.getElementsByClassName("comment-list")[0];

    commentListEle.innerHTML += commentsHtml;
  } catch (err) {}
})();

//클릭 이벤트
sendBtn.onclick = async (e) => {
  try {
    e.preventDefault();

    if (sendform.content.value != "") {
      console.log("val");

      const data = await axios.post(
        `${serverport}/api/chat/reply`, //url
        { chatId: chatId, content: sendform.content.value }, //body
        {
          //options
          withCredentials: true,
        }
      );

      if (data.data.redirect) location.href = data.data.redirect;
      if (data.data.error) console.error("error : ", data.data.error);
      if (data.data.result) console.log("result : ", data.data.result);
    } else {
      return;
    }
  } catch (err) {
    console.log(err);
  }
};
