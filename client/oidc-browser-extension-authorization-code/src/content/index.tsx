/* global document */

import React from 'react'
import ReactDOM from 'react-dom/client'

class Main extends React.Component {
  render() {
    return <></>
  }
}

const app = document.createElement('div')
app.id = 'my-extension-root'
document.body.appendChild(app)
const root = ReactDOM.createRoot(app)
root.render(<Main />)
