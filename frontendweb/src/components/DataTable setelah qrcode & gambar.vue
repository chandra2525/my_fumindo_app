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
            <button class="btn btn-info btn-sm me-2" @click="$emit('edit', row)" data-bs-toggle="modal" data-bs-target="#form-received">Terima</button>
          </template>
          <template v-if="column.data === 'edit2'">
            <button class="btn btn-info btn-sm me-2" @click="$emit('edit', row)" data-bs-toggle="modal" data-bs-target="#form-received">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" @click="$emit('delete', row)" data-bs-toggle="modal" data-bs-target="#delete-confirmation">Hapus</button>
          </template>
          <template v-if="column.data === 'detail edit delete'">
            <button class="btn btn-success btn-sm me-2" @click="$emit('viewDetail', row)">Detail</button>
            <button class="btn btn-info btn-sm me-2" @click="$emit('edit', row)">Edit</button>
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
          
          <template v-if="column.data === 'sku_item_image'">
            <img
              :src="`http://localhost:3000/qr_code_image/${row.sku_item_image}`"
              alt="Image"
              width="100"
              height="100"
              v-if="row.sku_item_image"
            />
          </template>

          <!-- <template v-if="column.data === 'sku_item_id'">
            <img :src="'https://api.qrserver.com/v1/create-qr-code/?data=' + row.sku_item_id + '&size=100x100'" alt="QR Code"/>
            <br/><br/> 
            <a href="https://api.qrserver.com/v1/create-qr-code/?data={{row.sku_item_id}}&size=100x100" download="QR Code.png">Download QR Code</a> 
            <button @click="printQRCode(row.sku_item_id.toString())">Print PDF</button>
          </template> -->

          <template v-if="column.data === 'sku_item_id'">
            <!-- <div :id="'qr-' + row.sku_item_id">
              <img :src="'https://api.qrserver.com/v1/create-qr-code/?data=' + row.sku_item_id + '&size=100x100'" alt="QR Code" />
            </div>
            <br /> -->
            <!-- <a :href="'https://api.qrserver.com/v1/create-qr-code/?data=' + row.sku_item_id + '&size=100x100'" download="QRCode.png">Download QR Code</a> -->
            <!-- <button @click="downloadQRCode(row.sku_item_id.toString())">Download PDF</button>
            <button @click="printQRCode(row.sku_item_id.toString())">Print PDF</button> -->

            <div :id="'qr-code-' + row.sku_item_id" style="text-align: center;">
              <img :src="'https://api.qrserver.com/v1/create-qr-code/?data=' + row.sku_item_id + '&size=100x100'" alt="QR Code" />
            </div>
            <br/>

            <div class="d-flex align-items-center list-user-action justify-content-between">
              <a @click="printQRCode(row.sku_item_id.toString())" class="btn btn-sm btn-icon btn-success mx-1 width-style" data-bs-toggle="tooltip" data-bs-placement="top"  data-bs-original-title ="Edit">
                <span class="btn-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                </span>
              </a>
              <a @click="downloadQRCode(row.sku_item_id.toString())" class="btn btn-sm btn-icon btn-success mx-1 width-style" data-bs-toggle="tooltip" data-bs-placement="top"  data-bs-original-title ="Delete">
                <span class="btn-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/>
                  </svg>
                </span>
              </a>
            </div>

            <!-- <div class="row">
              <div class="col-sm-5">
                <a @click="printQRCode(row.sku_item_id.toString())" class="btn btn-success btn-sm me-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 30 30" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                </a>
              </div>
              <div class="col-sm-5">
                <a @click="downloadQRCode(row.sku_item_id.toString())" class="btn btn-success btn-sm me-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 30 30" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/>
                  </svg>
                </a>
              </div>
            </div> -->
          </template>

          <!-- Harga Sekarang dihitung otomatis -->
          <div v-else-if="column.data === 'current_price'">
            {{ row.current_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }}
          </div>
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
            <input type="number" v-model="row.expected_quantity" class="form-control" required min="1" @input="$emit('update', data)"/>
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
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';
// import { nextTick } from 'vue';
import axios from 'axios';

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

// function downloadQRCode(skuItemId) {
//   const element = document.getElementById(`qr-${skuItemId}`);
//   html2canvas(element).then((canvas) => {
//     const link = document.createElement('a');
//     link.href = canvas.toDataURL('image/png');
//     link.download = `QRCode_${skuItemId}.png`;
//     link.click();
//   });
// }

// const downloadQRCode = (skuItemId) => {
//   setTimeout(async () => {
//     console.log(`Processing element ID: qr-code-${skuItemId}`);
//     await nextTick(); // Tunggu sampai DOM selesai dirender
//     const element = document.getElementById(`qr-code-${skuItemId}`);
//     if (!element) {
//       console.error(`Element with ID qr-code-${skuItemId} not found.`);
//       return;
//     }
//     console.log('Element:', element);
//     console.log('Full DOM:', document.body.innerHTML);
//     html2canvas(element).then((canvas) => {
//       const link = document.createElement('a');
//       link.href = canvas.toDataURL('image/png');
//       link.download = `QRCode_${skuItemId}.png`;
//       link.click();
//     }).catch((error) => {
//       console.error('Error generating image:', error);
//     });
//      }, 3000);
// }

const token = localStorage.getItem('access_token');

const downloadQRCode = async (skuItemId) => { 
  try {
    const response = await axios.get('http://localhost:3000/api/qr_code/download_image', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        data: skuItemId,
        size: 200, 
      },
    responseType: 'blob', // Ensure the response is in blob format
    })
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'qrcode.png'); // Set the default file name
    document.body.appendChild(link);
    link.click();
    console.log('QR Code berhasil didownload:', response.data)
  } catch (error) {
    console.error('Error fetching sku_item data:', error)
  }
};

const printQRCode = async (skuItemId) => { 
  try {
    const response = await axios.get('http://localhost:3000/api/qr_code/download_pdf', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        data: skuItemId,
        // size: 200, 
      },
      responseType: 'blob', // Ensure the response is in blob format
    }) 
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'qrcode.pdf'); // Set the default file name
    document.body.appendChild(link);
    link.click();
    console.log('QR Code berhasil diprint menjadi pdf:', response.data)
  } catch (error) {
    console.error('Error fetching sku_item data:', error)
  }
};

// function printQRCode(skuItemId) {
//   const element = document.getElementById(`qr-${skuItemId}`);
//   html2canvas(element).then((canvas) => {
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF();
//     pdf.addImage(imgData, 'PNG', 10, 10, 50, 50); // Atur posisi dan ukuran QR Code di PDF
//     pdf.save(`QRCode_${skuItemId}.pdf`);
//   });
// }

// function printQRCode(skuItemId) {
//   setTimeout(() => {
//     console.log(`Processing element ID: qr-code-${skuItemId}`);
//     const element = document.getElementById(`qr-code-${skuItemId}`);
//     console.log('Element:', element);
//     if (!element) {
//       console.error(`Element with ID qr-code-${skuItemId} not found.`);
//       return;
//     }
//     html2canvas(element).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF();
//       pdf.addImage(imgData, 'PNG', 10, 10, 50, 50); // Atur posisi dan ukuran QR Code di PDF
//       pdf.save(`QRCode_${skuItemId}.pdf`);
//     });
//   }, 3000);
// }

</script>

<style scoped lang="css">
/* .customize-columns {
  display: grid;
  flex-wrap: wrap;
} */
.width-style {
  /* max-width: 400px; */
  width: 43px;
  /* margin-bottom: 1rem; */
}

.sortable {
  cursor: pointer;
}
@import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
</style>
