<template lang="">
    <div>
        <button >button in component {{ title }}</button>
        <button :style="{ backgroundColor: bg }">bg passed from app:yellow</button>
    </div>
</template>
<script>
export default {
    props: ['title', 'bg'],
    
}
</script>
<style lang="">
    
</style>