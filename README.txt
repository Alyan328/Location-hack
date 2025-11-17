
Pakistan Number Tracker — Simple Build
====================================

Files:
 - index.html         -> Main page
 - earth_logo.png     -> Small earth logo used in header & favicon
 - assets/main.js     -> App logic: validation, operator detection, geolocation map
 - assets/main.css    -> Styling (dark theme, Urdu RTL)

How to use:
 - Extract the ZIP on your local machine or upload folder to Vercel / any static host.
 - Ensure index.html and earth_logo.png are at root; assets folder at root as well.
 - Open index.html in browser. To see map, click 'Show My Location on Map' and allow geolocation permission.

Notes:
 - Number validation: expects 11 digits starting with '03' (e.g., 03123456789).
 - Operator detection uses common prefixes (not exhaustive). This tool does NOT perform real-time tracking — for live location telecom APIs and legal permissions are required.
