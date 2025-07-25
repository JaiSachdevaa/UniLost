import { useState } from "react";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [userData, setUser] = useState({
    name: "Michael Van Gopher",
    image: assets.profile_pic,
    email: "michaelvan@gmail.com",
    phone: "+1 234 345 4567",
    address: {
      line1: "57 Cross, Richmond",
      line2: "Circle, Church Road, London",
    },
    gender: "Male",
    dob: "1997-10-03",
  });

  const [isEdit, setIsEdit] = useState(true);

  return (
    <div>
      <img src={userData.image} alt="" />

      {isEdit ? (
        <input
          type="text"
          value={userData.name}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p>{userData.name}</p>
      )}

      <hr />
      <div>
        <p>CONTACT INFORMATION</p>
        <div>
          <p>Email id :</p>
          <p>{userData.email}</p>

          <p>Phone :</p>
          {isEdit ? (
            <input
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p>{userData.phone}</p>
          )}

          <p>Address:</p>
          {isEdit ? (
            <p>
              <input
                type="text"
                value={userData.address.line1}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
              />
              <br />
              <input
                type="text"
                value={userData.address.line2}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
              />
            </p>
          ) : (
            <p>
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>
      <div>
        <p>BASIC INFORMATION</p>
        <div>
          <p>Gender:</p>
{
  isEdit ? (
    <select
  value={userData.gender}
  onChange={(e) =>
    setUser((prev) => ({ ...prev, gender: e.target.value }))
  }>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
</select>

  ) : (
    <p>{userData.gender}</p>
  )
}

        </div>
      </div>
    </div>
  );
};

export default MyProfile;

