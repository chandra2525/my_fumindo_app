<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">List Kategori Alat</h4>
          </div> 
          <div >
            <button 
              class="btn btn-success" 
              style="margin-right: 10px;" 
              @click="showAddModal" 
              data-bs-toggle="modal" 
              data-bs-target="#form-confirmation">
              Tambah Kategori Alat
            </button>
            <button 
              class="btn btn-outline-success" 
              style="margin-right: 10px;" 
              @click="exportToolCategoryData">
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
              @click="downloadTemplateToolCategoryData">
              Download Template
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row mb-2">
             
            <div class="col-sm-6">
            <!-- <b-col md="4"> -->
              <label for="validationCustomUsername01" class="form-label">Filter nama alat kategori</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterToolCategoryName" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div>
            <!-- </b-col> -->
            </div>
            <div class="col-sm-4">
              <label for="validationCustomUsername01" class="form-label text-white">I</label>
              <div class="input-group has-validation">
                <button
                  class="btn btn-primary width-button-style filter-style" 
                  @click="fetchToolCategoryData"
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
                @change="fetchToolCategoryData"
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
              :data="toolCategoryData"
              :columns="toolCategoryColumns" 
              :currentPage="currentPage"
              :pageSize="pageSize"  
              :idrow="tool_category_id"  
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
                    <h5 class="modal-title" id="staticBackdropPermissionLabel">{{ isEditMode ? 'Perbarui Kategori Alat' : 'Tambah Kategori Alat' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <p>Form yang bertanda <span class="text-primary">*</span> wajib diisi</p> 
                    <form @submit.prevent="submitToolCategory">
                      <div class="mb-3">
                        <label for="tool_category_name" class="form-label">Nama Kategori Alat<span class="text-primary">*</span></label>
                        <input v-model="editForm.tool_category_name" maxlength="100" id="tool_category_name" type="text" required class="form-control"/>
                      </div>
                       
                      <button type="submit" class="btn btn-primary" :data-bs-dismiss="editForm.tool_category_name ? 'modal' : null">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Kategori Alat' }}</button>
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
                    <p>Apa kamu yakin ingin menghapus data Kategori Alat <strong>{{ selectedToolCategory?.tool_category_name }}</strong>?</p>
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
                    <h5 class="modal-title" id="massUploadModalLabel">Mass Upload Kategori Alat</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="uploadFileToolCategoryData">
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
const toolCategoryData = ref([]);  
const filterToolCategoryName = ref('');
const globalSearch = ref('');

const currentPage = ref(1); // Halaman aktif
const totalPages = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
const totalData = ref(0); // Jumlah total data dari API

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
const toolCategoryColumns = [
  // { title: 'ID', data: 'tool_category_id', sortable: true },
  { title: 'Nama Kategori Alat', data: 'tool_category_name', sortable: true }, 
  { title: 'Aksi', data: 'actions', sortable: false },
];

// Mengambil data tool category saat komponen dimuat
onMounted(async () => { 
  await fetchToolCategoryData();
});

const currentSort = ref({ column: 'tool_category_id', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchToolCategoryData(); // Panggil ulang API dengan parameter sorting
};

// Fungsi untuk mengambil data tool category dari backend
const fetchToolCategoryData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/asset_tool_category', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {  
        tool_category_name: filterToolCategoryName.value,
        search: globalSearch.value,
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman 
       }, 
    });
    toolCategoryData.value = response.data.rows;// Asumsikan response berupa { data, total }
    totalData.value = response.data.sp.rowCount;
    totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);
  } catch (error) {
    console.error('Error fetching tool category data:', error); 
    handleAuthError();
  }
};

// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchToolCategoryData(); // Refresh data untuk halaman baru
  }
};

const isEditMode = ref(false)

const editForm = ref({
  tool_category_id: null, 
  tool_category_name: '', 
})

// Fungsi untuk reset form saat modal ditutup
const resetForm = () => {
  editForm.value = {
    tool_category_id: null, 
    tool_category_name: '', 
  }
}

const exportToolCategoryData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/asset_tool_category/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {  
        tool_category_name: filterToolCategoryName.value,
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
    link.setAttribute("download", "data_kategori_alat.xlsx"); // Nama file
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

const uploadFileToolCategoryData = async () => {
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
    const response = await axios.post('http://localhost:3000/api/asset_tool_category/mass-upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    titleMessage.value = `Berhasil`;
    alertMessage.value = `Upload berhasil, ${response.data.successCount} data kategori alat berhasil terupload`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
 
    fetchToolCategoryData();
  } catch (error) {
    console.error('Gagal mengunggah file:', error);
    titleMessage.value = `Gagal Upload`;
    alertMessage.value = 'Gagal mengunggah file. Pastikan format file benar.';
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
  }
};

const downloadTemplateToolCategoryData = async () => { 
  try {
    const response = await axios.get("http://localhost:3000/api/asset_tool_category/template/", {
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
    link.setAttribute("download", "template_data_kategori_alat.xlsx"); // Nama file
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
  selectedToolCategory.value = rowData
  editForm.value = { ...rowData }
  isEditMode.value = true
}

// Fungsi untuk submit tambah/edit
const submitToolCategory = async () => {
  console.log('Edit data submitted:', editForm.value)
  try {
    if (isEditMode.value) {
      // Update data jika dalam mode edit
      const response = await axios.put(`http://localhost:3000/api/asset_tool_category/${editForm.value.tool_category_id}`, editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil diupdate:', response.data)

      // Perbarui data toolCategoryData di tabel setelah update
      const index = toolCategoryData.value.findIndex(assetToolCategory => assetToolCategory.tool_category_id === editForm.value.tool_category_id)
      if (index !== -1) {
        toolCategoryData.value[index] = { ...editForm.value }
      }
    } else {
      // Tambahkan data baru jika dalam mode tambah
      const response = await axios.post('http://localhost:3000/api/asset_tool_category', editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil ditambahkan:', response.data)

      // Tambahkan data baru ke tabel
      toolCategoryData.value.push(response.data)
      fetchToolCategoryData()
    } 
  } catch (error) {
    console.error('Gagal mengupdate data:', error);
    handleAuthError();
    // this.$router.push('/auth/login'); // Redirect ke halaman login
  }
}


const selectedToolCategory = ref(null) // Menyimpan data yang dipilih untuk dihapus

// Fungsi untuk menampilkan modal konfirmasi penghapusan
const showDeleteModal = (rowData) => {
  selectedToolCategory.value = rowData
}

const confirmDelete = async () => {
  try {
    console.log('Id deleted:', selectedToolCategory.value.tool_category_id)
    await axios.delete(`http://localhost:3000/api/asset_tool_category/${selectedToolCategory.value.tool_category_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // alert('Data Kategori Alat ' + selectedToolCategory.value.tool_category_name + ' bertasil dihapus.') 
    titleMessage.value = `Berhasil Hapus`;
    alertMessage.value = `Data Kategori Alat <strong>${selectedToolCategory.value.tool_category_name}</strong> berhasil dihapus.`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show(); 
    fetchToolCategoryData()
  } catch (error) {
    console.error('Failed to delete tool category data:', error) 
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
