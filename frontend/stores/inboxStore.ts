import { defineStore } from 'pinia'
interface Visitors {
     id: string
     name: string
     email: string
     phone: string
     createdAt: Date
     conversations: Array<Conversations>
}
interface Operators {
     id: string
     name: string
}
interface Operator {
     id: string
     name: string
     conversations: Array<Conversations>
}
interface Conversations {
     id: string
     title: string
     agent: string
     messages: Array<Messages>
}
interface Messages {
     id: string
     content: string
}
export const useInboxStore = defineStore('panel', () => {
     const visitors = ref(<Array<Visitors>>([]))
     const operators = ref(<Array<Operators>>([]))
     const operator = ref<Operator | null>(null)

     // Simulate fetching data
     async function fetchData() {
          // This function would typically make an API call to fetch data
          // For now, we will simulate it with static data
          visitors.value = [
               {
                    id: '1',
                    name: 'John Doe',
                    email: 'john@doe.com',
                    phone: '1234567890',
                    createdAt: new Date(),
                    conversations: []
               }
          ]
          operators.value = [
               {id: '1', name: 'Jane Smith'},
               {id: '2', name: 'Bob Johnson'}
          ]
          operator.value = {
               id: '1', name: 'Jane Smith', conversations: [
                    {
                         id: '1',
                         title: 'Conversation 1',
                         agent: '1',
                         messages: [
                              {
                                   id: '1',
                                   content: 'Hello, how can I help you?'
                              },
                              {
                                   id: '2',
                                   content: 'I have a question about my order.'
                              }
                         ]
                    }
               ]
          }
     }
     return {
          visitors,
          operators,
          operator,
          fetchData
     }
})
