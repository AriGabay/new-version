#!/bin/bash


# run file :
# chmod +x setup.sh
# ./setup.sh

# Create directories if they don't exist
mkdir -p src/controllers
mkdir -p src/middleware
mkdir -p src/models
mkdir -p src/routes
mkdir -p src/services

# Create files if they don't exist
touch Dockerfile
touch README.md
touch docker-compose.yml
touch package-lock.json
touch package.json

# Create files in src/controllers if they don't exist
[ ! -f src/controllers/addressController.js ] && touch src/controllers/addressController.js
[ ! -f src/controllers/authController.js ] && touch src/controllers/authController.js
[ ! -f src/controllers/filesController.js ] && touch src/controllers/filesController.js
[ ! -f src/controllers/mailManagerController.js ] && touch src/controllers/mailManagerController.js
[ ! -f src/controllers/usersController.js ] && touch src/controllers/usersController.js

# Create src/index.js if it doesn't exist
[ ! -f src/index.js ] && touch src/index.js

# Create files in src/middleware if they don't exist
[ ! -f src/middleware/auth.js ] && touch src/middleware/auth.js
[ ! -f src/middleware/upload.js ] && touch src/middleware/upload.js

# Create files in src/models if they don't exist
[ ! -f src/models/address.js ] && touch src/models/address.js
[ ! -f src/models/file.js ] && touch src/models/file.js
[ ! -f src/models/mailManager.js ] && touch src/models/mailManager.js
[ ! -f src/models/user.js ] && touch src/models/user.js

# Create files in src/routes if they don't exist
[ ! -f src/routes/addresses.js ] && touch src/routes/addresses.js
[ ! -f src/routes/auth.js ] && touch src/routes/auth.js
[ ! -f src/routes/files.js ] && touch src/routes/files.js
[ ! -f src/routes/mailManager.js ] && touch src/routes/mailManager.js
[ ! -f src/routes/users.js ] && touch src/routes/users.js

# Create files in src/services if they don't exist
[ ! -f src/services/addressService.js ] && touch src/services/addressService.js
[ ! -f src/services/filesService.js ] && touch src/services/filesService.js
[ ! -f src/services/mailManagerService.js ] && touch src/services/mailManagerService.js
[ ! -f src/services/usersService.js ] && touch src/services/usersService.js

echo "Setup completed!"