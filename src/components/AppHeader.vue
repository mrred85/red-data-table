<template>
  <header class="header">
    <img :alt="appName" src="../assets/logo.png" />
    <strong>{{ appName }} v.{{ appVersion }}</strong>
    <nav>
      <RouterLink to="/">Demo</RouterLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const appName = ref(process.env.VUE_APP_NAME)
const appVersion = ref(process.env.VUE_APP_VERSION)
</script>

<style lang="scss">
header.header {
  display: block;
  height: 30px;
  line-height: 30px;
  padding-bottom: 6px;
  margin-bottom: 6px;
  border-bottom: 1px solid #ccc;
  img {
    float: left;
    height: 30px;
    line-height: 30px;
  }
  strong {
    display: inline-block;
    margin-left: 6px;
  }
  nav {
    display: inline-block;
    a {
      display: inline-block;
      margin-left: 12px;
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
}
</style>
