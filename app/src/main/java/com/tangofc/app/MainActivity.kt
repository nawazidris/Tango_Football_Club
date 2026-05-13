package com.tangofc.app

import android.content.Intent
import android.net.Uri
import android.content.Context
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.FrameLayout
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import java.io.IOException
import java.io.InputStream

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        // Install splash screen
        installSplashScreen()
        
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        supportActionBar?.hide()

        webView = findViewById(R.id.webView)
        val splashContainer = findViewById<FrameLayout>(R.id.fullscreenSplash)

        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.allowFileAccess = true
        webView.settings.allowFileAccessFromFileURLs = true
        webView.settings.allowUniversalAccessFromFileURLs = true

        // Add JavaScript interface for asset loading
        webView.addJavascriptInterface(WebAppInterface(), "Android")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                if (url != null && (url.startsWith("whatsapp://") || url.startsWith("https://wa.me/"))) {
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                    startActivity(intent)
                    return true
                }
                return false
            }
        }

        webView.loadUrl("file:///android_asset/index.html")

        // Hide the full-screen transition after 2 seconds
        Handler(Looper.getMainLooper()).postDelayed({
            splashContainer.animate()
                .alpha(0f)
                .setDuration(500)
                .withEndAction {
                    splashContainer.visibility = View.GONE
                }
        }, 2000)
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    private inner class WebAppInterface {
        @JavascriptInterface
        fun loadAsset(assetPath: String): String {
            return try {
                val inputStream: InputStream = assets.open(assetPath)
                val size: Int = inputStream.available()
                val buffer = ByteArray(size)
                inputStream.read(buffer)
                inputStream.close()
                String(buffer, Charsets.UTF_8)
            } catch (e: IOException) {
                e.printStackTrace()
                ""
            }
        }

        @JavascriptInterface
        fun isAndroid(): Boolean {
            return true
        }
    }
}