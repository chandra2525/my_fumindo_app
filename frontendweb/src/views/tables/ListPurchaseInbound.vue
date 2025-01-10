<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">Pembelian Masuk</h4>
          </div>
          <div>
            <button
              class="btn btn-success width-button-style-top"
              style="margin-right: 10px;" 
              @click="navigateToAdd">
              Tambah Pembelian Masuk
            </button>
            <button 
              class="btn btn-outline-success width-button-style-top" 
              style="margin-right: 10px;" 
              @click="exportPurchaseInboundData">
              Ekspor Data
            </button>
            <button
              class="btn btn-info width-button-style-top"
              style="margin-right: 10px;"
              data-bs-toggle="modal"
              data-bs-target="#mass-upload-modal">
              Mass Upload
            </button>
            <button 
              class="btn btn-outline-info width-button-style-top" 
              @click="downloadTemplatePurchaseInboundData">
              Download Template
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row mb-2">
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter gudang</label>
              <v-select 
                :options="warehouseNames" 
                v-model="selectedWarehouses" 
                multiple  
                @update:modelValue="onWarehouseSelect" 
                class="filter-style"
              ></v-select>
            </div>
            <div class="col-sm-6">
                <label for="validationCustomUsername01" class="form-label">Filter nomor pesanan pembelian</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterPurchaseOrderNumber" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                </div>
            </div> 
          </div>

          <div class="row mb-2">
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter jenis aset</label>
              <v-select 
                :options="optionsInventoryType"
                v-model="selectedInventoryType"
                multiple
                @update:modelValue="onInventoryTypeSelect"
                class="filter-style"
              ></v-select>
            </div>
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter vendor</label>
              <v-select 
                :options="vendorNames" 
                v-model="selectedVendors" 
                multiple  
                @update:modelValue="onVendorSelect" 
                class="filter-style"
              ></v-select>
            </div>
          </div>
          
          <div class="row mb-2">
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter pembuat</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterUsername" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter tanggal masuk</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterInboundDate" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter ASN</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterAsn" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter tanggal pembuatan</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterCreateDate" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter status</label>
              <v-select 
                :options="optionsStatus"
                v-model="selectedStatus"
                multiple
                @update:modelValue="onStatusSelect"
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
                </div>
              </div>
            </div>
          </div>

          <div class="row mb-4">
             <div class="col-sm-4">
              <div class="input-group has-validation">
                <button
                  class="btn btn-primary width-button-style filter-style" 
                  @click="fetchPurchaseInboundData"
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
                @change="fetchPurchaseInboundData"
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
              :data="purchaseInboundData"
              :columns="columns"
              :currentPage="currentPage"
              :pageSize="pageSize"  
              :idrow="purchase_inbound_id"
              @edit="navigateToEdit"
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
            
            <!-- <div class="modal fade" id="form-confirmation" data-bs-backdrop="static" data-bs-keyboard="true" tabindex="-1" aria-labelledby="staticBackdropPermissionLabel" aria-hidden="true" @hide="resetForm">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropPermissionLabel">{{ isEditMode ? 'Perbarui Pembelian Masuk' : 'Tambah Pembelian Masuk' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="submitPurchaseInbound">
                      <p>Form yang bertanda <span class="text-primary">*</span> wajib diisi</p> 
                      <div class="mb-3"> 
                        <label for="input-205" class="form-label">Dari Gudang<span class="text-primary">*</span></label>
                        <select id="warehouse_id" v-model="editForm.warehouse_id" class="form-select" required>
                          <option value="" disabled>Silahkan pilih gudang</option>
                          <option v-for="warehouse in warehouses" :key="warehouse.warehouse_id" :value="warehouse.warehouse_id">
                            {{ warehouse.warehouse_name }}
                          </option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label for="purchase_order_number" class="form-label">Nomor Pesanan Pembelian<span class="text-primary">*</span></label>
                        <input v-model="editForm.purchase_order_number" maxlength="100" type="text" class="form-control" id="purchase_order_number" required />
                      </div>
                      <div class="mb-3">
                        <label for="inventory_type" class="form-label">Jenis Aset<span class="text-primary">*</span></label>
                        <div class="mb-1">
                          <b-form-radio value="Usage" v-model="editForm.inventory_type" class="d-inline-block">Usage</b-form-radio>
                          <label class="form-label text-white"> . . . . </label>
                          <b-form-radio value="Storage" v-model="editForm.inventory_type" class="d-inline-block">Storage</b-form-radio>
                        </div>
                      </div>
                      <div class="mb-3"> 
                        <label for="input-205" class="form-label">Dari Vendor<span class="text-primary">*</span></label>
                        <select id="vendor_id" v-model="editForm.vendor_id" class="form-select" required>
                          <option value="" disabled>Silahkan pilih vendor</option>
                          <option v-for="vendor in vendors" :key="vendor.vendor_id" :value="vendor.vendor_id">
                            {{ vendor.vendor_name }}
                          </option>
                        </select>
                      </div>
                      <div class="mb-3"> 
                        <label for="expected_inbound_date" class="form-label">Tanggal Masuk</label>
                        <input v-model="editForm.expected_inbound_date" type="date" class="form-control" id="expected_inbound_date" />
                      </div>
                      <div class="mb-3"> 
                        <label for="asn" class="form-label">ASN</label> 
                        <input v-model="editForm.asn" maxlength="6" type="text" class="form-control" id="asn" />
                      </div>
                      <button type="submit" class="btn btn-primary" :data-bs-dismiss="
                        editForm.warehouse_id&&editForm.purchase_order_number&&editForm.inventory_type&&editForm.vendor_id&&editForm.expected_inbound_date ? 'modal' : null">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Pembelian Masuk' }}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div> -->

            <!-- Modal Konfirmasi Penghapusan -->
            <div class="modal fade" id="delete-confirmation" tabindex="-1" aria-labelledby="deleteConfirmationLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="deleteConfirmationLabel">Konfirmasi Hapus</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <p>Apa kamu yakin ingin menghapus data Pembelian Masuk <strong>{{ selectedPurchaseInbound?.purchase_order_number }}</strong>?</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="confirmDelete">Delete</button>
                  </div>
                </div>
              </div>
            </div>
 

            <!-- Modal for Mass Upload -->
            <div
              class="modal fade"
              id="mass-upload-modal"
              tabindex="-1"
              aria-labelledby="massUploadModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="massUploadModalLabel">Mass Upload Pembelian Masuk</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="uploadFilePurchaseInboundData">
                      <div class="mb-3">
                        <label for="upload-file" class="form-label">Pilih File</label>
                        <input
                          type="file"
                          id="upload-file"
                          ref="fileInput"
                          accept=".xlsx, .csv"
                          required
                          class="form-control"
                        />
                      </div>
                      <button type="submit" class="btn btn-primary">Upload</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <!-- Memanggil Modal  -->
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
import MessageModal from '@/components/ModalAlert.vue'; 
import { Modal as BootstrapModal } from 'bootstrap';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { useRouter } from 'vue-router';
const router = useRouter();

const titleMessage = ref('');
const alertMessage = ref(''); 

// Reactive data untuk menyimpan data pembelian masuk
const purchaseInboundData = ref([]);
const warehouseNames = ref([]);
const vendorNames = ref([]);
const optionsInventoryType = ref([]);
const optionsStatus = ref([]);
const selectedWarehouses = ref([]);
const selectedVendors = ref([]);
const selectedInventoryType = ref([]);
const selectedStatus = ref([]);

const filterPurchaseOrderNumber = ref('');
const filterUsername = ref('');
const filterInboundDate = ref('');
const filterAsn = ref('');
const filterCreateDate= ref('');

const globalSearch = ref('');

const currentPage = ref(1); // Halaman aktif
const totalPages = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
const totalData = ref(0); // Jumlah total data dari API

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
// Ambil token dari localStorage
const token = localStorage.getItem('access_token');

const columns = [
  // { title: 'ID', data: 'purchase_inbound_id', sortable: true },
  { title: 'Dari Gudang', data: 'warehouse_name', sortable: true },
  { title: 'Nomor Pesanan Pembelian', data: 'purchase_order_number', sortable: true },
  { title: 'Jenis Aset', data: 'inventory_type', sortable: true },
  { title: 'Dari Vendor', data: 'vendor_name', sortable: true },
  { title: 'Pembuat', data: 'username', sortable: true },
  { title: 'Tanggal Masuk', data: 'expected_inbound_date', sortable: true },
  { title: 'ASN', data: 'asn', sortable: true },
  { title: 'Tanggal Pembuatan', data: 'create_date2', sortable: true },
  { title: 'Status', data: 'status', sortable: true },
  { title: 'Aksi', data: 'detail edit delete', sortable: false },
];



// const isEditModalOpen = ref(false)
// const isEditMode = ref(false)

// const editForm = ref({
//   purchase_inbound_id: null,
//   warehouse_id: '',
//   purchase_order_number: '',
//   inventory_type: 'Usage',
//   vendor_id: '',
//   expected_inbound_date: '',
//   asn: '',
//   status: 'Pending',
//   create_date: '',
// })

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
// const openEditModal = (rowData) => {
//   editForm.value = { ...rowData }
//   isEditModalOpen.value = true
// }

// Fungsi untuk reset form saat modal ditutup
// const resetForm = () => {
//   editForm.value = {
//     purchase_inbound_id: null,
//     warehouse_id: '',
//     purchase_order_number: '',
//     inventory_type: 'Usage',
//     vendor_id: '',
//     expected_inbound_date: '',
//     asn: '',
//     status: 'Pending',
//     create_date: '',
//   }
// }

const selectedPurchaseInbound = ref(null) // Menyimpan data pembelian masuk yang dipilih untuk dihapus

// Fungsi untuk menampilkan modal konfirmasi penghapusan
const showDeleteModal = (rowData) => {
  selectedPurchaseInbound.value = rowData
}


const navigateToEdit = (rowData) => {
  router.push({ 
    name: 'PurchaseInboundEdit', 
    params: {
      purchase_inbound_id: rowData.purchase_inbound_id,
      warehouse_id: rowData.warehouse_id,
      warehouse_name: rowData.warehouse_name,
      purchase_order_number: rowData.purchase_order_number,
      inventory_type: rowData.inventory_type,
      vendor_id: rowData.vendor_id,
      vendor_name: rowData.vendor_name,
      username: rowData.username,
      expected_inbound_date: rowData.expected_inbound_date,
      actual_inbound_date: rowData.actual_inbound_date ?? '-',
      inbound_by: rowData.inbound_by ?? '-',
      asn: rowData.asn ?? '-',
      status: rowData.status,
      create_date: rowData.create_date2,
    }
  });
};


// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
// const showEditModal = (rowData) => {
//   selectedPurchaseInbound.value = rowData
//   editForm.value = { ...rowData } 
//   isEditMode.value = true
// }

const navigateToAdd = () => {
  router.push({ name: 'PurchaseInboundAdd' });
};

const navigateToDetail = (rowData) => {
  router.push({ name: 'PurchaseInboundDetail', params: {
    purchase_inbound_id: rowData.purchase_inbound_id,
    warehouse_id: rowData.warehouse_id,
    warehouse_name: rowData.warehouse_name,
    // warehouse_name: selectedWarehouses.value,
    purchase_order_number: rowData.purchase_order_number,
    inventory_type: rowData.inventory_type,
    vendor_id: rowData.vendor_id,
    vendor_name: rowData.vendor_name,
    username: rowData.username,
    expected_inbound_date: rowData.expected_inbound_date,
    actual_inbound_date: rowData.actual_inbound_date ?? '-',
    inbound_by: rowData.inbound_by ?? '-',
    asn: rowData.asn ?? '-',
    status: rowData.status,
    create_date: rowData.create_date2,
  } });
};

// Fungsi untuk membuka modal tambah dengan form kosong
// const showAddModal = () => {
//   resetForm() // Kosongkan form
//   isEditMode.value = false
//   // isEditModalOpen.value = true
// }

// Fungsi untuk submit tambah/edit
// const submitPurchaseInbound = async () => {
//   console.log('Edit data submitted:', editForm.value)  
//   try {
//     if (isEditMode.value) {
//       // Update data jika dalam mode edit
//       const response = await axios.put(`http://localhost:3000/api/purchase_inbound/${editForm.value.purchase_inbound_id}`, editForm.value, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       console.log('Data berhasil diupdate:', response.data)
//       fetchPurchaseInboundData()
//     }else {
//       // Tambahkan data baru jika dalam mode tambah
//       const response = await axios.post('http://localhost:3000/api/purchase_inbound', editForm.value, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       console.log('Data berhasil ditambahkan:', response.data)

//       fetchPurchaseInboundData()
//     }
//     // Tutup modal setelah berhasil update
//     // isEditModalOpen.value = false
//   } catch (error) {
//     console.error('Gagal mengupdate data:', error)
//     handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
//     // alert('Lakukan login terlebih dulu') 
//   } 
//   // isEditModalOpen.value = false // Tutup modal setelah submit
// }

// Mengambil data pembelian masuk saat komponen dimuat
onMounted(async () => {
  await fetchPurchaseInboundData();
  await fetchWarehouses();
  await fetchVendors();
  optionsInventoryType.value= ["Usage", "Storage"];
  optionsStatus.value= ["Pending", "Receiving", "Done", "Canceled"];
});

const currentSort = ref({ column: 'purchase_inbound_id', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchPurchaseInboundData(); // Panggil ulang API dengan parameter sorting
};

const onWarehouseSelect = (selected) => {
  selectedWarehouses.value = selected; // Perbarui nilai terpilih
  // fetchPurchaseInboundData(); // Panggil fungsi fetch dengan data terpilih
};

const onVendorSelect = (selected) => {
  selectedVendors.value = selected; // Perbarui nilai terpilih
  // fetchPurchaseInboundData(); // Panggil fungsi fetch dengan data terpilih
};

const onInventoryTypeSelect = (selected) => {
  selectedInventoryType.value = selected; // Perbarui nilai terpilih
  // fetchPurchaseInboundData(); // Panggil fungsi fetch dengan data terpilih
};

const onStatusSelect = (selected) => {
  selectedStatus.value = selected; // Perbarui nilai terpilih
  // fetchPurchaseInboundData(); // Panggil fungsi fetch dengan data terpilih
};


// Daftar  
const warehouses = ref([]);
const vendors = ref([]);


// Fungsi untuk mengambil data pembelian masuk dari backend
const fetchPurchaseInboundData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/purchase_inbound', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        warehouse_name: selectedWarehouses.value.join(','),
        purchase_order_number: filterPurchaseOrderNumber.value,
        inventory_type: selectedInventoryType.value.join(','),
        vendor_name: selectedVendors.value.join(','),
        username: filterUsername.value,
        expected_inbound_date: filterInboundDate.value,
        asn: filterAsn.value,
        status: selectedStatus.value.join(','),
        create_date: filterCreateDate.value,
        search: globalSearch.value,
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman
        // order_by: 'purchase_inbound_id', // Sorting berdasarkan ID
        // order_direction: 'DESC', // Urutan descending
      },
    })
    purchaseInboundData.value = response.data.rows.map((purchase_inbound) => ({
      ...purchase_inbound,
      warehouse_name: purchase_inbound.warehouse?.warehouse_name || '-', // Ambil nama nama atau tampilkan "-" jika tidak ada
      username: purchase_inbound.user?.username || '-', // Ambil nama nama atau tampilkan "-" jika tidak ada
      vendor_name: purchase_inbound.vendor?.vendor_name || '-', // Ambil nama nama atau tampilkan "-" jika tidak ada
      asn: purchase_inbound?.asn || '-', // Ambil nama nama atau tampilkan "-" jika tidak ada
      create_date2: formatTanggal(purchase_inbound.create_date), // Format kolom tanggal
    }))
    totalData.value = response.data.sp.rowCount;
    totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error('Error fetching purchase_inbound data:', error)
      handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    }
  }
};

// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchPurchaseInboundData(); // Refresh data untuk halaman baru
  }
};


const fetchWarehouses = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/warehouse', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {  
        // order_by: currentSort.value.column,
        // order_direction: currentSort.value.order,
        page: 1,
        pageSize: 1000,
      },
    });
    warehouses.value = response.data.rows;
    warehouseNames.value = response.data.rows.map(item => item.warehouse_name);
  } catch (error) {
    // if (error.response && error.response.status === 401) {
    //   handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    // } 
    // else {
      console.error('Error fetching warehouses:', error);
    //   handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    // }
  }
};


const fetchVendors = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/vendor', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {  
        // order_by: currentSort.value.column,
        // order_direction: currentSort.value.order,
        page: 1,
        pageSize: 1000,
      },
    });
    vendors.value = response.data.rows;
    vendorNames.value = response.data.rows.map(item => item.vendor_name);
    console.log('vendorNames.value:', vendorNames.value)
 
    vendorNames.value
  } catch (error) {
    // if (error.response && error.response.status === 401) {
    //   handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    // } 
    // else {
      console.error('Error fetching vendors:', error);
    //   handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    // }
  }
};

const exportPurchaseInboundData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/purchase_inbound/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        warehouse_name: selectedWarehouses.value.join(','),
        purchase_order_number: filterPurchaseOrderNumber.value,
        inventory_type: selectedInventoryType.value.join(','),
        vendor_name: selectedVendors.value.join(','),
        username: filterUsername.value,
        expected_inbound_date: filterInboundDate.value,
        asn: filterAsn.value,
        status: selectedStatus.value.join(','),
        create_date: filterCreateDate.value,
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
    link.setAttribute("download", "data_pembelian_masuk.xlsx"); // Nama file
    document.body.appendChild(link);
    link.click();

    // Hapus elemen link setelah selesai
    link.parentNode.removeChild(link);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error("Error exporting data:", error);
      handleErrorMessage(`Gagal Ekspor`,`Gagal mengekspor data. Silakan coba lagi.`,'error');
    }
  }
};

const uploadFilePurchaseInboundData = async () => {
  const fileInput = document.getElementById('upload-file');
  const file = fileInput.files[0];

  if (!file) {
    handleErrorMessage(`Pilih File`,`Silakan pilih file sebelum mengunggah.`,'error');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('http://localhost:3000/api/purchase_inbound/mass-upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    handleErrorMessage(`Berhasil`,`Upload berhasil, ${response.data.successCount} data pembelian masuk berhasil terupload`,'error');
    fetchPurchaseInboundData();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error('Gagal mengunggah file:', error);
      handleErrorMessage(`Gagal Upload`,`Gagal mengunggah file. Pastikan format file benar.`,'error');
    }
  }
};

const downloadTemplatePurchaseInboundData = async () => { 
  try {
    const response = await axios.get("http://localhost:3000/api/purchase_inbound/template/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", // Blob untuk file biner
    });

    // Buat URL dari blob
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Buat link untuk download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template_data_pembelian_masuk.xlsx"); // Nama file
    document.body.appendChild(link);
    link.click();

    // Hapus elemen link setelah selesai
    link.parentNode.removeChild(link);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error("Error downloading template:", error);
      handleErrorMessage(`Gagal Download`,`Gagal mendownload template. Silakan coba lagi.`,'error');
    }
  }
}

const confirmDelete = async () => {
  try {
    console.log('Id deleted:', selectedPurchaseInbound.value.purchase_inbound_id)
    await axios.delete(`http://localhost:3000/api/purchase_inbound/${selectedPurchaseInbound.value.purchase_inbound_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    handleErrorMessage(`Berhasil Hapus`,`Data Pembelian Masuk <strong>${selectedPurchaseInbound.value.purchase_order_number}</strong> berhasil dihapus.`,'error');
    fetchPurchaseInboundData()
  } catch (error) {
    if (error.response && error.response.status === 409) {
      handleErrorMessage(`Gagal Menghapus`,`Data Pembelian Masuk <strong>${selectedPurchaseInbound.value.purchase_order_number}</strong> gagal dihapus. ${error.response.data.message}. Anda harus menghapus terlebih dahulu data yang terkait dengan Data Pembelian Masuk <strong>${selectedPurchaseInbound.value.purchase_order_number}</strong>.`,'error');
    } 
    else {
      console.error('Failed to delete purchase inbound data:', error) 
      handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    }
  }
}


const handleErrorMessage = (title, alert, type) => {
  type == 'session'? router.push({ name: 'auth.login' }) : null;
  titleMessage.value = title;
  alertMessage.value = alert;
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
