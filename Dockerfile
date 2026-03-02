# imagem base
FROM node:20-alpine

# cria pasta
WORKDIR /app

# copia dependências
COPY package*.json ./

# instala deps
RUN npm install

# copia resto do projeto
COPY . .

# gera prisma client
RUN npx prisma generate

# build da aplicação
RUN npm run build

# expõe porta
EXPOSE 3000

# start
CMD ["node", "dist/main"]