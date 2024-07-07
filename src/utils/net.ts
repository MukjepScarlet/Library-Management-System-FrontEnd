import { error } from "./alert"
import type { Row } from "./db"

const DOMAIN = 'http://localhost:8081/'
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

interface APIResult {
    code: number
    message: string
    status: string
}

interface QueryResult extends APIResult {
    data: {
        count: number
        data: Row<any>[]
    }
}

interface RegisterResult extends APIResult {
    data: Row<any> // TODO: Row<TABLES.users.columns> // 找不到命名空间“TABLES”。
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
        if (value instanceof Date)
            value = value.toLocaleString();

        return [key, value];
    }));

const makeRequestParam = (data: Record<string, any>) => new URLSearchParams(formatData(data));

export default {
    query: function (tableName: string, options: QueryOptions): Promise<QueryResult> {
        return fetch(makeFullURL(`/query/${tableName}?${makeRequestParam(options)}`)).then(checkIfSucceeded)
    },

    add: function (tableName: string, item: Row<any>): Promise<APIResult> {
        return fetch(makeFullURL(`/add/${tableName}`), {
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: "PUT",
            body: JSON.stringify(formatData(item))
        }).then(checkIfSucceeded)
    },

    remove: function (tableName: string, keys: any[]): Promise<APIResult> {
        return fetch(makeFullURL(`/remove/${tableName}`), {
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: "DELETE",
            body: JSON.stringify(keys)
        }).then(checkIfSucceeded)
    },

    modify: function (tableName: string, item: Row<any>): Promise<APIResult> {
        return fetch(makeFullURL(`/modify/${tableName}`), {
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: "PUT",
            body: JSON.stringify(formatData(item))
        }).then(checkIfSucceeded)
    },

    myBorrow: function (userId: number, options: QueryOptions): Promise<QueryResult> {
        return fetch(makeFullURL(`/personal/${userId}?${makeRequestParam(options)}`)).then(checkIfSucceeded)
    },

    register: function (studentIdNumber: string, password: string, email: string): Promise<RegisterResult> {
        return fetch(makeFullURL(`/register/`), {
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: "PUT",
            body: JSON.stringify({ studentIdNumber, password, email })
        }).then(checkIfSucceeded)
    },

    login: function (idNumber: string, password: string): Promise<QueryResult> {
        return fetch(makeFullURL(`/login/`), {
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: "PUT",
            body: JSON.stringify({ idNumber, password })
        }).then(checkIfSucceeded)
    },
}
