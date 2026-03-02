import React from "react";
import { useAccountsData } from "./accounts.data";
import "../../common/components/table/Table.style.css";
import { RoleEnum } from "../../common/enum/RolesEnum";

export default function Accounts() {
  const { accounts, setSearch, search } = useAccountsData();

  return (
    <div className="accounts-container">
      <div className="accounts-header">
        <h2>Comptes</h2>
        <div className="accounts-actions">
          <input
            className="accounts-search"
            placeholder="Recherche"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <table className="accounts-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc, idx) => (
            <tr key={acc.id || idx}>
              <td>
                <input type="checkbox" />
                <span className="accounts-link">{acc.username}</span>
              </td>
              <td>{acc.email}</td>
              <td>{RoleEnum[acc.rights?.[0]] || "PAS DE ROLE"}</td>
              <td>{acc.points?.toLocaleString() || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="accounts-footer">Lignes : {accounts.length}</div>
    </div>
  );
}