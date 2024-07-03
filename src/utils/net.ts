import { error } from "./alert";
import type { Row } from "./db";

export namespace NetUtils {

    export const DOMAIN = 'http://localhost:8081/';

    const makeFullURL = (api: string) => new URL('api' + api, DOMAIN)

    export interface QueryOptions {
        searchBy?: string
        query?: string | number | Date
        match?: 'eq' | 'like'
        sortBy?: string
        order?: 'asc' | 'desc'
        start?: number
        count?: number
    }

    const CODE_OK = 200

    const checkIfSucceeded = (response: Response) => response.json().then((json) => {
        if (json.code !== CODE_OK) {
            const err = json.message ?? '未知错误'
            error(err)
            return Promise.reject(err)
        } else {
            return json
        }
    })

    const formatData = (data: Record<string, any>) =>
        Object.fromEntries(Object.entries(data).map(([key, value]) => {
            if (value instanceof Date) {
                const year = value.getFullYear();
                const month = ('0' + (value.getMonth() + 1)).slice(-2);
                const day = ('0' + value.getDate()).slice(-2);
                const hours = ('0' + value.getHours()).slice(-2);
                const minutes = ('0' + value.getMinutes()).slice(-2);
                const seconds = ('0' + value.getSeconds()).slice(-2);
                value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            }

            return [key, value];
        }));

    const makeRequestParam = (data: Record<string, any>) => new URLSearchParams(formatData(data));

    export function query(tableName: string, options: QueryOptions) {
        return fetch(makeFullURL(`/query/${tableName}?${makeRequestParam(options)}`)).then(checkIfSucceeded)
    }

    export function add(tableName: string, item: Row<any>) {
        return fetch(makeFullURL(`/add/${tableName}`), {
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: "PUT",
            body: JSON.stringify(formatData(item))
        }).then(checkIfSucceeded)
    }

    export function remove(tableName: string, keys: any[]) {
        return fetch(makeFullURL(`/remove/${tableName}`), {
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: "DELETE",
            body: JSON.stringify(keys)
        }).then(checkIfSucceeded)
    }

    export function modify(tableName: string, item: Row<any>) {
        return fetch(makeFullURL(`/modify/${tableName}`), {
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: "PUT",
            body: JSON.stringify(formatData(item))
        }).then(checkIfSucceeded)
    }

    export function myBorrow(userId: number, options: QueryOptions) {
        return fetch(makeFullURL(`/personal/${userId}?${makeRequestParam(options)}`)).then(checkIfSucceeded)
    }

    export function register(studentIdNumber: string, password: string, email: string) {
        return fetch(makeFullURL(`/register/`), {
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: "PUT",
            body: JSON.stringify({ studentIdNumber, password, email })
        }).then(checkIfSucceeded)
    }

    export function login(idNumber: string, password: string) {
        return fetch(makeFullURL(`/login/`), {
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: "PUT",
            body: JSON.stringify({ idNumber, password })
        }).then(checkIfSucceeded)
    }
}
