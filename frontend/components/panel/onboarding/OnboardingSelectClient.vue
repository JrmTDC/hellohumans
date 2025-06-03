<template>
     <div ref="dropdownRef">
          <div class="mt-[12px]">
               <input type="text" v-model="organizationName" :placeholder="t('panel.components.onboarding.selectClient.organizationName')" class="w-full h-[51px] px-[14px] py-[16px] border-2 border-[#d3dbe5] rounded-[8px] outline-none focus:border-[#3886ff] text-[#080f1a]"/>
          </div>
          <div class="mt-[12px]">
               <PanelOnboardingSelectSimple v-model="organizationType" :options="listOrganizationType" :placeholder="t('panel.components.onboarding.step.part1.selectType.placeholder')"/>
          </div>
     </div>
</template>
<script setup lang="ts">
const { t } = useI18n()

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
const isOpen = ref(false)
const store = useOnboardingStore()
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
     store.createMode = true
})

onBeforeUnmount(() => {
     window.removeEventListener('click', handleClickOutside)
})
</script>
