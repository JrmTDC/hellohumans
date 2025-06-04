<template>
     <div id="hellohumans-blocked" class="fixed inset-0 bg-[#001433] z-[2147483647] transition-opacity duration-300 grid place-items-center">
          <div class="flex flex-col items-center">
               <svgo-logo-hello-humans-full class="w-[250px] fill-white mb-8" />
               <div class="bg-white rounded-[16px] p-[40px_30px] max-w-[440px] text-center shadow-xl">
                    <div class="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-[#fff0c4] mx-auto mb-6">
                         <svgo-panel-layout-icon-warling class="w-[32px] h-[32px] fill-[#FF9800]" />
                    </div>
                    <h2 class="text-[22px] font-semibold text-[#001433] mb-4">
                         {{ t('panel.components.layout.accountError.bannedTitle') }}
                    </h2>
                    <p class="text-[#647491] text-[16px] leading-[22px] mb-6">
                         {{ t('panel.components.layout.accountError.bannedDescription') }}
                    </p>
                    <div>
                         <button @click="logout" class="inline-block text-[16px] font-medium cursor-pointer outline-none p-[10px] max-w-[370px] leading-[26px] tracking-[-0.01em] transition duration-200 ease-in-out border hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63] px-6 py-3 rounded-[8px] bg-transparent border border-[#E91E63] text-[#E91E63] p-[10px]">{{ t('panel.components.layout.accountError.logout') }}</button>
                         <a href="mailto:support@hellohumans.fr"
                            class="inline-block text-white text-[16px] font-medium cursor-pointer outline-none p-[10px] max-w-[370px] leading-[26px] tracking-[-0.01em] transition duration-200 ease-in-out bg-[#0569FF] border hover:bg-[#044bcc] px-6 py-3 rounded-[8px] ml-[10px]">
                              {{ t('panel.components.layout.accountError.contactSupport') }}
                         </a>
                    </div>

               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
const panelStore = usePanelStore()
const router = useRouter()
function logout() {
     panelStore.logout()
     router.push('/panel/login')
}

</script>
