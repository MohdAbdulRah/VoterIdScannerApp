# 🗳️ VoterID Scanner App (India Only)

A React Native (Expo) mobile application that scans or uploads an **Indian Voter ID card** and extracts the **Voter ID (EPIC) number** using an ML-based text recognition library.

If the uploaded or scanned image is not a valid Indian Voter ID, the app displays:

> ❌ **Invalid Voter ID**

⚠️ This application works **only for Indian Voter ID cards** issued by the :contentReference[oaicite:0]{index=0}.

---

## 🚀 Features

- 📷 Scan Voter ID using Camera  
- 🖼️ Upload Voter ID from Gallery  
- 🤖 ML-based Text Recognition (OCR)  
- 🔍 Extracts EPIC (Voter ID) Number automatically  
- ✅ Validates Indian Voter ID format  
- ❌ Displays "Invalid Voter ID" for incorrect uploads  
- 🇮🇳 Works only for Indian IDs  

---

## 📸 Screenshots



<img width="1080" height="2340" alt="image" src="https://github.com/user-attachments/assets/6d377458-4054-4804-aaca-e80ae6fefa0c" />

<img width="1080" height="2340" alt="image" src="https://github.com/user-attachments/assets/1fb35671-c68e-4428-bb52-b35baf43996a" />


---



## 🛠️ Tech Stack

- **React Native**
- **Expo**
- **ML Kit / Expo Text Recognition**
- **JavaScript / TypeScript**

---

## 🧠 How It Works

1. User selects:
   - 📷 Capture from Camera  
   - 🖼️ Upload from Gallery  

2. The image is processed using an ML-based OCR library.

3. Extracted text is scanned for EPIC format:

Format: 3 Alphabet Letters + 7 Digits
Example: ABC1234567


4. If pattern matches:
   - ✅ Voter ID Number is displayed.
   
5. If pattern does not match:
   - ❌ "Invalid Voter ID" message is shown.

---

## 🔐 Validation Logic

```javascript
const voterIdRegex = /^[A-Z]{3}[0-9]{7}$/;
```
Validation Rules:

Must contain 3 uppercase letters

Followed by 7 digits

No extra characters allowed

## 📦 Installation
git clone https://github.com/yourusername/voterid-scanner.git
cd voterid-scanner
npm install
npx expo start

## 📱 Permissions Required
Camera Access

Media Library Access

Expo automatically handles permission prompts.

## ❗ Error Handling

| Scenario              | Response                          |
|-----------------------|-----------------------------------|
| Image not clear       | Shows scanning error              |
| Not a Voter ID card   | Displays ❌ Invalid Voter ID      |
| No text detected      | Prompts user to try again         |
| Wrong ID format       | Displays ❌ Invalid Voter ID      |


## 📌 Limitations
Works only for Indian EPIC format

Image must be clear and readable

Does not verify with government database

Offline validation only (format-based)

## 🔮 Future Enhancements
Aadhaar & PAN Card Support

Backend verification integration

Auto-cropping Voter ID region

Improved AI accuracy

Dark mode support

## 📄 License
This project is for educational and demonstration purposes only.

It is not affiliated with the Government of India or the Election Commission.

## 👨‍💻 Author
Developed by Mohd Abdul Rahman
React Native | Expo | ML Enthusiast
