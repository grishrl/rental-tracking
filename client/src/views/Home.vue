<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h3">Rental Properties</h1>
          <v-btn color="primary" @click="openAddPropertyDialog">
            <v-icon left>mdi-home-plus</v-icon>
            Add Property
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="rental in rentals"
        :key="rental.id"
        cols="12"
        md="6"
        lg="4"
        class="d-flex"
      >
        <v-card class="rental-card d-flex flex-column w-100">
          <v-img
            :src="getRentalImage(rental)"
            height="200"
            cover
          ></v-img>
          
          <v-card-title class="rental-card-title">{{ rental.title }}</v-card-title>
          
          <v-card-text class="rental-card-text flex-grow-1">
            <p class="rental-description">{{ rental.description }}</p>
            <div class="d-flex justify-space-between align-center">
              <span class="text-h6 text-primary">${{ rental.price }}/month</span>
              <v-chip color="secondary" small>
                <v-icon left small>mdi-map-marker</v-icon>
                <span class="rental-location">{{ rental.location }}</span>
              </v-chip>
            </div>
          </v-card-text>
          
          <v-card-actions>
            <v-btn color="warning" text @click="openEditPropertyDialog(rental)">
              Edit
            </v-btn>
            <v-btn color="primary" text @click="openDetails(rental)">
              View Details
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="success" text @click="openContact(rental)">
              Contact
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="error">
      <v-col cols="12">
        <v-alert type="error">
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>

    <v-dialog v-model="showDetailsDialog" max-width="650">
      <v-card v-if="selectedRental">
        <v-img :src="getRentalImage(selectedRental)" height="220" cover></v-img>
        <v-card-title>{{ selectedRental.title }}</v-card-title>
        <v-card-text>
          <p class="mb-3">{{ selectedRental.description }}</p>
          <div class="d-flex align-center mb-2">
            <v-icon size="18" class="mr-2">mdi-map-marker</v-icon>
            <span>{{ selectedRental.address || selectedRental.location }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <v-icon size="18" class="mr-2">mdi-currency-usd</v-icon>
            <span>${{ selectedRental.price }}/month</span>
          </div>
          <div class="d-flex align-center mb-2">
            <v-icon size="18" class="mr-2">mdi-bed</v-icon>
            <span>{{ selectedRental.bedrooms ?? 0 }} bed</span>
            <v-icon size="18" class="mx-2">mdi-shower</v-icon>
            <span>{{ selectedRental.bathrooms ?? 0 }} bath</span>
          </div>
          <div v-if="Array.isArray(selectedRental.amenities) && selectedRental.amenities.length" class="mt-3">
            <div class="text-subtitle-2 mb-2">Amenities</div>
            <div class="d-flex flex-wrap ga-2">
              <v-chip v-for="amenity in selectedRental.amenities" :key="amenity" size="small" color="primary" variant="outlined">
                {{ amenity }}
              </v-chip>
            </div>
          </div>

          <div class="mt-4">
            <div class="text-subtitle-1 mb-2">Tenants</div>
            <div v-if="getCurrentTenants(selectedRental).length" class="mb-2">
              <div class="text-caption text-medium-emphasis mb-1">Current</div>
              <v-list density="compact" class="pa-0">
                <v-list-item v-for="tenant in getCurrentTenants(selectedRental)" :key="tenant.id" class="tenant-line-item">
                  <v-list-item-title>
                    {{ tenant.name }} :
                    <v-btn variant="text" size="small" color="primary" @click="openTenantDocuments(selectedRental, tenant)">
                      See all documents
                    </v-btn>
                    : {{ formatDateValue(tenant.startDate) }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
            <div v-if="getPastTenants(selectedRental).length">
              <div class="text-caption text-medium-emphasis mb-1">Past</div>
              <v-list density="compact" class="pa-0">
                <v-list-item v-for="tenant in getPastTenants(selectedRental)" :key="tenant.id" class="tenant-line-item">
                  <v-list-item-title>
                    {{ tenant.name }} :
                    <v-btn variant="text" size="small" color="primary" @click="openTenantDocuments(selectedRental, tenant)">
                      See all documents
                    </v-btn>
                    : {{ formatDateValue(tenant.startDate) }} - {{ formatDateValue(tenant.endDate) || 'N/A' }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
            <v-alert
              v-if="!getCurrentTenants(selectedRental).length && !getPastTenants(selectedRental).length"
              type="info"
              density="comfortable"
              class="mb-0"
            >
              No tenants tracked for this property yet.
            </v-alert>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="showDetailsDialog = false">Close</v-btn>
          <v-btn color="secondary" variant="text" @click="openAddTenantDialog(selectedRental)">
            Add Tenant
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="openContact(selectedRental)">Contact</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showAddTenantDialog" max-width="600">
      <v-card>
        <v-card-title>Add Tenant To Property</v-card-title>
        <v-card-text>
          <div class="text-body-2 mb-3" v-if="selectedRental">
            Property: <strong>{{ selectedRental.title }}</strong>
          </div>
          <v-form ref="addTenantForm" v-model="addTenantFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newTenant.name"
                  label="Tenant Name"
                  :rules="[v => !!v || 'Tenant name is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newTenant.phoneNumber"
                  label="Phone Number"
                  :rules="[v => !!v || 'Phone number is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newTenant.startDate"
                  label="Start Date"
                  type="date"
                  :rules="[v => !!v || 'Start date is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newTenant.endDate"
                  label="End Date (optional for past tenants)"
                  type="date"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="closeAddTenantDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :loading="savingTenant"
            :disabled="!addTenantFormValid || savingTenant"
            @click="addTenantToProperty"
          >
            Save Tenant
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showTenantDocumentsDialog" max-width="680">
      <v-card>
        <v-card-title>Tenant Documents</v-card-title>
        <v-card-text>
          <div class="text-body-2 mb-3" v-if="selectedTenant">
            Tenant: <strong>{{ selectedTenant.name }}</strong>
          </div>

          <v-progress-circular
            v-if="loadingTenantDocuments"
            indeterminate
            size="24"
            color="primary"
          ></v-progress-circular>

          <v-list v-else-if="tenantDocuments.length" density="compact" class="pa-0 mb-3">
            <v-list-item v-for="doc in tenantDocuments" :key="doc.id">
              <v-list-item-title>
                <a :href="doc.url" target="_blank" rel="noopener noreferrer">{{ doc.originalName }}</a>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDocumentType(doc.type) }} | {{ formatDateValue(doc.uploadedAt) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-alert v-else type="info" density="comfortable" class="mb-3">
            No documents uploaded for this tenant yet.
          </v-alert>

          <v-divider class="my-3"></v-divider>
          <div class="text-subtitle-2 mb-2">Upload Documents</div>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="tenantDocumentType"
                :items="tenantDocumentTypeOptions"
                item-title="text"
                item-value="value"
                label="Document Type"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-file-input
                v-model="tenantDocumentFiles"
                label="Select Files"
                multiple
                chips
                show-size
                counter
                prepend-icon="mdi-file-upload"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="closeTenantDocumentsDialog">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :loading="uploadingTenantDocuments"
            :disabled="!selectedTenant || !tenantDocumentFiles.length || uploadingTenantDocuments"
            @click="uploadTenantDocuments"
          >
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showContactDialog" max-width="520">
      <v-card v-if="selectedRental">
        <v-card-title>Tenant Contacts</v-card-title>
        <v-card-text>
          <p class="mb-3">{{ selectedRental.title }}</p>

          <v-progress-circular
            v-if="loadingContacts"
            indeterminate
            size="24"
            color="primary"
          ></v-progress-circular>

          <v-alert v-else-if="contactError" type="error" density="comfortable" class="mb-0">
            {{ contactError }}
          </v-alert>

          <v-list v-else-if="tenantContacts.length" density="compact" class="pa-0">
            <v-list-item v-for="contact in tenantContacts" :key="contact.id">
              <template #prepend>
                <v-icon>mdi-account</v-icon>
              </template>
              <v-list-item-title>{{ contact.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <a :href="`tel:${contact.phoneNumber}`">{{ contact.phoneNumber }}</a>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-alert v-else type="info" density="comfortable" class="mb-0">
            No tenant contacts found for this rental yet.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="showContactDialog = false">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="loadTenantContacts" :disabled="loadingContacts">
            Refresh
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showAddPropertyDialog" max-width="760">
      <v-card>
        <v-card-title>Add New Property</v-card-title>
        <v-card-text>
          <v-form ref="newPropertyForm" v-model="newPropertyFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newProperty.title"
                  label="Property Title"
                  :rules="[v => !!v || 'Title is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="newProperty.price"
                  type="number"
                  min="1"
                  prefix="$"
                  label="Monthly Rent"
                  :rules="[v => !!v || 'Price is required', v => Number(v) > 0 || 'Price must be greater than 0']"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newProperty.location"
                  label="Location"
                  :rules="[v => !!v || 'Location is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newProperty.address"
                  label="Address"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="newProperty.description"
                  label="Description"
                  :rules="[v => !!v || 'Description is required']"
                  rows="3"
                  required
                ></v-textarea>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="newProperty.bedrooms"
                  type="number"
                  min="0"
                  label="Bedrooms"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="newProperty.bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  label="Bathrooms"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="newProperty.squareFootage"
                  type="number"
                  min="1"
                  label="Square Footage"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newProperty.imageUrl"
                  label="Primary Image URL"
                  placeholder="https://..."
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newProperty.availableFrom"
                  type="date"
                  label="Available From"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="newPropertyPhotoFiles"
                  label="Property Photos (Optional)"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  multiple
                  chips
                  show-size
                  counter
                ></v-file-input>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="newProperty.amenitiesText"
                  label="Amenities"
                  hint="Comma-separated, e.g. WiFi, Parking, Laundry"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="closeAddPropertyDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :loading="savingProperty"
            :disabled="!newPropertyFormValid || savingProperty"
            @click="createProperty"
          >
            Save Property
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showEditPropertyDialog" max-width="760">
      <v-card>
        <v-card-title>Edit Property</v-card-title>
        <v-card-text>
          <v-form ref="editPropertyForm" v-model="editPropertyFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editProperty.title"
                  label="Property Title"
                  :rules="[v => !!v || 'Title is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editProperty.price"
                  type="number"
                  min="1"
                  prefix="$"
                  label="Monthly Rent"
                  :rules="[v => !!v || 'Price is required', v => Number(v) > 0 || 'Price must be greater than 0']"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editProperty.location"
                  label="Location"
                  :rules="[v => !!v || 'Location is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editProperty.address"
                  label="Address"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="editProperty.description"
                  label="Description"
                  :rules="[v => !!v || 'Description is required']"
                  rows="3"
                  required
                ></v-textarea>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="editProperty.bedrooms"
                  type="number"
                  min="0"
                  label="Bedrooms"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="editProperty.bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  label="Bathrooms"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="editProperty.squareFootage"
                  type="number"
                  min="1"
                  label="Square Footage"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editProperty.availableFrom"
                  type="date"
                  label="Available From"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editProperty.amenitiesText"
                  label="Amenities"
                  hint="Comma-separated, e.g. WiFi, Parking, Laundry"
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12" v-if="editProperty.images.length">
                <div class="text-subtitle-2 mb-2">Existing Photos</div>
                <div class="property-photo-grid">
                  <v-img
                    v-for="(imageUrl, idx) in editProperty.images"
                    :key="`${imageUrl}-${idx}`"
                    :src="imageUrl"
                    height="90"
                    width="120"
                    cover
                    class="property-photo-thumb"
                  ></v-img>
                </div>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="editPropertyPhotoFiles"
                  label="Add Photos"
                  accept="image/*"
                  prepend-icon="mdi-camera-plus"
                  multiple
                  chips
                  show-size
                  counter
                  hint="Upload one or more images to append to this property"
                  persistent-hint
                ></v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="closeEditPropertyDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :loading="savingProperty"
            :disabled="!editPropertyFormValid || savingProperty"
            @click="savePropertyEdits"
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2500">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data() {
    return {
      rentals: [],
      loading: true,
      error: null,
      selectedRental: null,
      showDetailsDialog: false,
      showContactDialog: false,
      showAddTenantDialog: false,
      showTenantDocumentsDialog: false,
      showAddPropertyDialog: false,
      showEditPropertyDialog: false,
      loadingContacts: false,
      loadingTenantDocuments: false,
      savingProperty: false,
      savingTenant: false,
      uploadingTenantDocuments: false,
      contactError: null,
      tenantContacts: [],
      selectedTenant: null,
      tenantDocuments: [],
      newPropertyFormValid: false,
      editPropertyFormValid: false,
      addTenantFormValid: false,
      currentOwnerId: 'user-landlord-001',
      newProperty: {
        title: '',
        description: '',
        price: null,
        location: '',
        address: '',
        bedrooms: null,
        bathrooms: null,
        squareFootage: null,
        amenitiesText: '',
        imageUrl: '',
        availableFrom: ''
      },
      newPropertyPhotoFiles: [],
      editPropertyPhotoFiles: [],
      editProperty: {
        id: '',
        title: '',
        description: '',
        price: null,
        location: '',
        address: '',
        bedrooms: null,
        bathrooms: null,
        squareFootage: null,
        amenitiesText: '',
        availableFrom: '',
        images: []
      },
      newTenant: {
        name: '',
        phoneNumber: '',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: ''
      },
      tenantDocumentType: 'lease_agreement',
      tenantDocumentTypeOptions: [
        { text: 'Application', value: 'application' },
        { text: 'Lease Agreement', value: 'lease_agreement' },
        { text: 'Lease Modification', value: 'lease_modification' },
        { text: 'Other', value: 'other' }
      ],
      tenantDocumentFiles: [],
      snackbar: {
        show: false,
        text: '',
        color: 'info'
      }
    }
  },
  methods: {
    getRentalImage(rental) {
      return rental?.image || rental?.images?.[0] || 'https://via.placeholder.com/600x400?text=Rental+Photo'
    },

    openAddPropertyDialog() {
      this.showAddPropertyDialog = true
    },

    closeAddPropertyDialog() {
      this.showAddPropertyDialog = false
      this.newPropertyFormValid = false
      this.newProperty = {
        title: '',
        description: '',
        price: null,
        location: '',
        address: '',
        bedrooms: null,
        bathrooms: null,
        squareFootage: null,
        amenitiesText: '',
        imageUrl: '',
        availableFrom: ''
      }
      this.newPropertyPhotoFiles = []
      this.$refs.newPropertyForm?.resetValidation()
    },

    openEditPropertyDialog(rental) {
      this.editProperty = {
        id: rental.id,
        title: rental.title || '',
        description: rental.description || '',
        price: Number(rental.price || 0),
        location: rental.location || '',
        address: rental.address || '',
        bedrooms: rental.bedrooms ?? null,
        bathrooms: rental.bathrooms ?? null,
        squareFootage: rental.squareFootage ?? null,
        amenitiesText: Array.isArray(rental.amenities) ? rental.amenities.join(', ') : '',
        availableFrom: rental.availableFrom ? String(rental.availableFrom).split('T')[0] : '',
        images: Array.isArray(rental.images) ? rental.images : []
      }
      this.editPropertyPhotoFiles = []
      this.editPropertyFormValid = true
      this.showEditPropertyDialog = true
    },

    closeEditPropertyDialog() {
      this.showEditPropertyDialog = false
      this.editPropertyFormValid = false
      this.editPropertyPhotoFiles = []
      this.$refs.editPropertyForm?.resetValidation()
    },

    openDetails(rental) {
      this.selectedRental = rental
      this.showDetailsDialog = true
    },

    getCurrentTenants(rental) {
      const tenants = Array.isArray(rental?.tenants) ? rental.tenants : []
      return tenants.filter(tenant => tenant.status === 'current')
    },

    getPastTenants(rental) {
      const tenants = Array.isArray(rental?.tenants) ? rental.tenants : []
      return tenants.filter(tenant => tenant.status === 'past' || !!tenant.endDate)
    },

    formatDateValue(dateValue) {
      if (!dateValue) return ''
      return new Date(dateValue).toLocaleDateString()
    },

    formatDocumentType(type) {
      const labels = {
        application: 'Application',
        lease_agreement: 'Lease Agreement',
        lease_modification: 'Lease Modification',
        other: 'Other'
      }
      return labels[type] || 'Other'
    },

    openAddTenantDialog(rental) {
      this.selectedRental = rental
      this.newTenant = {
        name: '',
        phoneNumber: '',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: ''
      }
      this.addTenantFormValid = false
      this.showAddTenantDialog = true
    },

    closeAddTenantDialog() {
      this.showAddTenantDialog = false
      this.$refs.addTenantForm?.resetValidation()
    },

    async addTenantToProperty() {
      if (!this.$refs.addTenantForm?.validate?.() || !this.selectedRental?.id) {
        return
      }

      this.savingTenant = true
      try {
        await axios.post(`/api/rental/${this.selectedRental.id}/tenant/add`, {
          name: this.newTenant.name,
          phoneNumber: this.newTenant.phoneNumber,
          startDate: this.newTenant.startDate,
          endDate: this.newTenant.endDate || undefined,
          status: this.newTenant.endDate ? 'past' : 'current'
        })

        await this.loadRentals()
        this.selectedRental = this.rentals.find(rental => rental.id === this.selectedRental.id) || this.selectedRental
        this.closeAddTenantDialog()
        this.snackbar = {
          show: true,
          text: 'Tenant added to property',
          color: 'success'
        }
      } catch (error) {
        console.error('Error adding tenant to property:', error)
        this.snackbar = {
          show: true,
          text: error?.response?.data?.error || 'Failed to add tenant',
          color: 'error'
        }
      } finally {
        this.savingTenant = false
      }
    },

    async openTenantDocuments(rental, tenant) {
      this.selectedRental = rental
      this.selectedTenant = tenant
      this.tenantDocumentFiles = []
      this.tenantDocuments = []
      this.showTenantDocumentsDialog = true
      await this.loadTenantDocuments()
    },

    closeTenantDocumentsDialog() {
      this.showTenantDocumentsDialog = false
      this.selectedTenant = null
      this.tenantDocumentFiles = []
      this.tenantDocuments = []
    },

    async loadTenantDocuments() {
      if (!this.selectedRental?.id || !this.selectedTenant?.id) {
        return
      }

      this.loadingTenantDocuments = true
      try {
        const response = await axios.get(`/api/rental/${this.selectedRental.id}/tenant/${this.selectedTenant.id}/documents`)
        this.tenantDocuments = Array.isArray(response.data) ? response.data : []
      } catch (error) {
        console.error('Error loading tenant documents:', error)
        this.tenantDocuments = []
      } finally {
        this.loadingTenantDocuments = false
      }
    },

    async uploadTenantDocuments() {
      if (!this.selectedRental?.id || !this.selectedTenant?.id || !this.tenantDocumentFiles.length) {
        return
      }

      this.uploadingTenantDocuments = true
      try {
        const formData = new FormData()
        formData.append('documentType', this.tenantDocumentType)
        for (const file of this.tenantDocumentFiles) {
          formData.append('documents', file)
        }

        await axios.post(
          `/api/rental/${this.selectedRental.id}/tenant/${this.selectedTenant.id}/documents/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        await this.loadRentals()
        const refreshedRental = this.rentals.find(rental => rental.id === this.selectedRental.id)
        if (refreshedRental) {
          this.selectedRental = refreshedRental
          const refreshedTenant = (refreshedRental.tenants || []).find(tenant => tenant.id === this.selectedTenant.id)
          if (refreshedTenant) {
            this.selectedTenant = refreshedTenant
          }
        }

        this.tenantDocumentFiles = []
        await this.loadTenantDocuments()
        this.snackbar = {
          show: true,
          text: 'Tenant documents uploaded',
          color: 'success'
        }
      } catch (error) {
        console.error('Error uploading tenant documents:', error)
        this.snackbar = {
          show: true,
          text: error?.response?.data?.error || 'Failed to upload tenant documents',
          color: 'error'
        }
      } finally {
        this.uploadingTenantDocuments = false
      }
    },

    async openContact(rental) {
      this.selectedRental = rental
      this.showDetailsDialog = false
      this.showContactDialog = true
      await this.loadTenantContacts()
    },

    async loadTenantContacts() {
      if (!this.selectedRental?.id) {
        return
      }

      this.loadingContacts = true
      this.contactError = null
      try {
        const response = await axios.get('/api/renters', {
          params: {
            rentalId: this.selectedRental.id
          }
        })

        const renters = Array.isArray(response.data) ? response.data : []
        this.tenantContacts = renters.map(renter => ({
          id: renter.id,
          name: `${renter.firstName || ''} ${renter.lastName || ''}`.trim() || 'Unknown Tenant',
          phoneNumber: renter.phoneNumber || 'No phone number'
        }))
      } catch (error) {
        console.error('Error loading tenant contacts:', error)
        this.contactError = error?.response?.data?.error || 'Failed to load tenant contacts'
        this.tenantContacts = []
      } finally {
        this.loadingContacts = false
      }
    },

    async loadRentals() {
      const response = await axios.get('/api/rental/getAll')
      this.rentals = Array.isArray(response.data) ? response.data : []
    },

    async createProperty() {
      if (!this.$refs.newPropertyForm?.validate?.()) {
        return
      }

      this.savingProperty = true
      try {
        const amenities = this.newProperty.amenitiesText
          .split(',')
          .map(item => item.trim())
          .filter(Boolean)

        const payload = {
          title: this.newProperty.title,
          description: this.newProperty.description,
          price: Number(this.newProperty.price),
          location: this.newProperty.location,
          address: this.newProperty.address || undefined,
          bedrooms: this.newProperty.bedrooms !== null && this.newProperty.bedrooms !== '' ? Number(this.newProperty.bedrooms) : undefined,
          bathrooms: this.newProperty.bathrooms !== null && this.newProperty.bathrooms !== '' ? Number(this.newProperty.bathrooms) : undefined,
          squareFootage: this.newProperty.squareFootage !== null && this.newProperty.squareFootage !== '' ? Number(this.newProperty.squareFootage) : undefined,
          amenities,
          images: this.newProperty.imageUrl ? [this.newProperty.imageUrl] : [],
          ownerId: this.currentOwnerId,
          isAvailable: true,
          availableFrom: this.newProperty.availableFrom
            ? new Date(this.newProperty.availableFrom).toISOString()
            : undefined,
        }

        const response = await axios.post('/api/rental/create', payload)
        const createdRental = response.data

        if (createdRental?.id && this.newPropertyPhotoFiles.length) {
          await this.uploadPropertyPhotos(createdRental.id, this.newPropertyPhotoFiles)
        }

        await this.loadRentals()
        this.closeAddPropertyDialog()
        this.snackbar = {
          show: true,
          text: 'Property added successfully',
          color: 'success'
        }
      } catch (error) {
        console.error('Error creating property:', error)
        this.snackbar = {
          show: true,
          text: error?.response?.data?.error || 'Failed to add property',
          color: 'error'
        }
      } finally {
        this.savingProperty = false
      }
    },

    async uploadPropertyPhotos(rentalId, files) {
      if (!files?.length) return

      const formData = new FormData()
      for (const file of files) {
        formData.append('photos', file)
      }

      await axios.post(`/api/rental/uploadPhotos/${rentalId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },

    async savePropertyEdits() {
      if (!this.$refs.editPropertyForm?.validate?.()) {
        return
      }

      this.savingProperty = true
      try {
        const amenities = this.editProperty.amenitiesText
          .split(',')
          .map(item => item.trim())
          .filter(Boolean)

        const updatePayload = {
          title: this.editProperty.title,
          description: this.editProperty.description,
          price: Number(this.editProperty.price),
          location: this.editProperty.location,
          address: this.editProperty.address || undefined,
          bedrooms: this.editProperty.bedrooms !== null && this.editProperty.bedrooms !== '' ? Number(this.editProperty.bedrooms) : undefined,
          bathrooms: this.editProperty.bathrooms !== null && this.editProperty.bathrooms !== '' ? Number(this.editProperty.bathrooms) : undefined,
          squareFootage: this.editProperty.squareFootage !== null && this.editProperty.squareFootage !== '' ? Number(this.editProperty.squareFootage) : undefined,
          amenities,
          availableFrom: this.editProperty.availableFrom
            ? new Date(this.editProperty.availableFrom).toISOString()
            : undefined,
        }

        await axios.put(`/api/rental/update/${this.editProperty.id}`, updatePayload)

        if (this.editPropertyPhotoFiles.length) {
          await this.uploadPropertyPhotos(this.editProperty.id, this.editPropertyPhotoFiles)
        }

        await this.loadRentals()
        this.closeEditPropertyDialog()
        this.snackbar = {
          show: true,
          text: 'Property updated successfully',
          color: 'success'
        }
      } catch (error) {
        console.error('Error saving property updates:', error)
        this.snackbar = {
          show: true,
          text: error?.response?.data?.error || 'Failed to update property',
          color: 'error'
        }
      } finally {
        this.savingProperty = false
      }
    }
  },
  async mounted() {
    try {
      await this.loadRentals()
    } catch (error) {
      this.error = 'Failed to load rentals. Please make sure the server is running.'
      console.error('Error fetching rentals:', error)
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.rental-card {
  min-height: 440px;
}

.rental-card-title {
  line-height: 1.35;
  min-height: 3.6em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.rental-card-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.rental-description {
  margin-bottom: 16px;
  line-height: 1.4;
  min-height: 4.2em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.rental-location {
  display: inline-block;
  max-width: 110px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.property-photo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.property-photo-thumb {
  border-radius: 8px;
  overflow: hidden;
}

.tenant-line-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
</style>