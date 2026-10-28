import { Link, useParams } from "react-router-dom";

const data = {
  frontend: {
    name: "곰돌이 사육사",
    description: "리액트를 좋아하는 개발자",
  },
  backend: {
    name: "달빛사냥꾼",
    description: "스프링부트를 좋아하는 개발자",
  },
  dba: {
    name: "천재개발자",
    description: "DB를 좋아하는 개발자",
  },
};

const Profile = () => {
  const params = useParams();
  const profile = data[params.name];
  return (
    <div>
      <h1>사용자 프로필</h1>
      {profile ? (
        <>
          <h2>{profile.name}</h2>
          <h3>{profile.description}</h3>
        </>
      ) : (
        <p>존재하지 않는 프로필 입니다.</p>
      )}
    </div>
  );
};

export default Profile;
