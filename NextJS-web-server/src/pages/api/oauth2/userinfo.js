export default async function handler(req, res) {
  let access_token = req.body.access_token;

  try {
    await fetch("<https://api-gateway.skymavis.com/account/userinfo>", {
      headers: {
        Authorization: "Bearer " + access_token,
        "X-API-Key": process.env.API_KEY,
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((resData) => {
        res.status(200).json(resData);
      });
  } catch (ex) {
    // Handle error
  }
}
