/* MIAMF site analytics — Umami Cloud + Meta (Facebook) Pixel
   Include on every page:  <script src="assets/analytics.js"></script>
   Umami ID: cloud.umami.is → Settings → Websites → Edit → Website ID
   Pixel ID: business.facebook.com → Events Manager → Data sources → your pixel (15–16 digit number) */
var UMAMI_WEBSITE_ID = '4ea47a8e-e74f-479a-9fc8-c994752c54be';
var META_PIXEL_ID = '1519820466497083';

(function () {
  var umamiOn = UMAMI_WEBSITE_ID && !/PASTE-YOUR/.test(UMAMI_WEBSITE_ID);
  // If a pixel snippet is already pasted into the page (e.g. added on GitHub), don't load a second one
  var pixelOn = !window.fbq && META_PIXEL_ID && !/PASTE-YOUR/.test(META_PIXEL_ID);

  if (umamiOn) {
    var s = document.createElement('script');
    s.defer = true;
    s.src = 'https://cloud.umami.is/script.js';
    s.setAttribute('data-website-id', UMAMI_WEBSITE_ID);
    document.head.appendChild(s);
  }

  if (pixelOn) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
    if (document.body && document.body.hasAttribute('data-fb-landing')) fbq('track', 'ViewContent', { content_name: 'Facebook ad landing page' });
    var ns = document.createElement('noscript');
    ns.innerHTML = '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=' + META_PIXEL_ID + '&ev=PageView&noscript=1" />';
    document.body && document.body.appendChild(ns);
  }

  function track(name, data) {
    if (window.umami && umami.track) { try { umami.track(name, data); } catch (e) {} }
  }
  function fb(type, name, data) {
    if (window.fbq) { try { fbq(type, name, data || {}); } catch (e) {} }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button,[type=submit],a');
    if (!btn) return;
    // Newsletter signup — Flodesk renders its own markup, so catch the submit inside it
    if (btn.closest('[id^="fd-form"],.fd-form,[class*="ff-"]')) { track('Newsletter signup completed'); fb('track', 'Lead', { content_name: 'Newsletter' }); return; }
    // Listen clicks → Meta custom event (use as an ad conversion)
    var ev = btn.getAttribute('data-umami-event') || '';
    if (/Listen on Spotify/.test(ev)) fb('trackCustom', 'ListenClick', { platform: 'Spotify' });
    else if (/Listen on Apple/.test(ev)) fb('trackCustom', 'ListenClick', { platform: 'Apple Podcasts' });
    else if (/YouTube/.test(ev) || /youtube\.com/.test(btn.href || '')) fb('trackCustom', 'ListenClick', { platform: 'YouTube' });
  }, true);

  // Contact form
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f && /formspree/.test(f.action || '')) { track('Contact form sent'); fb('track', 'Contact'); }
  }, true);
})();
