using Scenes;
using UnityEngine;

public class DeepLinkManager : MonoBehaviour
{
    private static DeepLinkManager Instance { get; set; }
    public string deeplinkURL;
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;                
            Application.deepLinkActivated += OnDeepLinkActivated;
            if (!string.IsNullOrEmpty(Application.absoluteURL))
            {
                // Cold start and Application.absoluteURL not null so process Deep Link.
                OnDeepLinkActivated(Application.absoluteURL);
            }
            // Initialize DeepLink Manager global variable.
            else deeplinkURL = "[none]";
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
 
    private void OnDeepLinkActivated(string url)
    {
        Debug.LogFormat("deeplink {0}", url);
        // Update DeepLink Manager global variable, so URL can be accessed from anywhere.
        deeplinkURL = url;
        LoginManager.GetInstance().ShowUserInfo(deeplinkURL);
// Decode the URL to determine action. 
// In this example, the app expects a link formatted like this:
// unitydl://mylink?scene1

    }
}
