<template>
     <div ref="dropdownRef">
          <div class="relative inline-block w-full">
               <div class="flex items-center justify-between border-2 rounded-[8px] px-3 py-2 cursor-pointer" :class="isOpen ? 'border-[#3886ff]' : 'border-[#d3dbe5]'" @click="toggleOpen">
                    <span class="text-[#080f1a] truncate">{{ displayLabel }}</span>
                    <svgo-panel-icon-triangle-caret-down class="w-[24px] h-[24px] fill-[#080f1a]" :class="{ 'rotate-180': isOpen }" />
               </div>
               <div v-if="isOpen" class="absolute left-0 right-0 mt-1 z-10 shadow-[0px_8px_20px_rgba(0,20,51,0.24)] bg-white rounded-[8px]">
                    <div v-if="clients && clients.length > 0" class="px-[8px] border-b border-[#e0e6ed]">
                         <div class="scrollbar-none overflow-scroll scrollbar-none overflow-y-scroll overflow-x-hidden w-full h-full">
                              <div class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></div>
                              <ul class="max-h-[200px] list-none outline-none p-0 m-0">
                                   <li v-for="client in clients" :key="client.id" class="px-[8px] py-[9px] rounded-[4px] text-[#080f1a] cursor-pointer bg-white overflow-hidden text-ellipsis whitespace-nowrap flex gap-[8px] items-center text-[14px] leading-[18px] tracking-[-0.01em] hover:bg-[#dce9ff]" @click="selectClient(client.id)">{{ client.name }}</li>
                              </ul>
                              <div class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></div>
                         </div>
                    </div>
                    <div class="flex items-center text-[#080f1a] bg-transparent border-none rounded-[4px] min-h-[36px] px-[8px] py-[6px] cursor-pointer outline-none hover:bg-[#dce9ff] hover:text-[#001433] m-[8px] group" @click="enableCreateMode">
                         <span class="flex items-center">
                              <svgo-panel-icon-add class="w-[24px] h-[24px] fill-[#647491] group-hover:fill-[#0566ff]" />
                         </span>
                         <span class="ml-[12px] text-[14px]">{{ t('panel.components.onboarding.selectClient.createNew') }}</span>
                    </div>
               </div>

               <div v-if="createMode">
                    <div class="mt-[12px]">
                         <input type="text"
                                v-model="organizationName"
                                :placeholder="t('panel.components.onboarding.selectClient.organizationName')"
                                class="w-full h-[51px] px-[14px] py-[16px] border-2 border-[#d3dbe5] rounded-[8px] outline-none focus:border-[#3886ff] text-[#080f1a]"/>
                    </div>
                    <div class="mt-[12px]">
                         <PanelOnboardingSelectSimple
                              v-model="organizationType"
                              :options="listOrganizationType"
                              :placeholder="t('panel.components.onboarding.step.part1.selectType.placeholder')"/>
                    </div>


               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
interface ClientAccount {
     id: string
     name: string
}

const listOrganizationType = [
     {
          id: 'individual',
          name: t('panel.components.onboarding.selectClient.type.individual')
     },
     {
          id: 'educational',
          name: t('panel.components.onboarding.selectClient.type.educational')
     },
     {
          id: 'startup',
          name: t('panel.components.onboarding.selectClient.type.startup')
     },
     {
          id: 'agency',
          name: t('panel.components.onboarding.selectClient.type.agency')
     },
     {
          id: 'company',
          name: t('panel.components.onboarding.selectClient.type.company')
     },
     {
          id: 'Communities',
          name: t('panel.components.onboarding.selectClient.type.communities')
     },
     {
          id: 'Associations',
          name: t('panel.components.onboarding.selectClient.type.associations')
     },
     {
          id: 'other',
          name: t('panel.components.onboarding.selectClient.type.other')
     }
]

const props = defineProps<{
     modelValue: string | null
     clients: ClientAccount[]
     placeholder?: string
     placeholderCreate?: string
}>()

const emit = defineEmits<{
     (e: 'update:modelValue', value: string | null): void
     (e: 'create-new-client', data: { name: string }): void
}>()

const isOpen = ref(false)
const store = useOnboardingStore()
const createMode = computed({
     get: () => store.createMode,
     set: (value) => {
          store.createMode = value
          if (!value) {
               emit('update:modelValue', null)
          }
     }
})
const dropdownRef = ref<HTMLElement | null>(null)
const onboardingStore = useOnboardingStore()
let skipNextClick = true
const organizationName = computed({
     get: () => onboardingStore.answers.organizationName,
     set: (val) => (onboardingStore.answers.organizationName = val),
})
const organizationType = computed({
     get: () => onboardingStore.answers.organizationType,
     set: (val) => (onboardingStore.answers.organizationType = val),
})
const toggleOpen = () => {
     isOpen.value = !isOpen.value
}

const selectClient = (id: string) => {
     emit('update:modelValue', id)
     isOpen.value = false
     store.createMode = false
     organizationName.value = ''
     organizationType.value = ''
}

const enableCreateMode = () => {
     emit('update:modelValue', null) // Reset valeur
     store.createMode = true
     isOpen.value = false
}

// Texte affiché dans le select
const displayLabel = computed(() => {
     if (createMode.value) return props.placeholderCreate
     const client = props.clients.find((c) => c.id === props.modelValue)
     return client?.name ?? props.placeholder
})

const handleClickOutside = (event: MouseEvent) => {
     if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
          isOpen.value = false
     }
}

onMounted(() => {
     skipNextClick = true
     setTimeout(() => {
          skipNextClick = false
     }, 100)
     document.addEventListener('click', (e) => {
          if (skipNextClick) return
          handleClickOutside(e)
     })

     // Si aucun client + un nom en cours = on force createMode
     if (props.clients.length === 0 || organizationName.value.trim().length > 0) {
          store.createMode = true
          emit('update:modelValue', null)
     }
})

onBeforeUnmount(() => {
     window.removeEventListener('click', handleClickOutside)
})
watch(() => props.modelValue, (val) => {
     if (val) {
          // Si on a sélectionné un vrai client, on quitte le mode création
          store.createMode = false
          organizationName.value = ''
          organizationType.value = ''
     }
})
</script>
