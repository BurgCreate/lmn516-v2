"use client";


export default function Pushup3D(){

return (

<div

style={{

height:"320px",

width:"100%",

borderRadius:"20px",

overflow:"hidden",

background:"#fff",

display:"flex",

alignItems:"center",

justifyContent:"center"

}}

>


<img

src="/images/pushup/person.webp"

alt="pushup person"

style={{

width:"100%",

height:"100%",

objectFit:"contain",

animation:"pushupFloat 3s ease-in-out infinite"

}}

/>



<style jsx>{`

@keyframes pushupFloat {

0%,100% {

transform:translateY(0);

}


50% {

transform:translateY(-8px);

}

}

`}</style>



</div>

)

}