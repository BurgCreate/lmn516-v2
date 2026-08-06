"use client";


export default function DeleteButton(){

  return (

    <button

      className="admin-delete"

      type="submit"

      onClick={(e)=>{

        const confirmDelete =
          window.confirm(
            "确定删除这个网站吗？"
          );


        if(!confirmDelete){

          e.preventDefault();

        }

      }}

    >

      删除

    </button>

  );

}