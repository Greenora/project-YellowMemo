import React, { useState, useEffect, useRef } from "react";

function JapanProgramDetail({ data = { title: "새 프로그램", content: "내용을 입력하세요.", imageUrl: null } }) {
  const [program, setProgram] = useState(data);
  const [previewImage, setPreviewImage] = useState(data.imageUrl);
  const descriptionRef = useRef(null);

  /** textarea 자동 높이 */
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height =
        descriptionRef.current.scrollHeight + "px";
    }
  }, [program.content]);

  return (
    <div className="flex flex-col p-4 border rounded-lg shadow-sm bg-white w-full max-w-sm">
      {/* 이미지 */}
      <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
        {previewImage ? (
          <img
            src={previewImage}
            alt={program.title}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-500">사진 없음</span>
        )}
      </div>

      {/* 제목 */}
      <h2 className="text-2xl font-bold w-full mb-2">{program.title}</h2>

      {/* 내용 */}
      <textarea
        ref={descriptionRef}
        value={program.content}
        readOnly
        className="text-base text-gray-700 w-full bg-transparent border-none outline-none focus:ring-0 resize-none leading-relaxed"
        rows={1}
      />
    </div>
  );
}

export default JapanProgramDetail;