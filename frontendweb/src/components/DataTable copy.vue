<template>
   <!-- <div class="customize-columns"> -->
    <!-- Customize Columns Dropdown -->
    <!-- <div class="dropdown mb-3">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >Sesuaikan Kolom</button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li v-for="(column, index) in columns" :key="index" class="dropdown-item">
          <label class="form-check-label">
            <input
              type="checkbox"
              class="form-check-input me-2"
              :value="index"
              v-model="visibleColumns"
              @change="toggleColumn(index)"
            />
            {{ column.title }}
          </label>
        </li>
      </ul>
    </div> -->

    <!-- DataTable -->
    <table :class="'table ' + className" ref="tableRef"></table>
 
  <!-- </div> -->
</template>
 

<script setup>
import { onMounted, ref, watch, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import 'datatables.net-bs5/js/dataTables.bootstrap5.min.js'
import 'datatables.net-bs5'
import $ from 'jquery'

const props = defineProps({
  data: Array,
  columns: Array,
  options: Object,
  className: String,
  isFooter: { type: String },
  isColumnFilter: { type: Boolean, default: false }, // Updated
  // isColumnFilter: { type: String },
  isToggleFilter: { type: String },
  isLanguageFilter: { type: String }
})

const emit = defineEmits(['edit', 'delete'])

const tableRef = ref(null)
let dataTable = null

// State untuk mengatur visibilitas kolom
const visibleColumns = ref(props.columns.map((_, index) => index));

// Fungsi untuk toggle visibilitas kolom
// const toggleColumn = (index) => {
//   if (dataTable && dataTable.column(index)) {
//     const column = dataTable.column(index)
//     column.visible(!column.visible())
//   }
// }

// Function to initialize DataTable
const initializeDataTable = () => {
  // Destroy any existing DataTable instance
  if (dataTable) {
    dataTable.destroy()
  }

  // Add edit and delete columns
  const columnsWithActions = [
    ...props.columns,
    {
      title: 'Actions',
      data: null,
      render: function () {
        return `
          <button class="btn btn-info btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#form-confirmation">Edit</button>
          <button class="btn btn-primary btn-sm delete-btn" data-bs-toggle="modal" data-bs-target="#delete-confirmation">Hapus</button>
        `
      }
    }
  ]

  // Initialize DataTable with options
  dataTable = $(tableRef.value).DataTable({
    data: props.data,
    columns: columnsWithActions,
    autoWidth: true,
    paging: true,
    searching: false,
    ordering: true,
    info: true,
    pageLength: 10,
    dom: '<"row align-items-center"<"col-md-6" l><"col-md-6" f>><"table-responsive my-3" rt><"row align-items-center" <"col-md-6" i><"col-md-6" p>><"clear">',
    destroy: true,
    order: [[0, 'desc']],
    initComplete: function () {
      const api = this.api()
      
      // Add column filters if enabled
      if (props.isColumnFilter) {
        $(api.columns().header()).each(function (index) {
          const column = api.column(index)

          // Deteksi jika ini adalah kolom "Actions" berdasarkan index atau judul
          // const isActionColumn = index === props.columns.length; // Index kolom "Actions" adalah panjang dari props.columns
          // if (isActionColumn) return; // Lewati kolom "Actions"// Lewati kolom "Actions"

          const header = $(this);

          // Tambahkan dropdown kustom
          // const dropdown = $(`
          //   <div class="dropdown">
          //     <button class="btn btn-link dropdown-toggle p-0 text-body" type="button" id="dropdown-${index}" data-bs-toggle="dropdown" aria-expanded="false">
          //       Filter
          //     </button>
          //     <ul class="dropdown-menu" aria-labelledby="dropdown-${index}">
          //       <li><a class="dropdown-item" href="#" data-value="">All</a></li>
          //     </ul>
          //   </div>
          // `).appendTo(header);

          // // Isi dropdown dengan nilai unik dari kolom
          // column.data().unique().sort().each(function (value) {
          //   dropdown
          //     .find('.dropdown-menu')
          //     .append(`<li><a class="dropdown-item" href="#" data-value="${value}">${value}</a></li>`);
          // });

          // // Tambahkan event handler untuk filtering
          // dropdown.find('.dropdown-item').on('click', function (e) {
          //   e.preventDefault();
          //   const val = $(this).data('value');
          //   column.search(val ? `^${val}$` : '', true, false).draw();
          // });

          // Tambahkan elemen <select> untuk kolom lainnya
          const select = $('<select class="form-select"><option value="">All</option></select>')
            .appendTo(header)
            .on('click', function (event) {
              event.stopPropagation(); // Cegah sorting saat dropdown diklik
            })
            .on('change', function () {
              const val = $.fn.dataTable.util.escapeRegex($(this).val())
              column.search(val ? `^${val}$` : '', true, false).draw()
            })

          // Isi dropdown dengan nilai unik dari kolom
          column.data().unique().sort().each(function (value) {
            select.append(`<option value="${value}">${value}</option>`)
          })
        })
      }

      // Terapkan visibilitas awal
      if (dataTable) {
        props.columns.forEach((_, index) => {
          const column = dataTable.column(index)
          if (column) {
            column.visible(visibleColumns.value.includes(index))
          }
        })
      }

      // Optional footer row for filters
      if (props.isFooter) {
        const footerRow = document.createElement('tr')
        props.columns.forEach((column) => {
          const footerCell = document.createElement('th')
          footerCell.textContent = column.title
          footerRow.appendChild(footerCell)
        })
        $(tableRef.value).append($('<tfoot>').append(footerRow))
      }
    }
  })

  // Handle edit and delete button clicks
  $(tableRef.value).on('click', '.edit-btn', function () {
    const rowData = dataTable.row($(this).parents('tr')).data()
    emit('edit', rowData)
  })

  $(tableRef.value).on('click', '.delete-btn', function () {
    const rowData = dataTable.row($(this).parents('tr')).data()
    emit('delete', rowData)
  })
}

onMounted(() => {
  // initializeDataTable()
})

// Watch for changes to data and reinitialize DataTable when data changes
watch(
  () => props.data,
  () => {
    initializeDataTable()
  },
  { deep: true }
)

// Clean up DataTable instance on component unmount
onBeforeUnmount(() => {
  if (dataTable) {
    dataTable.destroy()
  }
})
</script>

<style scoped lang="css">
/* .customize-columns {
  display: grid;
  flex-wrap: wrap;
} */
@import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
</style>
