<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-4">Available Rentals</h1>
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
      >
        <v-card>
          <v-img
            :src="rental.image"
            height="200"
            cover
          ></v-img>
          
          <v-card-title>{{ rental.title }}</v-card-title>
          
          <v-card-text>
            <p>{{ rental.description }}</p>
            <div class="d-flex justify-space-between align-center">
              <span class="text-h6 text-primary">${{ rental.price }}/month</span>
              <v-chip color="secondary" small>
                <v-icon left small>mdi-map-marker</v-icon>
                {{ rental.location }}
              </v-chip>
            </div>
          </v-card-text>
          
          <v-card-actions>
            <v-btn color="primary" text>
              View Details
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="success" text>
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
      error: null
    }
  },
  async mounted() {
    try {
      const response = await axios.get('/api/rentals')
      this.rentals = response.data
    } catch (error) {
      this.error = 'Failed to load rentals. Please make sure the server is running.'
      console.error('Error fetching rentals:', error)
    } finally {
      this.loading = false
    }
  }
}
</script>