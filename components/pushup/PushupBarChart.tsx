import data from "@/data/pushup.json";


export default function PushupBarChart(){


const months = data.records.reduce(
(acc,item)=>{

const month =
item.date.slice(5,7);


if(!acc[month]){
acc[month]=0;
}


acc[month]+=item.count;


return acc;

},
{} as Record<string,number>
);



const list =
Object.entries(months);



const max =
Math.max(
...list.map(
item=>item[1]
)
);



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
月度训练量
</h2>



<div

style={{
display:"flex",
flexDirection:"column",
gap:"16px",
marginTop:"20px"
}}

>


{
list.map(
([month,count])=>(


<div
key={month}
style={{
display:"grid",
gridTemplateColumns:"60px 1fr 60px",
alignItems:"center",
gap:"12px"
}}
>


<span>
{month}月
</span>



<div

style={{
height:"16px",
background:"#eee",
borderRadius:"20px",
overflow:"hidden"
}}

>


<div

style={{

width:
`${(count/max)*100}%`,

height:"100%",

background:"#65c466",

borderRadius:"20px"

}}

/>


</div>



<span>
{count}
</span>


</div>


)
)
}


</div>



</section>

)

}