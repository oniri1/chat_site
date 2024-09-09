import crypto from "crypto";

export const hasher = (data) => {
  const salt = "oniri1";

  //해쉬 알고리즘
  const hashAlgorithm = crypto.createHash("sha256");
  //단방향 키 값
  const hashing = hashAlgorithm.update(data + salt);
  //헥스로 값 뽑아오기
  const hashedString = hashing.digest("hex");
  console.log("hash", hashedString.slice(0, 10));

  return hashedString.slice(0, 10);
};
