<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">List Perubahan Vendor</h4>
          </div>
          <div>
            <button 
              class="btn btn-outline-success width-button-style-top" 
              style="margin-right: 10px;" 
              @click="exportVendorData">
              Ekspor Data
            </button>
          </div>
        </div>
        <div class="card-body">

          <div class="row mb-2">
            <div class="col-sm-6"> 
              <label for="validationCustomUsername01" class="form-label">Filter nama vendor</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterVendorName" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div> 
            </div>
            <div class="col-sm-6"> 
              <label for="validationCustomUsername01" class="form-label">Filter pembuat</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterUsername" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div> 
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter operasi</label>
              <v-select 
                :options="vendorOperation" 
                v-model="selectedOperation" 
                multiple  
                @update:modelValue="onOperationSelect" 
                class="filter-style"
              ></v-select>
            </div>
            <div class="col-sm-6">
              <!-- Input Pencarian Global -->
              <div class="search-container">
                <label for="global-search" class="form-label">Pencarian</label>
                <div class="input-group has-validation">
                  <input
                    type="text"
                    id="global-search"
                    v-model="globalSearch" 
                    class="form-control filter-style" 
                  />
                  <!-- <button
                    class="btn btn-primary filter-style"
                    @click="fetchVendorChangeLogData"
                    title="Search">
                    <svg width="18" height="19" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 17.124L12.0962 12.2202M12.0962 12.2202C13.2725 11.0439 14 9.41895 14 7.62402C14 4.03417 11.0899 1.12402 7.5 1.12402C3.91015 1.12402 1 4.03417 1 7.62402C1 11.2139 3.91015 14.124 7.5 14.124C9.29493 14.124 10.9199 13.3965 12.0962 12.2202Z" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button> -->
                </div>
              </div>
            </div>
          </div>
 
          <div class="row mb-4">
            <div class="col-sm-4"> 
              <div class="input-group has-validation">
                <button
                  class="btn btn-primary width-button-style filter-style" 
                  @click="fetchVendorChangeLogData"
                  title="Search">
                  Filter
                </button>
              </div>
            </div>
          </div>

          <div class="row mb-2">
            <!-- Dropdown Show Entries -->
            <div class="col-sm-6 pagination-show-entries">
              <label for="entries" class="form-label col-sm-3">Show entries</label>
              <select
                id="entries"
                class="form-select show-entries"
                v-model="pageSize"
                @change="fetchVendorChangeLogData"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          <div class="table-responsive border-bottom">
            <data-table
              :data="vendorData"
              :columns="VendorColumns"  
              :currentPage="currentPage"
              :pageSize="pageSize"
              :idrow="created_at_group"
              @edit="showEditModal"
              @delete="showDeleteModal"
              @viewDetail="navigateToDetail"
              @sort="onSort"
            />
            
            <div class="pagination-container">
              <p class="text-muted">
                Showing {{ (currentPage - 1) * pageSize + 1 }} to
                {{ Math.min(currentPage * pageSize, totalData) }} of {{ totalData }} entries
              </p>
              <nav aria-label="Page navigation example">
                <ul class="pagination justify-content-end">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                  </li>
                  <li
                    class="page-item"
                    v-for="page in totalPages"
                    :key="page"
                    :class="{ active: currentPage === page }"
                  >
                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
                  </li>
                </ul>
              </nav>
            </div>

            <!-- Modal Berhasil  Hapus  -->
            <MessageModal :message="alertMessage" :title="titleMessage"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .filter-style {
    /* max-width: 400px; */
    height: 35px;
    /* margin-bottom: 1rem; */
  }

  .width-button-style {
    /* max-width: 400px; */
    width: 85px;
    font-size: 13px; /* Kecil */
    /* margin-bottom: 1rem; */
  }
  
  .width-button-style-top {
    /* width: 105px; */
    font-size: 13px;
    /* padding: 10px; */
  }

  .show-entries {
    /* max-width: 400px; */
    width: 95px;
    /* margin-bottom: 1rem; */
  }

  .pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pagination-show-entries {
    display: flex; 
    align-items: center;
  }
</style>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from '@/components/DataTable.vue';
// import Actions from '@/components/TableActions.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
// import { Modal } from 'bootstrap'
import MessageModal from '@/components/ModalAlert.vue'; 
import { Modal as BootstrapModal } from 'bootstrap';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const navigateToDetail = (rowData) => {
  router.push({ name: 'VendorLogDetail', params: {
    created_at: rowData.created_at_group,
    operation: rowData.operation,
    vendor_name: rowData.vendor_name,
    username: rowData.username,
  } });
};

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
// Ambil token dari localStorage
const token = localStorage.getItem('access_token');

const VendorColumns = [
  // { title: 'ID', data: 'vendor_log_id', sortable: true },
  // { title: 'ID Vendor', data: 'vendor_id', sortable: true },
  { title: 'Nama Vendor', data: 'vendor_name', sortable: true }, 
  { title: 'Pembuat', data: 'username', sortable: true }, 
  { title: 'Dibuat Pada Waktu', data: 'created_at_group2', sortable: true },
  { title: 'Operasi', data: 'operation', sortable: true }, 
  { title: 'Aksi', data: 'view', sortable: false },
];

// Reactive data untuk menyimpan data vendor
const titleMessage = ref('');
const alertMessage = ref('');
const vendorData = ref([]);

const vendorOperation = ref([]);
const selectedOperation = ref([]);

const filterVendorName = ref('');
const filterUsername = ref('');

const globalSearch = ref('');

const currentPage = ref(1); // Halaman aktif
const totalPages = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
const totalData = ref(0); // Jumlah total data dari API

// Mengambil data vendor saat komponen dimuat
onMounted(async () => { 
  await fetchVendorOperation();
  await fetchVendorChangeLogData();
});

const currentSort = ref({ column: 'created_at_group', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchVendorChangeLogData(); // Panggil ulang API dengan parameter sorting
};

const onOperationSelect = (selectedOperation) => {
  selectedOperation.value = selectedOperation; // Perbarui nilai terpilih
  // fetchVendorChangeLogData(); // Panggil fungsi fetch dengan data terpilih
};


// Fungsi untuk mengambil data vendor dari backend
const fetchVendorChangeLogData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/vendor_change_log/grouped', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        vendor_name: filterVendorName.value,
        username: filterUsername.value,
        operation: selectedOperation.value.join(','),
        search: globalSearch.value, 
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman
        // order_by: 'vendor_id', // Sorting berdasarkan ID
        // order_direction: 'DESC', // Urutan descending
      },
    })
    console.log('coba res')
    console.log(response.data)
    // vendorData.value = response.data.rows
    // Format data sebelum dimasukkan ke tabel
    vendorData.value = response.data.rows.map((item) => ({
      ...item, 
      created_at_group2: formatTanggal(item.created_at_group), // Format kolom tanggal
    }));
    totalData.value = response.data.sp.rowCount;
    totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);
  } catch (error) {
    console.error('Error fetching vendor change log data:', error)
    handleAuthError();
  }
};

// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchVendorChangeLogData(); // Refresh data untuk halaman baru
  }
};


const fetchVendorOperation = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/vendor_change_log/getVendorChangeLogsOperation', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); 
    vendorOperation.value = [...new Set(response.data)];
  } catch (error) {
    console.error('Error fetching vendorOperation:', error);
    handleAuthError();
  }
};


const exportVendorData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/vendor_change_log/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        vendor_name: filterVendorName.value,
        username: filterUsername.value,
        operation: selectedOperation.value.join(','),
        search: globalSearch.value, 
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
       },
      responseType: "blob", // Blob untuk file biner
    });

    // Buat URL dari blob
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Buat link untuk download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data_vendor.xlsx"); // Nama file
    document.body.appendChild(link);
    link.click();

    // Hapus elemen link setelah selesai
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Error exporting data:", error);
    // alert("Gagal mengekspor data. Silakan coba lagi.");
    titleMessage.value = `Gagal Ekspor`;
    alertMessage.value = `Gagal mengekspor data. Silakan coba lagi.`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
  }
};

 
const handleAuthError = () => {
  // router.push({ name: 'auth.login' });
  alertMessage.value = `Cek koneksi internet Anda.`;
  const modal = new BootstrapModal(document.getElementById('message-alert'));
  modal.show();
};


function formatTanggal(tanggalString) {
  const hari = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu"
  ];
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];

  const date = new Date(tanggalString);
  const namaHari = hari[date.getDay()];
  const tanggal = date.getDate();
  const namaBulan = bulan[date.getMonth()];
  const tahun = date.getFullYear();
  const jam = date.getHours().toString().padStart(2, "0");
  const menit = date.getMinutes().toString().padStart(2, "0");
  const detik = date.getSeconds().toString().padStart(2, "0");

  return `${namaHari}, ${tanggal} ${namaBulan} ${tahun}, Jam ${jam}:${menit}:${detik} WIB`;
}


</script>
