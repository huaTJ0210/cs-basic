async function getJSON() {
  const response = await fetch("");
  if (response.ok) {
    // 请求成功 : http状态码：200~299
  } else {
    // 请求失败
    console.log(response.statusText);
  }
}
