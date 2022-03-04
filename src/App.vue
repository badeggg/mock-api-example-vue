<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Example of using @badeggg/mock-api in a common vue project."/>
    <div class="box">
      <button
        @click="requestFakeServices"
        class="request-button"
      >
        {{ isLoadingMockApi ? 'request a mocked api...' : 'request a mocked api' }}
      </button>
      <span v-if="showMockApiCue" cue> how many stars @badeggg/mock-api has got?</span>
      <p v-if="fakeStars">{{ fakeStars }} ⭐</p>
      <p v-if="shouldStartMockErrorTip" class="error-tip">{{ shouldStartMockErrorTip }}</p>
    </div>
    <div class="box">
      <button
        @click="requestReal"
        class="request-button"
      >
        {{ isLoadingRealApi ? 'request a real api...' : 'request a real api' }}
      </button>
      <span v-if="showRealApiCue" cue> suggest 'hello' phrase:</span>
      <div id="realResponse"></div>
    </div>
    <div class="box">
      <button
        class="request-button"
        @click="connectWsFakeServices"
      >
        connect a mocked websocket: /ws/echo
      </button>
      <input
        v-if="wsMockOpened"
        id="wsInput"
        @keyup.enter="wsMockSend"
        placeholder="input, press enter to send"
        style="margin-left: 10px; width: 152px"
      >
      <div class="ws-msgs-box">
        <div v-for="(msg, inx) in wsMockMsgs" :key="msg+inx">
          <span>{{ msg }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  ws: null,
  data: () => {
    return {
      fakeStars: 0,
      showRealApiCue: false,
      showMockApiCue: false,
      isLoadingRealApi: false,
      isLoadingMockApi: false,
      shouldStartMockErrorTip: '',

      wsMockOpened: false,
      wsMockMsgs: [],
    };
  },
  components: {
    HelloWorld
  },
  methods: {
    requestFakeServices() {
      this.showMockApiCue = true;
      this.isLoadingMockApi = true;
      axios.request({
        url: '/stars/count',
        method: 'GET',
      })
      .then(res => {
        this.fakeStars = res.data.count;
        this.shouldStartMockErrorTip = '';
      })
      .catch(err => {
        if (err.message.includes('404')) {
          this.fakeStars = 0;
          this.shouldStartMockErrorTip = 'Failed to request. Did you start mock-api by `yarn serve-mock`?';
        }
      })
      .finally(() => {
        this.isLoadingMockApi = false;
      });
    },
    requestReal() {
      this.showRealApiCue = true;
      this.isLoadingRealApi = true;
      axios.request({
        url: '/AS/Suggestions?scope=dictionary&pt=page.bingdict&bq=delayed&mkt=zh-cn&ds=bingdict&qry=hello&cp=7&cvid=4C6CCF7FC8EA4DF0A02311CE7BF39A0B',
        method: 'GET',
      })
      .then(res => {
        document.getElementById('realResponse').innerHTML = res.data;
        this.isLoadingRealApi = false;
      });
    },
    connectWsFakeServices() {
      if (this.wsMockOpened)
        return;
      this.ws = new WebSocket('ws:/localhost:8080/ws/echo');
      this.ws.onopen = () => this.wsMockOpened = true;
      this.ws.onmessage = (ev) => this.wsMockMsgs.push('<< ' + ev.data);
    },
    wsMockSend(ev) {
      const msg = ev.target.value;
      this.ws.send(msg);
      this.wsMockMsgs.push('>> ' + msg);
      ev.target.value = '';
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.box {
  margin: 20px auto;
}
.box:hover {
  background: #d5cdcd2e;
}
.ws-msgs-box {
  width: 400px;
  text-align: left;
  margin: 10px auto;
}

ul {
  list-style-type: none;
}
.request-button {
  padding: 8px;
  cursor: pointer;
}
.error-tip {
  color: red;
}
</style>
