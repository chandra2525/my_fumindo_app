<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">List Aset Repo</h4>
          </div>
          <div>
            <button 
              class="btn btn-success"
              style="margin-right: 10px;"
              @click="showAddModal"
              data-bs-toggle="modal"
              data-bs-target="#form-confirmation">
              Tambah Aset
            </button>
            <button 
              class="btn btn-outline-success" 
              style="margin-right: 10px;" 
              @click="exportAssetData">
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
              @click="downloadTemplateAssetData">
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
              <label for="validationCustomUsername01" class="form-label">Filter nama aset</label>
              <div class="input-group has-validation">
                <input type="text" v-model="filterAssetName" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div> 
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter kategori</label>
              <v-select 
                :options="assetCategory" 
                v-model="selectedCategory" 
                multiple  
                @update:modelValue="onCategorySelect" 
                class="filter-style"
              ></v-select>
            </div>
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter jenis</label>
              <v-select 
                :options="assetToolCategory" 
                v-model="selectedToolCategory" 
                multiple  
                @update:modelValue="onToolCategorySelect" 
                class="filter-style"
              ></v-select>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter kondisi alat</label>
              <v-select 
                :options="assetToolCondition" 
                v-model="selectedToolCondition" 
                multiple  
                @update:modelValue="onToolConditionSelect" 
                class="filter-style"
              ></v-select>
            </div>
            <div class="col-sm-6">
              <label for="filter" class="form-label">Filter satuan</label>
              <v-select 
                :options="assetUnit" 
                v-model="selectedUnit" 
                multiple  
                @update:modelValue="onUnitSelect" 
                class="filter-style"
              ></v-select>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-sm-6"> 
              <label for="validationCustomUsername01" class="form-label">Filter stok awal</label>
              <div class="input-group has-validation">
                <input type="number" v-model="filterInitialStock" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
              </div> 
            </div>
             <div class="col-sm-6"> 
              <label for="validationCustomUsername01" class="form-label">Filter stok saat ini</label>
              <div class="input-group has-validation">
                <input type="number" v-model="filterCurrentStock" class="form-control" style="height: 35px" id="validationCustomUsername01" aria-describedby="inputGroupPrepend"/>
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
                  <!-- <button
                    class="btn btn-primary filter-style"
                    @click="fetchAssetData"
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
                  @click="fetchAssetData"
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
                @change="fetchAssetData"
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
              :data="assetData"
              :columns="AssetColumns" 
              :currentPage="currentPage"
              :pageSize="pageSize"  
              :idrow="asset_id"  
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
                    <h5 class="modal-title" id="staticBackdropPermissionLabel">{{ isEditMode ? 'Perbarui Aset' : 'Tambah Aset' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="submitAsset">
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
                        <label for="asset_name" class="form-label">Nama Aset<span class="text-primary">*</span></label>
                        <input v-model="editForm.asset_name" maxlength="100" type="text" class="form-control" id="asset_name" required />
                      </div>
                      <div class="mb-3"> 
                        <label for="category" class="form-label">Kategori<span class="text-primary">*</span></label>
                        <b-form-select v-model="editForm.category" :options="optionsCategory" id="category" required></b-form-select>
                      </div>
                      <div class="mb-3"> 
                        <label for="tool_category" class="form-label">Jenis<span class="text-primary">*</span></label>
                        <select id="tool_category_id" v-model="editForm.tool_category_id" class="form-select" required>
                          <option value="0" disabled>Silahkan pilih jenis</option>
                          <option v-for="toolCategory in toolCategories" :key="toolCategory.tool_category_id" :value="toolCategory.tool_category_id">
                            {{ toolCategory.tool_category_name }}
                          </option>
                        </select>
                      </div>
                      <!-- <div v-if="!isEditMode"> -->
                        <div v-if="editForm.category=='Alat'">
                          <div class="mb-3"> 
                            <label for="tool_condition" class="form-label">Kondisi Alat<span class="text-primary">*</span></label>
                            <select id="tool_condition_id" v-model="editForm.tool_condition_id" class="form-select" required>
                              <option value="0" disabled>Silahkan pilih kondisi alat</option>
                              <option v-for="toolCondition in toolConditions" :key="toolCondition.tool_condition_id" :value="toolCondition.tool_condition_id">
                                {{ toolCondition.tool_condition_name }}
                              </option>
                            </select>
                          </div> 
                        </div> 
                      <div class="mb-3"> 
                        <label for="unit" class="form-label">Satuan<span class="text-primary">*</span></label>
                        <select id="unit_id" v-model="editForm.unit_id" class="form-select" required>
                          <option value="0" disabled>Silahkan pilih satuan</option>
                          <option v-for="unit in units" :key="unit.unit_id" :value="unit.unit_id">
                            {{ unit.unit_name }}
                          </option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label for="initial_stock" class="form-label">Stok Awal<span class="text-primary">*</span></label>
                        <input v-model.number="editForm.initial_stock" maxlength="4" type="number" class="form-control" id="initial_stock" @input="syncCurrentStock" required />
                      </div> 
                      <div class="mb-3">
                        <label for="current_stock" class="form-label">Stok Saat Ini<span class="text-primary">*</span></label>
                        <input v-model.number="editForm.current_stock" @input="handleCurrentStockInput" maxlength="4" type="number" class="form-control" id="current_stock" required />
                      </div>  
                      
                      <!-- Tambahkan field lainnya sesuai dengan struktur data asset -->
                      <button type="submit" class="btn btn-primary" :data-bs-dismiss="
                        editForm.category=='Alat'?
                        editForm.branch_id&&editForm.asset_name&&editForm.category&&editForm.initial_stock&&editForm.current_stock&&editForm.tool_category_id&&editForm.unit_id&&editForm.tool_condition_id ? 'modal' : null :
                        editForm.branch_id&&editForm.asset_name&&editForm.category&&editForm.initial_stock&&editForm.current_stock&&editForm.tool_category_id&&editForm.unit_id ? 'modal' : null
                        ">{{ isEditMode ? 'Simpan Perubahan' : 'Tambahkan Aset' }}
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
                    <p>Apa kamu yakin ingin menghapus data Aset <strong>{{ selectedAsset?.asset_name }}</strong>?</p>
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
                    <h5 class="modal-title" id="massUploadModalLabel">Mass Upload Aset</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="uploadFileAssetData">
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

// Definisikan kolom untuk DataTable, gunakan komponen Actions untuk kolom tindakan
// Ambil token dari localStorage
const token = localStorage.getItem('access_token');
const user_id = localStorage.getItem('user_id');

const AssetColumns = [
  // { title: 'ID', data: 'asset_id', sortable: true },
  { title: 'Dari Cabang', data: 'branch_name', sortable: true },
  { title: 'Nama Aset', data: 'asset_name', sortable: true },
  { title: 'Kategori', data: 'category', sortable: true },
  { title: 'Jenis', data: 'tool_category_name', sortable: true },
  { title: 'Kondisi Alat', data: 'tool_condition_name', sortable: true },
  { title: 'Satuan', data: 'unit_name', sortable: true },
  { title: 'Stok Awal', data: 'initial_stock', sortable: true },
  { title: 'Stok Saat Ini', data: 'current_stock', sortable: true },
  // { title: 'ID Jenis', data: 'tool_category_id', sortable: true },
  // { title: 'ID Kondisi Alat', data: 'tool_condition_id', sortable: true },
  // { title: 'ID Unit', data: 'unit_id', sortable: true },
  { title: 'Aksi', data: 'actions', sortable: false },
];

// Reactive data untuk menyimpan data asset
const titleMessage = ref('');
const alertMessage = ref('');
const assetData = ref([]);

const branchNames = ref([]);
const selectedBranches = ref([]); 
const assetCategory = ref([]);
const selectedCategory = ref([]);
const assetToolCategory = ref([]);
const selectedToolCategory = ref([]);
const assetToolCondition = ref([]);
const selectedToolCondition = ref([]);
const assetUnit = ref([]);
const selectedUnit = ref([]);

const filterAssetName = ref('');
const filterInitialStock = ref('');
const filterCurrentStock = ref('');
const globalSearch = ref('');

const currentPage = ref(1); // Halaman aktif
const totalPages = ref(0); // Total halaman
const pageSize = ref(10); // Banyaknya data per halaman
const totalData = ref(0); // Jumlah total data dari API

const isEditMode = ref(false) 

const editForm = ref({
  asset_id: null,
  branch_id: '',
  asset_name: '',
  category: '',  
  unit: '', 
  initial_stock: '',
  current_stock: '',
  tool_category_id: 0,
  tool_condition_id: 0,
  unit_id: 0,
})

// Fungsi untuk reset form saat modal ditutup
const resetForm = () => {
  editForm.value = {
    asset_id: null,
    branch_id: '',
    asset_name: '',
    category: '',  
    unit: '', 
    initial_stock: '',
    current_stock: '',
    tool_category_id: 0,
    tool_condition_id: 0,
    unit_id: 0,
  }
}

const syncCurrentStock= () => { 
  editForm.value.current_stock = editForm.value.initial_stock 
}

// Fungsi untuk mencegah input `current_stock` melebihi `initial_stock`
const handleCurrentStockInput = (event) => {
  const maxStock = editForm.value.initial_stock;
  if (event.target.value > maxStock) {
    event.target.value = maxStock; // Batasi nilai ke maksimum
    editForm.value.current_stock = maxStock;
  }
};

const selectedAsset = ref(null) // Menyimpan data asset yang dipilih untuk dihapus

// Fungsi untuk menampilkan modal konfirmasi penghapusan
const showDeleteModal = (rowData) => {
  selectedAsset.value = rowData 
}

// Fungsi untuk membuka modal edit dan mengisi form dengan data yang dipilih
const showEditModal = (rowData) => {
  selectedAsset.value = rowData
  editForm.value = { ...rowData }
  isEditMode.value = true
}

// Fungsi untuk membuka modal tambah dengan form kosong
const showAddModal = () => {
  resetForm()  
  isEditMode.value = false 
}

// Mengambil data asset saat komponen dimuat
onMounted(async () => { 
  await fetchAssetCategory();
  await fetchAssetToolCategory();
  await fetchAssetToolCondition();
  await fetchAssetUnit();
  await fetchBranches();
  await fetchAssetData();
});

const currentSort = ref({ column: 'asset_id', order: 'DESC' });

const onSort = ({ column, order }) => {
  currentSort.value = { column, order };
  fetchAssetData(); // Panggil ulang API dengan parameter sorting
};

const onBranchSelect = (selected) => {
  selectedBranches.value = selected; // Perbarui nilai terpilih
  // fetchAssetData(); // Panggil fungsi fetch dengan data terpilih
};

const onCategorySelect = (selectedCategory) => {
  selectedCategory.value = selectedCategory; // Perbarui nilai terpilih
  // fetchAssetData(); // Panggil fungsi fetch dengan data terpilih
};

const onToolCategorySelect = (selectedToolCategory) => {
  selectedToolCategory.value = selectedToolCategory; // Perbarui nilai terpilih
  // fetchAssetData(); // Panggil fungsi fetch dengan data terpilih
};

const onToolConditionSelect = (selectedToolCondition) => {
  selectedToolCondition.value = selectedToolCondition; // Perbarui nilai terpilih
  // fetchAssetData(); // Panggil fungsi fetch dengan data terpilih
};

const onUnitSelect = (selectedUnit) => {
  selectedUnit.value = selectedUnit; // Perbarui nilai terpilih
  // fetchAssetData(); // Panggil fungsi fetch dengan data terpilih
};

// Fungsi untuk submit tambah/edit
const submitAsset = async () => {
  if(editForm.value.category=='Bahan'){  
    // editForm.value.tool_category_id = 0;
    editForm.value.tool_condition_id = 0;
    // editForm.value.unit_id = 0;
  }
  
  console.log('Edit data submitted:', editForm.value)
  try {
    if (isEditMode.value) {
      // Update data jika dalam mode edit
      editForm.value.user_id = user_id;
      editForm.value.operation = 'Edit';
      const response = await axios.put(`http://localhost:3000/api/asset/${editForm.value.asset_id}`, editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil diupdate:', response.data)
      const index = assetData.value.findIndex(asset => asset.asset_id === editForm.value.asset_id)
      if (index !== -1) {
        assetData.value[index] = { ...editForm.value }
      }
    }else {
      // Tambahkan data baru jika dalam mode tambah
      editForm.value.user_id = user_id;
      editForm.value.operation = 'Tambah';
      const response = await axios.post('http://localhost:3000/api/asset', editForm.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Data berhasil ditambahkan:', response.data)
    }
    fetchAssetData()
  } catch (error) {
    console.error('Gagal mengupdate data:', error)
    handleAuthError();
  } 
  // isEditModalOpen.value = false // Tutup modal setelah submit
}

// Fungsi untuk mengambil data asset dari backend
const fetchAssetData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/asset', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        branch_name: selectedBranches.value.join(','), 
        asset_name: filterAssetName.value,
        category: selectedCategory.value.join(','), 
        tool_category_name: selectedToolCategory.value.join(','), 
        tool_condition_name: selectedToolCondition.value.join(','), 
        unit_name: selectedUnit.value.join(','),
        initial_stock: filterInitialStock.value,
        current_stock: filterCurrentStock.value,
        search: globalSearch.value, 
        order_by: currentSort.value.column,
        order_direction: currentSort.value.order,
        page: currentPage.value, // Kirim nomor halaman
        pageSize: pageSize.value, // Kirim ukuran data per halaman
        // order_by: 'asset_id', // Sorting berdasarkan ID
        // order_direction: 'DESC', // Urutan descending
      },
    })
    assetData.value = response.data.rows.map((asset) => ({
      ...asset,
      branch_name: asset.branch?.branch_name || '',
      tool_category_name: asset.assetToolCategory?.tool_category_name || '',
      tool_condition_name: asset.assetToolCondition?.tool_condition_name || '',
      unit_name: asset.assetUnit?.unit_name || ''
    })) 
    totalData.value = response.data.sp.rowCount;
    totalPages.value = Math.ceil(response.data.sp.rowCount / pageSize.value);
  } catch (error) {
    console.error('Error fetching asset data:', error)
    handleAuthError();
  }
};

// Fungsi untuk mengganti halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchAssetData(); // Refresh data untuk halaman baru
  }
};

// Daftar dropdown
const branches = ref([]);
const toolCategories = ref([]);
const toolConditions = ref([]);
const units = ref([]);

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
  }
};

const fetchAssetCategory = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/asset/getAssetsCategory', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); 
    assetCategory.value = [...new Set(response.data)];
  } catch (error) {
    console.error('Error fetching assetCategory:', error);
    handleAuthError();
  }
};

const fetchAssetToolCategory = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/asset_tool_category', {
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
    toolCategories.value = response.data.rows;
    assetToolCategory.value = response.data.rows.map(item => item.tool_category_name);
  } catch (error) {
    console.error('Error fetching Tool Category:', error);
    handleAuthError();
  }
};

const fetchAssetToolCondition = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/asset_tool_condition', {
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
    toolConditions.value = response.data.rows;
    assetToolCondition.value = response.data.rows.map(item => item.tool_condition_name);
  } catch (error) {
    console.error('Error fetching Tool Condition:', error);
    handleAuthError();
  }
};

const fetchAssetUnit = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/asset_unit', {
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
    units.value = response.data.rows;
    assetUnit.value = response.data.rows.map(item => item.unit_name);
  } catch (error) {
    console.error('Error fetching Unit', error);
    handleAuthError();
  }
};

const exportAssetData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/asset/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        branch_name: selectedBranches.value.join(','), 
        asset_name: filterAssetName.value,
        category: selectedCategory.value.join(','), 
        tool_category_name: selectedToolCategory.value.join(','), 
        tool_condition_name: selectedToolCondition.value.join(','), 
        unit_name: selectedUnit.value.join(','),
        initial_stock: filterInitialStock.value,
        current_stock: filterCurrentStock.value,
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
    link.setAttribute("download", "data_aset.xlsx"); // Nama file
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

const uploadFileAssetData = async () => {
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
    const response = await axios.post('http://localhost:3000/api/asset/mass-upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    titleMessage.value = `Berhasil`;
    alertMessage.value = `Upload berhasil, ${response.data.successCount} data aset berhasil terupload`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
 
    fetchAssetData();
  } catch (error) {
    console.error('Gagal mengunggah file:', error);
    titleMessage.value = `Gagal Upload`;
    alertMessage.value = 'Gagal mengunggah file. Pastikan format file benar.';
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
  }
};

const downloadTemplateAssetData = async () => { 
  try {
    const response = await axios.get("http://localhost:3000/api/asset/template/", {
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
    link.setAttribute("download", "template_data_aset.xlsx"); // Nama file
    document.body.appendChild(link);
    link.click();

    // Hapus elemen link setelah selesai
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Error downloading template:", error); 
    titleMessage.value = `Gagal Download`;
    alertMessage.value = `Gagal mendownload template. Silakan coba lagi.`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();
  }
}

const confirmDelete = async () => {
  try {
    console.log('Id deleted:', selectedAsset.value.asset_id)
    await axios.delete(`http://localhost:3000/api/asset/${selectedAsset.value.asset_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) 
    alertMessage.value = `Data Aset <strong>${selectedAsset.value.asset_name}</strong> berhasil dihapus.`;
    const modal = new BootstrapModal(document.getElementById('message-alert'));
    modal.show();  

    // Refresh data setelah penghapusan
    fetchAssetData()
  } catch (error) {
    console.error('Failed to delete asset data:', error) 
    handleAuthError();
  }
}

const handleAuthError = () => {
  // router.push({ name: 'auth.login' });
  alertMessage.value = `Cek koneksi internet Anda.`;
  const modal = new BootstrapModal(document.getElementById('message-alert'));
  modal.show();
};

const optionsCategory = [
  { value: null, text: 'Silahkan pilih kategori aset' },
  { value: 'Bahan', text: 'Bahan' }, 
  { value: 'Alat', text: 'Alat' },   
]

// const optionsToolCategory = [
//   { value: null, text: 'Silahkan pilih jenis },
//   { value: 'Peralatan Fumigasi', text: 'Peralatan Fumigasi' }, 
//   { value: 'Alat Ukur Fumigasi', text: 'Alat Ukur Fumigasi' },   
//   { value: 'Peralatan Pest Control', text: 'Peralatan Pest Control' },   
//   { value: 'Plastic Sheet', text: 'Plastic Sheet' },   
// ]

// const optionsToolCondition = [
//   { value: null, text: 'Silahkan pilih kondisi alat' },
//   { value: 'Baik', text: 'Baik' }, 
//   { value: 'Cukup', text: 'Cukup' },  
//   { value: 'Kurang', text: 'Kurang' },
//   { value: 'Rusak', text: 'Rusak' },
// ]

// const optionsUnit = [
//   { value: null, text: 'Silahkan pilih satuan' },
//   { value: 'UNIT', text: 'UNIT' }, 
//   { value: 'PCS', text: 'PCS' },
//   { value: 'TABUNG', text: 'TABUNG' },  
//   { value: 'KG', text: 'KG' },
//   { value: 'GRAM', text: 'GRAM' },
//   { value: 'L', text: 'L' },
//   { value: 'ML', text: 'ML' },
//   { value: 'M', text: 'M' },
//   { value: 'BUTIR', text: 'BUTIR' },
//   { value: 'BAG', text: 'BAG' },
//   { value: 'PACK', text: 'PACK' },
//   { value: 'SHEET', text: 'SHEET' }, 
// ]

</script>
