(async () => {
  try {
    const data = await axios.post(
      `${serverport}/api/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    console.log("hi");

    if (data.data.redirect) location.href = data.data.redirect;
    if (data.data.error) console.error("error : ", data.data.error);
    if (data.data.result) console.log("result : ", data.data.result);
  } catch (err) {
    console.log(err);
  }
})();

// console.log("hi");
