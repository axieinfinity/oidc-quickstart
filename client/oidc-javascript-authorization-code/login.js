import axios from 'axios'

export async function onLoad(container) {
  const code = new URL(location.href).searchParams.get('code') || ''

  if (code) {
    try {
      const { data } = await axios({
        url: SERVER_TOKEN_ENDPOINT,
        method: 'POST',
        data: {
          code,
          redirect_uri: OIDC_CALLBACK_URL,
        },
      })

      const wrapper = document.createElement('div')
      wrapper.innerHTML = `
      <h2>Successful!</h2>
      <pre>
        ${JSON.stringify(data, null, 2)}
      </pre>
  `
      container.appendChild(wrapper)
      return
    } catch (e) {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = `
      <h2>Failed!</h2>
      <pre>
        ${JSON.stringify(e, null, 2)}
      </pre>
  `
      container.appendChild(wrapper)
      return
    }
  }

  const query = new URLSearchParams({
    state: crypto.randomUUID(),
    response_type: 'code',
    remember: 'false',
    client_id: OIDC_CLIENT_ID,
    scope: OIDC_SCOPE,
    redirect_uri: OIDC_CALLBACK_URL,
  })

  const url = `${OIDC_AUTHORIZATION_ENDPOINT}?${query.toString()}`

  const loginButton = document.createElement('button')
  loginButton.setAttribute('type', 'button')
  loginButton.innerText = 'Continue with Sky Mavis SSO'
  loginButton.addEventListener('click', async () => {
    location.href = url
  })
  container.appendChild(loginButton)
}
