import {
  SkyMavisOAuth2Client,
  extractQueryParams,
} from "../skymavis-oauth2-client/lib";

const client = new SkyMavisOAuth2Client({
  clientId: "your_client",
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

const createSimulateButton = (container, flow) => {
  const loginButton = document.createElement("button");
  loginButton.setAttribute("type", "button");
  loginButton.innerText = flow === "code" ? "Authorization Code" : "Get Token";
  loginButton.addEventListener("click", async () => {
    const url = await (flow === "code"
      ? client.authorizationCode.getAuthorizeUri
      : client.implicitToken.getImplicitTokenUri)({
      redirectUri: "http://localhost:5173",
    });

    location.href = url;
  });
  container.appendChild(loginButton);
};

export async function onLoad(container) {
  const { code, error, error_description, access_token } = extractQueryParams(
    location.href
  );
  // Handle SSO Callback error
  if (error) {
    const errorElement = document.createElement("div");
    errorElement.innerHTML = `
      <h3>${error}</h3>
      <p>${error_description}</p>
    `;
    container.appendChild(errorElement);
    return;
  }

  // Handle implicit flow return access token
  if (access_token) {
    const userInfo = await getUserInfo(access_token);
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <h2>Token Response</h2>
        <p>
          ${access_token}
        </p>
    `;
    wrapper.innerHTML = `
      ${wrapper.innerHTML}
        <h2>UserInfo Response</h2>
        <p>${JSON.stringify(userInfo, null, 2)}</p>
      `;
    container.appendChild(wrapper);
    return;
  }

  // Handle authorization code flow callback
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
  //Authorization Code Flow
  createSimulateButton(container, "code");
  //Implicit Token flow
  createSimulateButton(container);
}
