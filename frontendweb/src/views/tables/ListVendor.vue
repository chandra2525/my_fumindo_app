<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">List Vendor</h4>
          </div> 
          <div >
            <button 
              class="btn btn-success width-button-style-top" 
              style="margin-right: 10px;" 
              @click="showAddModal" 
              data-bs-toggle="modal" 
              data-bs-target="#form-confirmation">
              Tambah Vendor
            </button>
            <button 
              class="btn btn-outline-success width-button-style-top" 
              style="margin-right: 10px;" 
              @click="exportVendorData">
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
              style="margin-right: 10px;"
              @click="downloadTemplateVendorData">
              Download Template
            </button>
            <button 
              class="btn btn-outline-warning width-button-style-top" 
              @click="navigateToVendorLog">
              Log
            </button>
          </div>
        </div> 
        <div class="card-body"> 
          <div class="row mb-2">
            <div class="col-sm-6"> 
              <label for="validationCustomUsername01" class="form-label">Filter nama vendor</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterVendor" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div> 
            </div>
          
            <div class="col-sm-6"> 
                <label for="validationCustomUsername01" class="form-label">Filter no telpon</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterPhoneNumber" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                </div>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-sm-6">
                <label for="validationCustomUsername01" class="form-label">Filter email</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterEmail" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                </div>
            </div>
            <div class="col-sm-6"> 
              <label for="validationCustomUsername01" class="form-label">Filter alamat</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterAddress" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div> 
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-sm-6">
                <label for="validationCustomUsername01" class="form-label">Filter tanggal peninjauan mendatang</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterUpcomingReviewDate" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                </div>
            </div>
            <div class="col-sm-6"> 
              <label for="validationCustomUsername01" class="form-label">Filter komentar vendor</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterVendorRemark" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div> 
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-sm-6">
                <label for="validationCustomUsername01" class="form-label">Filter status vendor</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterVendorStatus" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
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
              <div class="input-group has-validation">
                <button
                  class="btn btn-primary width-button-style filter-style" 
                  @click="fetchVendorData"
                  title="Search">
                  Filter
                </button>
              </div>
            </div>
          </div>
          
          <div class="row mb-2"> 
            <div class="col-sm-6 pagination-show-entries">
              <label for="entries" class="form-label col-sm-3">Show entries</label>
              <select
                id="entries"
                class="form-select show-entries"
                v-model="pageSize"
                @change="fetchVendorData"
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
              :columns="vendorColumns"
              :currentPage="currentPage"
              :pageSize="pageSize" 
              :idrow="vendor_id"  
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
                    <h5 class="modal-title" id="staticBackdropPermissionLabel">{{ isEditMode ? 'Perbarui Vendor' : 'Tambah Vendor' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <p>Form yang bertanda <span class="text-primary">*</span> wajib diisi</p> 
                    <form @submit.prevent="submitVendor">
                      <div class="mb-3">
                        <label for="vendor_name" class="form-label">Nama Vendor<span class="text-primary">*</span></label>
                        <input v-model="editForm.vendor_name" maxlength="100" id="vendor_name" type="text" required class="form-control"/>
                      </div>
                      <div class="mb-3">
                        <label for="phone_number" class="form-label">No Telpon</label>
                        <input v-model="editForm.phone_number" maxlength="15" id="phone_number" type="text" class="form-control" oninput="this.value = this.value.replace(/[^0-9]/g, '')"/>
                      </div>
                      <div class="mb-3">
                        <label for="email" class="form-label">E-mail</label>
                        <input v-model="editForm.email" maxlength="150" id="email" type="email" class="form-control" @input="syncUsername" />
                      </div>
                      <div class="mb-3"> 
                        <label for="address" class="form-label">Alamat</label>
                        <b-form-textarea v-model="editForm.address" maxlength="500" id="address" type="text" rows="4" max-rows="4"></b-form-textarea>
                      </div>
                      <div class="mb-3">
                        <label for="upcoming_review_date" class="form-label">Tanggal Peninjauan Mendatang</label>
                        <input v-model="editForm.upcoming_review_date" type="date" class="form-control"/>
                      </div>
                      <div class="mb-3">
                        <label for="vendor_remark" class="form-label">Komentar Vendor</label>
                        <b-form-textarea v-model="editForm.vendor_remark" maxlength="500" id="vendor_remark" type="text" rows="2" max-rows="2"></b-form-textarea>
                      </div> 
                      <div class="mb-3">
                        <label for="vendor_status" class="form-label">Status Vendor<span class="text-primary">*</span></label>
                        <div class="mb-1">
                          <b-form-radio value="Tersedia" v-model="editForm.vendor_status" class="d-inline-block">Tersedia</b-form-radio>
                          <label class="form-label text-white"> . . . . </label>
                          <b-form-radio value="Tidak Tersedia" v-model="editForm.vendor_status" class="d-inline-block">Tidak Tersedia</b-form-radio>
                        </div>
                      </div>
                      <!-- <p>Status yang dipilih: {{ editForm.vendor_status }}</p> -->
                      <button type="submit" class="btn btn-primary" :data-bs-dismiss="editForm.vendor_name ? 'modal' : null">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Vendor' }}</button>
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
                    <p>Apa kamu yakin ingin menghapus data Vendor <strong>{{ selectedVendor?.vendor_name }}</strong>?</p>
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
                    <h5 class="modal-title" id="massUploadModalLabel">Mass Upload Vendor</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="uploadFileVendorData">
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

  .show-entries {
    /* max-width: 400px; */
    width: 95px;
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

  .pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pagination-show-entries {
    display: flex; 
    align-items: center;
  }

  /* .pagination-container {
    margin-top: 20px;
  }
  .page-item.disabled .page-link {
    cursor: not-allowed;
  }
  .page-item.active .page-link {
    background-color: #007bff;
    border-color: #007bff;
    color: white;
  } */
</style>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from '@/components/DataTable.vue';
// import Actions from '@/components/TableActions.vue';
// import { Modal } from 'bootstrap'
import MessageModal from '@/components/ModalAlert.vue'; 
import { Modal as BootstrapModal } from 'bootstrap';
// import "vue-select/dist/vue-select.css";
// import "vue-select/src/scss/vue-select.scss";
// import Vue from "vue"; 
import 'vue-select/dist/vue-select.css';
import { useRouter } from 'vue-router';

const router = useRouter();  
const titleMessage = ref('');
const alertMessage = ref('');
const token = localStorage.getItem('access_token');
const user_id = localStorage.getItem('user_id');

// Reactive data untuk menyimpan data vendor
const vendorData = ref([]); 
const filterVendor = ref('');
const filterPhoneNumber = ref('');
const filterEmail = ref('');
const filterAddress = ref('');
const filterUpcomingReviewDate = ref('');
const filterVendorRemark = ref('');
const filterVendorStatus = ref('');
const globalSearch = ref('');

const currentPage = ref(1); // Halaman aktif
const totalPages = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
const totalData = ref(0); // Jumlah total data dari API

// const pagination = ref({
//   page: 1,       // Halaman saat ini
//   pageSize: 10,  // Jumlah data per halaman
//   pageCount: 0,  // Total halaman
//   rowCount: 0,   // Total data
// });

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
const vendorColumns = [
  // { title: 'ID', data: 'vendor_id', sortable: true },
  { title: 'Nama Vendor', data: 'vendor_name', sortable: true }, 
  { title: 'No Telpon', data: 'phone_number', sortable: true },
  { title: 'E-mail', data: 'email', sortable: true },
  { title: 'Alamat', data: 'address', sortable: true },
  { title: 'Tanggal Peninjauan Mendatang', data: 'upcoming_review_date', sortable: true },
  { title: 'Komentar Vendor', data: 'vendor_remark', sortable: true },
  { title: 'Status Vendor', data: 'vendor_status', sortable: true },
  { title: 'Aksi', data: 'actions', sortable: false },
];

// Mengambil data vendor saat komponen dimuat
onMounted(async () => {
  await fetchVendorData();
});

const currentSort = ref({ column: 'vendor_id', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchVendorData(); // Panggil ulang API dengan parameter sorting
};

// Fungsi untuk mengambil data vendor dari backend
const fetchVendorData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/vendor', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        vendor_name: filterVendor.value,
        phone_number: filterPhoneNumber.value,
        email: filterEmail.value,
        address: filterAddress.value,
        upcoming_review_date: filterUpcomingReviewDate.value,
        vendor_remark: filterVendorRemark.value,
        vendor_status: filterVendorStatus.value,
        search: globalSearch.value,
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman
        // order_by: 'vendor_id', // Sorting berdasarkan ID
        // order_direction: 'DESC', // Urutan descending
       }, 
    });
    vendorData.value = response.data.rows;// Asumsikan response berupa { data, total }
    totalData.value = response.data.sp.rowCount;
    totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error('Error fetching vendor data:', error); 
      handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    }
  }
};

// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchVendorData(); // Refresh data untuk halaman baru
  }
};

// const filter = ref('');
// const isEditModalOpen = ref(false)
const isEditMode = ref(false)

const editForm = ref({
  vendor_id: null, 
  vendor_name: '',
  phone_number: '',
  email: '',
  address: '',
  upcoming_review_date: '',
  vendor_remark: '',
  vendor_status: 'Tersedia',
})

// Fungsi untuk reset form saat modal ditutup
const resetForm = () => {
  editForm.value = {
    vendor_id: null, 
    vendor_name: '',
    phone_number: '',
    email: '',
    address: '',
    upcoming_review_date: '',
    vendor_remark: '',
    vendor_status: 'Tersedia',
  }
}


const exportVendorData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/vendor/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        vendor_name: filterVendor.value,
        phone_number: filterPhoneNumber.value,
        email: filterEmail.value,
        address: filterAddress.value,
        upcoming_review_date: filterUpcomingReviewDate.value,
        vendor_remark: filterVendorRemark.value,
        vendor_status: filterVendorStatus.value,
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
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error("Error exporting data:", error);
      handleErrorMessage(`Gagal Ekspor`,`Gagal mengekspor data. Silakan coba lagi.`,'error');
    }
  }
};

const uploadFileVendorData = async () => {
  const fileInput = document.getElementById('upload-file');
  const file = fileInput.files[0];

  if (!file) {
    handleErrorMessage(`Pilih File`,`Silakan pilih file sebelum mengunggah.`,'error');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('http://localhost:3000/api/vendor/mass-upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    handleErrorMessage(`Berhasil`,`Upload berhasil, ${response.data.successCount} data vendor berhasil terupload`,'error');
    fetchVendorData();
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

const downloadTemplateVendorData = async () => { 
  try {
    const response = await axios.get("http://localhost:3000/api/vendor/template/", {
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
    link.setAttribute("download", "template_data_vendor.xlsx"); // Nama file
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

// Fungsi untuk membuka modal tambah dengan form kosong
const showAddModal = () => {
  resetForm() // Kosongkan form
  isEditMode.value = false 
}

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
const showEditModal = (rowData) => {
  selectedVendor.value = rowData
  editForm.value = { ...rowData }
  isEditMode.value = true
}

// Fungsi untuk submit tambah/edit
const submitVendor = async () => {
  console.log('Edit data submitted:', editForm.value)
  try {
    if (isEditMode.value) {
      // Update data jika dalam mode edit
      editForm.value.user_id = user_id;
      editForm.value.operation = 'Edit';
      const response = await axios.put(`http://localhost:3000/api/vendor/${editForm.value.vendor_id}`, editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil diupdate:', response.data)

      // Perbarui data vendorData di tabel setelah update
      const index = vendorData.value.findIndex(vendor => vendor.vendor_id === editForm.value.vendor_id)
      if (index !== -1) {
        vendorData.value[index] = { ...editForm.value }
      }
    } else {
      // Tambahkan data baru jika dalam mode tambah
      editForm.value.user_id = user_id;
      editForm.value.operation = 'Tambah';
      const response = await axios.post('http://localhost:3000/api/vendor', editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil ditambahkan:', response.data)

      // Tambahkan data baru ke tabel
      vendorData.value.push(response.data)
    } 
    fetchVendorData();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error('Gagal menyimpan data:', error);
      handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    }
  }
}


const selectedVendor = ref(null) // Menyimpan data vendor yang dipilih untuk dihapus

// Fungsi untuk menampilkan modal konfirmasi penghapusan
const showDeleteModal = (rowData) => {
  selectedVendor.value = rowData
}

const confirmDelete = async () => {
  try {
    console.log('Id deleted:', selectedVendor.value.vendor_id)
    await axios.delete(`http://localhost:3000/api/vendor/${selectedVendor.value.vendor_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    handleErrorMessage(`Berhasil Hapus`,`Data Vendor <strong>${selectedVendor.value.vendor_name}</strong> berhasil dihapus.`,'error');
    fetchVendorData()
  } catch (error) {
    if (error.response && error.response.status === 409) {
      handleErrorMessage(`Gagal Menghapus`,`Data Vendor <strong>${selectedVendor.value.vendor_name}</strong> gagal dihapus. ${error.response.data.message}. Anda harus menghapus terlebih dahulu data yang terkait dengan Data Vendor <strong>${selectedVendor.value.vendor_name}</strong>.`,'error');
    }
    else if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } else {
      console.error('Failed to delete vendor data:', error) 
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


const navigateToVendorLog = () => {
  router.push({ name: 'ListVendorLog'});
};

</script>
