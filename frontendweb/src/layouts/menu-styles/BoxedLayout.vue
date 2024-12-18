<!-- <template>
  <div class="boxed-inner">
    <span class="screen-darken"></span> 
    <main class="main-content">
      <horizontal-navbar></horizontal-navbar>
      <main-content-component> 
        <router-view></router-view>
      </main-content-component>
    </main> 
    <footer-component></footer-component> 
  </div> 
  <setting-offcanvas></setting-offcanvas> 
</template>

<script setup>
// Library
import { onMounted, onUnmounted } from 'vue'

// Custom Utility Functions
import { addClass, removeClass } from '@/utilities/dom'

// Components
import HorizontalNavbar from '@/components/menu-styles/HorizontalNavbar.vue'
import MainContentComponent from '@/components/partials/MainContentComponent.vue'
import FooterComponent from '@/components/partials/FooterComponent.vue'
import SettingOffcanvas from '@/components/setting/SettingOffcanvas.vue'
onMounted(() => {
  addClass(document.body, 'boxed')
})
onUnmounted(() => {
  removeClass(document.body, 'boxed')
})
</script> -->
