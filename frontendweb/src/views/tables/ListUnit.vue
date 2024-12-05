<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">List Satuan</h4>
          </div> 
          <div >
            <button 
              class="btn btn-success" 
              style="margin-right: 10px;" 
              @click="showAddModal" 
              data-bs-toggle="modal" 
              data-bs-target="#form-confirmation">
              Tambah Unit
            </button>
            <button 
              class="btn btn-outline-success" 
              style="margin-right: 10px;" 
              @click="exportUnitData">
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
              @click="downloadTemplateUnitData">
              Download Template
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row mb-2">
             
            <div class="col-sm-6">
            <!-- <b-col md="4"> -->
              <label for="validationCustomUsername01" class="form-label">Filter nama unit</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterUnitName" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            <!-- </b-col> -->
            </div>
            <div class="col-sm-4">
              <label for="validationCustomUsername01" class="form-label text-white">I</label>
              <div class="input-group has-validation">
                <button
                  class="btn btn-primary width-button-style filter-style" 
                  @click="fetchUnitData"
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
                @change="fetchUnitData"
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
              :data="unitData"
              :columns="unitColumns" 
              :idrow="unit_id"  
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
                    <h5 class="modal-title" id="staticBackdropPermissionLabel">{{ isEditMode ? 'Perbarui Unit' : 'Tambah Unit' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <p>Form yang bertanda <span class="text-primary">*</span> wajib diisi</p> 
                    <form @submit.prevent="submitUnit">
                      <div class="mb-3">
                        <label for="unit_name" class="form-label">Nama Unit<span class="text-primary">*</span></label>
                        <input v-model="editForm.unit_name" maxlength="100" id="unit_name" type="text" required class="form-control"/>
                      </div>
                       
                      <button type="submit" class="btn btn-primary" :data-bs-dismiss="editForm.unit_name ? 'modal' : null">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Unit' }}</button>
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
                    <p>Apa kamu yakin ingin menghapus data Unit <strong>{{ selectedUnit?.unit_name }}</strong>?</p>
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
                    <h5 class="modal-title" id="massUploadModalLabel">Mass Upload Unit</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="uploadFileUnitData">
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
    height: 35px;
  }

  .show-entries {
    width: 95px;
  }

  .width-button-style {
    width: 85px;
    font-size: 13px;
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
// import 'vue-select/dist/vue-select.css';

// const router = useRouter();  
const titleMessage = ref('');
const alertMessage = ref('');
const token = localStorage.getItem('access_token'); 
const unitData = ref([]);  
const filterUnitName = ref('');
const globalSearch = ref('');

const currentPage = ref(1); // Halaman aktif
const totalPages = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
const totalData = ref(0); // Jumlah total data dari API

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
const unitColumns = [
  { title: 'ID', data: 'unit_id', sortable: true },
  { title: 'Nama Unit', data: 'unit_name', sortable: true }, 
  { title: 'Aksi', data: 'actions', sortable: false },
];

// Mengambil data tool unit saat komponen dimuat
onMounted(async () => { 
  await fetchUnitData();
});

const currentSort = ref({ column: 'unit_id', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchUnitData(); // Panggil ulang API dengan parameter sorting
};

// Fungsi untuk mengambil data tool unit dari backend
const fetchUnitData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/asset_unit', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {  
        unit_name: filterUnitName.value,
        search: globalSearch.value,
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman 
       }, 
    });
    unitData.value = response.data.rows;// Asumsikan response berupa { data, total }
    totalData.value = response.data.sp.rowCount;
    totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);
  } catch (error) {
    console.error('Error fetching unit data:', error); 
    handleAuthError();
  }
};

// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchUnitData(); // Refresh data untuk halaman baru
  }
};

const isEditMode = ref(false)

const editForm = ref({
  unit_id: null, 
  unit_name: '', 
})

// Fungsi untuk reset form saat modal ditutup
const resetForm = () => {
  editForm.value = {
    unit_id: null, 
    unit_name: '', 
  }
}

const exportUnitData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/asset_unit/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {  
        unit_name: filterUnitName.value,
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
    link.setAttribute("download", "data_unit.xlsx"); // Nama file
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

const uploadFileUnitData = async () => {
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
    const response = await axios.post('http://localhost:3000/api/asset_unit/mass-upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    titleMessage.value = `Berhasil`;
    alertMessage.value = `Upload berhasil, ${response.data.successCount} data unit berhasil terupload`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
 
    fetchUnitData();
  } catch (error) {
    console.error('Gagal mengunggah file:', error);
    titleMessage.value = `Gagal Upload`;
    alertMessage.value = 'Gagal mengunggah file. Pastikan format file benar.';
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
  }
};

const downloadTemplateUnitData = async () => { 
  try {
    const response = await axios.get("http://localhost:3000/api/asset_unit/template/", {
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
    link.setAttribute("download", "template_data_unit.xlsx"); // Nama file
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

// Fungsi untuk membuka modal tambah dengan form kosong
const showAddModal = () => {
  resetForm() // Kosongkan form
  isEditMode.value = false 
}

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
const showEditModal = (rowData) => {
  selectedUnit.value = rowData
  editForm.value = { ...rowData }
  isEditMode.value = true
}

// Fungsi untuk submit tambah/edit
const submitUnit = async () => {
  console.log('Edit data submitted:', editForm.value)
  try {
    if (isEditMode.value) {
      // Update data jika dalam mode edit
      const response = await axios.put(`http://localhost:3000/api/asset_unit/${editForm.value.unit_id}`, editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil diupdate:', response.data)

      // Perbarui data unitData di tabel setelah update
      const index = unitData.value.findIndex(assetUnit => assetUnit.unit_id === editForm.value.unit_id)
      if (index !== -1) {
        unitData.value[index] = { ...editForm.value }
      }
    } else {
      // Tambahkan data baru jika dalam mode tambah
      const response = await axios.post('http://localhost:3000/api/asset_unit', editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil ditambahkan:', response.data)

      // Tambahkan data baru ke tabel
      unitData.value.push(response.data)
      fetchUnitData()
    } 
  } catch (error) {
    console.error('Gagal mengupdate data:', error);
    handleAuthError();
    // this.$router.push('/auth/login'); // Redirect ke halaman login
  }
}


const selectedUnit = ref(null) // Menyimpan data yang dipilih untuk dihapus

// Fungsi untuk menampilkan modal konfirmasi penghapusan
const showDeleteModal = (rowData) => {
  selectedUnit.value = rowData
}

const confirmDelete = async () => {
  try {
    console.log('Id deleted:', selectedUnit.value.unit_id)
    await axios.delete(`http://localhost:3000/api/asset_unit/${selectedUnit.value.unit_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // alert('Data Unit ' + selectedUnit.value.unit_name + ' bertasil dihapus.') 
    titleMessage.value = `Berhasil Hapus`;
    alertMessage.value = `Data Unit <strong>${selectedUnit.value.unit_name}</strong> berhasil dihapus.`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show(); 
    fetchUnitData()
  } catch (error) {
    console.error('Failed to delete unit data:', error) 
    handleAuthError();
  }
}

// Fungsi untuk menangani kesalahan autentikasi
const handleAuthError = () => {
  // router.push({ name: 'auth.login' });
  titleMessage.value = `Koneksi Gagal`;
  alertMessage.value = `Cek koneksi internet Anda.`;
  const modal = new BootstrapModal(document.getElementById('message-alert'));
  modal.show();
};
 
</script>
