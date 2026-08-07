"use client";


export default function SiteEditorHover() {

  return (

    <div className="site-editor-hover">


      <button
        className="site-editor-trigger"
        type="button"
      >
        ✎ 编辑
      </button>



      <div className="site-editor-panel">


        <h3>
          编辑入口
        </h3>



        <form
          action="/api/auth/login"
          method="post"
        >

          <input
            name="password"
            type="password"
            placeholder="编辑密码"
            required
          />



          <button
            type="submit"
          >
            进入
          </button>


        </form>


      </div>


    </div>

  );

}