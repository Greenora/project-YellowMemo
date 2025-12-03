import { Link } from "react-router-dom";

export default function AdminHeader() {
  return(
    <header className="w-full h-10 items-center flex m-2 mb-6">
      <Link className="p-2 mx-2 bg-white rounded-md shadow-sm" to='/admin'>관리자 메인 페이지</Link>
      <Link className="p-2 mx-2 bg-white rounded-md shadow-sm" to='/admin/semester'>현지학기제 글 관리</Link>
      <Link className="p-2 mx-2 bg-white rounded-md shadow-sm" to='/admin/member'>멤버 소개 글 관리</Link>
      <Link className="p-2 mx-2 bg-white rounded-md shadow-sm" to='/board'>메인 보드로 이동</Link>
    </header>
  )
}