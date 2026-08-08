import data from "@/data/pushup.json"


export default function PushupProgress(){

const percent =
Math.round(
(data.current / data.goal) * 10000
) / 100


return (

<div className="pushup-progress">


<h2>
{data.title}
</h2>


<div>
<strong>
{data.current}
</strong>
/
{data.goal}
</div>


<p>
完成 {percent}%
</p>


<div
style={{
height:10,
background:"#eee",
borderRadius:10
}}
>

<div
style={{
width:`${percent}%`,
height:"100%",
background:"#65c466",
borderRadius:10
}}
/>

</div>


<p>
还需要 {data.goal-data.current} 个
</p>


</div>

)

}