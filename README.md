🤘 Только Chrome. <br>
👻 Серверные данные хранятся в памяти, после перезагрузки все теряется.

# Как запустить

```sh
git clone https://github.com/mishaberezin/oracle
cd oracle
npm ci
npm start
open http://localhost:4000
```

Или

# Как работает

- Верстка на Vue.js
- ServiceWorker кеширует статику и обеспечивает отложенную регистрацию через Background Sync
- Сервер на Express, раздает статику, плюс авторизация и аутентификация через токен.
- В качестве базы данных объект в памяти
