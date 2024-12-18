<!-- <template>
  <span class="screen-darken"></span> 
  <main class="main-content">
    <dual-compact-navbar></dual-compact-navbar>
    <main-content-component> 
      <router-view></router-view>
    </main-content-component>
  </main> 
  <footer-component></footer-component> 
  <setting-offcanvas></setting-offcanvas> 
</template>

<script setup>
// Library
import { onMounted, onUnmounted } from 'vue'

// Custom Utility Functions
import { addClass, removeClass } from '@/utilities/dom'

// Componants
import DualCompactNavbar from '@/components/menu-styles/DualCompactNavbar.vue'
import MainContentComponent from '@/components/partials/MainContentComponent.vue'
import FooterComponent from '@/components/partials/FooterComponent.vue'
import SettingOffcanvas from '@/components/setting/SettingOffcanvas.vue'
onMounted(() => {
  addClass(document.body, 'dual-compact')
})
onUnmounted(() => {
  removeClass(document.body, 'dual-compact')
})
</script> -->
