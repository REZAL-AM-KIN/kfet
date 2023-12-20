FROM node:20.5.1
WORKDIR /kfet

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# start the app
CMD ["npm", "start"]
