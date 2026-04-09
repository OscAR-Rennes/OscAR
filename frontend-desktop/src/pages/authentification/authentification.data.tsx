import { useEffect, useMemo, useState } from "react";
import { getActiveCulturalCenter } from "../../api/services/culturalcenter.api";
import { addUser } from "../../api/services/users.api";
import { logUser, resendTwoFactorCode, verifyTwoFactorCode } from "../../api/services/auth.api";
import { LogUserDto } from "../../api/models/users/LogUserDto";
import { useAuthStore } from "../../common/store/authStore";

export function useAuthentificationData() {

    const clearUser = useAuthStore((state) => state.clearUser);
    const setUser = useAuthStore((state) => state.setUser);

    const [culturalCenters, setCulturalCenters] = useState([]);
    const [twoFactorChallengeToken, setTwoFactorChallengeToken] = useState<string | null>(null);
    const [twoFactorEmail, setTwoFactorEmail] = useState<string>("");
    const [pendingApproval, setPendingApproval] = useState(false);
    
    // Fetch active cultural centers au chargement
    useEffect(() => {
        const fetchData = async () => {
            const response = await getActiveCulturalCenter({ page: 1, limit: 200 });
            setCulturalCenters(Array.isArray(response?.data) ? response.data : []);
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
            variant: "toggle",
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
            group: "new-cultural-center",
            required: (values: any) => values.isNewCulturalCenter,
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        {
            name: "newCulturalCenter.description",
            label: "Description du nouveau centre",
            type: "text",
            group: "new-cultural-center",
            required: (values: any) => values.isNewCulturalCenter,
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        {
            name: "newCulturalCenter.address.zip",
            label: "Code postal",
            type: "text",
            group: "new-cultural-center",
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        {
            name: "newCulturalCenter.address.city",
            label: "Ville",
            type: "text",
            group: "new-cultural-center",
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        {
            name: "newCulturalCenter.address.latitude",
            label: "Latitude",
            type: "number",
            group: "new-cultural-center",
            required: (values: any) => values.isNewCulturalCenter,
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        {
            name: "newCulturalCenter.address.longitude",
            label: "Longitude",
            type: "number",
            group: "new-cultural-center",
            required: (values: any) => values.isNewCulturalCenter,
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        {
            name: "newCulturalCenter.address.street",
            label: "Rue",
            type: "text",
            group: "new-cultural-center",
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        {
            name: "newCulturalCenter.address.street_number",
            label: "Numéro",
            type: "text",
            group: "new-cultural-center",
            showIf: (values: any) => values.isNewCulturalCenter,
        },
        ];
    }, [culturalCenters]);

    const addLoginFields = useMemo(() => [
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Mot de passe", type: "password", required: true },
    ], [] )

    const twoFactorFields = useMemo(() => [
        { name: "code", label: "Code de vérification", type: "text", required: true },
    ], []);


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
        if (!newUser) return;

        if (newUser.requiresTwoFactor && newUser.challengeToken) {
            clearUser();
            setPendingApproval(false);
            setTwoFactorEmail(values.email);
            setTwoFactorChallengeToken(newUser.challengeToken);
        }
    };


    const handleSubmitLogin = async (values: LogUserDto) => {
    
        if (!values.email || !values.password) {
          console.error("Missing field");
          return;
        }
    
        const newUser = await logUser(values);
                if (!newUser) return;

                if (newUser.accountPendingApproval) {
                    clearUser();
                    setPendingApproval(true);
                    setTwoFactorChallengeToken(null);
                    return;
                }

                if (newUser.requiresTwoFactor && newUser.challengeToken) {
                    clearUser();
                    setPendingApproval(false);
                    setTwoFactorEmail(values.email);
                    setTwoFactorChallengeToken(newUser.challengeToken);
                    return;
                }

                setPendingApproval(false);
                setTwoFactorChallengeToken(null);
                setUser(newUser);
    };

        const handleSubmitTwoFactorCode = async (values: { code: string }) => {
            if (!twoFactorChallengeToken || !values.code) {
                return;
            }

            const response = await verifyTwoFactorCode({
                challengeToken: twoFactorChallengeToken,
                code: values.code,
            });

            if (!response) return;

            if (response.accountPendingApproval) {
                clearUser();
                setPendingApproval(true);
                setTwoFactorChallengeToken(null);
                return;
            }

            setPendingApproval(false);
            setTwoFactorChallengeToken(null);
            setUser(response);
        };

        const handleResendTwoFactorCode = async () => {
            if (!twoFactorChallengeToken) return;

            const response = await resendTwoFactorCode({ challengeToken: twoFactorChallengeToken });
            if (response?.challengeToken) {
                setTwoFactorChallengeToken(response.challengeToken);
            }
        };

        const resetAuthFlow = () => {
            setPendingApproval(false);
            setTwoFactorChallengeToken(null);
            setTwoFactorEmail("");
        };
    
    return {

        addSigninFields,
        addLoginFields,
        twoFactorFields,

        handleSubmitSignin,
        handleSubmitLogin,
        handleSubmitTwoFactorCode,
        handleResendTwoFactorCode,
        resetAuthFlow,

        isTwoFactorStep: !!twoFactorChallengeToken,
        pendingApproval,
        twoFactorEmail,
    }

};

