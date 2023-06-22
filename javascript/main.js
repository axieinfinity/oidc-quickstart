import './style.css'
import { onLoad } from './login.js'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>SkyMavis SSO Javascript Demo</h1>
    <div class="card" id="container"></div>
  </div>
`

onLoad(document.querySelector('#container'))
