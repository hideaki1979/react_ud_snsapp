import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../SessionProvider";
import { Navigate } from "react-router-dom";
import { SideMenu } from "../components/SideMenu";
import { postRepository } from "../repositories/post";
import { Post } from "../components/Post";
import { Pagination } from "../components/Pagenation";
import { authRepository } from "../repositories/auth";

function Home() {
  const [currentUser, setCurrentUser] = useContext(SessionContext);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  // console.log(currentUser.id);

  const limit = 5;

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    const post = postRepository.create(content, currentUser.id);
    // console.log(post);
    setPosts([
      { ...post, userId: currentUser.id, userName: currentUser.userName },
      ...posts,
    ]);
    setContent("");
  };

  const fetchPosts = async () => {
    const posts = await postRepository.find(page, limit);
    // console.log(posts);
    setPosts(posts);
  };

  const handleNext = async () => {
    const nextPage = page + 1;
    const posts = await postRepository.find(nextPage, limit);
    setPosts(posts);
    setPage(nextPage);
  };

  const handlePrev = async () => {
    const prevPage = page - 1;
    const posts = await postRepository.find(prevPage, limit);
    setPosts(posts);
    setPage(prevPage);
  };

  const deletePost = async (postId) => {
    await postRepository.delete(postId);
    setPosts(posts.filter((post) => post.id != postId));
  };

  const signout = async () => {
    await authRepository.signout();
    setCurrentUser(null);
  };

  // useEffect(() => {
  //   signout();
  // }, []);

  if (currentUser == null) return <Navigate replace to={"/signin"} />;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#34D399] p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">SNS APP</h1>
          <button onClick={signout} className="text-white hover:text-red-600">
            ログアウト
          </button>
        </div>
      </header>
      <div className="container mx-auto mt-6 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <textarea
                placeholder="What's on your mind?"
                className="w-full p-2 mb-4 border-2 border-gray-200 rounded-md"
                onChange={(e) => setContent(e.target.value)}
                value={content}
              />
              <button
                disabled={content === ""}
                onClick={createPost}
                className="bg-[#34D399] text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
            <div className="mt-4">
              {posts.map((post) => (
                <Post key={post.id} post={post} onDelete={deletePost} />
              ))}
            </div>
            <Pagination onNext={handleNext} onPrev={handlePrev} />
          </div>
          <SideMenu />
        </div>
      </div>
    </div>
  );
}

export default Home;
