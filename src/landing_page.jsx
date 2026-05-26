import { Home, Cars, About} from './landing_comp.jsx'

export function Landing_Page({logged, search}){
    return (
    <>
      <Home/>
      <Cars logged={logged} search={search}/>
      <About/>
    </>
  )
}