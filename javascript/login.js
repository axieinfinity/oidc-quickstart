import {
  SkyMavisOAuth2Client,
  extractQueryParams,
} from "../skymavis-oauth2-client/lib";

const client = new SkyMavisOAuth2Client({
  clientId: "",
});

async function getUserInfo(token) {
  return await fetch("http://localhost:8080/oauth2/userinfo", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  }).then((resp) => resp.json());
}

async function getToken(code) {
  return await fetch("http://localhost:8080/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      redirectUri: "http://localhost:5173",
    }),
  }).then((resp) => resp.json());
}

export async function onLoad(container) {
  const { code, error, error_description } = extractQueryParams(location.href);
  if (error) {
    const errorElement = document.createElement("div");
    errorElement.innerHTML = `
      <h3>${error}</h3>
      <p>${error_description}</p>
    `;
    container.appendChild(errorElement);
    return;
  }

  if (code) {
    const resp = await getToken(code);
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <h2>Token Response</h2>
        <p>
          ${JSON.stringify(resp, null, 2)}
        </p>
    `;
    if (resp.access_token) {
      const userInfo = await getUserInfo(resp.access_token);
      wrapper.innerHTML = `
      ${wrapper.innerHTML}
        <h2>UserInfo Response</h2>
        <p>${JSON.stringify(userInfo, null, 2)}</p>
      `;
    }
    container.appendChild(wrapper);
    return;
  }

  const loginButton = document.createElement("button");
  loginButton.setAttribute("type", "button");
  loginButton.innerText = "Login";
  loginButton.addEventListener("click", async () => {
    const url = await client.authorizationCode.getAuthorizeUri({
      redirectUri: "http://localhost:5173",
    });
    location.href = url;
  });
  container.appendChild(loginButton);
}
