<template>
  <div id="nav">
  </div>
  <router-view/>
</template>

<style>
::-webkit-scrollbar{
  width: 5px;
}

::-webkit-scrollbar-button{
  border-radius: 10px;
  background-color: white;
}
::-webkit-scrollbar-thumb{
  width: 10px;
  border-radius: 5px;
  background-color: #8BA4FF;
}
::-webkit-scrollbar-track{
  background-color: rgba(150,150,150,0.8);
  border-radius: 10px;
}
button{
  cursor: pointer;
  outline: none;
  border: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
 overflow: hidden;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
