<<<<<<< HEAD
/**
 * App Configuration & Utilities
 * Handles environment detection and asset loading for both web and Android
 */

// REPLACE THIS with your actual GitHub username and repository name
const GITHUB_USERNAME = 'nawazidris';
const GITHUB_REPO = 'Tango_FC_Apk';
const ONLINE_DATA_BASE_URL = `https://${GITHUB_USERNAME}.github.io/${GITHUB_REPO}/app/src/main/assets/`;

// Detect if running in Android WebView
function isAndroidApp() {
    // Check for Android WebView identifiers
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(ua);
    const isWebView = /webview|wv/.test(ua) || window.AndroidWebView !== undefined;
    const result = isAndroid && (isWebView || typeof window.AndroidWebView !== 'undefined');
    return result;
}

/**
 * Get the correct path for asset files based on environment
 * @param {string} assetPath - Relative path to asset (e.g., 'data/matches.json')
 * @returns {string} - Correct path for current environment
 */
function getAssetPath(assetPath) {
    if (isAndroidApp()) {
        // In Android WebView, use file:///android_asset/ protocol
        return `file:///android_asset/${assetPath}`;
    }
    // In browser/website, use relative path
    return assetPath;
}

/**
 * Fetch asset with proper error handling and retry logic
 * @param {string} assetPath - Path to asset
 * @returns {Promise<Response>}
 */
async function fetchAsset(assetPath, options = {}) {
    // 1. Try to fetch from the Online Server first (if it's a data file)
    if (assetPath.startsWith('data/')) {
        try {
            console.log(`[App Config] Trying online fetch for: ${assetPath}`);
            const onlineUrl = ONLINE_DATA_BASE_URL + assetPath;
            const onlineResponse = await fetch(onlineUrl, {
                ...options,
                method: options.method || 'GET',
                cache: 'no-cache' // Ensure we get fresh data
            });

            if (onlineResponse.ok) {
                console.log(`[App Config] Successfully loaded online data for: ${assetPath}`);
                return onlineResponse;
            }
        } catch (error) {
            console.warn(`[App Config] Online fetch failed for ${assetPath}, falling back to local...`);
        }
    }

    // 2. Fallback: Check if we're in Android WebView and use the bridge
    if (typeof window.Android !== 'undefined' && window.Android.isAndroid()) {
        try {
            const assetContent = window.Android.loadAsset(assetPath);
            if (assetContent) {
                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => JSON.parse(assetContent),
                    text: async () => assetContent
                };
            }
        } catch (error) {
            console.error('[App Config] Android bridge failed:', error);
        }
    }

    // 3. Last Resort: Regular local fetch
    const fullPath = getAssetPath(assetPath);
    try {
        const response = await fetch(fullPath, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response;
    } catch (error) {
        console.error(`[App Config] All fetch attempts failed for ${assetPath}:`, error);
        throw error;
    }
}

// Log app environment on load
document.addEventListener('DOMContentLoaded', () => {
    const env = isAndroidApp() ? 'Android App' : 'Web Browser';
    console.log(`[App Config] Running in: ${env}`);
    console.log(`[App Config] User Agent: ${navigator.userAgent}`);
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.AppConfig = {
        isAndroidApp,
        getAssetPath,
        fetchAsset
    };
}
=======
/**
 * App Configuration & Utilities
 * Handles environment detection and asset loading for both web and Android
 */

// REPLACE THIS with your actual GitHub username and repository name
const GITHUB_USERNAME = 'nawazidris';
const GITHUB_REPO = 'Tango_FC_Apk';
const ONLINE_DATA_BASE_URL = `https://${GITHUB_USERNAME}.github.io/${GITHUB_REPO}/app/src/main/assets/`;

// Detect if running in Android WebView
function isAndroidApp() {
    // Check for Android WebView identifiers
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(ua);
    const isWebView = /webview|wv/.test(ua) || window.AndroidWebView !== undefined;
    const result = isAndroid && (isWebView || typeof window.AndroidWebView !== 'undefined');
    return result;
}

/**
 * Get the correct path for asset files based on environment
 * @param {string} assetPath - Relative path to asset (e.g., 'data/matches.json')
 * @returns {string} - Correct path for current environment
 */
function getAssetPath(assetPath) {
    if (isAndroidApp()) {
        // In Android WebView, use file:///android_asset/ protocol
        return `file:///android_asset/${assetPath}`;
    }
    // In browser/website, use relative path
    return assetPath;
}

/**
 * Fetch asset with proper error handling and retry logic
 * @param {string} assetPath - Path to asset
 * @returns {Promise<Response>}
 */
async function fetchAsset(assetPath, options = {}) {
    // 1. Try to fetch from the Online Server first (if it's a data file)
    if (assetPath.startsWith('data/')) {
        try {
            console.log(`[App Config] Trying online fetch for: ${assetPath}`);
            const onlineUrl = ONLINE_DATA_BASE_URL + assetPath;
            const onlineResponse = await fetch(onlineUrl, {
                ...options,
                method: options.method || 'GET',
                cache: 'no-cache' // Ensure we get fresh data
            });

            if (onlineResponse.ok) {
                console.log(`[App Config] Successfully loaded online data for: ${assetPath}`);
                return onlineResponse;
            }
        } catch (error) {
            console.warn(`[App Config] Online fetch failed for ${assetPath}, falling back to local...`);
        }
    }

    // 2. Fallback: Check if we're in Android WebView and use the bridge
    if (typeof window.Android !== 'undefined' && window.Android.isAndroid()) {
        try {
            const assetContent = window.Android.loadAsset(assetPath);
            if (assetContent) {
                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => JSON.parse(assetContent),
                    text: async () => assetContent
                };
            }
        } catch (error) {
            console.error('[App Config] Android bridge failed:', error);
        }
    }

    // 3. Last Resort: Regular local fetch
    const fullPath = getAssetPath(assetPath);
    try {
        const response = await fetch(fullPath, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response;
    } catch (error) {
        console.error(`[App Config] All fetch attempts failed for ${assetPath}:`, error);
        throw error;
    }
}

// Log app environment on load
document.addEventListener('DOMContentLoaded', () => {
    const env = isAndroidApp() ? 'Android App' : 'Web Browser';
    console.log(`[App Config] Running in: ${env}`);
    console.log(`[App Config] User Agent: ${navigator.userAgent}`);
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.AppConfig = {
        isAndroidApp,
        getAssetPath,
        fetchAsset
    };
}
>>>>>>> 19de20aede773e25a288670608f7d5b9ca18a4f3
