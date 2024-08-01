# בסיס הדימוי שלנו יהיה Node.js
FROM node:14

# הגדרת משתנה סביבתי
ENV NODE_ENV=production

# יצירת ספריית עבודה באפליקציה
WORKDIR /app

# העתקת קובץ package.json ו-package-lock.json
COPY package*.json ./

# התקנת התלויות הנדרשות
RUN npm install

# העתקת כל הקבצים של האפליקציה לספריית העבודה
COPY . .

# פתיחת הפורט 3000
EXPOSE 3000

# פקודת הרצה של האפליקציה
CMD ["npm", "start"]
