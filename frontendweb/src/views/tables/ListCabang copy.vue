<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">List Cabang</h4>
          </div> 
          <button class="btn btn-success" @click="showAddModal" data-bs-toggle="modal" data-bs-target="#form-confirmation">Tambah Cabang</button>
        </div>
        <!-- <div>
          <label for="filter">Filter by Branch Name:</label>
          <input type="text" id="filter" v-model="filter" @input="fetchBranchData" />
        </div> -->
        <div class="card-body">
          <!-- <div>
            <label for="filter">Filter by Branch Name:</label>
            <select id="filter" v-model="filter" @change="fetchBranchData" class="form-select">
              <option value="">-- Select Branch Name --</option>
              <option v-for="name in branchNames" :key="name" :value="name">
                {{ name }}
              </option>
            </select>
          </div> -->
          <div class="row mb-2">
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter nama cabang</label>
              <!-- <v-select :options="branchNames" v-model="selectedBranches" multiple @input="fetchBranchData" ></v-select> -->
              <v-select 
                :options="branchNames" 
                v-model="selectedBranches" 
                multiple  
                @update:modelValue="onBranchSelect" 
                class="filter-style"
              ></v-select>
            </div>
            <!-- <div class="col-sm-4">
              <label for="filter" class="mb-2">Filter Alamat:</label>
              <input
                type="text"
                v-model="filterAddress" 
                class="mb-4 form-control filter-style"
              />
              <button
                class="btn btn-primary filter-style"
                @click="fetchBranchData"
                title="Search">
                <svg width="18" height="19" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 17.124L12.0962 12.2202M12.0962 12.2202C13.2725 11.0439 14 9.41895 14 7.62402C14 4.03417 11.0899 1.12402 7.5 1.12402C3.91015 1.12402 1 4.03417 1 7.62402C1 11.2139 3.91015 14.124 7.5 14.124C9.29493 14.124 10.9199 13.3965 12.0962 12.2202Z" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
              </button>
            </div> -->
            <div class="col-sm-6">
            <!-- <b-col md="4"> -->
              <label for="validationCustomUsername01" class="form-label">Filter alamat</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterAddress" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            <!-- </b-col> -->
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
                  <!-- <button
                    class="btn btn-primary filter-style"
                    @click="fetchBranchData"
                    title="Search">
                    <svg width="18" height="19" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 17.124L12.0962 12.2202M12.0962 12.2202C13.2725 11.0439 14 9.41895 14 7.62402C14 4.03417 11.0899 1.12402 7.5 1.12402C3.91015 1.12402 1 4.03417 1 7.62402C1 11.2139 3.91015 14.124 7.5 14.124C9.29493 14.124 10.9199 13.3965 12.0962 12.2202Z" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button> -->
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <label for="validationCustomUsername01" class="form-label text-white">I</label>
              <div class="input-group has-validation">
                <button
                  class="btn btn-primary width-button-style filter-style" 
                  @click="fetchBranchData"
                  title="Search">
                  Filter
                </button>
              </div>
            </div>
          </div>
            <!-- <v-select
              v-model="selectedBranches"
              :options="branchNames"
              multiple
              label="branch_name"
              placeholder="Search and select branches"
              class="form-control"
              :reduce="branch => branch.branch_name"
              @input="fetchBranchData"
            >
              <template #option="{ selected, option }">
                <div class="d-flex align-items-center">
                  <input type="checkbox" :checked="selected" />
                  <span class="ms-2">{{ option }}</span>
                </div>
              </template>
            </v-select> -->
           
          <div class="table-responsive border-bottom">
            <data-table
              :data="branchData"
              :columns="branchColumns" 
              @edit="showEditModal"
              @delete="showDeleteModal"
            />
            
            <div class="modal fade" id="form-confirmation" data-bs-backdrop="static" data-bs-keyboard="true" tabindex="-1" aria-labelledby="staticBackdropPermissionLabel" aria-hidden="true" @hide="resetForm">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropPermissionLabel">{{ isEditMode ? 'Perbarui Cabang' : 'Tambah Cabang' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <p>Form yang bertanda <span class="text-primary">*</span> wajib diisi</p> 
                    <form @submit.prevent="submitBranch">
                      <div class="mb-3">
                        <label for="branch_name" class="form-label">Nama Cabang<span class="text-primary">*</span></label>
                        <input v-model="editForm.branch_name" maxlength="100" id="branch_name" type="text" required class="form-control"/>
                      </div>
                      <div class="mb-3"> 
                        <label for="address" class="form-label">Alamat<span class="text-primary">*</span></label>
                        <b-form-textarea v-model="editForm.address" id="address" type="text" required rows="6" max-rows="6"></b-form-textarea>
                      </div> 
                      <button type="submit" class="btn btn-primary" :data-bs-dismiss="editForm.branch_name&&editForm.address ? 'modal' : null">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Cabang' }}</button>
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
                    <p>Apa kamu yakin ingin menghapus data Cabang <strong>{{ selectedBranch?.branch_name }}</strong>?</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="confirmDelete">Delete</button>
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
</style>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from '@/components/DataTable.vue';
// import Actions from '@/components/TableActions.vue';
// import { useRouter } from 'vue-router';
// import { Modal } from 'bootstrap'
import MessageModal from '@/components/ModalAlert.vue'; 
import { Modal as BootstrapModal } from 'bootstrap';
// import "vue-select/dist/vue-select.css";
// import "vue-select/src/scss/vue-select.scss";
// import Vue from "vue";
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

// const router = useRouter();  
const alertMessage = ref('');
const token = localStorage.getItem('access_token');
// Reactive data untuk menyimpan data cabang
const branchData = ref([]);
const branchNames = ref([]);
const selectedBranches = ref([]);
const filterAddress = ref('');
const globalSearch = ref('');

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
const branchColumns = [
  { title: 'ID', data: 'branch_id', defaultSort: 'DESC' },
  { title: 'Nama Cabang', data: 'branch_name' },
  { title: 'Alamat', data: 'address' },  
];

// Mengambil data branch saat komponen dimuat
onMounted(async () => {
  await fetchBranchNames();
  await fetchBranchData();
});

const onBranchSelect = (selected) => {
  selectedBranches.value = selected; // Perbarui nilai terpilih
  // fetchBranchData(); // Panggil fungsi fetch dengan data terpilih
};


// Fungsi untuk mengambil data branch dari backend
const fetchBranchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/branch', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        branch_name: selectedBranches.value.join(','), 
        address: filterAddress.value,
        search: globalSearch.value,
        order_by: 'branch_id', // Sorting berdasarkan ID
        order_direction: 'DESC', // Urutan descending
       },
      // params: { branch_name: selectedBranches.value.map(branch => branch.branch_name) },  
    });
    branchData.value = response.data; 
  } catch (error) {
    console.error('Error fetching branch data:', error); 
    handleAuthError();
  }
};

const fetchBranchNames = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/branch/filterBranchName', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    branchNames.value = response.data; // Simpan daftar nama cabang
    //  branchNames.value = response.data.map(branch => ({
    //   value: branch.branch_id, // Nilai yang digunakan
    //   label: branch.branch_name, // Nama yang ditampilkan
    // }));
    // branchNames.value = response.data.map(branch => branch.branch_name); // Ambil nama cabang saja
  } catch (error) {
    console.error('Error fetching branch names:', error);
    handleAuthError();
  }
};
 
// const filter = ref('');
// const isEditModalOpen = ref(false)
const isEditMode = ref(false)

const editForm = ref({
  branch_id: null, 
  branch_name: '',
  address: '', 
})

// Fungsi untuk reset form saat modal ditutup
const resetForm = () => {
  editForm.value = {
    branch_id: null, 
    branch_name: '',
    address: '',
  }
}

// Fungsi untuk membuka modal tambah dengan form kosong
const showAddModal = () => {
  resetForm() // Kosongkan form
  isEditMode.value = false 
}

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
const showEditModal = (rowData) => {
  selectedBranch.value = rowData
  editForm.value = { ...rowData }
  isEditMode.value = true
}

// Fungsi untuk submit tambah/edit
const submitBranch = async () => {
  console.log('Edit data submitted:', editForm.value)
  try {
    if (isEditMode.value) {
      // Update data jika dalam mode edit
      const response = await axios.put(`http://localhost:3000/api/branch/${editForm.value.branch_id}`, editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil diupdate:', response.data)

      // Perbarui data branchData di tabel setelah update
      const index = branchData.value.findIndex(branch => branch.branch_id === editForm.value.branch_id)
      if (index !== -1) {
        branchData.value[index] = { ...editForm.value }
      }
    } else {
      // Tambahkan data baru jika dalam mode tambah
      const response = await axios.post('http://localhost:3000/api/branch', editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil ditambahkan:', response.data)

      // Tambahkan data baru ke tabel
      branchData.value.push(response.data)
    } 
  } catch (error) {
    console.error('Gagal mengupdate data:', error);
    handleAuthError();
    // this.$router.push('/auth/login'); // Redirect ke halaman login
  }
}


const selectedBranch = ref(null) // Menyimpan data cabang yang dipilih untuk dihapus

// Fungsi untuk menampilkan modal konfirmasi penghapusan
const showDeleteModal = (rowData) => {
  selectedBranch.value = rowData
}

const confirmDelete = async () => {
  try {
    console.log('Id deleted:', selectedBranch.value.branch_id)
    await axios.delete(`http://localhost:3000/api/branch/${selectedBranch.value.branch_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // alert('Data Cabang ' + selectedBranch.value.branch_name + ' bertasil dihapus.') 
    alertMessage.value = `Data Cabang <strong>${selectedBranch.value.branch_name}</strong> berhasil dihapus.`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show(); 
    fetchBranchData()
  } catch (error) {
    console.error('Failed to delete branch data:', error) 
    handleAuthError();
  }
}

// Fungsi untuk menangani kesalahan autentikasi
const handleAuthError = () => {
  // router.push({ name: 'auth.login' });
  alertMessage.value = `Lakukan login terlebih dulu.`;
  const modal = new BootstrapModal(document.getElementById('message-alert'));
  modal.show();
};
 
</script>
