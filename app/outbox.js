(global => {
  const createOutboxStore = () => {
    const db = idb.openDb("fetches", 1, upgradeDb => {
      upgradeDb.createObjectStore("outbox", {
        autoIncrement: true,
        keyPath: "id"
      });
    });

    return () => {
      return db.then(db => {
        return db.transaction("outbox", "readwrite").objectStore("outbox");
      });
    };
  };

  // Как fetch, только с ретраями и
  // отложенной отправкой через Background Sync.
  const createOutbox = () => {
    const sw = navigator.serviceWorker;
    const store = createOutboxStore();
    const map = {};

    sw.addEventListener("message", ({ data: { id, data } }) => {
      if (map[id]) {
        const json = data.json;
        data.json = () => Promise.resolve(json); // Как в нативном fetch
        map[id](data);
        delete map[id];
      }
    });

    return (...args) => {
      return store()
        .then(store => {
          return store.put(args);
        })
        .then(id => {
          return sw.ready
            .then(reg => reg.sync.register("outbox"))
            .then(() => {
              return new Promise(resolve => {
                map[id] = resolve;
              });
            });
        });
    };
  };

  global.createOutbox = createOutbox;
  global.createOutboxStore = createOutboxStore;
})(this);
