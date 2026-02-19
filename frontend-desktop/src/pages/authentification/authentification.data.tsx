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
    const [isNewCenter, setIsNewCenter] = useState(false);
    
    // Fetch active cultural centers au chargement
    useEffect(() => {
        const fetchData = async () => {
            const culturalCentersData = await getActiveCulturalCenter();
            setCulturalCenters(culturalCentersData)
        };
        fetchData()
    }, []);


    // Champs des formulaires
    const addSigninFields = useMemo(() => {
        return [
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Mot de passe", type: "password", required: true },
        { name: "username", label: "Nom d'utilisateur", type: "text", required: true },

        {
            name: "isNewCulturalCenter",
            label: "Créer un nouveau centre culturel ?",
            type: "checkbox",
        },

        {
            name: "id_cultural_center",
            label: "Centre culturel existant",
            type: "select",
            options: culturalCenters.map((c) => ({ label: c.name, value: c.id })),
            required: (values: any) => !values.isNewCulturalCenter, // obligatoire si pas de nouveau centre
            showIf: (values: any) => !values.isNewCulturalCenter, // caché si isNewCulturalCenter
        },

        // Champs du nouveau centre
        {
            name: "newCulturalCenter.name",
            label: "Nom du nouveau centre",
            type: "text",
            required: (values: any) => values.isNewCulturalCenter,
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        {
            name: "newCulturalCenter.description",
            label: "Description du nouveau centre",
            type: "text",
            required: (values: any) => values.isNewCulturalCenter,
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        {
            name: "newCulturalCenter.address.zip",
            label: "Code postal",
            type: "text",
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        {
            name: "newCulturalCenter.address.city",
            label: "Ville",
            type: "text",
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        {
            name: "newCulturalCenter.address.latitude",
            label: "Latitude",
            type: "number",
            required: (values: any) => values.isNewCulturalCenter,
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        {
            name: "newCulturalCenter.address.longitude",
            label: "Longitude",
            type: "number",
            required: (values: any) => values.isNewCulturalCenter,
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        {
            name: "newCulturalCenter.address.street",
            label: "Rue",
            type: "text",
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        {
            name: "newCulturalCenter.address.street_number",
            label: "Numéro",
            type: "text",
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        ];
    }, [culturalCenters]);

    const addLoginFields = useMemo(() => [
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Mot de passe", type: "password", required: true },
    ], [] )


    // Handlers
    const handleSubmitSignin = async (values: any) => {
    if (!values.email || !values.username || !values.password) {
        console.error("Missing fields");
        return;
    }

    let payload: any = { ...values };

    if (values.isNewCulturalCenter) {
        payload.newCulturalCenter = {
        name: values["newCulturalCenter.name"],
        description: values["newCulturalCenter.description"],
        address: {
            zip: values["newCulturalCenter.address.zip"],
            city: values["newCulturalCenter.address.city"],
            latitude: values["newCulturalCenter.address.latitude"],
            longitude: values["newCulturalCenter.address.longitude"],
            street: values["newCulturalCenter.address.street"],
            street_number: values["newCulturalCenter.address.street_number"],
        },
        };

        // on peut supprimer les champs plats pour ne pas polluer
        delete payload["newCulturalCenter.name"];
        delete payload["newCulturalCenter.description"];
        delete payload["newCulturalCenter.address.zip"];
        delete payload["newCulturalCenter.address.city"];
        delete payload["newCulturalCenter.address.latitude"];
        delete payload["newCulturalCenter.address.longitude"];
        delete payload["newCulturalCenter.address.street"];
        delete payload["newCulturalCenter.address.street_number"];
    }

    const newUser = await addUser(payload);
    console.log(newUser);
    };


    const handleSubmitLogin = async (values: LogUserDto) => {
    
        if (!values.email || !values.password) {
          console.error("Missing field");
          return;
        }
    
        const newUser = await logUser(values);
        setUser(newUser);
    };
    
    //   const handleLogout = async () => {
    //     await logoutUser();
    //     clearUser();
    // };


    return {

        addSigninFields,
        addLoginFields,

        handleSubmitSignin,
        handleSubmitLogin,
        //handleLogout
    }

};

