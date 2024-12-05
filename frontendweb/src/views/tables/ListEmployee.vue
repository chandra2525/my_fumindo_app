<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">List Karyawan</h4>
          </div>
          <!-- <button @click="goToAddEmployee" class="btn btn-primary">Add New Employee</button> -->
          <!-- <button class="btn btn-success" @click="showAddModal">Tambah Employee</button> -->
          <div>
            <button 
              class="btn btn-success"
              style="margin-right: 10px;" 
              @click="showAddModal"
              data-bs-toggle="modal"
              data-bs-target="#form-confirmation">
              Tambah Karyawan
            </button>
            <button 
              class="btn btn-outline-success" 
              style="margin-right: 10px;" 
              @click="exportEmployeeData">
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
              @click="downloadTemplateEmployeeData">
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
              <!-- <b-col md="4"> -->
                <label for="validationCustomUsername01" class="form-label">Filter nama karyawan</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterFullname" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                  <!-- <button
                    class="btn btn-primary"
                    style="height: 35px"
                    @click="fetchEmployeeData"
                    title="Search">
                    <svg width="18" height="19" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 17.124L12.0962 12.2202M12.0962 12.2202C13.2725 11.0439 14 9.41895 14 7.62402C14 4.03417 11.0899 1.12402 7.5 1.12402C3.91015 1.12402 1 4.03417 1 7.62402C1 11.2139 3.91015 14.124 7.5 14.124C9.29493 14.124 10.9199 13.3965 12.0962 12.2202Z" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button> -->
                </div>
              <!-- </b-col> -->
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-sm-6">
              <!-- <b-col md="4"> -->
                <label for="validationCustomUsername01" class="form-label">Filter no telpon</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterPhoneNumber" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                  <!-- <button
                    class="btn btn-primary"
                    style="height: 35px"
                    @click="fetchEmployeeData"
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
                <label for="validationCustomUsername01" class="form-label">Filter email</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterEmail" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                  <!-- <button
                    class="btn btn-primary"
                    style="height: 35px"
                    @click="fetchEmployeeData"
                    title="Search">
                    <svg width="18" height="19" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 17.124L12.0962 12.2202M12.0962 12.2202C13.2725 11.0439 14 9.41895 14 7.62402C14 4.03417 11.0899 1.12402 7.5 1.12402C3.91015 1.12402 1 4.03417 1 7.62402C1 11.2139 3.91015 14.124 7.5 14.124C9.29493 14.124 10.9199 13.3965 12.0962 12.2202Z" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button> -->
                </div>
              <!-- </b-col> -->
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-sm-6">
              <!-- <b-col md="4"> -->
                <label for="validationCustomUsername01" class="form-label">Filter alamat</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterAddress" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                  <!-- <button
                    class="btn btn-primary"
                    style="height: 35px"
                    @click="fetchEmployeeData"
                    title="Search">
                    <svg width="18" height="19" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 17.124L12.0962 12.2202M12.0962 12.2202C13.2725 11.0439 14 9.41895 14 7.62402C14 4.03417 11.0899 1.12402 7.5 1.12402C3.91015 1.12402 1 4.03417 1 7.62402C1 11.2139 3.91015 14.124 7.5 14.124C9.29493 14.124 10.9199 13.3965 12.0962 12.2202Z" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button> -->
                </div>
              <!-- </b-col> -->
            </div>
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter status</label>
              <v-select 
                :options="employeeStatus" 
                v-model="selectedStatus" 
                multiple  
                @update:modelValue="onStatusSelect" 
                class="filter-style"
              ></v-select>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter divisi</label>
              <v-select 
                :options="employeeDivision" 
                v-model="selectedDivision" 
                multiple  
                @update:modelValue="onDivisionSelect" 
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
                    @click="fetchEmployeeData"
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
              <!-- <label for="validationCustomUsername01" class="form-label text-white"></label> -->
              <div class="input-group has-validation">
                <button
                  class="btn btn-primary width-button-style filter-style" 
                  @click="fetchEmployeeData"
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
                @change="fetchEmployeeData"
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
              :data="employeeData"
              :columns="columns"
              :idrow="employee_id"
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
                    <h5 class="modal-title" id="staticBackdropPermissionLabel">{{ isEditMode ? 'Perbarui Karyawan' : 'Tambah Karyawan' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="submitEmployee">
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
                        <label for="fullname" class="form-label">Nama Karyawan<span class="text-primary">*</span></label>
                        <input v-model="editForm.fullname" maxlength="100" type="text" class="form-control" id="fullname" required />
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
                        <label for="input-205" class="form-label">Divisi<span class="text-primary">*</span></label>
                        <b-form-select v-model="editForm.division" :options="optionsDivision" id="division" required></b-form-select>
                      </div>
                      <!-- <div class="mb-3"> 
                        <label for="input-205" class="form-label">Role Karyawan<span class="text-primary">*</span></label>
                        <b-form-select v-model="editForm.role" :options="optionsRole" id="role" required></b-form-select>
                      </div> -->
                      <!-- <div class="mb-3"> 
                        <label for="input-205" class="form-label">Status<span class="text-primary">*</span></label>
                        <b-form-select v-model="editForm.status" :options="optionsStatus" id="role" required></b-form-select>
                      </div> -->
                      <div v-if="!isEditMode">
                        <div class="mb-3">
                          <!-- <input type="checkbox" v-model="showCheckbox" />
                          <label>Add Username and Password</label> -->
                          <label class="form-check-label">
                            <input type="checkbox" class="form-check-input me-2" v-model="showCheckbox"/>
                            Ingin menambahkan akun?
                          </label>
                        </div>
                        <div v-if="showCheckbox">
                          <div class="mb-1">
                            <label for="username" class="form-label">Username<span class="text-primary">*</span></label>
                            <input v-model="editForm.username" maxlength="150" type="text" class="form-control" id="username" required />
                          </div>
                          <div class="mb-3">
                            <label for="password" class="form-label">Password<span class="text-primary">*</span></label>
                            <input v-model="editForm.password" maxlength="15" type="password" class="form-control" id="password" required />
                          </div>
                          <div class="mb-3"> 
                            <label for="role" class="form-label">Role User<span class="text-primary">*</span></label>
                            <b-form-select v-model="editForm.role" :options="optionsRole" id="role" required></b-form-select>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Tambahkan field lainnya sesuai dengan struktur data employee -->
                      <button type="submit" class="btn btn-primary" :data-bs-dismiss="
                        showCheckbox?
                        editForm.branch_id&&editForm.fullname&&editForm.division&&editForm.username&&editForm.password&&editForm.role ? 'modal' : null :
                        editForm.branch_id&&editForm.fullname&&editForm.division ? 'modal' : null
                        ">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Karyawan' }}
                      </button>
                      <!-- <button type="button" class="btn btn-primary me-2" data-bs-dismiss="modal">Save2</button>
                      <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button> -->
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal untuk Form Edit -->
            <!-- <b-modal v-model="isEditModalOpen" title="Edit Employee" @hide="resetForm">
              <form @submit.prevent="submitEmployee">
                <div class="mb-3">
                  <label for="fullname" class="form-label">Nama Lengkap</label>
                  <input v-model="editForm.fullname" type="text" class="form-control" id="fullname" required />
                </div>
                <div class="mb-3">
                  <label for="phone_number" class="form-label">No Telpon</label>
                  <input v-model="editForm.phone_number" type="text" class="form-control" id="phone_number" required />
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input v-model="editForm.email" type="email" class="form-control" id="email" required />
                </div>
                
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </form>
            </b-modal> -->

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
                    <h5 class="modal-title" id="massUploadModalLabel">Mass Upload Karyawan</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="uploadFileEmployeeData">
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
            <MessageModal :message="alertMessage" />
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
const filterPhoneNumber = ref('');
const filterEmail = ref('');
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
  { title: 'ID', data: 'employee_id', sortable: true },
  { title: 'Dari Cabang', data: 'branch_name', sortable: true },
  { title: 'Nama Karyawan', data: 'fullname', sortable: true },
  { title: 'No Telpon', data: 'phone_number', sortable: true },
  { title: 'E-mail', data: 'email', sortable: true },
  { title: 'Alamat', data: 'address', sortable: true },
  { title: 'Divisi', data: 'division', sortable: true },
  { title: 'Status', data: 'status', sortable: true },
  { title: 'Aksi', data: 'actions', sortable: false },
  // { title: 'Role', data: 'role', sortable: true },
  // { title: 'Username', data: 'username', sortable: true },
];

// Reactive data untuk menyimpan data employee
const employeeData = ref([]);
const branchNames = ref([]);
const selectedBranches = ref([]);
const employeeStatus = ref([]);
const selectedStatus = ref([]);
const employeeDivision = ref([]);
const selectedDivision = ref([]);

// const isEditModalOpen = ref(false)
const isEditMode = ref(false)
const showCheckbox = ref(false) 

const syncUsername= () => { 
  editForm.value.username = editForm.value.email 
}

const editForm = ref({
  employee_id: null,
  branch_id: '',
  fullname: '',
  phone_number: '',
  email: '',
  address: '',
  division: '',
  // role: '',
  status: 'Offline',
  username: '',
  password: '',
  type_user: 'Employee'
})

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
// const openEditModal = (rowData) => {
//   editForm.value = { ...rowData }
//   isEditModalOpen.value = true
// }

// Fungsi untuk reset form saat modal ditutup
const resetForm = () => {
  editForm.value = {
    employee_id: null,
    branch_id: '',
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    division: '',
    // role: '',
    status: 'Offline',
    username: '',
    password: '',
    type_user: 'Employee'
  }
}

const selectedEmployee = ref(null) // Menyimpan data employee yang dipilih untuk dihapus
// let deleteModalInstance = null // Menyimpan instance modal
// let editModalInstance = null // Menyimpan instance modal

// Fungsi untuk menampilkan modal konfirmasi penghapusan
const showDeleteModal = (rowData) => {
  selectedEmployee.value = rowData
  // deleteModalInstance = new Modal(document.getElementById('delete-confirmation'))
  // deleteModalInstance.show()
}

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
const showEditModal = (rowData) => {
  selectedEmployee.value = rowData
  editForm.value = { ...rowData }
  isEditMode.value = true
  // isEditModalOpen.value = true
 
  // editModalInstance = new Modal(document.getElementById('form-confirmation'))
  // deleteModalInstance.show()
}

// Fungsi untuk membuka modal tambah dengan form kosong
const showAddModal = () => {
  resetForm() // Kosongkan form
  isEditMode.value = false
  showCheckbox.value  = false
  // isEditModalOpen.value = true
}

// Fungsi untuk submit tambah/edit
const submitEmployee = async () => {
  console.log('Edit data submitted:', editForm.value)
  try {
    if (isEditMode.value) {
      // Update data jika dalam mode edit
      const response = await axios.put(`http://localhost:3000/api/employee/${editForm.value.employee_id}`, editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil diupdate:', response.data)

      // Perbarui data employeeData di tabel setelah update
      const index = employeeData.value.findIndex(employee => employee.employee_id === editForm.value.employee_id)
      if (index !== -1) {
        employeeData.value[index] = { ...editForm.value }
      }
      fetchEmployeeData()
    }else {
      // Tambahkan data baru jika dalam mode tambah
      const response = await axios.post('http://localhost:3000/api/employee', editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil ditambahkan:', response.data)

      // Tambahkan data baru ke tabel
      // employeeData.value.push(response.data)
      fetchEmployeeData()
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

// Mengambil data employee saat komponen dimuat
onMounted(async () => { 
  await fetchEmployeeStatus();
  await fetchEmployeeDivision();
  await fetchBranches();
  await fetchEmployeeData();
});

const currentSort = ref({ column: 'employee_id', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchEmployeeData(); // Panggil ulang API dengan parameter sorting
};

const onBranchSelect = (selected) => {
  selectedBranches.value = selected; // Perbarui nilai terpilih
  // fetchEmployeeData(); // Panggil fungsi fetch dengan data terpilih
};

const onStatusSelect = (selectedStatus) => {
  selectedStatus.value = selectedStatus; // Perbarui nilai terpilih
  // fetchEmployeeData(); // Panggil fungsi fetch dengan data terpilih
};

const onDivisionSelect = (selectedDivision) => {
  selectedDivision.value = selectedDivision; // Perbarui nilai terpilih
  // fetchEmployeeData(); // Panggil fungsi fetch dengan data terpilih
};


// Fungsi untuk mengambil data employee dari backend
const fetchEmployeeData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/employee', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        branch_name: selectedBranches.value.join(','), 
        fullname: filterFullname.value,
        phone_number: filterPhoneNumber.value,
        email: filterEmail.value,
        address: filterAddress.value,
        status: selectedStatus.value.join(','),  
        division: selectedDivision.value.join(','), 
        search: globalSearch.value, 
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman
        // order_by: 'employee_id', // Sorting berdasarkan ID
        // order_direction: 'DESC', // Urutan descending
      },
    })
    employeeData.value = response.data.rows.map((employee) => ({
      ...employee,
      branch_name: employee.branch?.branch_name || 'N/A' // Ambil nama cabang atau tampilkan "N/A" jika tidak ada
    }))
    totalData.value = response.data.sp.rowCount;
    totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);
  } catch (error) {
    console.error('Error fetching employee data:', error)
    handleAuthError();
    // alert('Lakukan login terlebih dulu') 
  }
};

// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchEmployeeData(); // Refresh data untuk halaman baru
  }
};

const fetchEmployeeStatus = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/employee/getEmployeesStatus', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // employeeStatus.value = response.data;
    employeeStatus.value = [...new Set(response.data)];
  } catch (error) {
    console.error('Error fetching branch names:', error);
    handleAuthError();
  }
};

const fetchEmployeeDivision = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/employee/getEmployeesDivision', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); 
    employeeDivision.value = [...new Set(response.data)];
  } catch (error) {
    console.error('Error fetching branch names:', error);
    handleAuthError();
  }
};
 
// Daftar cabang
const branches = ref([]);

// Mengambil data cabang
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
// Navigasi ke halaman tambah employee
// const goToAddEmployee = () => {
//   router.push({ name: 'employee-add' });
// };

// Fungsi untuk mengedit employee
// const editEmployee = (employeeId) => {
//   router.push({ name: 'employee-edit', params: { id: employeeId } });
// };

// const handleEdit = (rowData) => {
//   console.log('Edit data:', rowData)
//   // Tambahkan logika untuk membuka form edit atau mengedit data
// }

const exportEmployeeData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/employee/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        branch_name: selectedBranches.value.join(','), 
        fullname: filterFullname.value,
        phone_number: filterPhoneNumber.value,
        email: filterEmail.value,
        address: filterAddress.value,
        status: selectedStatus.value.join(','),  
        division: selectedDivision.value.join(','), 
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
    link.setAttribute("download", "data_karyawan.xlsx"); // Nama file
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

const uploadFileEmployeeData = async () => {
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
    const response = await axios.post('http://localhost:3000/api/employee/mass-upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    titleMessage.value = `Berhasil`;
    alertMessage.value = `Upload berhasil, ${response.data.successCount} data karyawan berhasil terupload`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
 
    fetchEmployeeData();
  } catch (error) {
    console.error('Gagal mengunggah file:', error);
    titleMessage.value = `Gagal Upload`;
    alertMessage.value = 'Gagal mengunggah file. Pastikan format file benar.';
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
  }
};

const downloadTemplateEmployeeData = async () => { 
  try {
    const response = await axios.get("http://localhost:3000/api/employee/template/", {
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
    link.setAttribute("download", "template_data_karyawan.xlsx"); // Nama file
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
    console.log('Id deleted:', selectedEmployee.value.employee_id)
    await axios.delete(`http://localhost:3000/api/employee/${selectedEmployee.value.employee_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // alert('Daca Karyawan berhasil dihapus.') 
    titleMessage.value = `Berhasil Hapus`;
    alertMessage.value = `Data Karyawan <strong>${selectedEmployee.value.fullname}</strong> berhasil dihapus.`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show(); 
    // deleteModalInstance.hide() // Sembunyikan modal setelah penghapusan

    // Refresh data setelah penghapusan
    fetchEmployeeData()
  } catch (error) {
    console.error('Failed to delete employee data:', error) 
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

const optionsDivision = [
  { value: null, text: 'Silahkan pilih divisi karyawan' },
  { value: 'Admin', text: 'Admin' },
  { value: 'Director of Fumindo', text: 'Director of Fumindo' },
  { value: 'Technician Manager', text: 'Technician Manager' },  
  { value: 'Technician and Operational', text: 'Technician and Operational' },
  { value: 'Service Technician', text: 'Service Technician' },
]

const optionsRole = [
  { value: null, text: 'Silahkan pilih role user' },
  { value: 'Admin', text: 'Admin' },
  { value: 'Manajer Teknis', text: 'Manajer Teknis' },
  { value: 'Petugas Lapangan', text: 'Petugas Lapangan' }, 
]

// const optionsStatus = [
//   { value: null, text: 'Silahkan pilih status' },
//   { value: 'Online', text: 'Online' },
//   { value: 'Offline', text: 'Offline' },
//   { value: 'Survey', text: 'Survey' }, 
//   { value: 'On Duty', text: 'On Duty' }, 
// ]

// const handleDelete = async (rowData) => {
//   const confirmDelete = confirm(`Are you sure you want to delete employee ${rowData.fullname}?`)
//   if (!confirmDelete) return
//   console.log('Delete data:', rowData.employee_id)
//   try {
//     await axios.delete(`http://localhost:3000/api/employee/${rowData.employee_id}`)
//     alert('Employee data deleted successfully.')

//     // Refresh data setelah penghapusan
//     fetchEmployeeData()
//   } catch (error) {
//     console.error('Failed to delete employee data:', error)
//     alert('Failed to delete employee data.')
//   }
// }

// Fungsi untuk menghapus employee
// const deleteEmployee = async (rowData) => {
//   console.log('Edit data:', rowData.employee_id)
//   if (confirm('Are you sure you want to delete this employee?')) {
//     try {
//       await axios.delete(`http://localhost:3000/api/employee/${rowData.employee_id}`);
//       await fetchEmployeeData(); // Refresh data setelah penghapusan
//     } catch (error) {
//       console.error('Error deleting employee:', error);
//     }
//   }
// };
</script>
