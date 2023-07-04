using System.Linq;
using System.Web;
using System.Collections;
using System.Collections.Specialized;
using UnityEngine.Networking;
using UnityEngine;
using System;
using UnityEngine.UI;

namespace Scenes
{
	public class LoginController : MonoBehaviour
	{
		public static LoginController Instance { get; private set; }
		public GameObject loginPage;
		public Text txtResponse;

		public string OIDC_CLIENT_ID = "<your_client_id>";
		public string OIDC_SCOPE = "openid offline";
		public string REDIRECT_URI = "demologin://platform";
		public string OIDC_AUTHORIZATION_ENDPOINT = "https://api-gateway.skymavis.com/oauth2/auth";
		public string SERVER_TOKEN_ENDPOINT = "http://localhost:8080/oauth2/authorization-code/token";

		public static LoginController getInstance()
		{
			return Instance;
		}

		private void Awake()
		{
			if (Instance == null)
			{
				Instance = this;
			}
		}

		private string ToQueryString(NameValueCollection nvc)
		{
			var array = (
				from key in nvc.AllKeys
				from value in nvc.GetValues(key)
				select string.Format(
				"{0}={1}",
				HttpUtility.UrlEncode(key),
				HttpUtility.UrlEncode(value))
				).ToArray();
			return "?" + string.Join("&", array);
		}

		public void onLogin()
		{
			Guid myuuid = Guid.NewGuid();
			string myuuidAsString = myuuid.ToString();

			NameValueCollection collection = new NameValueCollection();
			collection.Add("state", myuuidAsString);
			collection.Add("client_id", OIDC_CLIENT_ID);
			collection.Add("response_type", "code");
			collection.Add("scope", OIDC_SCOPE);
			collection.Add("redirect_uri", REDIRECT_URI);

			string url = OIDC_AUTHORIZATION_ENDPOINT + ToQueryString(collection);

			Application.OpenURL(url);
		}

		public void onExchangeCode(string url)
		{
			StartCoroutine(onRequestExchangeCode(url));
		}

		public IEnumerator onRequestExchangeCode(string url)
		{
			txtResponse.text = "Requesting ...";

			Uri myUri = new Uri(url);
			string code = HttpUtility.ParseQueryString(myUri.Query).Get("code");

			string json = "{\"code\":\"" + code + "\",\"redirect_uri\":\""+REDIRECT_URI+ "\"}";

			UnityWebRequest exchangeRequest = UnityWebRequest.Post(SERVER_TOKEN_ENDPOINT, json, "application/json");

			yield return exchangeRequest.SendWebRequest();

			if (exchangeRequest.result != UnityWebRequest.Result.Success)
			{
				Debug.Log(exchangeRequest.error);
			}
			else
			{
				var responseText = exchangeRequest.downloadHandler.text;
				txtResponse.text = responseText;
			}
		}

	}
}

