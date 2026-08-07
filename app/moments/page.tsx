import { GardenCorner } from "@/components/garden";
import { getMoments } from "@/lib/wordpress";

export const revalidate = 300;


function getWeek(date: Date) {

  const firstDay = new Date(
    date.getFullYear(),
    0,
    1
  );

  const days =
    Math.floor(
      (date.getTime() - firstDay.getTime()) /
      86400000
    );

  return Math.ceil(
    (days + firstDay.getDay() + 1) / 7
  );

}



export default async function MomentsPage() {

  const moments = await getMoments(50);



  const grouped = moments.reduce(
    (result, moment) => {


      const date = new Date(moment.rawDate);


      if(Number.isNaN(date.getTime())) {
        return result;
      }



      const week =
        `${date.getFullYear()}年第${getWeek(date)}周`;



      const day =
        date.toLocaleDateString(
          "zh-CN",
          {
            month:"2-digit",
            day:"2-digit",
            weekday:"short",
          }
        );



      const time =
        date.toLocaleTimeString(
          "zh-CN",
          {
            hour:"2-digit",
            minute:"2-digit",
            hour12:false,
          }
        );



      if(!result[week]) {
        result[week] = {};
      }



      if(!result[week][day]) {
        result[week][day] = [];
      }



      result[week][day].push({

        ...moment,

        displayTime:time,

        timestamp:date.getTime(),

      });



      return result;


    },
    {} as Record<string, Record<string, any[]>>
  );




  const weeks =
    Object.entries(grouped)
    .sort(
      ([,a],[,b]) => {

        const aTime =
          Object.values(a)
          .flat()
          .sort(
            (x:any,y:any)=>
              y.timestamp-x.timestamp
          )[0]?.timestamp || 0;


        const bTime =
          Object.values(b)
          .flat()
          .sort(
            (x:any,y:any)=>
              y.timestamp-x.timestamp
          )[0]?.timestamp || 0;


        return bTime-aTime;

      }
    );



  return (

    <main className="shell garden-subpage garden-moments-page">


      <section className="garden-moments-field">


        <GardenCorner
          side="right"
          variant="flowers"
        />



        <div className="moments-list">


          {
            weeks.map(
              ([week,days]) => (


                <section
                  key={week}
                  className="moment-week"
                >


                  <h2 className="moment-week-title">
                    {week}
                  </h2>



                  {
                    Object.entries(days)
                    .sort(
                      ([,a],[,b]) => {

                        const at =
                          (a as any[])
                          .sort(
                            (x,y)=>
                              y.timestamp-x.timestamp
                          )[0]
                          .timestamp;


                        const bt =
                          (b as any[])
                          .sort(
                            (x,y)=>
                              y.timestamp-x.timestamp
                          )[0]
                          .timestamp;


                        return bt-at;

                      }
                    )
                    .map(
                      ([day,items]) => (


                        <section
                          key={day}
                          className="moment-day"
                        >


                          <h3 className="moment-day-date">
                            {day}
                          </h3>



                          {
                            (items as any[])
                            .sort(
                              (a,b)=>
                                b.timestamp-a.timestamp
                            )
                            .map(
                              (moment)=>(


                                <article

                                  key={moment.id}

                                  className="moment-item"

                                >


                                  <time className="moment-time">

                                    {moment.displayTime}

                                  </time>



                                  <div

                                    className="moment-content"

                                    dangerouslySetInnerHTML={{

                                      __html:
                                        moment.content

                                    }}

                                  />



                                  {
                                    moment.image && (

                                      <img

                                        src={moment.image}

                                        alt=""

                                        className="moment-image"

                                      />

                                    )
                                  }


                                </article>


                              )
                            )
                          }



                        </section>


                      )
                    )
                  }



                </section>


              )
            )
          }



        </div>


      </section>


    </main>

  );

}