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

const request = (method: string = 'GET', url: string, options: QueryOptions | undefined = undefined, data: any | undefined = undefined) => {
    if (options)
        url += '?' + makeRequestParam(options)

    const fetchParams: RequestInit = {
        method,
        credentials: 'include',
    }

    if (data) {
        fetchParams.body = JSON.stringify(data)
        fetchParams.headers = {
            "Content-Type": "application/json;charset=UTF-8"
        }
    }

    return fetch(makeFullURL(url), fetchParams).then(checkIfSucceeded).catch(error)
}

export default {
    // 无需登录
    api: function (): Promise<APIResult & { data: Row<any> }> {
        return request('GET', '')
    },

    register: function (studentIdNumber: string, password: string, email: string): Promise<APIResult & { data: Row<any> }> {
        return request('PUT', `/register`, undefined, { studentIdNumber, password, email })
    },

    login: function (idNumber: string, password: string): Promise<APIResult & { data: Row<any> }> {
        return request('PUT', `/login`, undefined, { idNumber, password })
    },

    logout: function (): Promise<APIResult> {
        return request('PUT', `/logout`)
    },

    query: function (tableName: string, options: QueryOptions): Promise<QueryResult> {
        return request('GET', `/query/${tableName}`, options)
    },

    // 用户
    borrow: function (userId: number, isbn: string, borrowDays: number): Promise<APIResult> {
        return request('PUT', `/borrow/${userId}`, undefined, { isbn, borrowDays })
    },

    return: function (userId: number, idList: number[]): Promise<APIResult> {
        return request('DELETE', `/return/${userId}`, undefined, idList)
    },

    myBorrow: function (userId: number, options: QueryOptions): Promise<QueryResult> {
        return request('GET', `/personal/${userId}`, options)
    },

    // 管理员
    add: function (tableName: string, item: Row<any>): Promise<APIResult> {
        return request('PUT', `/add/${tableName}`, undefined, formatData(item))
    },

    remove: function (tableName: string, keys: any[]): Promise<APIResult> {
        return request('DELETE', `/remove/${tableName}`, undefined, keys)
    },

    modify: function (tableName: string, item: Row<any>): Promise<APIResult> {
        return request('PUT', `/modify/${tableName}`, undefined, formatData(item))
    },
}
