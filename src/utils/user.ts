import { writable } from "svelte/store";
import DBUtils, { TABLES, type Row } from "./db";
import { replace } from "svelte-spa-router";
import NetUtils from "./net";

type User = Row<typeof TABLES.users.columns>

export const currentIdNumber = writable<string | null>(null);

export const userInfo = writable<User | undefined>(undefined);

export const checkLogin = () => {
    NetUtils.api().then(json => login(json.data));
}

export const login = (user: any) => {
    user = DBUtils.preprocess(TABLES.users.columns, [user])[0] as User;
    userInfo.set(user);
    currentIdNumber.set(user.idNumber);
    replace('/');
};

export const logout = () => {
    localStorage.removeItem('idNumber');
    currentIdNumber.set(null);
    replace('/');
}

