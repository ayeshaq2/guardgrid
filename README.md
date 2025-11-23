---

# **Caldera — Early Natural-Disaster Detection & Community Alerting Platform**

Caldera is a real-time, multi-hazard monitoring platform that uses **IoT sensors**, **AI-verified user reports**, **geospatial mapping**, and **live news intelligence** to alert communities about potential natural-disaster risks in their area.
It provides fast, trusted, and accessible early-warning capabilities for wildfires, floods, storms, and more.

---

## ** Features**

* **IoT Sensor Monitoring** — Temperature & air-quality sensors detect abnormal heat/smoke using on-device Python microcontroller code.
* **Instant SMS Alerts** — Automatically triggers alerts when thresholds indicating potential wildfires are reached.
* **User Incident Reports** — Community members can submit disaster reports with images stored securely in **Supabase Storage**.
* **AI-Assisted Verification** (future) — Planned integration with vision models to validate whether submitted images contain fire or other hazards.
* **Interactive Disaster Map** — Built with **Leaflet**, showing sensor locations, user reports, and alert zones.
* **Live News Feed** — Pulls the latest natural-disaster articles from trusted outlets for situational awareness.
* **Secure Authentication** — Supabase Auth handles sign-ups, logins, and role-protected pages.
* **Real-Time Dashboard** — Sensor alerts, new reports, and map updates refresh instantly via Supabase’s real-time APIs.
* **Scalable Multi-Hazard Design** — Built to support fires, floods, storms, earthquakes, and future environmental threats.

---

## ** Tech Stack**

### **Frontend**

* **React + TypeScript (Vite)**
* **Leaflet.js** for interactive maps
* **Nominatim (OpenStreetMap Geocoding API)** for location lookup
* **ShadCN UI** component system
* **TailwindCSS**

### **Backend / Infrastructure**

* **Supabase**

  * Auth
  * Database
  * Storage (images)
  * Real-time listeners
  * Edge Functions

* **SMS Alerts** via Supabase Edge or external SMS integration

* **(Future)** OpenRouter / Vision APIs for image-based fire verification

### **IoT Hardware**

* **Python microcontroller**
* Connected temperature + air-quality sensors
* Sends sensor readings to cloud endpoint
* Triggers SMS and database updates

---

## ** Getting Started**

1. Clone the repository.
2. Add your Supabase credentials to a `.env` file:

   ```
   VITE_SUPABASE_URL=""
   VITE_SUPABASE_ANON_KEY=""
   ```
3. Install dependencies:

   ```
   npm install
   ```
4. Run the development server:

   ```
   npm run dev
   ```

---

## ** Project Structure**

```
src/
 ├── components/
 ├── pages/
 ├── services/
 ├── hooks/
 ├── utils/
 └── types/
```

---

## ** Future Plans**

* Full AI-powered incident verification
* More sensor types (flooding, seismic, wind, humidity)
* Community alert networks & escalation logic
* Mobile app
* Deployment optimization and scaling
* Public API for local governments & responders

---
