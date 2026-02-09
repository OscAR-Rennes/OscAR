import { RoleEnum } from "../../enum/RolesEnum";
import { useAuthStore } from "../../store/authStore";

export function useCheckRights() {
  const user = useAuthStore((state) => state.user);

  return (rights: RoleEnum) => {
    return user?.rights?.some((r) => r === rights) ?? false;
  };
}