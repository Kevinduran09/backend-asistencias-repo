# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de configuración de Node.js (package.json y package-lock.json)
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Instala las dependencias necesarias para SQLite (esto instalará las librerías C necesarias para que SQLite funcione en el contenedor)
RUN apt-get update && apt-get install -y \
  sqlite3 \
  libsqlite3-dev

# Copia todo el código fuente de tu aplicación al contenedor
COPY . .

# Expón el puerto donde tu aplicación escuchará (en este caso, 3000)
EXPOSE 3000

# Comando para iniciar la aplicación con node app.js
CMD ["node", "app.js"]
