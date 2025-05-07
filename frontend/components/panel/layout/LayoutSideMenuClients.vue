<template>
     <div ref="clientMenuRef" class="absolute z-[110] bg-white shadow-[0px_8px_20px_rgba(0,20,51,0.24)] rounded-[8px] p-[8px] w-[256px] max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#d3dbe5] scrollbar-track-transparent" :style="menuStyle">
          <div v-for="client in clients" :key="client.id">
               <div role="menuitemradio" class="w-full flex items-center text-[#080f1a] bg-transparent border-none rounded-[4px] min-h-[36px] px-[8px] py-[6px] cursor-pointer outline-none hover:bg-[#dce9ff] hover:text-[#001433] group" @click="selectClient(client.id)">
                    <span class="whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-left text-[14px]">
                    {{ client.name || t('panel.components.layout.sideMenuClients.noName') }}
                    </span>
                    <span v-if="client.id === selectedClient" class="flex items-center ml-[12px]">
                         <svgo-panel-icon-checked class="w-[24px] h-[24px] fill-[#647491] group-hover:fill-[#0566ff]" />
                    </span>
               </div>
          </div>

          <NuxtLink @click="addNewClient" class="w-full flex items-center text-[#080f1a] bg-transparent border-none rounded-[4px] min-h-[36px] px-[8px] py-[6px] cursor-pointer outline-none hover:bg-[#dce9ff] hover:text-[#001433] group">
               <span class="flex items-center"><svgo-panel-icon-add class="w-[24px] h-[24px] fill-[#647491] group-hover:fill-[#0566ff]" /></span>
               <span class="ml-[12px] text-[14px]">{{ t('panel.components.layout.sideMenuClients.addNew') }}</span>
          </NuxtLink>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const panelStore = usePanelStore()
const emit = defineEmits(['open-create-client','close'])
const clientMenuRef = ref()

const clients = computed(() => panelStore.clients)
const selectedClient = computed(() => panelStore.client?.id)

const menuStyle = ref({ top: '50%', left: '245px', transform: 'translateY(-50%)' })
const layoutLoadingPanel = useState('layoutLoadingPanel', () => true)
const selectClient = async (uuid: string) => {
     if (uuid !== selectedClient.value) {
          await panelStore.switchClient(uuid)
          await router.push('/panel')
     }
     emit('close')
}

const addNewClient = () => {
     emit('open-create-client')
}


let skipNextClick = true

onMounted(() => {
     skipNextClick = true
     setTimeout(() => {
          skipNextClick = false
     }, 100)
     document.addEventListener('click', (e) => {
          if (skipNextClick) return
          handleClickOutside(e)
     })
})

onUnmounted(() => {
     document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: MouseEvent) => {
     if (!clientMenuRef.value || clientMenuRef.value.contains(event.target as Node)) return
     emit('close')
}
</script>
