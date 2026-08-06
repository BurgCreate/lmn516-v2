export default function LoginPage(){

  return (

    <main className="admin-login">


      <h1>
        LMN516 编辑入口
      </h1>


      <form
        action="/api/auth/login"
        method="post"
      >

        <input

          name="password"

          type="password"

          placeholder="请输入编辑密码"

          required

        />


        <button>
          进入
        </button>


      </form>


    </main>

  );

}