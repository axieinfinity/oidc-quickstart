import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Callback() {
  const router = useRouter()

  useEffect(() => {
    if (router.query.code) {
      // Get the code verifier from local storage to verify the code
      let codeVerifier = localStorage.getItem('codeVerifier')

      try {
        fetch('/api/oauth2/token', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            code: router.query.code,
            codeVerifier: codeVerifier,
          }),
        })
          .then(res => res.json())
          .then(resData => {
            router.push(
              `${process.env.DEEPLINK_URL}?access_token=${resData.access_token}&id_token=${resData.id_token}&refresh_token=${resData.refresh_token}`,
            )
          })
      } catch (ex) {
        // Handle exception
      }
    }
  }, [router])

  return (
    <div>
      <div className="loader center">
        <span></span>
      </div>
    </div>
  )
}
