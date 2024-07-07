import { writable } from "svelte/store";
import { info } from "./alert";
import { preprocess, type Row } from "./db";
import { TABLES } from "./tables";
import { replace } from "svelte-spa-router";
import NetUtils from "./net";

export const currentIdNumber = writable<string | null>(null);

export const userInfo = writable<Row<typeof TABLES.users.columns> | undefined>(undefined);

export const checkLogin = () => {
    const idNumber = localStorage.getItem('idNumber');

    if (!idNumber) return;

    NetUtils.query('users', {
        searchBy: 'id_number',
        query: idNumber,
    }).then(json => {
        userInfo.set(preprocess(TABLES.users.columns, json.data.data)[0]);
        currentIdNumber.set(localStorage.getItem('idNumber'));
    })
}

export const login = (idNumber: string | number) => {
    localStorage.setItem('idNumber', idNumber.toString());
    currentIdNumber.set(idNumber.toString());
    replace('/');
};

export const logout = () => {
    localStorage.removeItem('idNumber');
    currentIdNumber.set(null);
    replace('/');
    info('您已退出...')
}

