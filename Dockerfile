# Use the official Node.js image as the base image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# # Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm rebuild

# # Install the dependencies
RUN npm ci

# # Copy the rest of the application code to the working directory
COPY . .

# # # Copy the source code to the working directory
# RUN npm run build

# # Expose the port the app runs on
EXPOSE 3000

# # Define the command to run the application
CMD ["npm", "start"]