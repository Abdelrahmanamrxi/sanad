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
    document.querySelector("script[data-key]");

  if (!currentScript) {
    console.warn("[Sanad] Widget script tag not found with business/widget identifier.");
    return;
  }

  var widgetKey =
    currentScript.getAttribute("data-business-id") ||
    currentScript.getAttribute("data-widget-key") ||
    currentScript.getAttribute("data-key");

  if (!widgetKey) {
    console.warn("[Sanad] Widget key or business ID missing from script tag attributes.");
    return;
  }

  // Determine host origin (defaults to script origin or current origin)
  var scriptUrl;
  try {
    scriptUrl = new URL(currentScript.src);
  } catch {
    scriptUrl = { origin: window.location.origin };
  }
  var sanadHost = scriptUrl.origin;

  // 2. Create the Widget Iframe
  var iframe = document.createElement("iframe");
  iframe.id = "sanad-chat-frame";
  iframe.title = "Sanad AI Assistant";
  iframe.src = sanadHost + "/embed/" + encodeURIComponent(widgetKey);
  iframe.allow = "clipboard-write";

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
    right: "0px",
    width: "200px",
    height: "100px",
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
  window.addEventListener("message", function (event) {
    if (!event.data || typeof event.data !== "object") return;

    if (event.data.type === "sanad:toggle") {
      var isOpen = !!event.data.isOpen;
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
          iframe.style.height = "660px";
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
        // Reset to launcher dimensions (240px width allows Arabic badge text without clipping)
        iframe.style.top = "auto";
        iframe.style.height = "90px";
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
        iframe.contentWindow.postMessage({ type: "sanad:open" }, "*");
      }
    },
    close: function () {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "sanad:close" }, "*");
      }
    },
    toggle: function () {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "sanad:toggle" }, "*");
      }
    },
  };
})();
