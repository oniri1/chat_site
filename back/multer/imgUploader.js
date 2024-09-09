import multer from "multer";

//멀터의 multer({dest : path}) / destination(목적지)를 설정한다. (dest)
export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      console.log("1");
      //주소
      // /home/ubuntu/server
      callback(null, "/var/www/chatProject/front/userFiles"); //절대 경로다.. 무조건 Root에서 시작함..
    },

    filename: (req, file, callback) => {
      callback(null, Date.now() + "-" + req.headers["content-length"] + ".png");
    },
  }),
});
