#!/bin/bash

# יצירת התיקיות אם הן לא קיימות
mkdir -p ./src/{routes,controllers,services,models,middleware}

# פונקציה ליצירת קובץ אם הוא לא קיים
create_file() {
  if [ ! -f "$1" ]; then
    touch "$1"
  fi
}

# יצירת הקבצים אם הם לא קיימים
create_file ./src/app.js
create_file ./src/routes/users.js
create_file ./src/routes/mails.js
create_file ./src/controllers/usersController.js
create_file ./src/controllers/mailsController.js
create_file ./src/services/usersService.js
create_file ./src/services/mailsService.js
create_file ./src/models/user.js
create_file ./src/middleware/auth.js
