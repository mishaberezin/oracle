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

# Как работает

- Верстка на Vue.js
- ServiceWorker кеширует статику и обеспечивает отложенную регистрацию через Background Sync
- Сервер на Express, раздает статику, плюс авторизация и аутентификация через токен.
- В качестве базы данных объект в памяти

# Как пользоваться

Приложение показывает предсказание на день. Чтобы увидеть предсказание, нужно раскрыть четыре эмодзи-карточки. Предсказание можно получить как на сегодня, так и на любой другой день, для перемещения по дням используйте стрелки в верхней части.

<img src="https://i.ibb.co/GF3QKVg/Screenshot-2019-03-15-at-13-21-19.png" width="170"><img src="https://i.ibb.co/8cwt5CM/Screenshot-2019-03-15-at-13-24-18.png" width="170"><img src="https://i.ibb.co/9pHy8dz/Screenshot-2019-03-15-at-13-25-17.png" width="170"><img src="https://i.ibb.co/fvHy6n2/Screenshot-2019-03-15-at-13-25-00.png" width="170"><img src="https://i.ibb.co/ySKMsXM/Screenshot-2019-03-15-at-13-32-47.png" width="170">
