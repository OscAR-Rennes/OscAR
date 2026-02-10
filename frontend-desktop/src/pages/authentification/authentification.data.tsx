import { useEffect, useMemo, useState } from "react";
import { getActiveCulturalCenter } from "../../api/services/culturalcenter.api";
import { addUser } from "../../api/services/users.api";
import { CreateUserDto } from "../../api/models/users/AddUserDto";
import { logoutUser, logUser } from "../../api/services/auth.api";
import { LogUserDto } from "../../api/models/users/LogUserDto";
import { useAuthStore } from "../../common/store/authStore";

export function useAuthentificationData() {

    const clearUser = useAuthStore((state) => state.clearUser);
    const setUser = useAuthStore((state) => state.setUser);


    const [culturalCenters, setCulturalCenters] = useState([]);
    
    // Fetch active cultural centers au chargement
    useEffect(() => {
        const fetchData = async () => {
            const culturalCentersData = await getActiveCulturalCenter();
            setCulturalCenters(culturalCentersData)
        };
        fetchData()
    }, []);


    // Champs des formulaires
    const addSigninFields = useMemo(() => [
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Mot de passe", type: "password", required: true },
        { name: "username", label: "Nom d'utilisateur", type: "text", required: true },
        {
            name: "id_cultural_center",
            label: "Centre culturel",
            type: "select",
            required: true,
            options: culturalCenters.map(c => ({ label: c.name, value: c.id }))
        }
    ], [culturalCenters]);

    const addLoginFields = useMemo(() => [
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Mot de passe", type: "password", required: true },
    ], [] )


    // Handlers
    const handleSubmitSignin = async (values: CreateUserDto) => {
    
        if (!values.email || !values.username || !values.password) {
          console.error("Missing fields");
          return;
        }
    
        const newUser = await addUser(values);
        console.log(newUser)
    };

    const handleSubmitLogin = async (values: LogUserDto) => {
    
        if (!values.email || !values.password) {
          console.error("Missing field");
          return;
        }
    
        const newUser = await logUser(values);
        setUser(newUser);
      };
    
      const handleLogout = async () => {
        await logoutUser();
        clearUser();
    };


    return {

        addSigninFields,
        addLoginFields,

        handleSubmitSignin,
        handleSubmitLogin,
        handleLogout
    }

};

