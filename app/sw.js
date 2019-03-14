importScripts("/idb.js");

var cacheKey = "oracle_1";
var filesToCache = [
  // "/",
  // "/index.html",
  // "/index.html?pwa=1",
  // "/vue.min.js",
  // "/index.js",
  // "/index.css",
  // "/data/emoji.json",
  // "/data/texts.json",
  // "/img/wizard-32.png",
  // "/img/wizard-192.png"
];

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

const store = {
  db: null,

  init: function() {
    if (store.db) {
      return Promise.resolve(store.db);
    }
    return idb
      .openDb("messages", 1, function(upgradeDb) {
        upgradeDb.createObjectStore("outbox", {
          autoIncrement: true,
          keyPath: "id"
        });
      })
      .then(function(db) {
        return (store.db = db);
      });
  },

  outbox: function(mode) {
    return store.init().then(function(db) {
      return db.transaction("outbox", mode).objectStore("outbox");
    });
  }
};

self.addEventListener("sync", function(event) {
  if (!event.tag.startsWith("outbox")) return;

  const clientIdForMessages = event.tag.match(/^outbox_(.+)$/)[1];

  event.waitUntil(
    store
      .outbox("readonly")
      .then(function(outbox) {
        return outbox.getAll();
      })
      .then(function(fetches) {
        return Promise.all(
          fetches.map(function(args) {
            return fetch(...args)
              .then(function(response) {
                // response как есть через postMessage не отправишь
                if (response.ok) {
                  return {
                    ok: response.ok,
                    status: response.status,
                    json: null
                  };
                } else {
                  return response.json().then(json => ({
                    ok: response.ok,
                    status: response.status,
                    json
                  }));
                }
              })
              .then(resp => {
                clients.matchAll().then(clients => {
                  clients.forEach(client => {
                    client.postMessage({
                      client: clientIdForMessages,
                      id: args.id,
                      resp
                    });
                  });
                });

                return store.outbox("readwrite").then(outbox => {
                  return outbox.delete(args.id);
                });
              });
          })
        );
      })
      .catch(function(err) {
        console.error(err);
      })
  );
});
