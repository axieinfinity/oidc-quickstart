export async function onLoad(container) {
  const code = new URL(location.href).searchParams.get('code') || ''
  if (code) {
    const { data } = await axios({
      baseURL: SERVER_ENDPOINT,
      url: '/oauth2/authorization-code/token',
      method: 'POST',
      data: {
        code,
        redirect_uri: CALLBACK_URL,
      },
    })

    const wrapper = document.createElement('div')
    wrapper.innerHTML = `
        <h2>Token Response</h2>
        <p>
          ${JSON.stringify(data, null, 2)}
        </p>
    `
    container.appendChild(wrapper)
    return
  }

  const query = new URLSearchParams({
    state: crypto.randomUUID(),
    client_id: CLIENT_ID,
    response_type: 'code',
    scopes: 'openid',
    remember: 'false',
    redirect_uri: CALLBACK_URL,
  })

  const url = `${SSO_ENDPOINT}/oauth2/auth?${query.toString()}`

  const loginButton = document.createElement('button')
  loginButton.setAttribute('type', 'button')
  loginButton.innerText = 'Continue with Sky Mavis SSO'
  loginButton.addEventListener('click', async () => {
    location.href = url
  })
  container.appendChild(loginButton)
}
