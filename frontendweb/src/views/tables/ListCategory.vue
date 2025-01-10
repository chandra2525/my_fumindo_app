<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">List Kategori</h4>
          </div> 
          <div >
            <!-- <button 
              class="btn btn-success" 
              style="margin-right: 10px;" 
              @click="showAddModal" 
              data-bs-toggle="modal" 
              data-bs-target="#form-confirmation">
              Tambah Kategori
            </button> -->
       
            <button id="btnGroupDrop1" type="button" class="btn btn-success dropdown-toggle width-button-style-top" style="margin-right: 10px;" data-bs-toggle="dropdown" aria-expanded="false">Tambah Kategori</button>
            <ul class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                <li><a class="dropdown-item" href="#" @click="showAddModal('1')" data-bs-toggle="modal" data-bs-target="#form-confirmation">Kategori Level 1</a></li>
                <li><a class="dropdown-item" href="#" @click="showAddModal('2')" data-bs-toggle="modal" data-bs-target="#form-confirmation">Kategori Level 2</a></li>
                <li><a class="dropdown-item" href="#" @click="showAddModal('3')" data-bs-toggle="modal" data-bs-target="#form-confirmation">Kategori Level 3</a></li>
            </ul>
            <button 
              class="btn btn-outline-success width-button-style-top" 
              style="margin-right: 10px;" 
              @click="exportCategoryData">
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
              @click="downloadTemplateCategoryData">
              Download Template
            </button>
            <!-- <button 
              class="btn btn-outline-warning width-button-style-top" 
              @click="downloadTemplateCategoryData">
              Log
            </button> -->
          </div>
        </div>
        <div class="card-body">
          <div class="row mb-2">
            <div class="col-sm-6"> 
              <label for="validationCustomUsername01" class="form-label">Filter nama kategori</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterCategoryName" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div> 
            </div>
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter level</label>
              <v-select 
                :options="levels" 
                v-model="selectedLevels" 
                multiple 
                @update:modelValue="onLevelSelect" 
                class="filter-style"
              ></v-select>
            </div>
            <!-- <div class="col-sm-6"> 
              <label for="validationCustomUsername01" class="form-label">Filter level</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterLevel" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div> 
            </div> -->
          </div>

          <div class="row mb-3">
            <div class="col-sm-6"> 
              <label for="validationCustomUsername01" class="form-label">Filter path</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterPath" class="form-control filter-style" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div> 
            </div>
            <div class="col-sm-6"> 
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
                  @click="fetchCategoryData"
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
                @change="fetchCategoryData"
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
              :data="categoryData"
              :columns="categoryColumns" 
              :currentPage="currentPage"
              :pageSize="pageSize"  
              :idrow="category_id"  
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
                    <h5 class="modal-title" id="staticBackdropPermissionLabel">{{ isEditMode ? 'Perbarui Kategori' : 'Tambah Kategori Level ' + editForm.level }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <p>Form yang bertanda <span class="text-primary">*</span> wajib diisi</p> 
                    <form @submit.prevent="submitKategori">
                      <div v-if="editForm.level != '1'">
                        <div class="mb-3"> 
                        <label for="parent_id" class="form-label">Kategori Induk<span class="text-primary">*</span></label>
                        <select id="parent_id" v-model="editForm.parent_id" class="form-select" required>
                          <option value="" disabled>Silahkan pilih nama</option>
                          <option v-for="category in editForm.level == '2' ? categoryNameParent1 : categoryNameParent2" :key="category.parent_id" :value="category.category_id">
                            {{ category.category_name }}
                          </option>
                        </select>
                      </div>    
                      </div>
                      <div class="mb-3">
                        <label for="category_name" class="form-label">Nama Kategori<span class="text-primary">*</span></label>
                        <input v-model="editForm.category_name" maxlength="30" id="category_name" type="text" required class="form-control"/>
                      </div>
                       
                      <button type="submit" class="btn btn-primary" :data-bs-dismiss="
                        editForm.level == '1' ?
                        editForm.category_name ? 'modal' : null :
                        editForm.parent_id&&editForm.category_name ? 'modal' : null
                        ">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Kategori' }}
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
                    <p>Apa kamu yakin ingin menghapus data Kategori <strong>{{ selectedCategory?.category_name }}</strong>?</p>
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
                    <h5 class="modal-title" id="massUploadModalLabel">Mass Upload Kategori</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="uploadFileCategoryData">
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
const token = localStorage.getItem('access_token'); 
const categoryData = ref([]);
const categoryData2 = ref([]);

const filterCategoryName = ref(''); 
const selectedLevels = ref([]);
const filterPath= ref('');
const globalSearch = ref('');

const levels = ref([]);
const categoryNameParent1 = ref([]);
const categoryNameParent2= ref([]);

const currentPage = ref(1); // Halaman aktif
const totalPages = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
const totalData = ref(0); // Jumlah total data dari API

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
const categoryColumns = [
  // { title: 'ID', data: 'category_id', sortable: true },
  { title: 'Nama Kategori', data: 'category_name', sortable: true }, 
  { title: 'Level', data: 'level', sortable: true }, 
  { title: 'Turunan', data: 'path', sortable: true }, 
  { title: 'Aksi', data: 'actions', sortable: false },
];

// Mengambil data tool kategori saat komponen dimuat
onMounted(async () => { 
  await fetchCategoryData();
  await fetchLevels();
});

const currentSort = ref({ column: 'category_id', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchCategoryData(); // Panggil ulang API dengan parameter sorting
};

const onLevelSelect = (selected) => {
  selectedLevels.value = selected; // Perbarui nilai terpilih
  // fetchEmployeeData(); // Panggil fungsi fetch dengan data terpilih
};

// Fungsi untuk mengambil data tool kategori dari backend
const fetchCategoryData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/category/hierarchy', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        category_name: filterCategoryName.value,
        level: selectedLevels.value.join(','), 
        path: filterPath.value,
        search: globalSearch.value,
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman 
       }, 
    });
    // categoryData.value = response.data.rows;// Asumsikan response berupa { data, total }
    
    // Memodifikasi path untuk menghapus bagian terakhir
    categoryData.value = response.data.rows.map((item) => {
       if (!item.path || !item.path.includes(' > ')) {
        // Jika path kosong atau tidak memiliki turunan, tampilkan "-"
        item.path = '-';
      } else {
        // Jika ada turunan, hapus bagian terakhir
        const pathParts = item.path.split(' > '); // Pisahkan path berdasarkan ' > '
        item.path = pathParts.slice(0, -1).join(' > '); // Gabungkan kembali tanpa elemen terakhir
      }
      return item;
    });
    totalData.value = response.data.sp.rowCount;
    totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);

    const response2 = await axios.get('http://localhost:3000/api/category/hierarchy', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: 1, // Kirim nomor halaman
        pageSize: 200, // Kirim ukuran data per halaman 
       }, 
    });
    categoryData2.value = response2.data.rows;
    categoryNameParent1.value = categoryData2.value.filter(category => category.level === 1);
    categoryNameParent2.value = categoryData2.value.filter(category => category.level === 2);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } 
    else {
      console.error('Error fetching category data:', error); 
      handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    }
  }
};

const fetchLevels = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/category/filterLevel', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    levels.value = response.data.map(item => item.level);
  } catch (error) {
    // if (error.response && error.response.status === 401) {
    //   handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    // } 
    // else {
      console.error('Error fetching category levels:', error);
      // handleErrorMessage(`Koneksi Gagal`,`Cek koneksi internet Anda.`,'error');
    // }
  }
};

// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchCategoryData(); // Refresh data untuk halaman baru
  }
};

const isEditMode = ref(false)

const editForm = ref({
  category_id: null, 
  category_name: '',
  parent_id: '',
  level: '1',
})

// Fungsi untuk reset form saat modal ditutup
const resetForm = () => {
  editForm.value = {
    category_id: null,
    category_name: '',
    parent_id: '',
  }
}

const exportCategoryData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/category/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        category_name: filterCategoryName.value,
        level: selectedLevels.value.join(','), 
        path: filterPath.value,
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
    link.setAttribute("download", "data_category.xlsx"); // Nama file
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

const uploadFileCategoryData = async () => {
  const fileInput = document.getElementById('upload-file');
  const file = fileInput.files[0];

  if (!file) {
    handleErrorMessage(`Pilih File`,`Silakan pilih file sebelum mengunggah.`,'error');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('http://localhost:3000/api/category/mass-upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    handleErrorMessage(`Berhasil`,`Upload berhasil, ${response.data.successCount} data kategori berhasil terupload`,'error');
    fetchCategoryData();
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

const downloadTemplateCategoryData = async () => { 
  try {
    const response = await axios.get("http://localhost:3000/api/category/template/", {
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
    link.setAttribute("download", "template_data_category.xlsx"); // Nama file
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
const showAddModal = (lev) => {
  resetForm() // Kosongkan form
  isEditMode.value = false 
  editForm.value.level = lev;
}

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
const showEditModal = (rowData) => {
  selectedCategory.value = rowData
  editForm.value = { ...rowData }
  isEditMode.value = true
}

// Fungsi untuk submit tambah/edit
const submitKategori = async () => {
  if(editForm.value.level != '1'){
    editForm.value = {
      category_id: editForm.value.category_id, 
      category_name: editForm.value.category_name,
      parent_id: editForm.value.parent_id,
      level: editForm.value.level, 
    } 
  }else{
    editForm.value = {
      category_id: editForm.value.category_id,
      category_name: editForm.value.category_name,
      level: editForm.value.level, 
    }
  }

  console.log('Edit data submitted:', editForm.value)
  try {
    if (isEditMode.value) {
      // Update data jika dalam mode edit
      const response = await axios.put(`http://localhost:3000/api/category/${editForm.value.category_id}`, editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil diupdate:', response.data)

      // Perbarui data categoryData di tabel setelah update
      const index = categoryData.value.findIndex(category => category.category_id === editForm.value.category_id)
      if (index !== -1) {
        categoryData.value[index] = { ...editForm.value }
      }
    } else {
      // Tambahkan data baru jika dalam mode tambah
      const response = await axios.post('http://localhost:3000/api/category', editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil ditambahkan:', response.data)

      // Tambahkan data baru ke tabel
      categoryData.value.push(response.data)
    }
    fetchCategoryData()
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


const selectedCategory = ref(null) // Menyimpan data yang dipilih untuk dihapus

// Fungsi untuk menampilkan modal konfirmasi penghapusan
const showDeleteModal = (rowData) => {
  selectedCategory.value = rowData
}

const confirmDelete = async () => {
  try {
    console.log('Id deleted:', selectedCategory.value.category_id)
    await axios.delete(`http://localhost:3000/api/category/${selectedCategory.value.category_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    handleErrorMessage(`Berhasil Hapus`,`Data Kategori <strong>${selectedCategory.value.category_name}</strong> berhasil dihapus.`,'error');
    fetchCategoryData()
   } catch (error) {
    if (error.response && error.response.status === 409) {
      handleErrorMessage(`Gagal Menghapus`,`Data Kategori <strong>${selectedCategory.value.category_name}</strong> gagal dihapus. ${error.response.data.message}. Anda harus menghapus terlebih dahulu data yang terkait dengan Data Kategori <strong>${selectedCategory.value.category_name}</strong>.`,'error');
    }
    else if (error.response && error.response.status === 401) {
      handleErrorMessage(`Sesi Login Berakhir`,`Untuk keamanan harap login kembali, karena Anda telah melewati 24 jam setelah login terakhir`,'session');
    } else {
      console.error('Failed to delete category data:', error) 
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
