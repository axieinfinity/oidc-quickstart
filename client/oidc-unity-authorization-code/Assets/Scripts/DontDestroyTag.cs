using UnityEngine;

namespace DefaultNamespace
{
    public class DontDestroyTag : MonoBehaviour
    {
        private void Awake()
        {
            DontDestroyOnLoad(gameObject);
        }
    }
}