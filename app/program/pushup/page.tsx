import PushupHero from "@/components/pushup/PushupHero";
import PushupStats from "@/components/pushup/PushupStats";
import PushupCalendar from "@/components/pushup/PushupCalendar";
import PushupBarChart from "@/components/pushup/PushupBarChart";
import PushupLineChart from "@/components/pushup/PushupLineChart";
import PushupRecords from "@/components/pushup/PushupRecords";
import PushupAchievements from "@/components/pushup/PushupAchievements";


export default function PushupPage(){

return (

<main className="shell page">


<PushupHero />


<PushupStats />


<PushupCalendar />


<PushupBarChart />


<PushupLineChart />


<PushupRecords />


<PushupAchievements />


</main>

)

}