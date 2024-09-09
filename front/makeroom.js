//
const categoryList = [
  {
    name: "Tags",
    categorys: [{ name: "찬반토론" }, { name: "정보방" }, { name: "친목수다" }],
  },
];

const cateListElem = document.getElementById("category");

cateListElem.innerHTML += `<option value="0">채널 선택</option>`;

const tempArr = [];

categoryList.forEach((item) => {
  console.log("item", item);
  item.categorys?.length && tempArr.push(...item.categorys);
});

tempArr.forEach((item, idx) => {
  cateListElem.innerHTML += `<option value="${idx + 1}">${item.name}</option>`;
});
