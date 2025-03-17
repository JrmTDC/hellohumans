<template>
     <div id="hellohumans-panel-iframe" class="border border-[rgb(226,232,239)] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-1 p-[4px_8px] m-[15px]">
          <div class="flex flex-row justify-start items-start">
               <div class="flex flex-col justify-start items-stretch w-full p-[20px] ">
                    <div class="relative p-[13px_20px_13px_44px] mb-0 rounded-[8px] bg-[rgb(255,221,167)] text-[rgb(58,35,0)] mb-[20px]">
                         <div class="absolute top-[10px] left-[12px] flex items-center justify-center w-[24px] h-[24px]"
                         >
                              <svgoIconWarling class="w-[24px] h-[24px] fill-[#d48200]"/>
                         </div>
                         Le widget de chat n'est pas installé sur le site du client. Les visiteurs ne peuvent pas voir les modifications pour le moment.
                    </div>

                    <div class="flex flex-col justify-start items-stretch mb-[20px]" >
                         <h2 class="mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em]">Apparence</h2>
                         <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(100,116,145)] max-w-[750px]">Personnalisez votre widget de chat HelloHuman pour attirer l'attention des visiteurs de votre site Web ou pour adapter l'apparence du widget à votre marque.</p>
                    </div>

                    <!-- SECTION GÉNÉRAL -->
                    <ExpandableSection title="Général">
                         <div class="flex flex-col justify-start items-start gap-3">
                              <label class="block">Couleur d'arrière-plan :</label>
                              <div>

                                   <div class="w-full flex items-center text-[rgb(8,15,26)] text-left">
                                        <svgoIconPickerColor class="w-[24px] h-[24px] fill-[#647491]"/>
                                        <span class="ml-[12px] whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-left text-[14px] leading-[18px] tracking-[-0.01em]">Choisissez votre couleur</span>
                                   </div>
                                   <ul>
                                        <li class="p-[14px_8px_4px] overflow-hidden text-ellipsis whitespace-nowrap text-[rgb(100,116,145)] pointer-events-none text-[12px] leading-[16px] tracking-[-0.01em]">Themes</li>
                                        <li class="p-[9px_8px] rounded-[4px] text-[rgb(8,15,26)] cursor-pointer bg-white overflow-hidden text-ellipsis whitespace-nowrap flex gap-[8px] items-center text-[14px] leading-[18px] tracking-[-0.01em] hover:bg-[rgb(220, 233, 255)]">
                                             <div class="w-full flex items-center text-[rgb(8,15,26)] text-left">
                                                  <button class="bg-[linear-gradient(115deg,rgb(42,39,218),rgb(0,204,255))] p-0 border-none rounded-full cursor-pointer flex items-center justify-center flex-[0_0_22px] w-[22px] h-[22px] shadow-[inset_0px_0px_2px_0px_rgba(0,0,0,0.2)]"></button>
                                                  <span class="ml-[12px] whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-left"
                                                  >Dégradé 1</span>
                                             </div>
                                        </li>
                                   </ul>
                              </div>
                         </div>
                         <div class="flex flex-col justify-start items-start gap-3">
                              <label class="block">Couleur de l'action :</label>
                              <input v-model="configData.name" type="text" class="border px-3 py-2 rounded w-full" />
                         </div>


                    </ExpandableSection>

                    <!-- SECTION CONTENU -->
                    <ExpandableSection title="Contenu">
                         <label class="block mb-2">Questions suggérées :</label>

                         <ColorPicker v-model="configData.color" />


                    </ExpandableSection>

                    <!-- SECTION VISIBILITÉ & POSITION -->
                    <ExpandableSection title="Visibilité et position">
                         <label class="block mb-2">Afficher le chat ?</label>
                         <input type="checkbox" v-model="configData.showChat" />
                         <textarea v-model="configData.suggestedQuestionsString" class="border px-3 py-2 rounded w-full"></textarea>
                    </ExpandableSection>

                    <!-- SECTION PACK NATURE -->
                    <ExpandableSection title="Pack Nature">
                         <label class="block mb-2">Activer le Pack Nature ? </label>
                         <input type="checkbox" v-model="configData.has_nature_pack" />
                    </ExpandableSection>

                    <!-- SECTION AVANCÉ -->
                    <ExpandableSection title="Avancé">
                         <label class="block mb-2">Clé API Client :</label>
                         <input v-model="apiClientKey" type="text" class="border px-3 py-2 rounded w-full" />
                    </ExpandableSection>

               </div>
               <div class="self-stretch w-[400px] min-w-[400px]">
                    <div class="sticky top-0 min-h-[628px] bg-[linear-gradient(rgb(255,255,255)_0%,rgba(255,255,255,0)_500px),url(data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP////X19f///yH5BAEAAAMALAAAAAAQABAAAAIflG+hq4jM3IFLJhqswNly/XkcBpIiVaInlLJr9FZWAQA7)] bg-repeat w-full">
                         <Chat v-if="isChatActive" :overrideConfig="appliedConfig" />
                    </div>
               </div>
          </div>
     </div>

     <div class="p-4">
          <h1 class="text-2xl font-bold mb-4">Administration du Chatbot</h1>

          <!-- CLÉ API CLIENT -->
          <div class="mb-4">
               <label class="block font-medium mb-1">Clé API Client</label>
               <input
                    v-model="apiClientKey"
                    type="text"
                    class="border px-2 py-1 rounded w-96"
                    placeholder="Entrez la clé client"
               />
               <button
                    class="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    @click="loadClientData">
                    Charger config
               </button>
          </div>

          <!-- SI LES DONNÉES CLIENT SONT CHARGÉES -->
          <div v-if="clientData">
               <h2 class="text-xl font-semibold mt-6 mb-2">Infos Client</h2>
               <div class="mb-2">
                    <label class="block font-medium mb-1">Nom :</label>
                    <input
                         v-model="clientData.name"
                         type="text"
                         class="border px-2 py-1 rounded w-96"
                    />
               </div>

               <div class="mb-2">
                    <label class="block font-medium mb-1">Activité :</label>
                    <input
                         v-model="clientData.activity"
                         type="text"
                         class="border px-2 py-1 rounded w-96"
                    />
               </div>

               <div class="mb-2">
                    <label class="block font-medium mb-1">Has Nature Pack ?</label>
                    <input
                         type="checkbox"
                         v-model="clientData.has_nature_pack"
                    />
               </div>

               <!-- CONFIGURATION (COULEURS, QUESTIONS, ETC.) -->
               <h2 class="text-xl font-semibold mt-4 mb-2">Configuration du Chat</h2>
               <p class="text-gray-600 text-sm mb-2">
                    (Valeurs par défaut si config est vide)
               </p>
               <!-- Couleur principale -->
               <div class="mb-2">
                    <label class="block font-medium mb-1">Couleur principale :</label>
                    <input
                         v-model="configData.color"
                         type="color"
                         class="w-16 h-8 border px-2 py-1 rounded"
                    />
               </div>

               <!-- Exemples de champs supplémentaires -->
               <div class="mb-2">
                    <label class="block font-medium mb-1">Questions suggérées :</label>
                    <textarea
                         v-model="configData.suggestedQuestionsString"
                         rows="3"
                         class="border px-2 py-1 rounded w-96"
                    ></textarea>
                    <p class="text-xs text-gray-500">
                         Séparez par un point-virgule ou une virgule par ex.
                    </p>
               </div>

               <!-- BOUTONS DE GESTION -->
               <div class="mt-4 flex space-x-2">
                    <button
                         class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                         @click="applyToChat"> Appliquer au Chat
                    </button>

                    <button
                         class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                         @click="resetConfig"> Reset
                    </button>

                    <button
                         class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                         @click="saveConfig"> Sauvegarder
                    </button>
               </div>
          </div>


     </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Chat from '@/components/chat/Chat.vue'
import {useRuntimeConfig} from "#imports"; // votre composant principal du Chat
import ExpandableSection from '@/components/Panel/ExpandableSection.vue'
import ColorPicker from '@/components/Panel/ColorPicker.vue'

const config = useRuntimeConfig()
const apiUrl = `${config.public.apiBaseUrl}/api/${config.public.apiVersion}`

const isChatActive = ref(false)

/* =============================
   ÉTAT ET VARIABLES
   ============================= */
const apiClientKey = ref('4a250974433e6ea35fad46637734b8fe')
const clientData = ref<any | null>(null)

// On va stocker la config interne dans configData
// par ex. color, suggestions, etc. On imagine un format (à vous d'ajuster)
const configData = ref<{
     color: string;
     suggestedQuestionsString: string;  // pour un champ text
     // d'autres champs possibles...
}>({
     color: '#0566ff',
     suggestedQuestionsString: 'Quels sont les restaurants ?;Quels sites touristiques visiter ?'
})

// On stocke la config "appliquée" au chat
// (celle qui est passée en prop overrideConfig)
const appliedConfig = ref<any>({})

/* =============================
   CHARGEMENT DU CLIENT
   ============================= */
async function loadClientData() {
     if (!apiClientKey.value.trim()) {
          alert('Veuillez saisir une clé client.')
          return
     }
     try {
          // Appel GET /clients avec header x-client-key
          // (à ajuster selon votre endpoint réel)
          const res = await fetch(apiUrl + '/clients', {
               method: 'GET',
               headers: {
                    'Content-Type': 'application/json',
                    'x-client-key': apiClientKey.value
               }
          })
          if (!res.ok) {
               throw new Error('Erreur au chargement du client.')
          }
          const json = await res.json()
          // Ex: { success: { name, activity, config, has_nature_pack } }
          clientData.value = json.success
          // On initialise configData avec soit la config du serveur, soit du par défaut
          if (clientData.value.config) {
               // Suppose que clientData.value.config = { color: "...", suggestedQuestions: ["q1", "q2"] ...}
               configData.value.color = clientData.value.config.color || '#0566ff'
               configData.value.suggestedQuestionsString = (clientData.value.config.suggestedQuestions || []).join('; ')
          } else {
               // Pas de config => on garde nos valeurs par défaut
               // (on pourrait encore plus paramétrer si on veut)
               configData.value.color = '#0566ff'
               configData.value.suggestedQuestionsString = 'Quels sont les restaurants ?;Quels sites touristiques visiter ?'
          }
          isChatActive.value = true
     } catch (err) {
          console.error(err)
     }
}

/* =============================
   APPLIQUER LA CONFIG AU CHAT
   ============================= */
function applyToChat() {
     // On transforme par ex. suggestedQuestionsString en array
     const suggestedArray = configData.value.suggestedQuestionsString
          .split(/[;,]/)
          .map((s) => s.trim())
          .filter(Boolean)

     // On construit l'objet config final
     appliedConfig.value = {
          color: configData.value.color,
          suggestedQuestions: suggestedArray,
          // On pourrait ajouter d'autres paramètres
     }
}

/* =============================
   RESET DE LA CONFIG
   ============================= */
function resetConfig() {
     if (!clientData.value) {
          // Si pas de clientData, on applique un reset sur la config par défaut
          configData.value.color = '#0566ff'
          configData.value.suggestedQuestionsString = 'Quels sont les restaurants ?;Quels sites touristiques visiter ?'
          appliedConfig.value = {}
          return
     }
     // Sinon, on recharge la config depuis clientData
     if (clientData.value.config) {
          configData.value.color = clientData.value.config.color || '#0566ff'
          configData.value.suggestedQuestionsString = (clientData.value.config.suggestedQuestions || []).join('; ')
     } else {
          configData.value.color = '#0566ff'
          configData.value.suggestedQuestionsString = 'Quels sont les restaurants ?;Quels sites touristiques visiter ?'
     }
     // On vide la config "appliquée" => le Chat reviendra à la config par défaut / en prop
     appliedConfig.value = {}
}

/* =============================
   SAUVEGARDER LA CONFIG
   ============================= */
async function saveConfig() {
     if (!clientData.value) {
          alert("Aucune donnée client chargée.")
          return
     }
     try {
          // On recalcule l'objet config final
          const suggestedArray = configData.value.suggestedQuestionsString
               .split(/[;,]/)
               .map((s) => s.trim())
               .filter(Boolean)

          // On l'affecte à clientData.value.config
          clientData.value.config = {
               color: configData.value.color,
               suggestedQuestions: suggestedArray,
               // etc. Ajoutez d'autres champs
          }

          // On envoie au backend, ex: PUT /clients
          const res = await fetch('/api/clients', {
               method: 'PUT',
               headers: {
                    'Content-Type': 'application/json',
                    'x-client-key': apiClientKey.value
               },
               body: JSON.stringify({
                    // On met ce que vous attendez côté API...
                    name: clientData.value.name,
                    activity: clientData.value.activity,
                    has_nature_pack: clientData.value.has_nature_pack,
                    config: clientData.value.config
               })
          })
          if (!res.ok) {
               throw new Error('Erreur sauvegarde config.')
          }
          alert('Configuration sauvegardée avec succès !')
     } catch (err) {
          console.error(err)
          alert('Impossible de sauvegarder la config.')
     }
}
</script>
