
(() => {
  const prefixes = {
    // Common Pakistani mobile prefix ranges (simple, not exhaustive)
    // We'll check first 4 digits (e.g., 0300..0399) where possible.
    // These mappings are common examples and may not be exhaustive or fully up-to-date.
    "030": "Jazz / Warid",
    "031": "Jazz / Warid",
    "032": "Zong",
    "033": "Ufone",
    "034": "Telenor",
    "035": "Zong (Mobile)",
    "036": "PTCL/Other",
    "037": "Special / Other",
    "038": "Special / Other",
    "039": "Reserved / Other"
  };

  const circleHints = {
    "030": "عام طور پر Punjab / Sindh / All Pakistan",
    "031": "عام طور پر Punjab / Sindh / All Pakistan",
    "032": "عام طور پر Punjab / Sindh / All Pakistan",
    "033": "عام طور پر Punjab / Sindh / All Pakistan",
    "034": "عام طور پر Punjab / Sindh / All Pakistan",
    "035": "عام طور پر Punjab / Sindh / All Pakistan"
  };

  const $ = id => document.getElementById(id);
  const input = $("numberInput");
  const lookup = $("lookupBtn");
  const clear = $("clearBtn");
  const results = $("results");
  const validity = $("validity");
  const operator = $("operator");
  const circle = $("circle");
  const notes = $("notes");
  const locBtn = $("locBtn");
  const mapContainer = $("map");

  function resetResults(){
    results.classList.add("hidden");
    validity.textContent = "";
    operator.textContent = "";
    circle.textContent = "";
    notes.textContent = "";
  }

  function sanitize(v){ return v.replace(/[^\d]/g,''); }

  function detectOperator(num){
    // expects numeric string starting with 03XXXXXXXXX (11 digits)
    if(num.length < 4) return null;
    const key3 = num.slice(0,3); // 03X
    const key4 = num.slice(0,4); // 03XX
    if(prefixes[key3]) return prefixes[key3];
    // fallback try first 4 with leading zero removed (e.g., 300..)
    const keyNoZero = num.slice(1,4);
    if(prefixes[keyNoZero]) return prefixes[keyNoZero];
    return "Unknown (prefix not in local table)";
  }

  function detectCircle(num){
    const key3 = num.slice(0,3);
    return circleHints[key3] || "Unknown / Varies by operator";
  }

  lookup.addEventListener("click", () => {
    const raw = input.value || "";
    const n = sanitize(raw);
    resetResults();
    if(n.length === 11 && n.startsWith("03")){
      results.classList.remove("hidden");
      validity.textContent = "Valid Pakistani mobile number";
      operator.textContent = detectOperator(n);
      circle.textContent = detectCircle(n);
      notes.textContent = "یہ معلومات محض تعلیمی اور عام prefixes کی بنیاد پر دی گئی ہیں — حقیقی لوکیشن کیلئے قانونی APIs درکار ہونگے۔";
    } else {
      results.classList.remove("hidden");
      validity.textContent = "Invalid format — ایک درست پاکستانی موبائل نمبر 11 digits کا ہوتا ہے اور 03 سے شروع ہوتا ہے";
      operator.textContent = "—";
      circle.textContent = "—";
      notes.textContent = "مثال: 03123456789";
    }
  });

  clear.addEventListener("click", ()=>{
    input.value = "";
    resetResults();
    // hide map
    mapContainer.classList.add("hidden");
    mapContainer.innerHTML = "";
  });

  locBtn.addEventListener("click", ()=>{
    if(!navigator.geolocation){
      alert("آپ کے براؤزر میں Geolocation supported نہیں ہے۔");
      return;
    }
    locBtn.textContent = "Getting location… (براہِ کرم اجازت دیں)";
    navigator.geolocation.getCurrentPosition((pos)=>{
      locBtn.textContent = "Show My Location on Map";
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      mapContainer.classList.remove("hidden");
      // create leaflet map
      mapContainer.style.height = "320px";
      mapContainer.innerHTML = "";
      const map = L.map(mapContainer).setView([lat, lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(map);
      const marker = L.marker([lat, lon]).addTo(map);
      marker.bindPopup("Your device location").openPopup();
    }, (err)=>{
      locBtn.textContent = "Show My Location on Map";
      alert("Location error: " + (err && err.message ? err.message : "permission denied or unavailable"));
    }, {enableHighAccuracy:false, timeout:10000});
  });

  // allow pressing Enter to lookup
  input.addEventListener("keydown", (e)=>{
    if(e.key === "Enter") lookup.click();
  });

})();
