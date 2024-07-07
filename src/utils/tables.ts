import { Column, type Columns } from "./db";

import DateInput from '$/components/editor/inputs/DateInput.svelte';
import DateTimeInput from '$/components/editor/inputs/DateTimeInput.svelte';
import NumberInput from '$/components/editor/inputs/NumberInput.svelte';
import StringInput from '$/components/editor/inputs/StringInput.svelte';
import TextInput from '$/components/editor/inputs/TextInput.svelte';

export type TableName = keyof typeof TABLES

export interface ITable {
    name: string;
    searchable: boolean;
    managePermission: number;
    columns: Columns;
}

export const TABLES = {
    users: {
        name: '用户',
        searchable: false,
        managePermission: 2,
        columns: {
            userId: new Column("ID", "BIGINT", NumberInput, { isPrimary: true, isImmutable: true }),
            idNumber: new Column("借书证号", "VARCHAR(10)", StringInput, { isImmutable: true, maxLength: 10 }),
            studentIdNumber: new Column("学工号", "VARCHAR(20)", StringInput, { maxLength: 20 }),
            userName: new Column("用户名", "VARCHAR(40)", StringInput, { maxLength: 40 }),
            password: new Column("密码", "VARCHAR(40)", StringInput, { maxLength: 40 }),
            email: new Column("联系方式", "VARCHAR(40)", StringInput, { maxLength: 40 }),
            roleId: new Column("角色ID", "BIGINT", NumberInput, { isImmutable: true, foreignKey: { tableName: "roles", key: "id" } }),
            createDate: new Column("注册日期", "DATE", DateInput, { isImmutable: true }),
            bookNum: new Column("借阅数", "INT", NumberInput, { isImmutable: true }),
            fine: new Column("罚款金额", "DECIMAL(10,2)", NumberInput, { isImmutable: true, step: 0.01 }),
        }
    },
    roles: {
        name: '角色',
        searchable: false,
        managePermission: 3,
        columns: {
            id: new Column("ID", "BIGINT", NumberInput, { isPrimary: true, isImmutable: true }),
            roleName: new Column("角色名称", "VARCHAR(20)", StringInput, { maxLength: 20 }),
            permissionId: new Column("权限ID", "VARCHAR(40)", StringInput, { maxLength: 40 }), // 设计有问题
        }
    },
    permissions: {
        name: '权限',
        searchable: false,
        managePermission: 3,
        columns: {
            id: new Column("ID", "BIGINT", NumberInput, { isPrimary: true, isImmutable: true }),
            permissionName: new Column("权限名称", "VARCHAR(40)", StringInput, { maxLength: 40 }),
            aclValue: new Column("权限码", "VARCHAR(60)", StringInput, { maxLength: 60 }),
        }
    },
    books: {
        name: '书籍',
        searchable: false,
        managePermission: 2,
        columns: {
            isbn: new Column("ISBN", "CHAR(13)", StringInput, { isPrimary: true, maxLength: 13 }),
            name: new Column("名称", "VARCHAR(40)", StringInput, { maxLength: 40 }),
            author: new Column("作者", "VARCHAR(40)", StringInput, { maxLength: 40 }),
            press: new Column("出版社", "VARCHAR(40)", StringInput, { maxLength: 40 }),
            price: new Column("价格", "DECIMAL(10,2)", NumberInput, { step: 0.01, isNullable: true }),
            num: new Column("数目", "INT", NumberInput, { isNullable: true }),
            position: new Column("所在书架", "VARCHAR(40)", StringInput, { maxLength: 40 }),
            date: new Column("更新日期", "DATE", DateInput, { isImmutable: true }),
        }
    },
    labels: {
        name: '标签',
        searchable: true,
        managePermission: 2,
        columns: {
            id: new Column("ID", "BIGINT", NumberInput, { isPrimary: true, isImmutable: true }),
            name: new Column("标签名称", "VARCHAR(40)", StringInput, { maxLength: 40 }),
            num: new Column("数量", "INT", NumberInput),
        }
    },
    book_label: {
        name: '书籍-标签',
        searchable: true,
        managePermission: 2,
        columns: {
            id: new Column("ID", "BIGINT", NumberInput, { isPrimary: true, isImmutable: true }),
            isbn: new Column("ISBN", "CHAR(13)", StringInput, { maxLength: 13, foreignKey: { tableName: "books", key: "isbn" } }),
            labelId: new Column("标签ID", "BIGINT", NumberInput, { foreignKey: { tableName: "labels", key: "id" } }),
        }
    },
    notice: {
        name: '公告',
        searchable: true,
        managePermission: 2,
        columns: {
            id: new Column("ID", "BIGINT", NumberInput, { step: 1, isPrimary: true }),
            title: new Column("标题", "VARCHAR(40)", StringInput, { maxLength: 40 }),
            content: new Column("内容", "TEXT", TextInput),
            createTime: new Column("创建时间", "DATETIME", DateTimeInput, { isImmutable: true }),
            updateTime: new Column("修改时间", "DATETIME", DateTimeInput),
            viewNum: new Column("查看人次", "INT", NumberInput, { isImmutable: true, step: 1, isNullable: true }),
        }
    },
    borrowinfo: {
        name: '借阅信息',
        searchable: false,
        managePermission: 2,
        columns: {
            id: new Column("ID", "BIGINT", NumberInput, { step: 1, isPrimary: true }),
            isbn: new Column("ISBN", "CHAR(13)", StringInput, { maxLength: 13, foreignKey: { tableName: "books", key: "isbn" } }),
            userId: new Column("用户ID", "BIGINT", NumberInput, { foreignKey: { tableName: "users", key: "userId" } }),
            beginTime: new Column("借书时间", "DATETIME", DateTimeInput, { isImmutable: true }),
            returnTime: new Column("预期归还时间", "DATETIME", DateTimeInput),
            fine: new Column("罚款金额", "DECIMAL(10,2)", NumberInput, { step: 0.01 }),
        }
    },
}

export default TABLES

/** userId -> user_id */
export const parseColumnName = (str: string) => str.replace(/([A-Z])/g, '_$1').toLowerCase();
