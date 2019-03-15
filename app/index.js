Vue.component("weekday", {
  props: {
    date: {
      type: Date,
      default: function() {
        return new Date();
      }
    }
  },
  template: `
    <div class="weekday">{{ this.date.toLocaleString("ru-RU", {weekday: "long",month: "short",day: "numeric"}) }}</div>
  `
});

Vue.component("userpic", {
  props: {
    src: {
      type: String,
      default: "/img/placeholder.png"
    }
  },
  template: `
    <div class="userpic">
      <span class="userpic__img" :style="{ backgroundImage: 'url(' + src + ')' }"></span>
    </div>
  `
});

Vue.component("photo-attach", {
  data: function() {
    return {
      filename: ""
    };
  },
  template: `
    <div class="photo-attach">
      <label class="photo-attach__label">
        <span class="photo-attach__text">Фото {{ filename ? '[' + filename + ']' : '' }}</span>
        <input
          class="photo-attach__input"
          type="file"
          accept="image/*"
          capture="user"
          @change="handleChange"
        >
      </label>
    </div>
  `,
  methods: {
    handleChange({ target }) {
      const file = target.files[0];

      if (!file) {
        this.filename = "";
        return;
      }

      this.filename = file.name;
      const reader = new FileReader();

      reader.onload = () => {
        this.$emit("change", reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
});

Vue.component("oracle", {
  props: {
    prophecy: {
      type: Object,
      default: null
    },
    index: Number
  },
  data: function() {
    return {
      fulfilled: null,
      roll: null,
      text: null
    };
  },
  created: function() {
    this.renewState();
  },
  watch: {
    index() {
      this.renewState();
    },
    prophecy() {
      this.renewState();
    },
    fulfilled(curr, prev) {
      if (!curr) return;

      this.text = this.getRandomText();
      this.$emit("fulfilled", {
        roll: this.roll.map(item => item.emoji),
        text: this.text
      });
    }
  },
  template: `
    <div class="oracle" :class="{ oracle_fulfilled: fulfilled }" @click="handleClick">
      <div class="oracle__cell oracle__cell_for_roll">
        <button
          v-for="item in roll"
          class="oracle__button"
          :class="{ oracle__button_fulfilled: item.fulfilled }"
          :disabled="item.fulfilled"
          :data-index="item.id"
        >
          {{ item.emoji }}
        </button>
      </div>
      <div class="oracle__cell oracle__cell_for_prophecy">
        <div class="oracle__prophecy">{{ text }}</div>
      </div>
    </div>
  `,

  methods: {
    renewState() {
      const prophecy = this.prophecy;

      if (prophecy) {
        this.fulfilled = true;
        this.roll = prophecy.roll.map((emoji, i) => ({
          id: i,
          emoji,
          fulfilled: true
        }));
        this.text = prophecy.text;
      } else {
        this.fulfilled = false;
        this.roll = ["🧙‍", "🧙‍", "🧙‍", "🧙‍"].map((emoji, i) => ({
          id: i,
          emoji,
          fulfilled: false
        }));
        this.text = "Привет, странник! Звезды еще не открыли тебе свои тайны.";
      }
    },

    handleClick({ target }) {
      if (!target.matches(".oracle__button")) {
        return;
      }

      const index = target.dataset.index;
      this.roll[index].emoji = this.getRandomEmoji();
      this.roll[index].fulfilled = true;
      this.fulfilled = this.roll.every(item => item.fulfilled);
    },

    getRandomEmoji() {
      const ranges = [
        [0x1f681, 0x1f6c5],
        [0x1f600, 0x1f636],
        [0x1f680, 0x1f6c0],
        [0x2702, 0x27b0],
        [0x1f601, 0x1f64f]
      ];
      const randRange = ranges[this._getRandom(0, ranges.length)];
      const randPoint = this._getRandom(randRange[0], randRange[1] + 1);

      return String.fromCodePoint(randPoint);
    },

    getRandomText() {
      const texts = [
        "Спланировав этот день – не меняйте планов. Он будет удачен лишь в том случае, если вы станете следовать расписанию пункт за пунктом.",
        "Ваши усилия не останутся незамеченными, но большого успеха не принесут. Пусть ваши дела говорят сами за себя, вам же лучше помолчать сегодня.",
        "Сегодня вам может встретиться что-то, чему вы не сможете найти рационального объяснения. Впрочем, это вряд ли сможет вас напугать, ведь привидения не кусаются.",
        "Жизнь сложна, но прекрасна, и сегодня у вас будет повод убедиться в этом в очередной раз. Повремените с вопросами, ответы найдутся сами.",
        "Будьте сегодня добрым и отзывчивым. Обращайте побольше внимания на то, что творится вокруг вас. Не переходите дорогу в неположенном месте.",
        "Не стоит использовать разочарование в чем-либо в качестве оправдания своих дурацких поступков, или, того хуже, отсутствия малейших признаков деятельности. Сделайте сегодня что-нибудь осмысленное.",
        "Не воспаряйте в своих мечтах особенно высоко. Сегодня вам слишком сложно будет вернуться. Так и останетесь висеть, как Винни Пух на воздушном шарике. А вокруг пчелы... И вниз, между прочим, падать больно...",
        "Сегодня у вас не будет необходимости как-либо оправдывать свои действия. Вам простят все что угодно, хотя злоупотреблять этим, пожалуй, не стоит.",
        "Сегодня вы будете спокойны, как дохлый лев, чем вызовете восхищение наблюдателей, ибо вокруг такое происходит! Спокойствие, правда, наверняка будет показное, но кто об этом знает?",
        "Сегодня, рассчитывая на кого-то кроме себя, приготовьтесь к большой суете и путанице. А лучше и вовсе не полагаться ни на чью помощь, самому разобраться будет проще.",
        "Сегодня вы можете оказаться орудием в чьих-то руках. Во избежание этой ситуации, постарайтесь не ввязываться ни в какие авантюры. Развлечься можно и иначе.",
        "Сегодня вам, возможно, придется объяснять тому, кто вам дорог, что он в чем-то глубоко заблуждается. Постарайтесь сохранять спокойствие - это неприятно, но не смертельно.",
        "Сегодня могут произойти некоторые изменения, которые будут непосредственно вас касаться. Только не впадайте по этому поводу в панику, иначе вы рискуете остаться в этом состоянии надолго.",
        "На одном желании далеко не уедешь, хотя, если бы научиться использовать энергию желаний, то повсеместно отпала бы необходимость в добыче нефти. Придется предпринимать активные действия.",
        "Сегодня вас будут ограничивать лишь те пределы, которые вы сами себе установите. Не злоупотребляйте открывшимися перед вами возможностями.",
        "Сегодня не самый лучший день, чтобы пытаться избавиться от вредных привычек. Только измотаетесь, толку же - не будет.",
        "Сегодня вам не стоит слишком громко и радостно сообщать о своих достижениях окружающим. Можете попасть в неловкую ситуацию.",
        "Сегодняшний день ознаменуется приступом бурной деятельности, в которую будет вовлечен каждый, кто будет иметь несчастье попасться вам на глаза. Вы рискуете переутомиться.",
        "Вы склонны взваливать на свои плечи ношу гораздо более тяжкую, чем следовало бы. Когда, наконец, наступит долгожданный перекур, подумайте хорошенько, а стоит ли продолжать в том же духе?",
        "Нынче вы будете преисполнены решимости достичь некоторой никому, в том числе, возможно, и вам, неизвестной цели. Однако горе тому, кто посмеет усомниться в успешности ваших действий.",
        "Постарайтесь спланировать этот день, и во всем следовать своему плану. Импровизационные решения сегодня не будут слишком удачны.",
        "Сегодня вы не будете полностью контролировать ситуацию, хотя со стороны это будет выглядеть именно так. Возможно, вам придется заручиться поддержкой со стороны.",
        "Сегодня ваше настроение может оказаться очень переменчивым. В связи с этим обстоятельством день лучше провести с тем, кто к вам давно привык и способен вас понять (с любимой собакой, например)."
      ];

      return texts[this._getRandom(0, texts.length)];
    },

    _getRandom(from, to) {
      return from + Math.floor(Math.random() * (to - from));
    }
  }
});

const DAY = 1000 * 60 * 60 * 24;
const outbox = createOutbox();

window.APP = new Vue({
  el: "#app",
  data: {
    token: null,
    screen: "main",
    offline: !navigator.onLine,
    loading: null,
    date: new Date(),
    user: {
      hist: {}
    },
    auth: {
      newcomer: false,
      login: null,
      password: null,
      name: null,
      photo: null
    }
  },
  computed: {
    dayIndex: function() {
      return Math.floor(this.date.getTime() / DAY);
    },
    prophecy: function() {
      return this.user.hist[this.dayIndex];
    }
  },
  created() {
    window.addEventListener("online", () => (this.offline = false));
    window.addEventListener("offline", () => (this.offline = true));

    this.token = window.localStorage.getItem("token");

    if (this.token) {
      this.fetchUserData();
    } else {
      this.screen = "auth";
    }
  },
  methods: {
    reset() {
      window.localStorage.removeItem("token");
      this.token = null;
      this.screen = "auth";
    },

    addCurrentProphecy({ roll, text }) {
      this.user.hist[this.dayIndex] = { roll, text, index: this.dayIndex };
    },

    getCurrentProphecy() {
      return this.user.hist[this.dayIndex];
    },

    goDayBack() {
      this.date = new Date(this.date.getTime() - DAY);
    },

    goDayNext() {
      this.date = new Date(this.date.getTime() + DAY);
    },

    handlePhotoChange(photo) {
      this.auth.photo = photo;
    },

    fetchUserData() {
      this.loading = true;

      const userDataUrl = `/user/${this.token}`;

      caches.match(userDataUrl).then(resp => {
        if (!resp) return;

        resp.json().then(user => {
          this.user = user;
        });
      });

      fetch(userDataUrl)
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          } else if (resp.status === 401) {
            this.reset();
          } else {
            // retry();
          }
        })
        .then(user => {
          const currTimestamp = this.user.timestamp || -1;

          if (currTimestamp < user.timestamp) {
            this.user = user;
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleSubmit(e) {
      if (this.auth.newcomer) {
        this.screen = "main"; // оптимистичная регистрация
      }

      this.loading = true;

      outbox("/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.auth)
      })
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          } else if (resp.status === 401) {
            alert("Неправильный логин или пароль");
            this.screen = "auth";
            // alert();
          } else {
            // retry();
          }
        })
        .then(({ token }) => {
          window.localStorage.setItem("token", token);
          this.token = token;

          if (!this.auth.newcomer) {
            this.fetchUserData();
            this.screen = "main";
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleOracle(data) {
      this.addCurrentProphecy(data);

      fetch("/prophecy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: this.token,
          prophecy: this.getCurrentProphecy()
        })
      })
        .then(resp => {
          if (!resp.ok && resp.status === 401) {
            this.reset();
          } else {
            // retry();
          }
        })
        .catch(error => {
          // retry();
        });
    }
  }
});
