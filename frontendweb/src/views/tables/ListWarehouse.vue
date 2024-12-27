<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">List Gudang</h4>
          </div>
          <div>
            <button
              class="btn btn-success"
              style="margin-right: 10px;" 
              @click="showAddModal"
              data-bs-toggle="modal"
              data-bs-target="#form-confirmation">
              Tambah Gudang
            </button>
            <button 
              class="btn btn-outline-success" 
              style="margin-right: 10px;" 
              @click="exportWarehouseData">
              Ekspor Data
            </button>
            <button
              class="btn btn-info"
              style="margin-right: 10px;"
              data-bs-toggle="modal"
              data-bs-target="#mass-upload-modal">
              Mass Upload
            </button>
            <button 
              class="btn btn-outline-info" 
              @click="downloadTemplateWarehouseData">
              Download Template
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row mb-2">
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter nama cabang</label>
              <v-select 
                :options="branchNames" 
                v-model="selectedBranches" 
                multiple  
                @update:modelValue="onBranchSelect" 
                class="filter-style"
              ></v-select>
            </div>

            <div class="col-sm-6">
                <label for="validationCustomUsername01" class="form-label">Filter nama gudang</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterWarehouseName" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                </div>
            </div> 
          </div>
          
          <div class="row mb-2">
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter alamat</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterAddress" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
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
              <button
                class="btn btn-primary width-button-style filter-style" 
                @click="fetchWarehouseData"
                title="Search">
                Filter
              </button>
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
                @change="fetchWarehouseData"
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
              :data="warehouseData"
              :columns="columns"
              :currentPage="currentPage"
              :pageSize="pageSize"  
              :idrow="warehouse_id"
              @edit="showEditModal"
              @delete="showDeleteModal"
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
            
            <div class="modal fade" id="form-confirmation" data-bs-backdrop="static" data-bs-keyboard="true" tabindex="-1" aria-labelledby="staticBackdropPermissionLabel" aria-hidden="true" @hide="resetForm">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropPermissionLabel">{{ isEditMode ? 'Perbarui Gudang' : 'Tambah Gudang' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="submitWarehouse">
                      <p>Form yang bertanda <span class="text-primary">*</span> wajib diisi</p> 
                      <div class="mb-3"> 
                        <label for="input-205" class="form-label">Dari Cabang<span class="text-primary">*</span></label>
                        <select id="branch_id" v-model="editForm.branch_id" class="form-select" required>
                          <option value="" disabled>Silahkan pilih cabang</option>
                          <option v-for="branch in branches" :key="branch.branch_id" :value="branch.branch_id">
                            {{ branch.branch_name }}
                          </option>
                        </select>
                      </div> 
                      <div class="mb-3">
                        <label for="warehouse_name" class="form-label">Nama Gudang<span class="text-primary">*</span></label>
                        <input v-model="editForm.warehouse_name" maxlength="100" type="text" class="form-control" id="warehouse_name" required />
                      </div>
                      <div class="mb-3"> 
                        <label for="address" class="form-label">Alamat<span class="text-primary">*</span></label>
                        <b-form-textarea v-model="editForm.address" id="address" type="text" required rows="6" max-rows="6"></b-form-textarea>
                      </div> 
                      <!-- Tambahkan field lainnya sesuai dengan struktur data gudang -->
                      <button type="submit" class="btn btn-primary" :data-bs-dismiss="
                        editForm.branch_id&&editForm.warehouse_name&&editForm.address ? 'modal' : null">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Gudang' }}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Konfirmasi Penghapusan -->
            <div class="modal fade" id="delete-confirmation" tabindex="-1" aria-labelledby="deleteConfirmationLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="deleteConfirmationLabel">Konfirmasi Hapus</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <p>Apa kamu yakin ingin menghapus data Gudang <strong>{{ selectedWarehouse?.warehouse_name }}</strong>?</p>
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
                    <h5 class="modal-title" id="massUploadModalLabel">Mass Upload Gudang</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="uploadFileWarehouseData">
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

const titleMessage = ref('');
const alertMessage = ref(''); 

// Reactive data untuk menyimpan data gudang
const warehouseData = ref([]);
const branchNames = ref([]);
const selectedBranches = ref([]); 
const filterWarehouseName = ref(''); 
const filterAddress = ref('');
const globalSearch = ref('');

const currentPage = ref(1); // Halaman aktif
const totalPages = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
const totalData = ref(0); // Jumlah total data dari API

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
// Ambil token dari localStorage
const token = localStorage.getItem('access_token');

const columns = [
  // { title: 'ID', data: 'warehouse_id', sortable: true },
  { title: 'Dari Cabang', data: 'branch_name', sortable: true },
  { title: 'Nama Gudang', data: 'warehouse_name', sortable: true },
  { title: 'Alamat', data: 'address', sortable: true },
  { title: 'Aksi', data: 'actions', sortable: false },
];



// const isEditModalOpen = ref(false)
const isEditMode = ref(false)

const editForm = ref({
  warehouse_id: null,
  branch_id: '',
  warehouse_name: '',
  address: '', 
})

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
// const openEditModal = (rowData) => {
//   editForm.value = { ...rowData }
//   isEditModalOpen.value = true
// }

// Fungsi untuk reset form saat modal ditutup
const resetForm = () => {
  editForm.value = {
    warehouse_id: null,
    branch_id: '',
    warehouse_name: '',
    address: '', 
  }
}

const selectedWarehouse = ref(null) // Menyimpan data gudang yang dipilih untuk dihapus

// Fungsi untuk menampilkan modal konfirmasi penghapusan
const showDeleteModal = (rowData) => {
  selectedWarehouse.value = rowData
}

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
const showEditModal = (rowData) => {
  selectedWarehouse.value = rowData
  editForm.value = { ...rowData } 
  isEditMode.value = true
}

// Fungsi untuk membuka modal tambah dengan form kosong
const showAddModal = () => {
  resetForm() // Kosongkan form
  isEditMode.value = false
  // isEditModalOpen.value = true
}

// Fungsi untuk submit tambah/edit
const submitWarehouse = async () => {
  console.log('Edit data submitted:', editForm.value)
  try {
    if (isEditMode.value) {
      // Update data jika dalam mode edit
      const response = await axios.put(`http://localhost:3000/api/warehouse/${editForm.value.warehouse_id}`, editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil diupdate:', response.data)
      fetchWarehouseData()
    }else {
      // Tambahkan data baru jika dalam mode tambah
      const response = await axios.post('http://localhost:3000/api/warehouse', editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil ditambahkan:', response.data)

      fetchWarehouseData()
    }
    // Tutup modal setelah berhasil update
    // isEditModalOpen.value = false
  } catch (error) {
    console.error('Gagal mengupdate data:', error)
    handleAuthError();
    // alert('Lakukan login terlebih dulu') 
  } 
  // isEditModalOpen.value = false // Tutup modal setelah submit
}

// Mengambil data gudang saat komponen dimuat
onMounted(async () => {
  await fetchBranches(); 
  await fetchWarehouseData();
});

const currentSort = ref({ column: 'warehouse_id', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchWarehouseData(); // Panggil ulang API dengan parameter sorting
};

const onBranchSelect = (selected) => {
  selectedBranches.value = selected; // Perbarui nilai terpilih
  // fetchBranchData(); // Panggil fungsi fetch dengan data terpilih
};

// Daftar cabang
const branches = ref([]);


// Fungsi untuk mengambil data gudang dari backend
const fetchWarehouseData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/warehouse', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {  
        branch_name: selectedBranches.value.join(','),
        warehouse_name: filterWarehouseName.value,
        address: filterAddress.value,
        search: globalSearch.value,
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman
        // order_by: 'warehouse_id', // Sorting berdasarkan ID
        // order_direction: 'DESC', // Urutan descending
      },
    })
    warehouseData.value = response.data.rows.map((warehouse) => ({
      ...warehouse,
      branch_name: warehouse.branch?.branch_name || 'N/A' // Ambil nama nama atau tampilkan "N/A" jika tidak ada
    }))
    totalData.value = response.data.sp.rowCount;
    totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);
  } catch (error) {
    console.error('Error fetching warehouse data:', error)
    handleAuthError();
    // alert('Lakukan login terlebih dulu') 
  }
};

// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchWarehouseData(); // Refresh data untuk halaman baru
  }
};


const fetchBranches = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/branch', {
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
    branches.value = response.data.rows;
    branchNames.value = response.data.rows.map(item => item.branch_name);
  } catch (error) {
    console.error('Error fetching branches:', error);
    handleAuthError();
    // alert('Lakukan login terlebih dulu') 
  }
};


const exportWarehouseData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/warehouse/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        branch_name: selectedBranches.value.join(','),
        warehouse_name: filterWarehouseName.value,
        address: filterAddress.value,
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
    link.setAttribute("download", "data_gudang.xlsx"); // Nama file
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

const uploadFileWarehouseData = async () => {
  const fileInput = document.getElementById('upload-file');
  const file = fileInput.files[0];

  if (!file) {
    titleMessage.value = `Pilih File`;
    alertMessage.value = 'Silakan pilih file sebelum mengunggah.';
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('http://localhost:3000/api/warehouse/mass-upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    titleMessage.value = `Berhasil`;
    alertMessage.value = `Upload berhasil, ${response.data.successCount} data gudang berhasil terupload`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
 
    fetchWarehouseData();
  } catch (error) {
    console.error('Gagal mengunggah file:', error);
    titleMessage.value = `Gagal Upload`;
    alertMessage.value = 'Gagal mengunggah file. Pastikan format file benar.';
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
  }
};

const downloadTemplateWarehouseData = async () => { 
  try {
    const response = await axios.get("http://localhost:3000/api/warehouse/template/", {
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
    link.setAttribute("download", "template_data_gudang.xlsx"); // Nama file
    document.body.appendChild(link);
    link.click();

    // Hapus elemen link setelah selesai
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Error downloading template:", error);
    // alert("Gagal mendownload template. Silakan coba lagi.");
    titleMessage.value = `Gagal Download`;
    alertMessage.value = `Gagal mendownload template. Silakan coba lagi.`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
  }
}

const confirmDelete = async () => {
  try {
    console.log('Id deleted:', selectedWarehouse.value.warehouse_id)
    await axios.delete(`http://localhost:3000/api/warehouse/${selectedWarehouse.value.warehouse_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // alert('Daca Gudang berhasil dihapus.') 
    titleMessage.value = `Berhasil Hapus`;
    alertMessage.value = `Data Gudang <strong>${selectedWarehouse.value.warehouse_name}</strong> berhasil dihapus.`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();

    fetchWarehouseData()
  } catch (error) {
    if (error.response && error.response.status === 409) {
        titleMessage.value = `Gagal Menghapus`;
        alertMessage.value = `Data Gudang <strong>${selectedWarehouse.value.warehouse_name}</strong> gagal dihapus. ${error.response.data.message}. Anda harus menghapus terlebih dahulu data yang terkait dengan Data Gudang <strong>${selectedWarehouse.value.warehouse_name}</strong>.`;
        const modal = new BootstrapModal(document.getElementById('message-alert'));
        modal.show(); 
    } 
    else {
      console.error('Failed to delete warehouse data:', error) 
      handleAuthError();
    }
  }
}

const handleAuthError = () => {
  // router.push({ name: 'auth.login' });
  titleMessage.value = `Koneksi Gagal`;
  alertMessage.value = `Cek koneksi internet Anda.`;
  const modal = new BootstrapModal(document.getElementById('message-alert'));
  modal.show();
};


</script>
