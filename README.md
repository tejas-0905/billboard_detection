# 🏙️ Billboard Detection System  

A **smart, scalable, mobility-based detection application** that identifies unauthorized or non-compliant billboards by analyzing captured images or live video.  
This project integrates **real-time image detection, citizen engagement, and regulatory compliance checks** to streamline the process of identifying illegal billboards.

---

## 🚀 Features  

- 📸 **Image & Video Input** – Capture from camera or upload existing image/video.  
- 🤖 **AI-Powered Detection** – Detect unauthorized billboards using trained models.  
- 📊 **Real-Time Results** – Get instant feedback with detection highlights.  
- 🌐 **User-Friendly Interface** – Modern, responsive web app UI.  
- 🔗 **Firebase Integration** – Stores user submissions and updates points in profile.  
- 📢 **Citizen Engagement** – Users can report violations and contribute to cleaner cities.  
- 🗺️ **Geo-Tagging Support** – Each report is linked with location for verification.  

---

## 🛠️ Tech Stack  

| **Category**         | **Technology Used** |
|----------------------|----------------------|
| **Frontend**         | HTML, CSS, JavaScript |
| **Backend**          | Flask / Node.js |
| **AI/ML**            | OpenCV, TensorFlow / YOLOv5 |
| **Database**         | Firebase (Realtime DB / Firestore) |
| **Hosting**          | Netlify (frontend), Heroku/Render (backend) |

---

## ⚙️ Workflow  

1. **User uploads** an image/video or captures via camera.  
2. **AI model processes** the input using YOLO/TensorFlow and highlights billboard regions.  
3. **System checks compliance** (registered vs. unauthorized).  
4. **Firebase logs report** with user profile & geo-coordinates.  
5. **Authorities dashboard** (future scope) can verify and take action.  

---

## 🧑‍💻 Installation  

Run locally with these steps:  

```bash
# Clone the repository
git clone https://github.com/tejas-0905/billboard_detection.git

# Navigate to project directory
cd billboard_detection

# Install dependencies
pip install -r requirements.txt   # For Python backend
# or
npm install                       # For Node backend

# Run the app
python app.py    # Flask
# or
npm start        # Node.js├── app.py              # Main entry point (Flask)
├── requirements.txt    # Python dependencies
└── README.md           # This file

``` 
## 🔮 Future Scope

- 📡 **IoT Integration** – Real-time detection from surveillance cameras.
- 📈 **Analytics Dashboard** – Insights for authorities on violation hotspots.
- 🏙️ **Smart City Integration** – Connect with municipal APIs for automated action.
- 🔐 **User Authentication** – Secure login and leaderboard for citizen engagement.


### Backend (Flask)
```bash
pip install -r requirements.txt
python app.py
### Backend (Node.js)
```bash
npm install
npm start

