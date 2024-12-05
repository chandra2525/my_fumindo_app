<template>
  <div
    class="modal fade"
    id="message-alert"
    tabindex="-1"
    aria-labelledby="deleteConfirmationLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteConfirmationLabel"> {{ title == '' ? 'Alert Dialog' : title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p v-html="message"></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageModal", // Nama komponen yang lebih spesifik
  props: {
    title: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
  },
};
</script>
