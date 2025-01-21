import { create } from 'zustand'
const useStore = create((set)=>({
   Etape:0,
    setEtape:(id)=> set({Etape:id})
}))

const useInfos = create((set)=>({
    //Source
    HoteSource:"",

    MailSource:"",

    PassewordSource:"",

    //Destination
    HoteDestination:"",

    MailDestination:"",

    PassewordDestination:"",

}))
export {useStore,useInfos}