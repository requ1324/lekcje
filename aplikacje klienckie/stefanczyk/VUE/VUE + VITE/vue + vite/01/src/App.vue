<template>
  <div id="container">
    <MyButton />  
    <MyButton2 title="title passed from app" bg="yellow" />
    <MySelect />
  </div>
</template>
<script>
  import MyButton from './components/MyButton.vue';
  import MyButton2 from './components/MyButton2.vue';
  import MySelect from './components/MySelect.vue';
export default {
  data() {
    return {};
  },
  components: {
    MyButton,
    MyButton2,
    MySelect,

  } 
};
</script>
<style scoped>
  #container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    margin-top: 50px;
  }
</style>