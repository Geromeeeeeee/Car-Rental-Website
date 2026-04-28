import { Home, Cars, About} from './landing_comp.jsx'

export function Landing_Page({logged}){
    return (
    <>
      <Home/>
      <Cars logged={logged}/>
      <About/>
    </>
  )
}