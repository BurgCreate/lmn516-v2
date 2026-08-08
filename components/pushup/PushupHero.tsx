import data from "@/data/pushup.json";
import Pushup3D from "@/components/pushup/Pushup3D";


export default function PushupHero(){

  const percent =
    ((data.current / data.goal) * 100).toFixed(2);


  return (

    <section

      style={{
        display:"grid",
        gridTemplateColumns:"0.8fr 1.2fr",
        gap:"40px",
        padding:"40px",
        marginTop:"24px",
        border:"1px solid #eee",
        borderRadius:"24px",
        background:"#fff",
        boxSizing:"border-box"
      }}

    >


      {/* 左侧数据 */}

      <div>


        <h1

          style={{
            fontSize:"42px",
            fontWeight:600,
            margin:"0 0 24px"
          }}

        >

          {data.title}

        </h1>



        <div

          style={{
            fontSize:"56px",
            fontWeight:700,
            lineHeight:1.2
          }}

        >

          {data.current}

          <span

            style={{
              fontSize:"28px",
              fontWeight:400,
              opacity:.45
            }}

          >

            / {data.goal}

          </span>


        </div>



        <p

          style={{
            marginTop:"16px",
            opacity:.7
          }}

        >

          完成 {percent}%

        </p>



        <div

          style={{

            height:"12px",

            background:"#eeeeee",

            borderRadius:"20px",

            overflow:"hidden",

            marginTop:"16px"

          }}

        >


          <div

            style={{

              width:`${percent}%`,

              height:"100%",

              background:"#65c466",

              borderRadius:"20px"

            }}

          />


        </div>




        <p

          style={{

            marginTop:"20px",

            opacity:.6

          }}

        >

          还需要 {data.goal - data.current} 个俯卧撑

        </p>



      </div>





      {/* 右侧3D人物区域 */}

      <div>

        <Pushup3D />

      </div>



    </section>

  )

}