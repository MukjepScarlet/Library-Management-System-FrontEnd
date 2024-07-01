import { writable } from "svelte/store";
import { info } from "./alert";
import { type Row } from "./db";
import { TABLES } from "./tables";
import { replace } from "svelte-spa-router";

export const currentIdNumber = writable<string | null>(null);

export const userInfo = writable<Row<typeof TABLES.users.columns> | undefined>(undefined);

export const checkLogin = () => {
    currentIdNumber.set(localStorage.getItem('userId'));
}

export const login = (userId: string | number) => {
    localStorage.setItem('userId', userId.toString());
    currentIdNumber.set(userId.toString());
    replace('/');
    info('登录成功...')
};

export const logout = () => {
    localStorage.removeItem('userId');
    currentIdNumber.set(null);
    replace('/');
    info('您已退出...')
}

