<template>
     <div ref="projectMenuRef" class="absolute z-[110] bg-white shadow-[0px_8px_20px_rgba(0,20,51,0.24)] rounded-[8px] p-[8px] w-[256px] max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#d3dbe5] scrollbar-track-transparent" :style="menuStyle">
          <div v-for="project in projects" :key="project.id">
               <div role="menuitemradio" class="w-full flex items-center text-[#080f1a] bg-transparent border-none rounded-[4px] min-h-[36px] px-[8px] py-[6px] cursor-pointer outline-none hover:bg-[#dce9ff] hover:text-[#001433] group" @click="selectProject(project.id)">
                    <span class="whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-left text-[14px]">
                    {{ project.website || t('panel.components.layout.sideMenuProjects.noName') }}
                    </span>
                    <span v-if="project.id === selectedProject" class="flex items-center ml-[12px]">
                         <svgo-panel-icon-checked class="w-[24px] h-[24px] fill-[#647491] group-hover:fill-[#0566ff]" />
                    </span>
               </div>
          </div>

          <!-- Ajouter un projet -->
          <div role="menuitemradio" class="w-full flex items-center text-[#080f1a] bg-transparent border-none rounded-[4px] min-h-[36px] px-[8px] py-[6px] cursor-pointer outline-none hover:bg-[#dce9ff] hover:text-[#001433] group" @click="addNewProject">
               <span class="flex items-center">
                    <svgo-panel-icon-add class="w-[24px] h-[24px] fill-[#647491] group-hover:fill-[#0566ff]" />
               </span>
               <span class="ml-[12px] text-[14px]">{{ t('panel.components.layout.sideMenuProjects.addNew') }}</span>

          </div>
     </div>
</template>

<script setup lang="ts">
import { usePanelStore } from '~/stores/panelStore'
import {onMounted} from "vue";

const { t } = useI18n()
const panelStore = usePanelStore()
const emit = defineEmits(['open-create-project','close'])
const projectMenuRef = ref()

const projects = computed(() => panelStore.projects)
const selectedProject = computed(() => panelStore.project?.id)

const menuStyle = ref({ top: '50%', left: '245px', transform: 'translateY(-50%)' })
const layoutLoadingPanel = useState('layoutLoadingPanel', () => true)
const selectProject = async (uuid: string) => {
     if (uuid !== selectedProject.value) {
          layoutLoadingPanel.value = true
          await panelStore.switchProject(uuid)
          location.reload()
     }
     emit('close')
}

const addNewProject = () => {
     emit('open-create-project')
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
     if (!projectMenuRef.value || projectMenuRef.value.contains(event.target as Node)) return
     emit('close')
}
</script>
