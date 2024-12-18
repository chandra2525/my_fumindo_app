<template>
  <!--Logo start-->
  <div class="logo-main">
    <img :src="logoSrc" :class="`${color ? 'text-primary' : ''}`" alt="Logo" width="30" height="30" />
  </div>
  <!--Logo End-->
</template>

<script>
export default {
  props: {
    color: { type: Boolean, default: false }
  },
  computed: {
    logoSrc() {
      // Impor logo dari folder assets
      return require('@/assets/logo.png');
    }
  }
}
</script>
