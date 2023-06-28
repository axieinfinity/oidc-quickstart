import React from 'react'
import ReactDOM from 'react-dom/client'
import Popup from './Popup'

const Index = () => <Popup />

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById('display-container')!)
root.render(<Index />)
