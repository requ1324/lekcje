<template lang="">
    <div>
        <select @change="change">
            <option v-for="item in array" :key="item">{{ item }}</option>
        </select>
    </div>
</template>
<script>
export default {
    data() {
        return {
            array: [1,2,3],
        };
    },
    methods: {
        change(event) {
            alert(`Selected value: ${event.target.value}`);
        },
    },
}
</script>
<style lang="">
    
</style>