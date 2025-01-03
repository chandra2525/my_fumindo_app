<!-- <template>
    <table :class="'table ' + className" ref="tableRef"></table>
</template> -->

<template>
  <table class="table">
    <thead>
      <tr>
        <th>#</th>
        <th v-for="column in columns" :key="column.data" @click="onSort(column)" class="sortable">
          {{ column.title }}
          <span v-if="sortColumn === column.data && column.sortable">
            {{ sortOrder === 'ASC' ? '▲' : '▼' }}
          </span>
        </th>
        <!-- <th v-for="column in columns" :key="column.data">
          <template v-if="column.data === 'delete'">
            <th>Expected Quantity</th>
          </template>
        </th> -->
      </tr>
    </thead>
    <tbody>
      <!-- <tr v-for="row in data" :key="row.idrow"></tr> -->
      <tr v-for="(row, index) in data" :key="row.idrow">
        <!-- Nomor urut dihitung berdasarkan indeks dan halaman -->
        <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
        <td v-for="column in columns" :key="column.data">
          <!-- Tombol khusus untuk kolom "Aksi" -->
          <template v-if="column.data === 'actions'">
            <button class="btn btn-info btn-sm me-2" @click="$emit('edit', row)" data-bs-toggle="modal" data-bs-target="#form-confirmation">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" @click="$emit('delete', row)" data-bs-toggle="modal" data-bs-target="#delete-confirmation">Hapus</button>
          </template>
          <template v-if="column.data === 'delete'">
            <button class="btn btn-danger btn-sm delete-btn" @click="$emit('delete', row)" data-bs-toggle="modal" data-bs-target="#delete-confirmation">Hapus</button>
          </template>
          <template v-if="column.data === 'view'">
            <button class="btn btn-success btn-sm me-2" @click="$emit('viewDetail', row)">Detail</button>
          </template>
          <template v-if="column.data === 'edit'">
            <button class="btn btn-info btn-sm me-2" @click="$emit('edit', row)" data-bs-toggle="modal" data-bs-target="#form-confirmation">Terima</button>
          </template>
          <template v-if="column.data === 'detail edit delete'">
            <button class="btn btn-success btn-sm me-2" @click="$emit('viewDetail', row)">Detail</button>
            <button class="btn btn-info btn-sm me-2" @click="$emit('edit', row)" data-bs-toggle="modal" data-bs-target="#form-confirmation">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" @click="$emit('delete', row)" data-bs-toggle="modal" data-bs-target="#delete-confirmation">Hapus</button>
          </template>
          <!-- Input untuk kolom Status -->
          <template v-if="column.data === 'status'">
            <div v-if="row.status === 'Pending'" class="text-warning">{{ row.status }}</div>
            <div v-else-if="row.status === 'Receiving'" class="text-info">{{ row.status }}</div>
            <div v-else-if="row.status === 'Done'" class="text-success">{{ row.status }}</div>
            <div v-else-if="row.status === 'Canceled'" class="text-danger">{{ row.status }}</div>
            <div v-else>{{ row.status }}</div>
          </template>
          <!-- Harga dihitung otomatis -->
          <div v-else-if="column.data === 'price'">
            {{ row.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }}
          </div>
          <!-- Total Harga dihitung otomatis -->
          <div v-else-if="column.data === 'total_price'">
            {{ row.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }}
          </div>
          <!-- Input untuk kolom Expected Quantity -->
          <template v-else-if="column.data === 'expected_quantity'">
            <input type="number" v-model="row.expected_quantity" class="form-control" min="0" @input="$emit('update', data)"/>
          </template>
          <!-- Data biasa untuk kolom lain -->
          <template v-else>
            {{ row[column.data] }}
          </template>
        </td>
        <!-- <td v-for="column in columns" :key="column.data">
          <template v-if="column.data === 'delete'">
            <input type="number" class="form-control" v-model="row.expected_quantity" @input="updateExpectedQuantity(row)"/>
          </template>
        </td> -->
      </tr>
    </tbody>
  </table>
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
  currentPage: Number, // Tambahkan prop halaman saat ini
  pageSize: Number,    // Tambahkan prop ukuran halaman
  idrow: String,
  options: Object,
  className: String,
  isFooter: { type: String }, 
})

const emit = defineEmits(['sort', 'edit', 'delete', 'update-expected-quantity'])
const sortColumn = ref(null);
const sortOrder = ref(null);

const tableRef = ref(null)
let dataTable = null

// Fungsi untuk update nilai expected_quantity
// const updateExpectedQuantity = (row) => {
//   emit('update-expected-quantity', row);
// };

const onSort = (column) => {
  if (!column.sortable) return;

  if (sortColumn.value === column.data) {
    sortOrder.value = sortOrder.value === 'ASC' ? 'DESC' : 'ASC';
  } else {
    sortColumn.value = column.data;
    sortOrder.value = 'ASC';
  }

  emit('sort', { column: column.data, order: sortOrder.value });
};

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
      title: 'Aksi',
      data: null,
      sortable: false,
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
    // ordering: true,
    info: true,
    pageLength: 10,
    dom: '<"row align-items-center"<"col-md-6" l><"col-md-6" f>><"table-responsive my-3" rt><"row align-items-center" <"col-md-6" i><"col-md-6" p>><"clear">',
    destroy: true,
    // order: [[0, 'DESC']],
    initComplete: function () {
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
.sortable {
  cursor: pointer;
}
@import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
</style>
