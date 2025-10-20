# ===== Stage 1: Builder =====
FROM node:20-alpine AS builder

WORKDIR /app

# package.json + package-lock.json zuerst kopieren → schnelleres Caching
COPY package*.json ./

# Dependencies installieren
RUN npm ci

# Rest des Projekts kopieren
COPY . .

# Build erzeugen
RUN npm run build

# ===== Stage 2: Slim Image für Deployment / Preview =====
FROM node:20-alpine AS runner

WORKDIR /app

# Nur das Build-Verzeichnis kopieren
COPY --from=builder /app/dist ./dist

# Optional: serve installieren (leichtes Preview-Tool)
RUN npm install -g serve

# Preview Server starten
CMD ["serve", "-s", "dist", "-l", "4173"]
