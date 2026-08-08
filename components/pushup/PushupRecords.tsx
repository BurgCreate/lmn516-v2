import data from "@/data/pushup.json"


export default function PushupRecords(){

return (

<table>

<thead>

<tr>
<th>日期</th>
<th>完成</th>
<th>累计</th>
</tr>

</thead>


<tbody>

{
data.records.map(
(item)=>(
<tr key={item.date}>

<td>
{item.date}
</td>

<td>
{item.count}
</td>

<td>
{item.total}
</td>

</tr>
)
)
}


</tbody>

</table>

)

}