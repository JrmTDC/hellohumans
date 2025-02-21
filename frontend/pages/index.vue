
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">CRM - Gestion des Clients</h1>
    <ClientForm @add-client="addClient" />
    <SearchBar @search="filterClients" />
    <ClientList :clients="filteredClients" @delete-client="deleteClient" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ClientForm from '@/components/ClientForm.vue';
import ClientList from '@/components/ClientList.vue';
import SearchBar from '@/components/SearchBar.vue';

const clients = ref([
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com' },
  { id: 2, name: 'Sophie Martin', email: 'sophie.martin@email.com' }
]);
const searchQuery = ref('');

const addClient = (client) => {
  clients.value.push({ id: Date.now(), ...client });
};

const deleteClient = (id) => {
  clients.value = clients.value.filter(client => client.id !== id);
};

const filterClients = (query) => {
  searchQuery.value = query;
};

const filteredClients = computed(() => {
  return clients.value.filter(client =>
      client.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>
