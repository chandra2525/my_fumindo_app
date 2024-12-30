<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">List Jenis SKU</h4>
          </div>
          <div>
            <button
              class="btn btn-success width-button-style-top"
              style="margin-right: 10px;" 
              @click="showAddModal"
              data-bs-toggle="modal"
              data-bs-target="#form-confirmation">
              Tambah Jenis SKU
            </button>
            <button 
              class="btn btn-outline-success width-button-style-top" 
              style="margin-right: 10px;" 
              @click="exportSkuTypeData">
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
              @click="downloadTemplateSkuTypeData">
              Download Template
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row mb-2">
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter kategori</label>
              <v-select 
                :options="categoryNames" 
                v-model="selectedCategories" 
                multiple  
                @update:modelValue="onCategorySelect" 
                class="filter-style"
              ></v-select>
            </div>

            <div class="col-sm-6">
                <label for="validationCustomUsername01" class="form-label">Filter nama jenis SKU</label>
                <div class="input-group has-validation">
                  <input type="text" v-model="filterSkuTypeName" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
                </div>
            </div> 
          </div>
          
          <div class="row mb-3">
            <div class="col-sm-6">
              <label for="validationCustomUsername01" class="form-label">Filter kode jenis SKU</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterSkuTypeCode" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
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
                    class="form-control"
                    style="height: 35px"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-sm-4">
              <button
                class="btn btn-primary width-button-style" 
                style="height: 35px"
                @click="fetchSkuTypeData"
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
                @change="fetchSkuTypeData"
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
              :data="skuTypeData"
              :columns="columns"
              :currentPage="currentPage"
              :pageSize="pageSize"  
              :idrow="sku_type_id"
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
                    <h5 class="modal-title" id="staticBackdropPermissionLabel">{{ isEditMode ? 'Perbarui Jenis SKU' : 'Tambah Jenis SKU' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="submitSkuType">
                      <p>Form yang bertanda <span class="text-primary">*</span> wajib diisi</p> 
                      <div class="mb-3"> 
                        <label for="category_id" class="form-label">Dari Kategori<span class="text-primary">*</span></label>
                        <!-- <select id="category_id" v-model="editForm.category_id" class="form-select" required>
                          <option value="" disabled>Silahkan pilih kategori</option>
                          <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
                            {{ category.path }}
                          </option>
                        </select> -->
                        <v-select
                          id="category_id"
                          v-model="editForm.category_id"
                          :options="categories"
                          :reduce="category => category.category_id"
                          label="path"
                          :searchable="true"
                          :loading="isLoading"
                          @search="fetchCategories"
                          @scroll-bottom="loadMoreCategories"
                          placeholder="Silahkan pilih kategori"
                          required
                        />
                      </div> 
                      <div class="mb-3">
                        <label for="sku_type_name" class="form-label">Nama Jenis SKU<span class="text-primary">*</span></label>
                        <input v-model="editForm.sku_type_name" maxlength="150" type="text" class="form-control" id="sku_type_name" required />
                      </div>
                      <div class="mb-3"> 
                        <label for="sku_type_code" class="form-label">Kode Jenis SKU<span class="text-primary">*</span></label>
                        <input v-model="editForm.sku_type_code" maxlength="50" type="text" class="form-control" id="sku_type_code" required />
                      </div> 
                      <!-- Tambahkan field lainnya sesuai dengan struktur data Jenis SKU -->
                      <button type="submit" class="btn btn-primary" :data-bs-dismiss="
                        editForm.category_id&&editForm.sku_type_name&&editForm.sku_type_code ? 'modal' : null">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Jenis SKU' }}
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
                    <p>Apa kamu yakin ingin menghapus data Jenis SKU <strong>{{ selectedSkuType?.sku_type_name }}</strong>?</p>
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
                    <h5 class="modal-title" id="massUploadModalLabel">Mass Upload Jenis SKU</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="uploadFileSkuTypeData">
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
    /* height: 35px; */
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

const titleMessage = ref('');
const alertMessage = ref(''); 

// Reactive data untuk menyimpan data jenis SKU
const skuTypeData = ref([]);
const categoryNames = ref([]);
const selectedCategories = ref([]); 
const filterSkuTypeName = ref(''); 
const filterSkuTypeCode = ref('');
const globalSearch = ref('');

const currentPage = ref(1); // Halaman aktif
const totalPages = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
const totalData = ref(0); // Jumlah total data dari API

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
// Ambil token dari localStorage
const token = localStorage.getItem('access_token');

const columns = [
  // { title: 'ID', data: 'sku_type_id', sortable: true },
  { title: 'Dari Kategori', data: 'category_name', sortable: true },
  { title: 'Nama Jenis SKU', data: 'sku_type_name', sortable: true },
  { title: 'Kode Jenis SKU', data: 'sku_type_code', sortable: true },
  { title: 'Aksi', data: 'actions', sortable: false },
];



// const isEditModalOpen = ref(false)
const isEditMode = ref(false)

const editForm = ref({
  sku_type_id: null,
  category_id: '',
  sku_type_name: '',
  sku_type_code: '', 
})

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
// const openEditModal = (rowData) => {
//   editForm.value = { ...rowData }
//   isEditModalOpen.value = true
// }

// Fungsi untuk reset form saat modal ditutup
const resetForm = () => {
  editForm.value = {
    sku_type_id: null,
    category_id: '',
    sku_type_name: '',
    sku_type_code: '', 
  }
}

const selectedSkuType = ref(null) // Menyimpan data jenis SKU yang dipilih untuk dihapus

// Fungsi untuk menampilkan modal konfirmasi penghapusan
const showDeleteModal = (rowData) => {
  selectedSkuType.value = rowData
}

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
const showEditModal = (rowData) => {
  selectedSkuType.value = rowData
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
const submitSkuType = async () => {
  console.log('Edit data submitted:', editForm.value)
  try {
    if (isEditMode.value) {
      // Update data jika dalam mode edit
      const response = await axios.put(`http://localhost:3000/api/sku_type/${editForm.value.sku_type_id}`, editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil diupdate:', response.data)
      fetchSkuTypeData()
    }else {
      // Tambahkan data baru jika dalam mode tambah
      const response = await axios.post('http://localhost:3000/api/sku_type', editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil ditambahkan:', response.data)

      fetchSkuTypeData()
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

// Mengambil data jenis SKU saat komponen dimuat
onMounted(async () => {
  await fetchCategories(); 
  await fetchSkuTypeData();
});

const currentSort = ref({ column: 'sku_type_id', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchSkuTypeData(); // Panggil ulang API dengan parameter sorting
};

const onCategorySelect = (selected) => {
  selectedCategories.value = selected; // Perbarui nilai terpilih
  // fetchSkuTypeData(); // Panggil fungsi fetch dengan data terpilih
};

// Daftar kategori
const categories = ref([]);


// Fungsi untuk mengambil data jenis SKU dari backend
const fetchSkuTypeData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/sku_type', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {  
        category_name: selectedCategories.value.join(','),
        sku_type_name: filterSkuTypeName.value,
        sku_type_code: filterSkuTypeCode.value,
        search: globalSearch.value,
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman
        // order_by: 'sku_type_id', // Sorting berdasarkan ID
        // order_direction: 'DESC', // Urutan descending
      },
    })
    skuTypeData.value = response.data.rows.map((sku_type) => ({
      ...sku_type,
      category_name: sku_type.category?.category_name || 'N/A' // Ambil nama nama atau tampilkan "N/A" jika tidak ada
    }))
    totalData.value = response.data.sp.rowCount;
    totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);
  } catch (error) {
    console.error('Error fetching sku_type data:', error)
    handleAuthError();
    // alert('Lakukan login terlebih dulu') 
  }
};

// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchSkuTypeData(); // Refresh data untuk halaman baru
  }
};


const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/category/hierarchy', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {  
        order_by: 'path',
        order_direction: 'ASC',
        page: 1,
        pageSize: 1000,
      },
    });
    categories.value = response.data.rows;
    categoryNames.value = response.data.rows.map(item => item.path);
  } catch (error) {
    console.error('Error fetching categories:', error);
    handleAuthError();
    // alert('Lakukan login terlebih dulu') 
  }
};


const exportSkuTypeData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/sku_type/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        category_name: selectedCategories.value.join(','),
        sku_type_name: filterSkuTypeName.value,
        sku_type_code: filterSkuTypeCode.value,
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
    link.setAttribute("download", "data_jenis_sku.xlsx"); // Nama file
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

const uploadFileSkuTypeData = async () => {
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
    const response = await axios.post('http://localhost:3000/api/sku_type/mass-upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    titleMessage.value = `Berhasil`;
    alertMessage.value = `Upload berhasil, ${response.data.successCount} data jenis SKU berhasil terupload`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
 
    fetchSkuTypeData();
  } catch (error) {
    console.error('Gagal mengunggah file:', error);
    titleMessage.value = `Gagal Upload`;
    alertMessage.value = 'Gagal mengunggah file. Pastikan format file benar.';
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
  }
};

const downloadTemplateSkuTypeData = async () => { 
  try {
    const response = await axios.get("http://localhost:3000/api/sku_type/template/", {
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
    link.setAttribute("download", "template_data_jenis_sku.xlsx"); // Nama file
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
    console.log('Id deleted:', selectedSkuType.value.sku_type_id)
    await axios.delete(`http://localhost:3000/api/sku_type/${selectedSkuType.value.sku_type_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // alert('Data Jenis SKU berhasil dihapus.') 
    titleMessage.value = `Berhasil Hapus`;
    alertMessage.value = `Data Jenis SKU <strong>${selectedSkuType.value.sku_type_name}</strong> berhasil dihapus.`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();

    fetchSkuTypeData()
  } catch (error) {
    if (error.response && error.response.status === 409) {
        titleMessage.value = `Gagal Menghapus`;
        alertMessage.value = `Data Jenis SKU <strong>${selectedSkuType.value.sku_type_name}</strong> gagal dihapus. ${error.response.data.message}. Anda harus menghapus terlebih dahulu data yang terkait dengan Data Jenis SKU <strong>${selectedSkuType.value.sku_type_name}</strong>.`;
        const modal = new BootstrapModal(document.getElementById('message-alert'));
        modal.show(); 
    } 
    else {
      console.error('Failed to delete sku type data:', error) 
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
