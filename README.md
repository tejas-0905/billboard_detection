# 🏙️ Billboard Detection System  

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Tech](https://img.shields.io/badge/tech-Flask%20|%20YOLOv5%20|%20Firebase-blue)

A **smart, scalable, mobility-based detection application** that identifies unauthorized or non-compliant billboards by analyzing captured images or live video.  
This project integrates **real-time image detection, citizen engagement, and regulatory compliance checks** to streamline the process of identifying illegal billboards.

---

## 🔎 Overview  
Illegal and non-compliant billboards clutter cities, cause safety issues, and violate regulations.  
Our solution allows citizens and authorities to:  
- Detect unauthorized billboards in **real-time**.  
- Report them with **geo-tagged evidence**.  
- Track and analyze **violation hotspots** for better urban planning.
- The system bridges citizens and authorities through smart automation.
- It minimizes manual inspection and speeds up enforcement.
- It helps build cleaner and safer cities.

---

## 🚀 Features  

- 📸 **Image & Video Input** – Capture from camera or upload existing image/video.  
- 🤖 **AI-Powered Detection** – Detect unauthorized billboards using trained YOLO/TensorFlow models.  
- 📊 **Real-Time Results** – Get instant feedback with detection highlights.  
- 🔗 **Firebase Integration** – Stores user submissions and updates points in profile.  
- 📢 **Citizen Engagement** – Users can report violations and contribute to cleaner cities.
- 🗺️ Geo-Tagging Support – Automatically attach location coordinates to each report.
- 🕒 Violation History – View previously reported billboards and their status.


---

## 🛠️ Tech Stack  

| **Category**     | **Technology Used** |
|------------------|--------------------|
| **Frontend**     | HTML, CSS, JavaScript |
| **Backend**      | Flask / Node.js |
| **AI/ML**        | OpenCV, TensorFlow / YOLOv5 |
| **Database**     | Firebase (Realtime DB / Firestore) |
| **Hosting**      | Netlify (frontend), Heroku/Render (backend) |

---

## ⚙️ Workflow  

1. **User uploads** an image/video or captures via camera.  
2. **AI model processes** the input using YOLO/TensorFlow and highlights billboard regions.  
3. **System checks compliance** (registered vs. unauthorized).  
4. **Firebase logs report** with user profile & geo-coordinates.  
5. **Authorities dashboard** (future scope) can verify and take action.  

---

## 🧑‍💻 Installation  

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/tejas-0905/billboard_detection.git
cd billboard_detection
```
### Backend (Flask)
```bash
pip install -r requirements.txt
python app.py
```
### Backend (Node.js)
```bash
npm install
npm start
```

### Frontend
Deploy via Netlify or run locally by opening `index.html`.

##  Acknowledgments  
Special thanks to the tools, frameworks, and contributors that made this project possible:  

- **[YOLOv5](https://github.com/ultralytics/yolov5)** – For providing state-of-the-art object detection models.  
- **[OpenCV](https://opencv.org/)** – For enabling fast and efficient image processing.  
- **[Firebase](https://firebase.google.com/)** – For real-time database and user authentication support.  
- **Netlify & Heroku** – For seamless cloud hosting and deployment.  
- **Open-Source Community** – For valuable resources, tutorials, and datasets.  
- **Contributors & Testers** – For helping improve the system with feedback and bug reports.  

