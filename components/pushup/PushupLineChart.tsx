import data from "@/data/pushup.json";


export default function PushupLineChart(){


const points =
data.records
.map((item,index)=>({

x:index * 60 + 30,

y:200 - (item.total / data.goal) * 160,

label:item.date.slice(5)

}))
.reverse();



const path =
points
.map(
(point,index)=>
`${index===0?"M":"L"} ${point.x} ${point.y}`
)
.join(" ");



return (

<section

style={{
marginTop:"32px",
padding:"24px",
border:"1px solid #eee",
borderRadius:"20px",
background:"#fff"
}}

>


<h2>
累计增长
</h2>



<svg

width="100%"

height="240"

viewBox="0 0 300 220"

>


<path

d={path}

fill="none"

stroke="#65c466"

strokeWidth="3"

/>



{
points.map(point=>(

<circle

key={point.x}

cx={point.x}

cy={point.y}

r="5"

fill="#65c466"

/>

))

}


</svg>


</section>

)

}