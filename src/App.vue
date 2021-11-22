<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Example of using @badeggg/mock-api in a common vue project."/>
    <div>
      <button
        @click="requestFakeServices"
        class="request-button"
      >
        {{ isLoadingMockApi ? 'making a mock-api request...' : 'make a mock-api request' }}
      </button>
      <span v-if="showMockApiCue" cue> how many stars @badeggg/mock-api has got?</span>
      <p v-if="fakeStars">{{ fakeStars }} ⭐</p>
      <p v-if="shouldStartMockErrorTip" class="error-tip">{{ shouldStartMockErrorTip }}</p>
    </div>
    <div class="real-api">
      <button
        @click="requestReal"
        class="request-button"
      >
        {{ isLoadingRealApi ? 'making a real request...' : 'make a real request' }}
      </button>
      <span v-if="showRealApiCue" cue> suggest 'hello' phrase:</span>
      <div id="realResponse"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  data: () => {
    return {
      fakeStars: 0,
      showRealApiCue: false,
      showMockApiCue: false,
      isLoadingRealApi: false,
      isLoadingMockApi: false,
      shouldStartMockErrorTip: '',
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
          this.shouldStartMockErrorTip = 'Failed to request. Do you start mock-api by `npm run serve-mock`?';
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

.real-api {
  width: 400px;
  margin: 20px auto;
}

ul {
  list-style-type: none;
}
.request-button {
  padding: 8px;
}
.error-tip {
  color: red;
}
</style>
