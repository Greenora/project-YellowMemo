import AdminHeader from "../../components/AdminHeader";

export default function AdminPage() {
  return (
    <div className="w-full min-h-screen p-4 bg-gray-100">
      <AdminHeader />
      <h1 className="text-center m-6">관리자 페이지 입니다. 관리자 계정만 엑세스 할 수 있습니다.</h1>

    </div>
  )
}