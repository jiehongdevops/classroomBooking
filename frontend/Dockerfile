FROM node:14
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN cp public/index.html ./
COPY ./pages ./src/pages/
COPY ./components ./src/components/
EXPOSE 5173
CMD ["npm", "run", "dev"]

