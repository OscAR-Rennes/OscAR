import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/services/users.api";

export function useAccountsData() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllUsers({ page: 1, limit: 200 }).then((response) => {
      setAccounts(Array.isArray(response?.data) ? response.data : []);
    });
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => {
        console.log("GET ALL USERS:", data);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.username?.toLowerCase().includes(search.toLowerCase()) ||
      acc.email?.toLowerCase().includes(search.toLowerCase()) ||
      acc.rights?.toLowerCase().includes(search.toLowerCase())
  );

  return {
    accounts: filteredAccounts,
    setSearch,
    search,
  };
}