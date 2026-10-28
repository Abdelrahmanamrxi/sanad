(function () {
  "use strict";

  // Prevent multiple injections
  if (window.__SANAD_WIDGET_LOADED__) return;
  window.__SANAD_WIDGET_LOADED__ = true;

  // 1. Locate script tag and extract configuration
  var currentScript =
    document.currentScript ||
    document.querySelector("script[data-business-id]") ||
    document.querySelector("script[data-widget-key]") ||
    document.querySelector("script[data-key]") ||
    document.querySelector("script[data-id]");

  if (!currentScript) {
    console.warn("[Sanad] Widget script tag not found with business/widget identifier.");
    return;
  }

  var widgetKey = (
    currentScript.getAttribute("data-business-id") ||
    currentScript.getAttribute("data-widget-key") ||
    currentScript.getAttribute("data-key") ||
    currentScript.getAttribute("data-id") ||
    ""
  ).trim();

  if (!widgetKey) {
    console.warn("[Sanad] Widget key or business ID missing from script tag attributes.");
    return;
  }

  // Determine host origin (respects data-host / data-app-url, cdn fallback, or script origin)
  var hostAttr =
    currentScript.getAttribute("data-host") ||
    currentScript.getAttribute("data-app-url");
  var sanadHost = "";

  if (hostAttr) {
    sanadHost = hostAttr.replace(/\/+$/, "");
  } else {
    try {
      var scriptUrl = new URL(currentScript.src, window.location.href);
      if (scriptUrl.hostname === "cdn.sanad.app") {
        sanadHost = "https://sanad.app";
      } else {
        sanadHost = scriptUrl.origin;
      }
    } catch {
      sanadHost = window.location.origin;
    }
  }

  // Determine parent origin to pass in query params for access validation
  var parentOrigin = "";
  try {
    parentOrigin =
      window.location.origin ||
      window.location.protocol + "//" + window.location.host;
  } catch {
    parentOrigin = "";
  }

  // 2. Create the Widget Iframe
  var iframe = document.createElement("iframe");
  iframe.id = "sanad-chat-frame";
  iframe.title = "Sanad AI Assistant";

  var pagePath = window.location.pathname || "/";
  var embedUrl = sanadHost + "/embed/" + encodeURIComponent(widgetKey); 


  if (parentOrigin) {
    embedUrl += "?host=" + encodeURIComponent(parentOrigin);
  }
  embedUrl += (embedUrl.indexOf("?") === -1 ? "?" : "&") + "page=" + encodeURIComponent(pagePath);
  
  iframe.src = embedUrl;
  iframe.allow = "clipboard-write";
  iframe.setAttribute("allowtransparency", "true");
  iframe.setAttribute("frameborder", "0");

  // Check if position was explicitly hinted on script tag (e.g. data-position="bottom-left")
  var hintedPosition = currentScript.getAttribute("data-position");
  var isInitialBottomLeft = hintedPosition === "bottom-left";

  // Base styles: initially positioned as a floating launcher
  var baseStyles = {
    position: "fixed",
    zIndex: "2147483647",
    border: "none",
    background: "transparent",
    backgroundColor: "transparent",
    colorScheme: "normal",
    overflow: "hidden",
    boxShadow: "none",
    transition: "width 0.2s ease, height 0.2s ease, transform 0.2s ease",
    bottom: "0px",
    right: isInitialBottomLeft ? "auto" : "0px",
    left: isInitialBottomLeft ? "0px" : "auto",
    width: "240px",
    height: "90px",
    maxHeight: "100dvh",
  };

  Object.assign(iframe.style, baseStyles);

  // 3. Mount iframe once DOM is ready
  function mountIframe() {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", mountIframe);
      return;
    }
    if (!document.getElementById("sanad-chat-frame")) {
      document.body.appendChild(iframe);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountIframe);
  } else {
    mountIframe();
  }

  // 4. Handle communication with the embedded chat widget
  var isWidgetOpen = false;

  window.addEventListener("message", function (event) {
    if (!event.data || typeof event.data !== "object") return;

    // Security check: only listen to messages coming directly from our iframe content window
    if (iframe.contentWindow && event.source !== iframe.contentWindow) {
      return;
    }

    if (event.data.type === "sanad:not_found") {
      var isNotFoundOpen = !!event.data.isOpen;
      isWidgetOpen = isNotFoundOpen;
      if (isNotFoundOpen) {
        if (window.innerWidth <= 480) {
          iframe.style.width = "100vw";
          iframe.style.height = "100dvh";
          iframe.style.maxHeight = "100dvh";
          iframe.style.top = "0px";
          iframe.style.bottom = "0px";
          iframe.style.left = "0px";
          iframe.style.right = "0px";
        } else {
          iframe.style.top = "auto";
          iframe.style.width = "380px";
          iframe.style.height = "240px";
          iframe.style.bottom = "12px";
          iframe.style.right = "12px";
          iframe.style.left = "auto";
        }
      } else {
        iframe.style.top = "auto";
        iframe.style.width = "220px";
        iframe.style.height = "60px";
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
        iframe.style.left = "auto";
      }
      return;
    }

    if (event.data.type === "sanad:resize") {
      var isOpen = !!event.data.isOpen;
      isWidgetOpen = isOpen;
      var isBottomLeft = event.data.position === "bottom-left";
      var launcherStyle = event.data.launcherStyle || "badge";
      var isMobile = window.innerWidth <= 480;

      if (isOpen) {
        if (isMobile) {
          iframe.style.width = "100vw";
          iframe.style.height = "100dvh";
          iframe.style.maxHeight = "100dvh";
          iframe.style.top = "0px";
          iframe.style.bottom = "0px";
          iframe.style.left = "0px";
          iframe.style.right = "0px";
        } else {
          iframe.style.top = "auto";
          iframe.style.width = "430px";
          iframe.style.height = "min(660px, calc(100vh - 24px))";
          iframe.style.maxHeight = "calc(100vh - 24px)";
          iframe.style.bottom = "12px";
          if (isBottomLeft) {
            iframe.style.left = "12px";
            iframe.style.right = "auto";
          } else {
            iframe.style.right = "12px";
            iframe.style.left = "auto";
          }
        }
      } else {
        // Reset to launcher dimensions (240px width allows badge text without clipping)
        iframe.style.top = "auto";
        iframe.style.height = "90px";
        iframe.style.maxHeight = "90px";
        iframe.style.width = launcherStyle === "icon" ? "90px" : "240px";
        iframe.style.bottom = "0px";

        if (isBottomLeft) {
          iframe.style.left = "0px";
          iframe.style.right = "auto";
        } else {
          iframe.style.right = "0px";
          iframe.style.left = "auto";
        }
      }
    }
  });

  // 5. Expose Global JavaScript SDK
  window.SanadWidget = {
    open: function () {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "sanad:cmd_open" }, "*");
      }
    },
    close: function () {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "sanad:cmd_close" }, "*");
      }
    },
    toggle: function () {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "sanad:cmd_toggle" }, "*");
      }
    },
    isOpen: function () {
      return isWidgetOpen;
    },
  };
})();
