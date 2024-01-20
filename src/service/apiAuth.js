import toast from "react-hot-toast";
import supabase from "./supabase";

async function signUp({ fullName, email, password, navigate }) {
  toast.success("Creating");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
      },
    },
  });

  if (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }

  toast.dismiss(); //for dismissing existing toasts/alerts
  toast.success("Success");
  navigate("/login");
  return data;
}

async function login({ email, password, navigate }) {
  toast.success("Logging in");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast.dismiss(); //for dismissing existing toasts/alerts
    toast.error("Invalid Credentials");
    throw new Error(error.message);
  }

  toast.dismiss(); //for dismissing existing toasts/alerts
  toast.success("Success");
  getSession();
  navigate("/");
  return data;
}

async function getSession() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.error("Failed to logout, try again");
    throw new Error(error.message);
  }
}

export { login, getSession, logout, signUp };
