<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">List Pelanggan</h4>
          </div> 
          <div >
            <button 
              class="btn btn-success" 
              style="margin-right: 10px;" 
              @click="showAddModal" 
              data-bs-toggle="modal" 
              data-bs-target="#form-confirmation">
              Tambah Pelanggan
            </button>
            <button 
              class="btn btn-outline-success" 
              style="margin-right: 10px;" 
              @click="exportCustomerData">
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
              @click="downloadTemplateCustomerData">
              Download Template
            </button> 
          </div>
        </div> 
        <div class="card-body"> 
          <div class="row mb-2">
            <div class="col-sm-6"> 
              <label for="validationCustomUsername01" class="form-label">Filter nama pelanggan</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterCustomer" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
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

          <div class="row mb-4">
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
            <div class="col-sm-4">
              <label for="validationCustomUsername01" class="form-label text-white">I</label>
              <div class="input-group has-validation">
                <button
                  class="btn btn-primary width-button-style filter-style" 
                  @click="fetchCustomerData"
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
                @change="fetchCustomerData"
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
              :data="customerData"
              :columns="customerColumns"
              :currentPage="currentPage"
              :pageSize="pageSize" 
              :idrow="customer_id"  
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

            <!-- Pagination -->
            <!-- <div class="pagination-container d-flex justify-content-between align-items-center mt-3">
              <span>Menampilkan {{ customerData.length }} dari {{ pagination.rowCount }} data</span>
              <ul class="pagination mb-0">
                <li class="page-item" :class="{ disabled: pagination.page === 1 }">
                  <button class="page-link" @click="changePage(pagination.page - 1)">Sebelumnya</button>
                </li>
                <li
                  v-for="page in pagination.pageCount"
                  :key="page"
                  :class="{ active: pagination.page === page }"
                  class="page-item"
                >
                  <button class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: pagination.page === pagination.pageCount }">
                  <button class="page-link" @click="changePage(pagination.page + 1)">Berikutnya</button>
                </li>
              </ul>
            </div> -->
            
            <div class="modal fade" id="form-confirmation" data-bs-backdrop="static" data-bs-keyboard="true" tabindex="-1" aria-labelledby="staticBackdropPermissionLabel" aria-hidden="true" @hide="resetForm">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropPermissionLabel">{{ isEditMode ? 'Perbarui Pelanggan' : 'Tambah Pelanggan' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <p>Form yang bertanda <span class="text-primary">*</span> wajib diisi</p> 
                    <form @submit.prevent="submitCustomer">
                      <div class="mb-3">
                        <label for="customer_name" class="form-label">Nama Pelanggan<span class="text-primary">*</span></label>
                        <input v-model="editForm.customer_name" maxlength="100" id="customer_name" type="text" required class="form-control"/>
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
                      <button type="submit" class="btn btn-primary" :data-bs-dismiss="editForm.customer_name ? 'modal' : null">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Pelanggan' }}</button>
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
                    <p>Apa kamu yakin ingin menghapus data Pelanggan <strong>{{ selectedCustomer?.customer_name }}</strong>?</p>
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
                    <h5 class="modal-title" id="massUploadModalLabel">Mass Upload Pelanggan</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="uploadFileCustomerData">
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
// import "vue-select/src/scss/vue-select.scss";
// import Vue from "vue"; 
import 'vue-select/dist/vue-select.css';
import { useRouter } from 'vue-router';

const router = useRouter(); 
const titleMessage = ref('');
const alertMessage = ref('');
const token = localStorage.getItem('access_token');
// Reactive data untuk menyimpan data pelanggan
const customerData = ref([]); 
const filterCustomer = ref('');
const filterPhoneNumber = ref('');
const filterEmail = ref('');
const filterAddress = ref('');
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
const customerColumns = [
  // { title: 'ID', data: 'customer_id', sortable: true },
  { title: 'Nama Pelanggan', data: 'customer_name', sortable: true }, 
  { title: 'No Telpon', data: 'phone_number', sortable: true },
  { title: 'E-mail', data: 'email', sortable: true },
  { title: 'Alamat', data: 'address', sortable: true },
  { title: 'Aksi', data: 'actions', sortable: false },
];

// Mengambil data customer saat komponen dimuat
onMounted(async () => {
  await fetchCustomerData();
});

const currentSort = ref({ column: 'customer_id', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchCustomerData(); // Panggil ulang API dengan parameter sorting
};

// Fungsi untuk mengambil data customer dari backend
const fetchCustomerData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/customer', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        customer_name: filterCustomer.value,
        phone_number: filterPhoneNumber.value,
        email: filterEmail.value,
        address: filterAddress.value,
        search: globalSearch.value,
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman
        // order_by: 'customer_id', // Sorting berdasarkan ID
        // order_direction: 'DESC', // Urutan descending
       }, 
    });
    customerData.value = response.data.rows;// Asumsikan response berupa { data, total }
    totalData.value = response.data.sp.rowCount;
    totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error('Error fetching customer data:', error); 
      handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    }
  }
};

// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchCustomerData(); // Refresh data untuk halaman baru
  }
};

// const filter = ref('');
// const isEditModalOpen = ref(false)
const isEditMode = ref(false)

const editForm = ref({
  customer_id: null, 
  customer_name: '',
  phone_number: '',
  email: '',
  address: '',
})

// Fungsi untuk reset form saat modal ditutup
const resetForm = () => {
  editForm.value = {
    customer_id: null, 
    customer_name: '',
    phone_number: '',
    email: '',
    address: '',
  }
}

const exportCustomerData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/customer/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        customer_name: filterCustomer.value,
        phone_number: filterPhoneNumber.value,
        email: filterEmail.value,
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
    link.setAttribute("download", "data_pelanggan.xlsx"); // Nama file
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

const uploadFileCustomerData = async () => {
  const fileInput = document.getElementById('upload-file');
  const file = fileInput.files[0];

  if (!file) {
    handleErrorMessage(`Pilih File`,`Silakan pilih file sebelum mengunggah.`,'error');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('http://localhost:3000/api/customer/mass-upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    handleErrorMessage(`Berhasil`,`Upload berhasil, ${response.data.successCount} data pelanggan berhasil terupload`,'error');
    fetchCustomerData();
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

const downloadTemplateCustomerData = async () => { 
  try {
    const response = await axios.get("http://localhost:3000/api/customer/template/", {
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
    link.setAttribute("download", "template_data_pelanggan.xlsx"); // Nama file
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
  selectedCustomer.value = rowData
  editForm.value = { ...rowData }
  isEditMode.value = true
}

// Fungsi untuk submit tambah/edit
const submitCustomer = async () => {
  console.log('Edit data submitted:', editForm.value)
  try {
    if (isEditMode.value) {
      // Update data jika dalam mode edit
      const response = await axios.put(`http://localhost:3000/api/customer/${editForm.value.customer_id}`, editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil diupdate:', response.data)

      // Perbarui data customerData di tabel setelah update
      const index = customerData.value.findIndex(customer => customer.customer_id === editForm.value.customer_id)
      if (index !== -1) {
        customerData.value[index] = { ...editForm.value }
      }
    } else {
      // Tambahkan data baru jika dalam mode tambah
      const response = await axios.post('http://localhost:3000/api/customer', editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil ditambahkan:', response.data)

      // Tambahkan data baru ke tabel
      customerData.value.push(response.data)
    } 
    fetchCustomerData();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error('Gagal mengupdate data:', error);
      handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    }

  }
}


const selectedCustomer = ref(null) // Menyimpan data pelanggan yang dipilih untuk dihapus

// Fungsi untuk menampilkan modal konfirmasi penghapusan
const showDeleteModal = (rowData) => {
  selectedCustomer.value = rowData
}

const confirmDelete = async () => {
  try {
    console.log('Id deleted:', selectedCustomer.value.customer_id)
    await axios.delete(`http://localhost:3000/api/customer/${selectedCustomer.value.customer_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    handleErrorMessage(`Berhasil Hapus`,`Data Pelanggan <strong>${selectedCustomer.value.customer_name}</strong> berhasil dihapus.`,'error');
    fetchCustomerData()
  } catch (error) {
    if (error.response && error.response.status === 409) {
      handleErrorMessage(`Gagal Menghapus`,`Data Pelanggan <strong>${selectedCustomer.value.customer_name}</strong> gagal dihapus. ${error.response.data.message}. Anda harus menghapus terlebih dahulu data yang terkait dengan Data Pelanggan <strong>${selectedCustomer.value.customer_name}</strong>.`,'error');
    }
    else if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    }
    else {
      console.error('Failed to delete customer data:', error) 
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

</script>
