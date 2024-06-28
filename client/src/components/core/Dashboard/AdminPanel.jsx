import React from "react";
import { createCategory } from "../../../services/operations/courseDetailsAPI";
import { useSelector } from "react-redux";

const AdminPanel = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [category, setCategory] = React.useState({
    name: "",
    description: "",
  });

  console.log("user data", user);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.name || !category.description) {
      return;
    }
    //console.log(category);
    const res = await createCategory(
      {
        name: category.name,
        description: category.description,
      },
      token
    );
    //console.log("this is res:", res)
  };

  return (
    // create categories
    // <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-richblack-5">
        Hi {user?.firstName} 👋
      </h1>
      <p className="font-medium text-richblack-200">
        Let's shape the future together!
      </p>

      <div className=" text-pure-greys-50 text-xl p-5">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="category">Category Name</label>
            <input
              value={category.name}
              onChange={(e) =>
                setCategory({ ...category, name: e.target.value })
              }
              type="text"
              name="category"
              id="category"
              className="form-style"
              placeholder="Enter category name"
            />
          </div>
          <div className="flex flex-col gap-2 mt-10">
            <label htmlFor="category">Category Description</label>
            <textarea
              value={category.description}
              onChange={(e) =>
                setCategory({ ...category, description: e.target.value })
              }
              type="text"
              name="category"
              id="category"
              className="form-style"
              placeholder="Enter category description"
            />
          </div>
          <button
            type="submit"
            className=" mt-10 rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-95 hover:shadow-none  disabled:bg-richblack-500 sm:text-[16px] "
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
