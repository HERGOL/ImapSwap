import { create } from 'zustand'
const useStore = create((set)=>({
   Etape:0,
    setEtape:(id)=> set({Etape:id})
}))

const useInfos = create((set)=>({
    //Source
    HoteSource:"",
    setHoteSource:(hote)=>set({HoteSource:hote}),
    MailSource:"",
    setMailSource:(mail)=>set({MailSource:mail}),
    PassewordSource:"",
    setPassewordSource:(password)=>set({PassewordSource:password}),

    //Destination
    HoteDestination:"",
    setHoteDestination:(hote)=>set({HoteDestination:hote}),
    MailDestination:"",
    setMailDestination:(mail)=>set({MailDestination:mail}),
    PassewordDestination:"",
    setPassewordDestination:(passeword)=>set({PassewordDestination:passeword}),

}))
export {useStore,useInfos}