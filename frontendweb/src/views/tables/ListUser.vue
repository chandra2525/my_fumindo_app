<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">List User</h4>
          </div>
          <div>
            <button
              class="btn btn-success"
              style="margin-right: 10px;" 
              @click="showAddModal"
              data-bs-toggle="modal"
              data-bs-target="#form-confirmation">
              Tambah User
            </button>
            <button 
              class="btn btn-outline-success" 
              style="margin-right: 10px;" 
              @click="exportUserData">
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
              @click="downloadTemplateUserData">
              Download Template
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row mb-2">
            <div class="col-sm-6">
              <!-- <b-col md="4"> -->
                <label for="validationCustomUsername01" class="form-label">Filter nama karyawan</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterFullname" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                  <!-- <button
                    class="btn btn-primary"
                    style="height: 35px"
                    @click="fetchUserData"
                    title="Search">
                    <svg width="18" height="19" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 17.124L12.0962 12.2202M12.0962 12.2202C13.2725 11.0439 14 9.41895 14 7.62402C14 4.03417 11.0899 1.12402 7.5 1.12402C3.91015 1.12402 1 4.03417 1 7.62402C1 11.2139 3.91015 14.124 7.5 14.124C9.29493 14.124 10.9199 13.3965 12.0962 12.2202Z" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button> -->
                </div>
              <!-- </b-col> -->
            </div>
            <div class="col-sm-6">
              <!-- <b-col md="4"> -->
                <label for="validationCustomUsername01" class="form-label">Filter username</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterUsername" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                  <!-- <button
                    class="btn btn-primary"
                    style="height: 35px"
                    @click="fetchUserData"
                    title="Search">
                    <svg width="18" height="19" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 17.124L12.0962 12.2202M12.0962 12.2202C13.2725 11.0439 14 9.41895 14 7.62402C14 4.03417 11.0899 1.12402 7.5 1.12402C3.91015 1.12402 1 4.03417 1 7.62402C1 11.2139 3.91015 14.124 7.5 14.124C9.29493 14.124 10.9199 13.3965 12.0962 12.2202Z" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button> -->
                </div>
              <!-- </b-col> -->
            </div> 
          </div>
          
          <div class="row mb-3">
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter role</label>
              <v-select 
                :options="userRole" 
                v-model="selectedRole" 
                multiple  
                @update:modelValue="onRoleSelect" 
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
                    @click="fetchUserData"
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
              <button
                class="btn btn-primary width-button-style filter-style" 
                @click="fetchUserData"
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
                @change="fetchUserData"
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
              :data="userData"
              :columns="columns"
              :currentPage="currentPage"
              :pageSize="pageSize"  
              :idrow="user_id"
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
                    <h5 class="modal-title" id="staticBackdropPermissionLabel">{{ isEditMode ? 'Perbarui User' : 'Tambah User' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="submitUser">
                      <p>Form yang bertanda <span class="text-primary">*</span> wajib diisi</p> 
                      <div class="mb-3"> 
                        <label for="employee_id" class="form-label">Dari Nama</label>
                        <select id="employee_id" v-model="editForm.employee_id" class="form-select">
                          <option value="" disabled>Silahkan pilih nama</option>
                          <option v-for="employee in employees" :key="employee.employee_id" :value="employee.employee_id">
                            {{ employee.fullname }}
                          </option>
                        </select>
                      </div> 
                      <div class="mb-3">
                        <label for="username" class="form-label">Username<span class="text-primary">*</span></label>
                        <input v-model="editForm.username" maxlength="15" type="text" class="form-control" id="username" required />
                      </div>
                      <div class="mb-3">
                        <label for="password" class="form-label">Password<span class="text-primary">*</span></label>
                        <input v-model="editForm.password" maxlength="15" type="password" class="form-control" id="password" :required="!isEditMode" />
                      </div>
                      <div class="mb-3"> 
                        <label for="role" class="form-label">Role Karyawan<span class="text-primary">*</span></label>
                        <b-form-select v-model="editForm.role" :options="optionsRole" id="role" required></b-form-select>
                      </div>
                      <!-- Tambahkan field lainnya sesuai dengan struktur data user -->
                      <button type="submit" class="btn btn-primary" :data-bs-dismiss="
                        isEditMode?
                        editForm.username&&editForm.role ? 'modal' : null :
                        editForm.username&&editForm.password&&editForm.role ? 'modal' : null
                        ">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan User' }}
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
                    <p>Apa kamu yakin ingin menghapus data User <strong>{{ selectedUser?.username }}</strong>?</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="confirmDelete">Delete</button>
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
                    <p>Apa kamu yakin ingin menghapus data Karyawan <strong>{{ selectedEmployee?.fullname }}</strong>?</p>
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
                    <h5 class="modal-title" id="massUploadModalLabel">Mass Upload User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="uploadFileUserData">
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
// import Actions from '@/components/TableActions.vue';
// import { useRouter } from 'vue-router';
// import { Modal } from 'bootstrap'
// const router = useRouter();
import MessageModal from '@/components/ModalAlert.vue'; 
import { Modal as BootstrapModal } from 'bootstrap';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const titleMessage = ref('');
const alertMessage = ref('');
const filterFullname = ref('');
const filterUsername = ref(''); 
const globalSearch = ref('');

const currentPage = ref(1); // Halaman aktif
const totalPages = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
const totalData = ref(0); // Jumlah total data dari API

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
// Ambil token dari localStorage
const token = localStorage.getItem('access_token');

const columns = [
  // { title: 'ID', data: 'user_id', sortable: true },
  { title: 'Dari Nama', data: 'fullname', sortable: true },
  { title: 'Username', data: 'username', sortable: true },
  { title: 'Role', data: 'role', sortable: true },
  { title: 'Aksi', data: 'actions', sortable: false },
  // { 
  //   title: 'Password', 
  //   data: 'password',
  //   render: function(data) {
  //     return maskPassword(data);
  //   }
  // }, 
];

// Reactive data untuk menyimpan data user
const userData = ref([]);
const userRole = ref([]);
const selectedRole = ref([]);

// const isEditModalOpen = ref(false)
const isEditMode = ref(false)

const editForm = ref({
  user_id: null,
  employee_id: '',
  username: '',
  password: '',
  role: '',
})

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
// const openEditModal = (rowData) => {
//   editForm.value = { ...rowData }
//   isEditModalOpen.value = true
// }

// Fungsi untuk reset form saat modal ditutup
const resetForm = () => {
  editForm.value = {
    user_id: null,
    employee_id: '',
    username: '',
    password: '',
    role: '',
  }
}

const selectedUser = ref(null) // Menyimpan data user yang dipilih untuk dihapus
// let deleteModalInstance = null // Menyimpan instance modal
// let editModalInstance = null // Menyimpan instance modal

// Fungsi untuk menampilkan modal konfirmasi penghapusan
const showDeleteModal = (rowData) => {
  selectedUser.value = rowData
  // deleteModalInstance = new Modal(document.getElementById('delete-confirmation'))
  // deleteModalInstance.show()
}

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
const showEditModal = (rowData) => {
  selectedUser.value = rowData
  editForm.value = { ...rowData }
  editForm.value.password = '';
  isEditMode.value = true
  // isEditModalOpen.value = true
 
  // editModalInstance = new Modal(document.getElementById('form-confirmation'))
  // deleteModalInstance.show()
}

// Fungsi untuk membuka modal tambah dengan form kosong
const showAddModal = () => {
  resetForm() // Kosongkan form
  isEditMode.value = false
  // isEditModalOpen.value = true
}

// Fungsi untuk submit tambah/edit
const submitUser = async () => {
  if(editForm.value.employee_id == ""){
    editForm.value = {
      user_id: editForm.value.user_id, 
      username: editForm.value.username,
      password: editForm.value.password,
      role: editForm.value.role
    } 
  }else{
    editForm.value = {
      user_id: editForm.value.user_id,
      employee_id: editForm.value.employee_id,
      username: editForm.value.username,
      password: editForm.value.password,
      role: editForm.value.role
    }
  }
 
  console.log('Edit data submitted:', editForm.value)
  try {
    if (isEditMode.value) {
      // Update data jika dalam mode edit
      const response = await axios.put(`http://localhost:3000/api/user/${editForm.value.user_id}`, editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil diupdate:', response.data)

      // Perbarui data userData di tabel setelah update
      // const index = userData.value.findIndex(user => user.user_id === editForm.value.user_id)
      // if (index !== -1) {
      //   userData.value[index] = { ...editForm.value }
      // }
      fetchUserData()
    }else {
      // Tambahkan data baru jika dalam mode tambah
      const response = await axios.post('http://localhost:3000/api/user', editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil ditambahkan:', response.data)

      // Tambahkan data baru ke tabel
      // userData.value.push(response.data)
      fetchUserData()
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

// Mengambil data user saat komponen dimuat
onMounted(async () => {
  await fetchUserRole();
  await fetchEmployees();
  await fetchUserData();
});

const currentSort = ref({ column: 'user_id', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchUserData(); // Panggil ulang API dengan parameter sorting
};

// Daftar nama
const employees = ref([]);

// Mengambil data nama
const fetchEmployees = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/employee', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    employees.value = response.data.rows;
  } catch (error) {
    console.error('Error fetching employees:', error);
    handleAuthError();
    // alert('Lakukan login terlebih dulu') 
  }
};

// Fungsi untuk mengambil data user dari backend
const fetchUserData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {  
        fullname: filterFullname.value,
        username: filterUsername.value,
        role: selectedRole.value.join(','),
        search: globalSearch.value,
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman
        // order_by: 'user_id', // Sorting berdasarkan ID
        // order_direction: 'DESC', // Urutan descending
      },
    })
    userData.value = response.data.rows.map((user) => ({
      ...user,
      fullname: user.employee?.fullname || 'N/A' // Ambil nama nama atau tampilkan "N/A" jika tidak ada
    }))
    totalData.value = response.data.sp.rowCount;
    totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);
  } catch (error) {
    console.error('Error fetching user data:', error)
    handleAuthError();
    // alert('Lakukan login terlebih dulu') 
  }
};

// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchUserData(); // Refresh data untuk halaman baru
  }
};

const onRoleSelect = (selectedRole) => {
  selectedRole.value = selectedRole; // Perbarui nilai terpilih 
};

const fetchUserRole = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/user/getUsersRole', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); 
    userRole.value = [...new Set(response.data)];
  } catch (error) {
    console.error('Error fetching role:', error);
    handleAuthError();
  }
};

// function maskPassword(password) {
//   if (!password) return ''; // Handle empty or undefined passwords
//   return '●'.repeat(12); // Replace with 8 bullet points or adjust length
// }


const exportUserData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/user/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        fullname: filterFullname.value,
        username: filterUsername.value,
        role: selectedRole.value.join(','),
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
    link.setAttribute("download", "data_user.xlsx"); // Nama file
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

const uploadFileUserData = async () => {
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
    const response = await axios.post('http://localhost:3000/api/user/mass-upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    titleMessage.value = `Berhasil`;
    alertMessage.value = `Upload berhasil, ${response.data.successCount} data user berhasil terupload`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
 
    fetchUserData();
  } catch (error) {
    console.error('Gagal mengunggah file:', error);
    titleMessage.value = `Gagal Upload`;
    alertMessage.value = 'Gagal mengunggah file. Pastikan format file benar.';
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
  }
};

const downloadTemplateUserData = async () => { 
  try {
    const response = await axios.get("http://localhost:3000/api/user/template/", {
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
    link.setAttribute("download", "template_data_user.xlsx"); // Nama file
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
    console.log('Id deleted:', selectedUser.value.user_id)
    await axios.delete(`http://localhost:3000/api/user/${selectedUser.value.user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // alert('Daca User berhasil dihapus.') 
    titleMessage.value = `Berhasil Hapus`;
    alertMessage.value = `Data User <strong>${selectedUser.value.username}</strong> berhasil dihapus.`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show(); 
    // deleteModalInstance.hide() // Sembunyikan modal setelah penghapusan

    // Refresh data setelah penghapusan
    fetchUserData()
  } catch (error) {
    console.error('Failed to delete user data:', error) 
    handleAuthError();
    // alert('Lakukan login terlebih dulu') 
  }
}

const handleAuthError = () => {
  // router.push({ name: 'auth.login' });
  titleMessage.value = `Koneksi Gagal`;
  alertMessage.value = `Cek koneksi internet Anda.`;
  const modal = new BootstrapModal(document.getElementById('message-alert'));
  modal.show();
};

const optionsRole = [
  { value: null, text: 'Silahkan pilih role karyawan' },
  { value: 'Admin', text: 'Admin' },
  { value: 'Manajer Teknis', text: 'Manajer Teknis' },
  { value: 'Petugas Lapangan', text: 'Petugas Lapangan' }, 
]

// const handleDelete = async (rowData) => {
//   const confirmDelete = confirm(`Are you sure you want to delete user ${rowData.fullname}?`)
//   if (!confirmDelete) return
//   console.log('Delete data:', rowData.user_id)
//   try {
//     await axios.delete(`http://localhost:3000/api/user/${rowData.user_id}`)
//     alert('User data deleted successfully.')

//     // Refresh data setelah penghapusan
//     fetchUserData()
//   } catch (error) {
//     console.error('Failed to delete user data:', error)
//     alert('Failed to delete user data.')
//   }
// }

// Fungsi untuk menghapus user
// const deleteUser = async (rowData) => {
//   console.log('Edit data:', rowData.user_id)
//   if (confirm('Are you sure you want to delete this user?')) {
//     try {
//       await axios.delete(`http://localhost:3000/api/user/${rowData.user_id}`);
//       await fetchUserData(); // Refresh data setelah penghapusan
//     } catch (error) {
//       console.error('Error deleting user:', error);
//     }
//   }
// };
</script>
