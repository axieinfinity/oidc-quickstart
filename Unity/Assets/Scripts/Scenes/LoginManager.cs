using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.Http;
using System.Web;
using Models;
using Newtonsoft.Json;
using UnityEngine;
using OAuth;
using TMPro;
using UnityEngine.Networking;
using UnityEngine.UI;
using Utils;

namespace Scenes
{
    public class LoginManager : MonoBehaviour
    {
        private static LoginManager Instance { get; set; }
        
        /// <summary>
        /// Reference to the oauth settings object.
        /// </summary>
        [SerializeField] private OAuthSettings oauthSettings;
        
        [SerializeField] private GameObject loginPanel;
        [SerializeField] private Button btnLogin;
        [SerializeField] private Button btnBackLogin;

        [SerializeField] private GameObject userInfoPanel;
        [SerializeField] private TMP_Text txtAccessToken;
        [SerializeField] private TMP_Text txtSub;
        [SerializeField] private TMP_Text txtName;

        [SerializeField] private Button btnDebugCode;
        [SerializeField] private TMP_InputField inputRedirectDeeplink;

        private WebViewObject _webView;

        // Start is called before the first frame update
        private IEnumerator Start()
        {
#if UNITY_IOS
            _webView = (new GameObject("WebViewObject")).AddComponent<WebViewObject>();
            _webView.Init(
                err: (msg) =>
                {
                    Debug.LogFormat("CallOnError[{0}]", msg);
                },
                ld: (msg) =>
                {
                    Debug.LogFormat("CallOnLoaded[{0}]", msg);
                },
                enableWKWebView: true,
                wkAllowsBackForwardNavigationGestures: true);
#endif
            yield break;
        }

        public static LoginManager GetInstance()
        {
            return Instance;
        }
        
        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
            }

            btnLogin.onClick.AddListener(LoginButtonOnClick);
            btnBackLogin.onClick.AddListener(BackToLogin);
            btnDebugCode.onClick.AddListener(DebugAuthCode);
        }

        // Update is called once per frame
        void Update()
        {
        }

        private void LoginButtonOnClick()
        {
            Debug.Log("prepare to login");
            var url = oauthSettings.ServerURL;
            
#if UNITY_IOS
            _webView.LoadURL(url.ToString());
            _webView.SetMargins(0, 0, 0, 0);
            _webView.SetVisibility(true);
            _webView.SetScrollbarsVisibility(true);
            _webView.SetScrollBounceEnabled(true);
            _webView.SetInteractionEnabled(true);
#else
            Application.OpenURL(url.ToString());
#endif
        }

        public void ShowUserInfo(string redirectUrl)
        {
            
#if UNITY_IOS
            _webView.SetVisibility(false);
#endif
            
            StartCoroutine(ExchangeAuthCode(redirectUrl));
        }

        private IEnumerator ExchangeAuthCode(string redirectUrl)
        {
            loginPanel.SetActive(false);
            userInfoPanel.SetActive(true);
            
            var uri = new Uri(redirectUrl);
            var urlParams = HttpUtility.ParseQueryString(uri.Query);
            var access_token = urlParams.Get("access_token");

            Debug.LogFormat("redirect url: {0}", redirectUrl);
            Debug.LogFormat("access_token : {0}", access_token);
            
            StartCoroutine(GetUserInfo(access_token));
            yield return null;
        }

        private IEnumerator GetUserInfo(String accessToken)
        {
            var webRequest = UnityWebRequest.Post(new Uri(oauthSettings.UserInfoURL), new Dictionary<string, string> {
                {QueryParams.AccessToken, accessToken}
            });
            webRequest.SendWebRequest();
            while (!webRequest.isDone)
            {
                yield return null;
            }

            if (webRequest.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Failed to get access token: " + webRequest.error);
                yield break;
            }
            
            var responseText = webRequest.downloadHandler.text;
            var userInfo = JsonConvert.DeserializeObject<UserInfo>(responseText);

            txtAccessToken.text = accessToken.ToString().Substring(0,20); 
            txtSub.text = userInfo.Sub;
            txtName.text = userInfo.Name;
        }

        private void BackToLogin()
        {
            loginPanel.SetActive(true);
            userInfoPanel.SetActive(false);
        }

        private void DebugAuthCode()
        {
            if (inputRedirectDeeplink.text != "")
            {
                StartCoroutine(ExchangeAuthCode(inputRedirectDeeplink.text));
            }
        }
    }
}
