<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-toolbar-title>Rental Management</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-btn variant="text" :to="{ name: 'Home' }" exact>
        <v-icon left>mdi-home</v-icon>
        Home
      </v-btn>
      
      <v-btn variant="text" :to="{ name: 'CashFlow' }">
        <v-icon left>mdi-cash-multiple</v-icon>
        Cash Flow
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view @show-snackbar="showSnackbar" />
      
      <!-- Global snackbar for notifications -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
        bottom
        right
      >
        {{ snackbar.message }}
        <template v-slot:actions>
          <v-btn
            variant="text"
            @click="snackbar.show = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      snackbar: {
        show: false,
        message: '',
        color: 'success',
        timeout: 4000
      }
    }
  },
  methods: {
    showSnackbar({ message, color = 'success', timeout = 4000 }) {
      this.snackbar = {
        show: true,
        message,
        color,
        timeout
      }
    }
  }
}
</script>