FROM node:alpine

ENV NODE_ENV=production
RUN npm install pm2 -g

# Install app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
RUN npm run build

# Expose port and enable traefik proxy
EXPOSE 3000
EXPOSE 8000
LABEL traefik.enable="true"
LABEL traefik.first.port="8000"
LABEL traefik.first.frontend.rule="Host:dominus.panen.ga;PathPrefix:/gameapi;PathPrefixStrip:/gameapi"
LABEL traefik.third.port="8000"
LABEL traefik.third.frontend.rule="Host:dominus.panen.ga;PathPrefix:/socket.io"
LABEL traefik.second.port="3000"
LABEL traefik.second.frontend.rule="Host:dominus.panen.ga"

# Run app
CMD ["pm2-runtime", "ecosystem.config.js"]