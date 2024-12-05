 <!-- <template>
  <div class="container"> 
    <h2>{{ isEdit ? 'Edit Employee' : 'Add New Employee' }}</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="fullname" class="form-label">Full Name</label>
        <input type="text" id="fullname" v-model="employee.fullname" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="phone_number" class="form-label">Phone Number</label>
        <input type="text" id="phone_number" v-model="employee.phone_number" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" v-model="employee.email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="address" class="form-label">Address</label>
        <input type="text" id="address" v-model="employee.address" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="role" class="form-label">Role</label>
        <input type="text" id="role" v-model="employee.role" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="status" class="form-label">Status</label>
        <select id="status" v-model="employee.status" class="form-select" required>
          <option value="" disabled>Select status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" id="username" v-model="employee.username" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" v-model="employee.password" class="form-control" :required="!isEdit" />
      </div>
      <div class="mb-3">
        <label for="branch_id" class="form-label">Branch</label>
        <select id="branch_id" v-model="employee.branch_id" class="form-select" required>
          <option value="" disabled>Select branch</option>
          <option v-for="branch in branches" :key="branch.branch_id" :value="branch.branch_id">
            {{ branch.branch_name }}
          </option>
        </select>
      </div>
      <button type="submit" class="btn btn-success">{{ isEdit ? 'Update' : 'Add' }}</button>
      <button type="button" @click="goBack" class="btn btn-secondary">Cancel</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Props
const isEdit = ref(false);
const employeeId = ref(null);

// Data employee
const employee = ref({
  fullname: '',
  phone_number: '',
  email: '',
  address: '',
  role: '',
  status: '',
  username: '',
  password: '',
  branch_id: null
});

// Daftar cabang
const branches = ref([]);

// Mengecek apakah ini halaman edit
onMounted(async () => {
  await fetchBranches();
  if (route.name === 'employee-edit' && route.params.id) {
    isEdit.value = true;
    employeeId.value = route.params.id;
    await fetchEmployeeData(employeeId.value);
  }
});

// Mengambil data cabang
const fetchBranches = async () => {
  try {
    const response = await axios.get('http://localhost:3000/branch');
    branches.value = response.data;
  } catch (error) {
    console.error('Error fetching branches:', error);
  }
};

// Mengambil data employee untuk edit
const fetchEmployeeData = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/employee/${id}`);
    employee.value = response.data;
  } catch (error) {
    console.error('Error fetching employee data:', error);
  }
};

// Submit form
const submitForm = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`http://localhost:3000/employee/${employeeId.value}`, employee.value);
    } else {
      await axios.post('http://localhost:3000/employee', employee.value);
    }
    router.push({ name: 'employee' });
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

// Navigasi kembali
const goBack = () => {
  router.push({ name: 'employee' });
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
padding: 20px; 
}
</style>
-->