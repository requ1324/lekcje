<template lang="">
    <button id="button" @click="click">Click me!</button>
</template>
<script>
export default {
    data() {
        return {};
    },
    methods: {
        click() {
            alert('Button clicked!');
        },
    },
}
</script>
<style scoped>
    #button {
        font-size: 16px;
        padding: 10px 20px;
        background-color: rgb(10, 64, 227);
        border: none;
        border-radius: 5px;
        cursor: pointer;
        color:white;
    }
    #button:hover {
        background-color: gray;
        color: white;
    }
</style>