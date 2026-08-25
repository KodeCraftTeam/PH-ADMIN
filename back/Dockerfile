FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install --ignore-scripts
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]