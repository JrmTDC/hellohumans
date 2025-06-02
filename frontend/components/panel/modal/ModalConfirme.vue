<template>
     <PanelModalBaseConfirme>
          <div>
               <SvgoPanelSettingsIconWarning class="h-[40px] w-[40px] fill-[#0566ff] m-0 mr-auto mb-[12px]" />
               <h1 class="text-[20px] leading-[26px] normal-case break-words font-semibold">Êtes-vous certain ?</h1>
               <p class="text-[16px] leading-[20px] my-[12px] p-0 text-left">Voulez-vous vraiment modifier la langue pour {{ newLanguage.label }} ?</p>
          </div>
          <div class="flex p-0 justify-end mt-[32px] w-full z-[1] box-border flex-wrap items-center">
               <button @click="emit('close')" class="inline-block transition-[box-shadow] duration-100 shadow-[0_0_0_3px_rgba(0,0,0,0)] border border-[#d1d9e0] text-[#080f1a] rounded-[8px] font-normal px-[16px] py-[9px] cursor-pointer :hover:bg-[#dce9ff]">Annuler</button>
               <button @click="confirm" class="inline-block bg-[#0566ff] hover:bg-[#055ce5] transition-[box-shadow] duration-100 shadow-[0_0_0_3px_rgba(0,0,0,0)] rounded-[8px] font-normal px-[16px] py-[9px] text-white text-[1em] ml-[8px]">Oui, absolument !</button>
          </div>
     </PanelModalBaseConfirme>
</template>

<script setup lang="ts">
const { t } = useI18n()
const emit = defineEmits(['close'])
const props = defineProps<{
     newLanguage: any
}>()
const panelStore = usePanelStore()
const router = useRouter()

const newLanguage = ref(props.newLanguage)
console.log(newLanguage)

const confirm = async function () {
     await panelStore.updateUserLang(newLanguage.code)
     await router.push('/panel')
}

</script>
