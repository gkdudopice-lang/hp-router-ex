import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const selectPath = e.target.value;
    if (selectPath) navigate(`/profile/${selectPath}`);
  };

  return (
    <div>
      <h1>여기가 홈 입니다.</h1>
      <p>가장 먼저 보여지는 페이지 입니다.</p>
      <Link to="/about">소개 페이지로 이동</Link>
      <br />
      <Link to="/profile/frontend">프론트앤드 프로필 페이지로 이동</Link>
      <br />
      <Link to="/profile/backend">백앤드 프로필 페이지로 이동</Link>
      <br />
      <Link to="/login">로그인 페이지로 이동</Link>

      <br />
      <br />
      <hr />

      {/* 콤보 박스(select 박스를 만들고 선택된 값을 전달해 페이지 이동하기) */}

      <h3>콤보 박스로 페이지 이동하기</h3>
      <select onChange={handleChange}>
        <option value="">---프로필 선택---</option>
        <option value="frontend">프론트앤드 프로필</option>
        <option value="backend">백앤드 프로필</option>
        <option value="dba">DBA</option>
      </select>
    </div>
  );
};

export default Home;
