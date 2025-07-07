import useAuthStore from "@/store/auth-store";
import useCanister from "./use-canister";

export default function useUser() {
  const { setUser } = useAuthStore();
  const [backend] = useCanister();

  const editUser = async (name, email, avatar) => {
    try {
      const updatedUser = await backend.edit_user([name], [email], [avatar]);
      if (updatedUser.length) setUser(updatedUser[0]);
    } catch (err) {
      console.error("Error editing user:", err);
    }
  };

  return { editUser };
}
