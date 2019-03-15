importScripts("/idb.js");
importScripts("/outbox.js");

var cacheKey = "oracle_1";
var filesToCache = [
  "/",
  "/index.html",
  "/index.html?pwa=1",
  "/idb.js",
  "/vue.min.js",
  "/outbox.js",
  "/index.js",
  "/index.css",
  "/img/wizard-32.png",
  "/img/wizard-192.png",
  "/img/placeholder.png"
];

// Добавляем файлы в кеш.
self.addEventListener("install", e => {
  e.waitUntil(caches.open(cacheKey).then(cache => cache.addAll(filesToCache)));
});

// Удаляем устаревшие кеши.
self.addEventListener("activate", e => {
  e.waitUntil(
    caches
      .keys()
      .then(list =>
        Promise.all(
          list.filter(key => key !== cacheKey).map(key => caches.delete(key))
        )
      )
  );
  return self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(resp => resp || fetch(e.request)));
});

self.addEventListener("sync", function(event) {
  if (event.tag === "outbox") {
    event.waitUntil(syncOutbox());
  }
});

const outboxStore = createOutboxStore();
const postMessageableResp = resp => {
  return resp
    .json()
    .catch(() => null)
    .then(json => ({
      ok: resp.ok,
      status: resp.status,
      json
    }));
};

const syncOutbox = () => {
  return outboxStore()
    .then(store => store.getAll())
    .then(fetchesArgs => {
      return Promise.all(
        fetchesArgs.map(args => {
          return fetch(...args)
            .then(resp => postMessageableResp(resp))
            .then(data => {
              outboxStore().then(store => store.delete(args.id));
              clients.matchAll().then(clients => {
                clients.forEach(client => {
                  client.postMessage({
                    id: args.id,
                    data
                  });
                });
              });
            });
        })
      );
    })
    .catch(err => {
      console.error(err);
    });
};
