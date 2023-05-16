export default async function handler(req, res){

    let data = {
        code : req.body.code,
        redirect_uri: process.env.CALLBACK_URL,
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code_verifier: req.body.codeVerifier
    }

    try {
        await fetch("https://api-gateway.skymavis.com/account/oauth2/token",{
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-API-Key' : process.env.API_KEY
            },
            method: 'POST',
            body: new URLSearchParams(data)
        }).then((response)=>response.json())
        .then((resData)=>{
            if(resData.access_token && resData.id_token){
                res.status(200).json({
                    success: true,
                    access_token: resData.access_token,
                    expires_in: resData.expires_in,
                    id_token: resData.id_token,
                    refresh_token: resData.refresh_token
                })
            }
            else{
                // Handle error
                res.status(200).json({
                    success: false 
                })
            }
        })
    }
    catch(ex){
        // Handle error
    }
}