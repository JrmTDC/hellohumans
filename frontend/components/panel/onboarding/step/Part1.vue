<template>
     <div class="flex flex-col gap-[32px] sm:gap-[48px]">

          <PanelOnboardingSection title="Sélectionnez ou créez un compte client" description="Votre projet sera rattaché à ce compte client">
               <PanelOnboardingSelectClient v-model="onboardingStore.answers.selectedClientId" :clients="panelStore.clients" />
          </PanelOnboardingSection>


          <!-- SECTION 1 : URL du site -->
          <PanelOnboardingSection title="Quelle est l'adresse URL de votre site web" description="Vos réponses nous aideront à personnaliser votre expérience">
               <label class="block font-normal max-w-full flex flex-col relative text-[16px] leading-[20px] tracking-[-0.01em] w-full text-left text-[#647491]">
                    <input type="text" v-model="onboardingStore.answers.webSite" placeholder="https://votre-site.com" class="block w-full h-[51px] text-[#080f1a] border-2 border-[#d3dbe5] rounded-[8px] px-[14px] py-[16px] outline-none focus:border-[#3886ff]"/>
               </label>
          </PanelOnboardingSection>
     </div>
</template>

<script setup lang="ts">
const panelStore = usePanelStore()
const onboardingStore = useOnboardingStore()

// Auto validation
// Section 1 : client valide
useSection(1, 1, () => {
     const { selectedClientId, newClientName } = onboardingStore.answers
     const validClient = !!panelStore.clients.find(c => c.id === selectedClientId)
     return validClient || newClientName.trim().length > 0
})

// Section 2 : URL valide
useSection(1, 2, () => {
     const { webSite } = onboardingStore.answers
     const regex = /^(https?:\/\/)?([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/
     return regex.test(webSite)
})
</script>
